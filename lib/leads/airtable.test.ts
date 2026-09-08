import { describe, expect, it, vi } from "vitest";
import {
  AIRTABLE_BASE_ID,
  AIRTABLE_LEADS_TABLE_ID,
  construirCampos,
  crearLeadEnAirtable,
} from "./airtable";
import type { Lead } from "./normalize";

const ahora = new Date("2026-09-08T13:40:00.000Z");

const leadWeb: Lead = {
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

const leadRecurso: Lead = {
  nombre: "Luis Ortiz",
  telefono: null,
  email: "luis@example.com",
  productoId: "",
  seguro: null,
  fuente: "Recurso (lead magnet)",
  notas: "Lead magnet: Quiz huracán (resultado)",
  pagina: "https://unityinsurancepr.com/recursos/quiz-huracan",
  consentimiento: true,
};

describe("construirCampos", () => {
  it("mapea un lead del formulario de consulta a las columnas de Leads", () => {
    expect(construirCampos(leadWeb, ahora)).toEqual({
      Nombre: "Ana Pérez",
      Teléfono: "+17875550100",
      "Correo Electrónico": "ana@example.com",
      "Seguro de Interés": "Hogar",
      Status: "Nuevo",
      "Fecha de Llegada": "2026-09-08T13:40:00.000Z",
      Fuente: "Formulario web",
      "Notas del formulario": "Página: https://unityinsurancepr.com/seguros/hogar",
      Consentimiento: true,
    });
  });

  it("omite teléfono, seguro y consentimiento cuando no aplican", () => {
    const campos = construirCampos({ ...leadRecurso, consentimiento: false }, ahora);
    expect(campos).not.toHaveProperty("Teléfono");
    expect(campos).not.toHaveProperty("Seguro de Interés");
    expect(campos).not.toHaveProperty("Consentimiento");
    expect(campos["Notas del formulario"]).toBe(
      "Página: https://unityinsurancepr.com/recursos/quiz-huracan\nNotas: Lead magnet: Quiz huracán (resultado)",
    );
  });

  it("anota el producto original cuando cae en Otro", () => {
    const campos = construirCampos({ ...leadWeb, productoId: "vida", seguro: "Otro" }, ahora);
    expect(campos["Seguro de Interés"]).toBe("Otro");
    expect(campos["Notas del formulario"]).toContain("Producto del sitio: vida");
  });
});

describe("crearLeadEnAirtable", () => {
  it("hace POST a la tabla Leads con el token y devuelve id y url", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "recABC" }), { status: 200 }));
    const r = await crearLeadEnAirtable(leadWeb, {
      apiKey: "pat_test",
      fetch: fetchMock as unknown as typeof fetch,
      now: () => ahora,
    });
    expect(r).toEqual({
      id: "recABC",
      url: `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_LEADS_TABLE_ID}/recABC`,
    });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_LEADS_TABLE_ID}`);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer pat_test");
    expect(JSON.parse(init.body as string)).toEqual({ fields: construirCampos(leadWeb, ahora) });
  });

  it("lanza AirtableError con el status si la API responde error", async () => {
    const fetchMock = vi.fn(
      async () => new Response('{"error":{"type":"INVALID_MULTIPLE_CHOICE_OPTIONS"}}', { status: 422 }),
    );
    await expect(
      crearLeadEnAirtable(leadWeb, { apiKey: "pat_test", fetch: fetchMock as unknown as typeof fetch, now: () => ahora }),
    ).rejects.toMatchObject({ name: "AirtableError", status: 422 });
  });
});
