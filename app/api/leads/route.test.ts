// app/api/leads/route.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const AIRTABLE_URL = "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK";
const MAKE_URL = "https://hook.us2.make.com/prueba";
const REFERER = "https://unityinsurancepr.com/seguros/hogar";

function peticion(body: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", referer: REFERER },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const consulta = { nombre: "Ana Pérez", telefono: "787-555-0100", email: "", producto: "hogar", consentimiento: true };

function fetchQueResponde(airtableStatus: number, makeStatus: number) {
  return vi.fn(async (url: string | URL | Request) => {
    const u = String(url);
    if (u.startsWith(AIRTABLE_URL)) {
      return new Response(airtableStatus === 200 ? JSON.stringify({ id: "recTEST123" }) : '{"error":"x"}', {
        status: airtableStatus,
      });
    }
    if (u === MAKE_URL) return new Response(makeStatus === 200 ? "Accepted" : "error", { status: makeStatus });
    throw new Error(`URL inesperada: ${u}`);
  });
}

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

  it("responde 500 sin llamar a nadie si faltan variables de entorno", async () => {
    vi.stubEnv("AIRTABLE_API_KEY", "");
    const fetchMock = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("responde 400 si el cuerpo no es JSON", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(200, 200));
    const res = await POST(peticion("esto no es json"));
    expect(res.status).toBe(400);
  });

  it("responde 400 con el motivo si faltan datos", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(200, 200));
    const res = await POST(peticion({ telefono: "787-555-0100" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "El nombre es requerido" });
  });

  it("guarda en Airtable, avisa a Make y responde 200", async () => {
    const fetchMock = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, id: "recTEST123", notificado: true });

    const [llamadaAirtable, llamadaMake] = fetchMock.mock.calls as unknown as [string, RequestInit][];
    expect(String(llamadaAirtable[0])).toBe(AIRTABLE_URL);
    const camposAirtable = JSON.parse(llamadaAirtable[1].body as string).fields;
    expect(camposAirtable["Seguro de Interés"]).toBe("Hogar");
    expect(camposAirtable["Notas del formulario"]).toBe(`Página: ${REFERER}`);

    expect(String(llamadaMake[0])).toBe(MAKE_URL);
    const payloadMake = JSON.parse(llamadaMake[1].body as string);
    expect(payloadMake.airtable_url).toBe(
      "https://airtable.com/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK/recTEST123",
    );
    expect(payloadMake.pagina).toBe(REFERER);
  });

  it("responde 502 y no llama a Make si Airtable falla", async () => {
    const fetchMock = fetchQueResponde(422, 200);
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("responde 200 con notificado=false si Make falla", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(200, 500));
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, id: "recTEST123", notificado: false });
  });
});
