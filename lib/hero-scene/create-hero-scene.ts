import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  Scene,
  NoToneMapping,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  type Texture,
} from "three";
import type { HeroSceneHandle, HeroSceneOptions, LogoElementData, LogoModel } from "./types";
import unityLogoModelRaw from "./unity-logo.json";
import { buildAllElements } from "./logo-geometry";
import {
  applyBackgroundAndFog,
  attachLights,
  createFloor,
  createFloorFade,
  createLights,
  createReflectionGroup,
  createWall,
} from "./environment";
import { CameraRig } from "./camera-rig";
import { clamp, damp, EntryTimeline } from "./animation";

const unityLogoModel = unityLogoModelRaw as unknown as LogoModel;

const COLOR_NAVY = 0x1b2449;
const COLOR_GRAY = 0x787878;

const ENTRY_STEPS = [
  { id: "shield", delayMs: 0, durationMs: 1000 },
  { id: "unity", delayMs: 120, durationMs: 1000 },
  { id: "insurance-group", delayMs: 220, durationMs: 1000 },
  { id: "tagline", delayMs: 300, durationMs: 1000 },
];

// Amplitud del parallax de cámara y de la deriva idle, como fracción de la
// distancia de cámara al objetivo (así se escala solo con el encuadre).
const PARALLAX_X = 0.09;
const PARALLAX_Y = 0.05;
const SPOT_FOLLOW_X = 0.6;
const SPOT_FOLLOW_Y = 0.3;
const SPOT_SWEEP_PERIOD = 57; // segundos, sin loop perceptible junto a la deriva
const DAMP_LAMBDA = 3.5;

function createMaterialsForElement(id: LogoElementData["id"], texture: Texture | null) {
  if (id === "shield") {
    const cap = new MeshStandardMaterial({ map: texture ?? undefined, roughness: 0.6, metalness: 0 });
    const side = new MeshStandardMaterial({ color: COLOR_NAVY, roughness: 0.55, metalness: 0 });
    return [cap, side];
  }
  if (id === "unity") {
    return [new MeshStandardMaterial({ color: COLOR_NAVY, roughness: 0.55, metalness: 0 })];
  }
  return [new MeshStandardMaterial({ color: COLOR_GRAY, roughness: 0.6, metalness: 0 })];
}

export async function createHeroScene(options: HeroSceneOptions): Promise<HeroSceneHandle> {
  const { canvas, textureUrl, onReady, onFatal } = options;
  const model = unityLogoModel;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMapping = NoToneMapping;

  const scene = new Scene();
  applyBackgroundAndFog(scene);

  const container = canvas.parentElement ?? canvas;
  let cssWidth = container.clientWidth || window.innerWidth;
  let cssHeight = container.clientHeight || window.innerHeight;

  const dprCap = options.quality === "high" ? 1.5 : 1.25;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setSize(cssWidth, cssHeight, false);

  const cameraRig = new CameraRig(model, cssWidth / cssHeight);
  cameraRig.fit(cssWidth, cssHeight);

  const wall = createWall();
  const floor = createFloor();
  const floorFade = createFloorFade();
  scene.add(wall, floor, floorFade);

  const lights = createLights(model.lockup.center);
  attachLights(scene, lights);
  if (options.quality === "low") {
    lights.directional.shadow.mapSize.set(512, 512);
  }

  // Textura del escudo: si falla, el escudo cae a color plano navy (mejor
  // que romper toda la escena por una imagen que no cargó).
  let texture: Texture | null = null;
  try {
    texture = await new TextureLoader().loadAsync(textureUrl);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  } catch {
    texture = null;
  }

  const builtElements = buildAllElements(model);
  const logoGroup = new Group();
  const meshesByElement = new Map<LogoElementData["id"], Mesh[]>();

  for (const { id, geometry } of builtElements) {
    const materials = createMaterialsForElement(id, texture);
    const mesh = new Mesh(geometry, materials.length > 1 ? materials : materials[0]);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.userData.elementId = id;
    logoGroup.add(mesh);
    meshesByElement.set(id, [...(meshesByElement.get(id) ?? []), mesh]);
  }
  scene.add(logoGroup);

  const reflectionGroup = createReflectionGroup(logoGroup);
  scene.add(reflectionGroup);

  function applyLayoutVisibility(layout: "lockup" | "shield") {
    for (const [id, meshes] of meshesByElement) {
      const visible = layout === "lockup" || id === "shield";
      for (const mesh of meshes) mesh.visible = visible;
    }
    reflectionGroup.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const id = child.userData.sourceId as LogoElementData["id"] | undefined;
      child.visible = layout === "lockup" || id === "shield";
    });
  }
  applyLayoutVisibility(cameraRig.getLayout());

  // --- Entrada (una sola vez) ------------------------------------------
  const entryTimeline = new EntryTimeline(ENTRY_STEPS);
  let entryStarted = false;

  function applyEntry(nowMs: number) {
    for (const [id, meshes] of meshesByElement) {
      const t = entryTimeline.progress(id, nowMs);
      const scale = 0.15 + 0.85 * t;
      for (const mesh of meshes) {
        mesh.scale.z = scale;
        mesh.position.y = -0.05 * (1 - t);
      }
    }
    reflectionGroup.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const id = child.userData.sourceId as LogoElementData["id"] | undefined;
      if (!id) return;
      const t = entryTimeline.progress(id, nowMs);
      child.scale.z = 0.15 + 0.85 * t;
      child.position.y = -0.05 * (1 - t);
    });
  }

  // --- Input (parallax, scroll, deriva idle) ----------------------------
  let pointerNX = 0;
  let pointerNY = 0;
  let curParallaxX = 0;
  let curParallaxY = 0;
  let curSpotX = 0;
  let curSpotY = 0;

  function onPointerMove(e: PointerEvent) {
    pointerNX = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
    pointerNY = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1);
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const heroSection = (canvas.closest("section") as HTMLElement | null) ?? container;

  function scrollProgress() {
    const rect = heroSection.getBoundingClientRect();
    const height = heroSection.offsetHeight || 1;
    return clamp(-rect.top / height, 0, 1);
  }

  // --- Loop de render, con pausa fuera de viewport / pestaña oculta -----
  let running = false;
  let rafId = 0;
  let lastTime = 0;
  let captureMode = false;
  let disposed = false;
  const clockStart = performance.now();

  function computeSpotPosition(tSec: number) {
    const sweep = (Math.sin((2 * Math.PI * tSec) / SPOT_SWEEP_PERIOD) + 1) / 2;
    const baseX = -2.4 + 3.2 * sweep;
    return {
      x: baseX + SPOT_FOLLOW_X * curSpotX,
      y: 2.9,
      z: 3.4,
    };
  }

  function renderFrame(nowMs: number) {
    const dt = Math.min(0.05, lastTime ? (nowMs - lastTime) / 1000 : 0);
    lastTime = nowMs;
    const tSec = (nowMs - clockStart) / 1000;

    if (!entryStarted) {
      entryTimeline.start(nowMs);
      entryStarted = true;
    }
    applyEntry(nowMs);

    if (!captureMode) {
      curParallaxX = damp(curParallaxX, pointerNX, DAMP_LAMBDA, dt);
      curParallaxY = damp(curParallaxY, pointerNY, DAMP_LAMBDA, dt);
      curSpotX = damp(curSpotX, pointerNX, DAMP_LAMBDA, dt);
      curSpotY = damp(curSpotY, pointerNY, DAMP_LAMBDA, dt);

      const d = cameraRig.getDistance();
      const driftX =
        d * (0.018 * Math.sin(0.23 * tSec) + 0.01 * Math.sin(0.071 * tSec + 1.3));
      const driftY = d * 0.01 * Math.sin(0.17 * tSec + 0.6);

      cameraRig.parallaxOffset.set(
        PARALLAX_X * d * curParallaxX + driftX,
        -PARALLAX_Y * d * curParallaxY + driftY,
        0,
      );

      const p = scrollProgress();
      const visibleH = cameraRig.getVisibleHeight();
      cameraRig.scrollOffset.set(0, 0.12 * visibleH * p, 0.15 * d * p);
      logoGroup.rotation.x = -0.06 * p;
      reflectionGroup.rotation.x = 0.06 * p;

      const spotPos = computeSpotPosition(tSec);
      lights.spot.position.set(spotPos.x, spotPos.y, spotPos.z);
      lights.spot.target.position.set(
        spotPos.x + 0.8,
        model.lockup.center[1] + 0.35 + SPOT_FOLLOW_Y * curSpotY,
        0,
      );
      lights.spot.target.updateMatrixWorld();
    }

    cameraRig.applyFrame();
    renderer.render(scene, cameraRig.camera);
  }

  function tick(nowMs: number) {
    if (disposed || !running) return;
    renderFrame(nowMs);
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running || disposed) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  // --- Observadores de visibilidad y tamaño ------------------------------
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible && !document.hidden) start();
      else stop();
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(heroSection);

  function onVisibilityChange() {
    if (document.hidden) stop();
    else {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) start();
    }
  }
  document.addEventListener("visibilitychange", onVisibilityChange);

  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    cssWidth = w;
    cssHeight = h;
    renderer.setSize(w, h, false);
    cameraRig.fit(w, h);
    applyLayoutVisibility(cameraRig.getLayout());
  });
  resizeObserver.observe(container);

  function onContextLost(e: Event) {
    e.preventDefault();
    stop();
    onFatal?.();
  }
  canvas.addEventListener("webglcontextlost", onContextLost);

  // Precompila materiales/shaders antes del primer frame visible.
  cameraRig.applyFrame();
  renderer.compile(scene, cameraRig.camera);
  renderer.render(scene, cameraRig.camera);
  onReady?.();

  // --- API pública ---------------------------------------------------
  function dispose() {
    disposed = true;
    stop();
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    intersectionObserver.disconnect();
    resizeObserver.disconnect();

    scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of mats) mat.dispose();
      }
    });
    texture?.dispose();
    renderer.dispose();
  }

  function setCaptureMode(on: boolean) {
    captureMode = on;
    if (on) {
      curParallaxX = 0;
      curParallaxY = 0;
      cameraRig.parallaxOffset.set(0, 0, 0);
      cameraRig.scrollOffset.set(0, 0, 0);
      logoGroup.rotation.x = 0;
      reflectionGroup.rotation.x = 0;
      const spotPos = computeSpotPosition(12);
      lights.spot.position.set(spotPos.x, spotPos.y, spotPos.z);
      lights.spot.target.position.set(spotPos.x + 0.8, model.lockup.center[1] + 0.35, 0);
      lights.spot.target.updateMatrixWorld();
      applyEntry(performance.now() + 5000);
      cameraRig.applyFrame();
      renderer.render(scene, cameraRig.camera);
    }
  }

  function getScreenRect(id: "shield" | "lockup") {
    const box = new Box3();
    if (id === "shield") {
      for (const mesh of meshesByElement.get("shield") ?? []) box.expandByObject(mesh);
    } else {
      logoGroup.updateWorldMatrix(true, true);
      box.setFromObject(logoGroup);
    }
    if (box.isEmpty()) return null;

    const corners = [
      new Vector3(box.min.x, box.min.y, box.max.z),
      new Vector3(box.max.x, box.min.y, box.max.z),
      new Vector3(box.min.x, box.max.y, box.max.z),
      new Vector3(box.max.x, box.max.y, box.max.z),
    ];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const corner of corners) {
      const projected = corner.clone().project(cameraRig.camera);
      const x = ((projected.x + 1) / 2) * cssWidth;
      const y = ((1 - projected.y) / 2) * cssHeight;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  start();

  return {
    dispose,
    setCaptureMode,
    getScreenRect,
    isRunning: () => running,
  };
}
