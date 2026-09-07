// Captura los posters estáticos del hero desde la escena 3D real (modo
// "captura": entrada completada, spot fijo, input a cero) vía CDP. Requiere
// que el sitio esté corriendo en http://localhost:3000 (npm run dev o
// npm run start). No usa Puppeteer: WebSocket + fetch nativos de Node 22.
//
// Uso: node scripts/capture-hero-poster.mjs [base-url]
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const OUT_DIR = join(REPO_ROOT, "public", "images", "hero");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.argv[2] ?? "http://localhost:3000";
const PORT = 9390;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new", "--hide-scrollbars", "--use-gl=angle", "--use-angle=metal",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "hero-poster-"))}`,
  "about:blank",
], { stdio: "ignore" });

let target;
for (let i = 0; i < 60 && !target; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === "page");
  } catch {}
  if (!target) await sleep(250);
}
if (!target) throw new Error("No se pudo conectar a Chrome");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const send = (method, params = {}) => new Promise((res, rej) => {
  const my = ++id;
  pending.set(my, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result)));
  ws.send(JSON.stringify({ id: my, method, params }));
});
const evalJs = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result.value;
};

await send("Runtime.enable");
await send("Page.enable");

async function capture(name, width, height, dpr, mobile) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: dpr, mobile });
  await send("Page.navigate", { url: `${BASE}/` });

  let ready = false;
  for (let i = 0; i < 40; i++) {
    ready = await evalJs(`!!(window.__unityHero && document.querySelector(".hero-scene-canvas.is-ready"))`);
    if (ready) break;
    await sleep(300);
  }
  if (!ready) throw new Error(`La escena no quedó lista para "${name}"`);

  // Modo captura: pausa el loop, congela el spot y la entrada, resetea el
  // parallax, y oculta texto/scrim/posters para fotografiar solo la escena
  // (el poster detrás del canvas puede asomar como "fantasma" tenue en
  // capturas headless con GPU si no se oculta explícitamente).
  await evalJs(`
    window.__unityHero.setCaptureMode(true);
    document.querySelector("#inicio .relative.z-10").style.visibility = "hidden";
    document.querySelector(".hero-scrim").style.display = "none";
    document.querySelectorAll("#inicio img").forEach((img) => { img.style.display = "none"; });
  `);
  await sleep(200);

  const canvasRect = await evalJs(`
    (() => {
      const r = document.querySelector(".hero-scene-canvas").getBoundingClientRect();
      return JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height });
    })()
  `);
  const rect = JSON.parse(canvasRect);

  // Screenshot del viewport completo (sin `clip` de CDP: su interacción con
  // deviceScaleFactor + mobile dio un recorte incorrecto en pruebas) y
  // recorte preciso con sharp, escalando el rect de CSS px a px de imagen.
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  const buffer = Buffer.from(data, "base64");
  const meta = await sharp(buffer).metadata();
  const scaleX = meta.width / width;
  const scaleY = meta.height / height;
  const outPath = join(OUT_DIR, `${name}.webp`);
  const extractRect = {
    left: Math.max(0, Math.round(rect.x * scaleX)),
    top: Math.max(0, Math.round(rect.y * scaleY)),
    width: Math.min(meta.width - Math.round(rect.x * scaleX), Math.round(rect.width * scaleX)),
    height: Math.min(meta.height - Math.round(rect.y * scaleY), Math.round(rect.height * scaleY)),
  };
  await sharp(buffer)
    .extract(extractRect)
    .webp({ quality: 82 })
    .toFile(outPath);
  console.log(`Escrito: ${outPath} (${rect.width}x${rect.height} CSS px, imagen ${meta.width}x${meta.height})`);
}

await capture("hero-poster", 1440, 820, 2, false);
await capture("hero-poster-mobile", 390, 680, 2, true);

console.log("\nListo.");
ws.close();
chrome.kill();
