import {
  ExtrudeGeometry,
  Shape,
  Path,
  Vector2,
  type ExtrudeGeometryOptions,
} from "three";
import type { LogoElementData, LogoModel, LogoShapeData } from "./types";

function buildShape(data: LogoShapeData): Shape {
  const shape = new Shape(data.outer.points.map(([x, y]) => new Vector2(x, y)));
  for (const hole of data.holes) {
    shape.holes.push(new Path(hole.points.map(([x, y]) => new Vector2(x, y))));
  }
  return shape;
}

export interface ElementExtrudeParams {
  depth: number;
  bevelEnabled: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
  curveSegments: number;
}

// Parámetros del plan: profundidad relativa al ancho del escudo (0.726
// unidades de mundo). bevelOffset negativo = -bevelSize: las paredes
// quedan en el contorno original y la tapa se contrae hacia dentro (así
// el bisel tapa el borde blanco de la textura del PNG, que es opaco).
export const ELEMENT_PARAMS: Record<LogoElementData["id"], ElementExtrudeParams> = {
  shield: {
    depth: 0.045,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.003,
    bevelOffset: -0.003,
    bevelSegments: 2,
    curveSegments: 5,
  },
  unity: {
    depth: 0.036,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.002,
    bevelOffset: -0.002,
    bevelSegments: 1,
    curveSegments: 4,
  },
  "insurance-group": {
    depth: 0.018,
    bevelEnabled: false,
    curveSegments: 3,
  },
  tagline: {
    depth: 0.018,
    bevelEnabled: false,
    curveSegments: 3,
  },
};

interface TextureUVGeneratorOptions {
  rect: { x: number; y: number; w: number; h: number };
}

// UV de la tapa frontal por posición del vértice (no por repeat/offset):
// mapea directo el rect de textura (en unidades de mundo) a [0,1]. Reusa
// el generador estándar de three para las paredes laterales.
function createShieldUVGenerator({ rect }: TextureUVGeneratorOptions) {
  return {
    generateTopUV(
      geometry: ExtrudeGeometry,
      vertices: number[],
      indexA: number,
      indexB: number,
      indexC: number,
    ) {
      const uvOf = (index: number) => {
        const x = vertices[index * 3];
        const y = vertices[index * 3 + 1];
        return new Vector2((x - rect.x) / rect.w, (y - rect.y) / rect.h);
      };
      return [uvOf(indexA), uvOf(indexB), uvOf(indexC)];
    },
    generateSideWallUV(
      geometry: ExtrudeGeometry,
      vertices: number[],
      indexA: number,
      indexB: number,
      indexC: number,
      indexD: number,
    ) {
      const uvOf = (index: number) => {
        const x = vertices[index * 3];
        const y = vertices[index * 3 + 1];
        return new Vector2((x - rect.x) / rect.w, (y - rect.y) / rect.h);
      };
      return [uvOf(indexA), uvOf(indexB), uvOf(indexC), uvOf(indexD)];
    },
  };
}

export interface BuiltElement {
  id: LogoElementData["id"];
  geometry: ExtrudeGeometry;
}

// Construye la ExtrudeGeometry de un elemento (todas sus shapes juntas, un
// solo draw call). El escudo recibe un UVGenerator propio para texturizar
// con el degradado real del PNG; el resto no lo necesita (color plano).
export function buildElementGeometry(
  model: LogoModel,
  element: LogoElementData,
): BuiltElement {
  const params = ELEMENT_PARAMS[element.id];
  const shapes = element.shapes.map(buildShape);

  const options: ExtrudeGeometryOptions = {
    depth: params.depth,
    bevelEnabled: params.bevelEnabled,
    curveSegments: params.curveSegments,
    steps: 1,
  };
  if (params.bevelEnabled) {
    options.bevelThickness = params.bevelThickness;
    options.bevelSize = params.bevelSize;
    options.bevelOffset = params.bevelOffset;
    options.bevelSegments = params.bevelSegments;
  }
  if (element.id === "shield") {
    options.UVGenerator = createShieldUVGenerator({ rect: model.texture.rect });
  }

  const geometry = new ExtrudeGeometry(shapes, options);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  return { id: element.id, geometry };
}

export function buildAllElements(model: LogoModel): BuiltElement[] {
  return model.elements.map((el) => buildElementGeometry(model, el));
}
