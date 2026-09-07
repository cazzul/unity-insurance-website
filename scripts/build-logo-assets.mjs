// Extrae la silueta vectorial del lockup de Unity (escudo + UNITY +
// INSURANCE GROUP + eslogan) desde el SVG trazado, resuelve huecos con el
// mismo algoritmo de regla de relleno que usa three.js (ShapePath.toShapes,
// nonzero winding, igual que un navegador), y genera:
//   - lib/hero-scene/unity-logo.json  (contornos en unidades de mundo)
//   - public/images/brand/unity-shield-albedo-1024.webp (textura del escudo)
//
// Uso: node scripts/build-logo-assets.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ShapePath, Path } from "three";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const FOTOS_LOGO = join(REPO_ROOT, "..", "FOTOS", "LOGO");

const SVG_PATH = join(FOTOS_LOGO, "unity-lockup-trace.svg");
const PNG_PATH = join(FOTOS_LOGO, "unity-lockup-2752.png");
const JSON_OUT = join(REPO_ROOT, "lib", "hero-scene", "unity-logo.json");
const TEXTURE_OUT = join(
  REPO_ROOT,
  "public",
  "images",
  "brand",
  "unity-shield-albedo-1024.webp",
);

// Unidades de mundo: origen en el centro del lockup completo, 1 unidad =
// 1000 px del SVG (viewBox "0 0 2752 1536"), eje Y invertido (SVG crece
// hacia abajo, three.js hacia arriba).
const LOCKUP_CENTER = { x: 1402, y: 752 };
const UNITS_PER_PX = 1 / 1000;
const CURVE_DIVISIONS = 7; // segmentos por curva Bézier original al aplanar
const ROUND = (n) => Math.round(n * 10000) / 10000;

function toWorld(x, y) {
  return [
    ROUND((x - LOCKUP_CENTER.x) * UNITS_PER_PX),
    ROUND((LOCKUP_CENTER.y - y) * UNITS_PER_PX),
  ];
}

// --- 1. Parsear los <path fill="#RRGGBB" ... d="..."> del SVG -------------

function parseSvgPaths(svgText) {
  const re = /<path\s+fill="(#[0-9A-Fa-f]{6})"[^>]*?\sd="([^"]+)"/g;
  const paths = [];
  let m;
  while ((m = re.exec(svgText))) {
    paths.push({ fill: m[1], d: m[2] });
  }
  return paths;
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
}

// Point-in-polygon (even-odd ray casting), igual al algoritmo que usa
// ShapePath.toShapes() internamente. Se usa aparte porque los 20 huecos
// reales (contadores de letras y el negativo del escudo) NO viven dentro
// de path[0]: son <path> separados, casi blancos, verificados a mano.
function pointInPolygon(p, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) {
      inside = !inside;
    }
  }
  return inside;
}

// Aplana un subtrazado simple (M + N curvas C, un solo M) a puntos [x,y] en
// espacio SVG, usando three.Path (mismo tesselador que el resto del script).
function flattenSubpath(subPath, divisions) {
  const path = new Path();
  path.moveTo(subPath.start[0], subPath.start[1]);
  for (const [c1x, c1y, c2x, c2y, x, y] of subPath.segs) {
    path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
  }
  return path.getPoints(divisions).map((v) => [v.x, v.y]);
}

// Tokeniza "d" en subtrazados absolutos M/C/z (el archivo solo usa esos 3
// comandos, verificado previamente). Aborta si aparece cualquier otro.
function parsePathData(d) {
  const tokens = d.match(/[MCz]|-?\d+(?:\.\d+)?/g);
  if (!tokens) throw new Error("d vacío o sin tokens reconocibles");
  const subPaths = [];
  let current = null;
  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i];
    if (cmd === "M") {
      const x = Number(tokens[i + 1]);
      const y = Number(tokens[i + 2]);
      current = { start: [x, y], segs: [] };
      subPaths.push(current);
      i += 3;
    } else if (cmd === "C") {
      if (!current) throw new Error("C sin M previo");
      const nums = tokens.slice(i + 1, i + 7).map(Number);
      current.segs.push(nums);
      i += 7;
    } else if (cmd === "z") {
      i += 1; // cierre implícito, no aporta geometría adicional
    } else {
      throw new Error(`Comando no soportado: "${cmd}" (solo se esperaba M/C/z)`);
    }
  }
  return subPaths;
}

// --- 2. Construir ShapePath con TODOS los subtrazados de path[0], en el ---
//        mismo orden del archivo, y dejar que three.js resuelva huecos ----
//        exactamente como lo haría un navegador (nonzero winding). --------

function buildShapesFromSubpaths(subPaths) {
  const shapePath = new ShapePath();
  for (const sp of subPaths) {
    shapePath.moveTo(sp.start[0], sp.start[1]);
    for (const [c1x, c1y, c2x, c2y, x, y] of sp.segs) {
      shapePath.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
    }
  }
  return shapePath.toShapes();
}

function bboxOfPoints(points) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

// Clasificación por bbox (en espacio SVG, Y crece hacia abajo), verificada
// contra el archivo real: escudo x<1000; UNITY x>=1000 && maxY<800;
// INSURANCE GROUP minY en [850,1050]; eslogan minY>=1100.
function classify(bbox) {
  if (bbox.minX < 1000) return "shield";
  if (bbox.maxY < 800) return "unity";
  if (bbox.minY >= 850 && bbox.minY < 1050) return "insurance-group";
  if (bbox.minY >= 1100) return "tagline";
  return "unclassified";
}

function shapeToWorldContour(pointsSvg) {
  return pointsSvg.map((p) => toWorld(p.x, p.y));
}

function shapeToElementContour(shape) {
  const outerPoints = shape.getPoints(CURVE_DIVISIONS);
  const outer = {
    start: shapeToWorldContour(outerPoints)[0],
    points: shapeToWorldContour(outerPoints),
  };
  const holes = (shape.holes || []).map((hole) => {
    const pts = hole.getPoints(CURVE_DIVISIONS);
    return { points: shapeToWorldContour(pts) };
  });
  return { outer, holes };
}

async function main() {
  console.log("Leyendo SVG:", SVG_PATH);
  const svgText = readFileSync(SVG_PATH, "utf8");
  const allPaths = parseSvgPaths(svgText);
  console.log(`  ${allPaths.length} <path> encontrados`);
  if (allPaths.length !== 280) {
    console.warn(`  AVISO: se esperaban 280 paths, se encontraron ${allPaths.length}`);
  }

  const path0 = allPaths[0];
  if (path0.fill.toUpperCase() !== "#FEFEFE") {
    throw new Error(`path[0] no es #FEFEFE (es ${path0.fill}); revisa el SVG`);
  }

  const subPaths = parsePathData(path0.d);
  console.log(`  path[0] tiene ${subPaths.length} subtrazados`);
  if (subPaths.length !== 42) {
    console.warn(`  AVISO: se esperaban 42 subtrazados, se encontraron ${subPaths.length}`);
  }

  // Descarta el subtrazado del lienzo completo (bbox ~ todo el viewBox).
  const CANVAS_AREA_THRESHOLD = 3_500_000;
  const usable = subPaths.filter((sp) => {
    const pts = [sp.start, ...sp.segs.map((s) => [s[4], s[5]])];
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const w = Math.max(...xs) - Math.min(...xs);
    const h = Math.max(...ys) - Math.min(...ys);
    return w * h < CANVAS_AREA_THRESHOLD;
  });
  console.log(`  ${usable.length} subtrazados tras descartar el lienzo`);

  console.log("Construyendo contornos externos desde path[0] (ShapePath.toShapes)...");
  const shapes = buildShapesFromSubpaths(usable);
  console.log(`  ${shapes.length} shapes externos`);

  // Los huecos reales (contadores de letras O/A/R/P/G y el negativo del
  // escudo) NO están en path[0]: son 20 <path> separados, casi blancos,
  // verificados a mano (un solo M/C/z cada uno). Se asignan al shape que
  // los contiene por punto-en-polígono.
  console.log("Buscando huecos reales (paths casi blancos fuera de path[0])...");
  const holeCandidates = [];
  for (let i = 1; i < allPaths.length; i++) {
    if (luminance(allPaths[i].fill) > 235) {
      const [sp] = parsePathData(allPaths[i].d);
      holeCandidates.push(flattenSubpath(sp, CURVE_DIVISIONS));
    }
  }
  console.log(`  ${holeCandidates.length} candidatos a hueco encontrados`);
  if (holeCandidates.length !== 20) {
    console.warn(`  AVISO: se esperaban 20 candidatos a hueco, se encontraron ${holeCandidates.length}`);
  }

  const shapeFlatPoints = shapes.map((s) => s.getPoints(CURVE_DIVISIONS).map((v) => [v.x, v.y]));
  let assigned = 0;
  for (const holePts of holeCandidates) {
    const bbox = bboxOfPoints(holePts.map(([x, y]) => ({ x, y })));
    const centroid = [(bbox.minX + bbox.maxX) / 2, (bbox.minY + bbox.maxY) / 2];
    let parentIndex = -1;
    let parentArea = Infinity;
    shapeFlatPoints.forEach((poly, idx) => {
      if (!pointInPolygon(centroid, poly)) return;
      const b = bboxOfPoints(poly.map(([x, y]) => ({ x, y })));
      const area = (b.maxX - b.minX) * (b.maxY - b.minY);
      if (area < parentArea) {
        parentArea = area;
        parentIndex = idx;
      }
    });
    if (parentIndex === -1) {
      console.warn("  AVISO: un candidato a hueco no cayó dentro de ningún shape; se descarta.", centroid);
      continue;
    }
    const holePath = new Path(holePts.map(([x, y]) => ({ x, y })));
    shapes[parentIndex].holes.push(holePath);
    assigned++;
  }
  console.log(`  ${assigned} huecos asignados`);

  // Clasificar cada shape resultante por su bbox.
  const elements = { shield: [], unity: [], "insurance-group": [], tagline: [], unclassified: [] };
  for (const shape of shapes) {
    const pts = shape.getPoints(2);
    const bbox = bboxOfPoints(pts);
    const key = classify(bbox);
    elements[key].push(shape);
  }

  console.log("Conteo por elemento:");
  for (const [key, arr] of Object.entries(elements)) {
    console.log(`  ${key}: ${arr.length}`);
  }
  if (elements.unclassified.length > 0) {
    console.warn("  AVISO: hay shapes sin clasificar; revisa los rangos de bbox.");
  }
  const EXPECTED = { shield: 1, unity: 5, "insurance-group": 14, tagline: 21 };
  for (const [key, expected] of Object.entries(EXPECTED)) {
    if (elements[key].length !== expected) {
      console.warn(`  AVISO: "${key}" esperaba ${expected}, obtuvo ${elements[key].length}`);
    }
  }

  // bbox del escudo en espacio SVG, para el rect de textura.
  const shieldPts = elements.shield.flatMap((s) => s.getPoints(2));
  const shieldBboxSvg = bboxOfPoints(shieldPts);
  const PAD = 10; // aire alrededor, en px SVG, para que el bisel no muestre el borde blanco
  const cropRectSvg = {
    left: Math.max(0, Math.round(shieldBboxSvg.minX - PAD)),
    top: Math.max(0, Math.round(shieldBboxSvg.minY - PAD)),
    right: Math.round(shieldBboxSvg.maxX + PAD),
    bottom: Math.round(shieldBboxSvg.maxY + PAD),
  };
  cropRectSvg.width = cropRectSvg.right - cropRectSvg.left;
  cropRectSvg.height = cropRectSvg.bottom - cropRectSvg.top;

  // bbox real del contenido (los 4 elementos juntos), NO del lienzo del
  // SVG: es lo que camera-rig.ts usa para encuadrar el lockup completo.
  const allOuterPointsSvg = [];
  for (const key of ["shield", "unity", "insurance-group", "tagline"]) {
    for (const shape of elements[key]) {
      const pts = shape.getPoints(2);
      allOuterPointsSvg.push(...pts);
    }
  }
  const contentBboxSvg = bboxOfPoints(allOuterPointsSvg);

  // Construir el JSON final.
  const model = {
    version: 1,
    unitsPerPx: UNITS_PER_PX,
    center: [LOCKUP_CENTER.x, LOCKUP_CENTER.y],
    lockup: (() => {
      const [x0, y0] = toWorld(contentBboxSvg.minX, contentBboxSvg.maxY);
      const [x1, y1] = toWorld(contentBboxSvg.maxX, contentBboxSvg.minY);
      return {
        center: [ROUND((x0 + x1) / 2), ROUND((y0 + y1) / 2)],
        width: ROUND(x1 - x0),
        height: ROUND(y1 - y0),
      };
    })(),
    shield: (() => {
      const [x0, y0] = toWorld(shieldBboxSvg.minX, shieldBboxSvg.maxY);
      const [x1, y1] = toWorld(shieldBboxSvg.maxX, shieldBboxSvg.minY);
      return {
        center: [ROUND((x0 + x1) / 2), ROUND((y0 + y1) / 2)],
        width: ROUND(x1 - x0),
        height: ROUND(y1 - y0),
      };
    })(),
    texture: {
      // Rect del recorte de textura, en unidades de mundo (esquina inferior
      // izquierda + tamaño), para el UVGenerator en tiempo de ejecución.
      rect: (() => {
        const [x0, y0] = toWorld(cropRectSvg.left, cropRectSvg.bottom);
        const [x1, y1] = toWorld(cropRectSvg.right, cropRectSvg.top);
        return { x: ROUND(x0), y: ROUND(y0), w: ROUND(x1 - x0), h: ROUND(y1 - y0) };
      })(),
    },
    elements: Object.entries(elements)
      .filter(([key]) => key !== "unclassified")
      .map(([id, shapeList]) => ({
        id,
        shapes: shapeList.map((shape) => shapeToElementContour(shape)),
      })),
  };

  mkdirSync(dirname(JSON_OUT), { recursive: true });
  writeFileSync(JSON_OUT, JSON.stringify(model));
  console.log("Escrito:", JSON_OUT, `(${(JSON.stringify(model).length / 1024).toFixed(1)} KB)`);

  // --- 3. Textura del escudo: recorte del PNG de alta resolución ----------
  console.log("Generando textura del escudo desde:", PNG_PATH);
  mkdirSync(dirname(TEXTURE_OUT), { recursive: true });
  await sharp(PNG_PATH)
    .extract({
      left: cropRectSvg.left,
      top: cropRectSvg.top,
      width: cropRectSvg.width,
      height: cropRectSvg.height,
    })
    .resize({ width: 1024 })
    .webp({ quality: 88 })
    .toFile(TEXTURE_OUT);
  console.log("Escrito:", TEXTURE_OUT);

  console.log("\nListo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
