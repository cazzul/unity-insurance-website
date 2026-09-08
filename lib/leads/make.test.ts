import { afterEach, describe, expect, it, vi } from "vitest";
import { construirPayloadMake, notificarMake } from "./make";
import type { Lead } from "./normalize";

const ahora = new Date("2026-09-08T13:40:00.000Z");
const WEBHOOK = "https://hook.us2.make.com/prueba";

const lead: Lead = {
  nombre: "Ana Pérez",
  telefono: "+17875550100",
  email: "ana@example.com",
  productoId: "hogar",
  seguro: "Hogar",
  fuente: "Formulario web",
  notas: "",
  pagina: "https://unityinsurancepr.com/seguros/hogar",
  consentimiento: true,
};

describe("construirPayloadMake", () => {
  it("arma el payload con fecha local de Puerto Rico y la URL de Airtable", () => {
    expect(construirPayloadMake(lead, "https://airtable.com/app/tbl/rec1", ahora)).toEqual({
      nombre: "Ana Pérez",
      telefono: "+17875550100",
      email: "ana@example.com",
      seguro: "Hogar",
      fuente: "Formulario web",
      notas: "Sin notas",
      pagina: "https://unityinsurancepr.com/seguros/hogar",
      fecha: "2026-09-08T13:40:00.000Z",
      fecha_local: "08/09/2026 9:40 AM",
      airtable_url: "https://airtable.com/app/tbl/rec1",
    });
  });

  it("usa textos legibles cuando faltan datos", () => {
    const p = construirPayloadMake({ ...lead, telefono: null, email: "", seguro: null }, "u", ahora);
    expect(p.telefono).toBe("No indicado");
    expect(p.email).toBe("No indicado");
    expect(p.seguro).toBe("No especificado");
  });
});

describe("notificarMake", () => {
  afterEach(() => vi.restoreAllMocks());

  it("devuelve true cuando el webhook acepta", async () => {
    const fetchMock = vi.fn(async () => new Response("Accepted", { status: 200 }));
    const payload = construirPayloadMake(lead, "u", ahora);
    await expect(
      notificarMake(payload, { webhookUrl: WEBHOOK, fetch: fetchMock as unknown as typeof fetch }),
    ).resolves.toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(WEBHOOK);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual(payload);
  });

  it("devuelve false y no lanza si el webhook responde error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => new Response("error", { status: 500 }));
    await expect(
      notificarMake(construirPayloadMake(lead, "u", ahora), { webhookUrl: WEBHOOK, fetch: fetchMock as unknown as typeof fetch }),
    ).resolves.toBe(false);
    expect(console.error).toHaveBeenCalled();
  });

  it("devuelve false y no lanza si la red falla", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => {
      throw new Error("ECONNRESET");
    });
    await expect(
      notificarMake(construirPayloadMake(lead, "u", ahora), { webhookUrl: WEBHOOK, fetch: fetchMock as unknown as typeof fetch }),
    ).resolves.toBe(false);
  });
});
