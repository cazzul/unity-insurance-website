import {
  BackSide,
  CanvasTexture,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SpotLight,
  type Object3D,
} from "three";

export const FLOOR_Y = -1.12;
export const BACKGROUND_COLOR = 0xc5cad0;

export function makeNoiseTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const image = ctx.createImageData(size, size);
    for (let i = 0; i < image.data.length; i += 4) {
      const v = 246 + Math.floor(Math.random() * 9); // 246..254
      image.data[i] = v;
      image.data[i + 1] = v;
      image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(6, 3);
  return texture;
}

// Gradiente 1x256 para el alphaMap del piso: 0 en la unión con la pared,
// 1 a partir de cierta distancia (smoothstep), usado para desvanecer el
// reflejo cerca de esa unión sin un render target aparte.
export function makeFadeTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, size, 0, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.6)");
    gradient.addColorStop(1, "rgba(255,255,255,1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, size);
  }
  const texture = new CanvasTexture(canvas);
  return texture;
}

export function createWall(): Mesh {
  const geometry = new PlaneGeometry(40, 20);
  const material = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    map: makeNoiseTexture(),
  });
  const wall = new Mesh(geometry, material);
  wall.position.set(0, 3, 0);
  wall.receiveShadow = true;
  return wall;
}

export function createFloor(): Mesh {
  const geometry = new PlaneGeometry(40, 30);
  const material = new MeshStandardMaterial({
    color: 0xcfd3d8,
    roughness: 0.5,
    metalness: 0,
  });
  const floor = new Mesh(geometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = FLOOR_Y;
  floor.receiveShadow = true;
  return floor;
}

// Plano coplanar al piso que funde el reflejo cerca de la unión
// pared/piso, con polygonOffset para evitar z-fighting con el piso.
export function createFloorFade(): Mesh {
  const geometry = new PlaneGeometry(40, 30);
  const material = new MeshStandardMaterial({
    color: 0xcfd3d8,
    roughness: 0.5,
    metalness: 0,
    transparent: true,
    alphaMap: makeFadeTexture(),
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const fade = new Mesh(geometry, material);
  fade.rotation.x = -Math.PI / 2;
  fade.position.y = FLOOR_Y + 0.002;
  fade.receiveShadow = true;
  fade.renderOrder = 2;
  return fade;
}

export interface SceneLights {
  hemisphere: HemisphereLight;
  directional: DirectionalLight;
  spot: SpotLight;
}

// Todas las luces son blancas a propósito (nunca teñir el logo). El bisel
// direccional aporta las sombras suaves; el spot es el barrido lento.
export function createLights(logoCenter: [number, number]): SceneLights {
  const hemisphere = new HemisphereLight(0xffffff, 0xdfe6ee, 0.6);

  const directional = new DirectionalLight(0xffffff, 0.55);
  directional.position.set(2.2, 3.5, 4.0);
  directional.castShadow = true;
  directional.shadow.mapSize.set(1024, 1024);
  directional.shadow.bias = -0.0004;
  directional.shadow.normalBias = 0.015;
  const cam = directional.shadow.camera;
  cam.left = -1.7;
  cam.right = 1.7;
  cam.top = 1.0;
  cam.bottom = -1.4;
  cam.near = 0.5;
  cam.far = 12;
  cam.updateProjectionMatrix();
  directional.target.position.set(logoCenter[0], logoCenter[1], 0);

  const spot = new SpotLight(0xffffff, 3.0, 0, 0.55, 0.85, 2);
  spot.position.set(-2.4, 2.9, 3.4);
  spot.castShadow = false;
  spot.target.position.set(logoCenter[0] + 0.8, logoCenter[1] + 0.35, 0);

  return { hemisphere, directional, spot };
}

export function attachLights(scene: Scene, lights: SceneLights) {
  scene.add(lights.hemisphere);
  scene.add(lights.directional);
  scene.add(lights.directional.target);
  scene.add(lights.spot);
  scene.add(lights.spot.target);
}

// Copia espejada bajo el piso: mismas geometrías, materiales clonados sin
// test de profundidad ni escritura, opacidad baja. Barato (sin Reflector,
// sin render target).
export function createReflectionGroup(logoGroup: Group, opacity = 0.32): Group {
  const reflection = new Group();
  reflection.scale.y = -1;
  reflection.position.y = 2 * FLOOR_Y;

  logoGroup.traverse((child: Object3D) => {
    if (!(child instanceof Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const cloned = materials.map((mat) => {
      const clone = (mat as MeshStandardMaterial).clone();
      clone.transparent = true;
      clone.opacity = opacity;
      clone.depthTest = false;
      clone.depthWrite = false;
      clone.side = BackSide;
      return clone;
    });
    const mesh = new Mesh(child.geometry, Array.isArray(child.material) ? cloned : cloned[0]);
    mesh.renderOrder = 1;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.userData.sourceId = child.userData.elementId;
    reflection.add(mesh);
  });

  return reflection;
}

export function applyBackgroundAndFog(scene: Scene) {
  scene.background = new Color(BACKGROUND_COLOR);
  scene.fog = new Fog(BACKGROUND_COLOR, 6, 15);
}
