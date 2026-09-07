import { PerspectiveCamera, Vector3 } from "three";
import type { LogoModel } from "./types";

export type Layout = "lockup" | "shield";

interface FramingTarget {
  width: number;
  height: number;
  center: [number, number];
}

interface FramingParams {
  f: number; // fracción del ancho de viewport que ocupa el objetivo
  g: number; // fracción máxima del alto de viewport que ocupa el objetivo
  sy: number; // fracción desde arriba del viewport donde cae el centro
}

// Por debajo de 768px CSS el lockup completo mediría menos de 120px de
// ancho (regla de marca: el escudo nunca baja de 120px), así que en móvil
// solo se encuadra el escudo.
const LAYOUT_BREAKPOINT = 768;
const WIDE_BREAKPOINT = 1024;

const FOV_DEG = 34;

function paramsFor(layout: Layout, width: number): FramingParams {
  if (layout === "shield") return { f: 0.42, g: 0.32, sy: 0.27 };
  return width >= WIDE_BREAKPOINT ? { f: 0.56, g: 0.55, sy: 0.38 } : { f: 0.62, g: 0.55, sy: 0.38 };
}

export function chooseLayout(width: number): Layout {
  return width >= LAYOUT_BREAKPOINT ? "lockup" : "shield";
}

function targetFor(model: LogoModel, layout: Layout): FramingTarget {
  if (layout === "shield") {
    return { width: model.shield.width, height: model.shield.height, center: model.shield.center };
  }
  return { width: model.lockup.width, height: model.lockup.height, center: model.lockup.center };
}

export class CameraRig {
  readonly camera: PerspectiveCamera;
  private model: LogoModel;
  private layout: Layout = "lockup";
  private distance = 3;
  private visibleHeight = 1;
  private basePosition = new Vector3();
  private lookAtTarget = new Vector3();

  // Offsets suaves (parallax, scroll) sumados a la posición base. Se
  // guardan por separado para poder animarlos con damp() sin recalcular
  // el encuadre en cada frame.
  parallaxOffset = new Vector3();
  scrollOffset = new Vector3();

  constructor(model: LogoModel, aspect: number) {
    this.model = model;
    this.camera = new PerspectiveCamera(FOV_DEG, aspect, 0.1, 40);
  }

  getLayout() {
    return this.layout;
  }

  getDistance() {
    return this.distance;
  }

  getVisibleHeight() {
    return this.visibleHeight;
  }

  // Recalcula encuadre para un tamaño de viewport en CSS px. Se llama al
  // iniciar y en cada resize.
  fit(cssWidth: number, cssHeight: number) {
    this.layout = chooseLayout(cssWidth);
    const aspect = cssWidth / cssHeight;
    this.camera.aspect = aspect;

    const target = targetFor(this.model, this.layout);
    const params = paramsFor(this.layout, cssWidth);

    const fovRad = (FOV_DEG * Math.PI) / 180;
    const tanH = Math.tan(fovRad / 2);

    const dW = target.width / (2 * params.f * aspect * tanH);
    const dH = target.height / (2 * params.g * tanH);
    const distance = Math.max(dW, dH);
    const visibleHeight = 2 * distance * tanH;

    this.distance = distance;
    this.visibleHeight = visibleHeight;

    const cx = target.center[0];
    const cy = target.center[1];
    const camY = cy - (0.5 - params.sy) * visibleHeight;

    this.basePosition.set(cx, camY, distance);
    this.lookAtTarget.set(cx, camY, 0);

    this.camera.updateProjectionMatrix();
  }

  // Aplica la posición final (base + parallax + scroll) y re-orienta la
  // cámara. Se llama en cada frame del loop.
  applyFrame() {
    this.camera.position.set(
      this.basePosition.x + this.parallaxOffset.x + this.scrollOffset.x,
      this.basePosition.y + this.parallaxOffset.y + this.scrollOffset.y,
      this.basePosition.z + this.scrollOffset.z,
    );
    this.camera.lookAt(
      this.lookAtTarget.x,
      this.basePosition.y + this.parallaxOffset.y + this.scrollOffset.y,
      this.lookAtTarget.z,
    );
  }

  getBasePosition() {
    return this.basePosition;
  }
}
