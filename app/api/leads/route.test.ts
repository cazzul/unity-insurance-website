// app/api/leads/route.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST, maxDuration } from "./route";

const AIRTABLE_URL = "https://api.airtable.com/v0/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY";
const MAKE_URL = "https://hook.us2.make.com/prueba";
const REFERER = "https://unityinsurancepr.com/seguros/hogar";
const REGISTRO = "https://airtable.com/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY/recTEST123";
const AVISO = "⚠️ NO se guardó en el CRM (Airtable). Anótalo a mano.";
const consulta = { nombre: "Ana Pérez", telefono: "787-555-0100", email: "", producto: "hogar", consentimiento: true };

const peticion = (body: unknown) =>
  new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", referer: REFERER },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

// Responde según el destino; cualquier otra URL hace fallar la prueba.
function fetchQueResponde(airtable: 200 | 403 | 422 | 500 | "red", make: 200 | 500) {
  return vi.fn(async (url: string | URL | Request) => {
    const u = String(url);
    if (u === AIRTABLE_URL) {
      if (airtable === "red") throw new TypeError("fetch failed");
      return new Response(airtable === 200 ? JSON.stringify({ id: "recTEST123" }) : '{"error":"x"}', { status: airtable });
    }
    if (u === MAKE_URL) return new Response(make === 200 ? "Accepted" : "error", { status: make });
    throw new Error(`URL inesperada: ${u}`);
  });
}
type Fetch = ReturnType<typeof fetchQueResponde>;
const llamadas = (f: Fetch) => f.mock.calls as unknown as [string, RequestInit][];
const urls = (f: Fetch) => llamadas(f).map(([u]) => String(u));
const cuerpoMake = (f: Fetch) =>
  JSON.parse(llamadas(f).find(([u]) => String(u) === MAKE_URL)![1].body as string);

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.stubEnv("AIRTABLE_API_KEY", "pat_test");
    vi.stubEnv("MAKE_LEADS_WEBHOOK_URL", MAKE_URL);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("responde 500 sin llamar a nadie si faltan las dos variables", async () => {
    vi.stubEnv("AIRTABLE_API_KEY", "");
    vi.stubEnv("MAKE_LEADS_WEBHOOK_URL", "");
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    expect((await POST(peticion(consulta))).status).toBe(500);
    expect(f).not.toHaveBeenCalled();
  });

  it("responde 400 si el cuerpo no es JSON o faltan datos, sin llamar a nadie", async () => {
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    expect((await POST(peticion("esto no es json"))).status).toBe(400);
    const res = await POST(peticion({ telefono: "787-555-0100" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "El nombre es requerido" });
    expect(f).not.toHaveBeenCalled();
  });

  it("guarda en Airtable, avisa a Make con el enlace y responde 200", async () => {
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, guardado: true, notificado: true });
    expect(urls(f)).toEqual([AIRTABLE_URL, MAKE_URL]);
    expect(llamadas(f)[0][1].headers).toMatchObject({ Authorization: "Bearer pat_test" });
    expect(cuerpoMake(f)).toMatchObject({ crm: REGISTRO, seguro: "Hogar", pagina: REFERER });
  });

  it("responde 200 con notificado=false si Make falla y el lead ya está en Airtable", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(200, 500));
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, guardado: true, notificado: false });
  });

  it.each([403, 422, 500, "red"] as const)(
    "con Airtable %s avisa a Make con el aviso ⚠️ y responde 200",
    async (airtable) => {
      const f = fetchQueResponde(airtable, 200);
      vi.stubGlobal("fetch", f);
      const res = await POST(peticion(consulta));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true, guardado: false, notificado: true });
      expect(cuerpoMake(f).crm).toBe(AVISO);
    },
  );

  it("responde 502 si fallan Airtable y Make", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(403, 500));
    expect((await POST(peticion(consulta))).status).toBe(502);
  });

  it("sin AIRTABLE_API_KEY omite Airtable y avisa a Make con el aviso", async () => {
    vi.stubEnv("AIRTABLE_API_KEY", "");
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    const res = await POST(peticion(consulta));
    expect(await res.json()).toEqual({ success: true, guardado: false, notificado: true });
    expect(urls(f)).toEqual([MAKE_URL]);
    expect(cuerpoMake(f).crm).toBe(AVISO);
  });

  it("sin MAKE_LEADS_WEBHOOK_URL guarda en Airtable y responde 200 sin avisar", async () => {
    vi.stubEnv("MAKE_LEADS_WEBHOOK_URL", "");
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, guardado: true, notificado: false });
    expect(urls(f)).toEqual([AIRTABLE_URL]);
  });

  it.each([
    [403, 200],
    [200, 500],
    [403, 500],
  ] as const)(
    "no registra datos del lead en los logs si Airtable responde %s y Make %s",
    async (airtable, make) => {
      vi.stubGlobal("fetch", fetchQueResponde(airtable, make));
      await POST(peticion(consulta));
      const registro = JSON.stringify(vi.mocked(console.error).mock.calls);
      expect(registro).not.toContain("Ana Pérez");
      expect(registro).not.toContain("787");
    },
  );

  it("declara un tiempo máximo de función que cubre los tiempos de Airtable (6 s) y Make (4 s)", () => {
    expect(maxDuration).toBeGreaterThanOrEqual(15);
  });
});
