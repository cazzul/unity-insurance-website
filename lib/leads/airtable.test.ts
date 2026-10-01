import { describe, expect, it, vi } from "vitest";
import { construirCampos, crearContactoEnAirtable } from "./airtable";
import type { Lead } from "./normalize";

const ahora = new Date("2026-09-08T13:40:00.000Z"); // 08/09/2026 9:40 AM en PR
const formulario: Lead = {
  nombre: "Ana Pérez", telefono: "+17875550100", email: "ana@example.com",
  productoId: "hogar", seguro: "Hogar", fuente: "Formulario web", notas: "Quiero revisar mi póliza",
  pagina: "https://unityinsurancepr.com/seguros/hogar", consentimiento: true,
};
const recurso: Lead = {
  nombre: "Luis Ortiz", telefono: null, email: "luis@example.com", productoId: "", seguro: null,
  fuente: "Recurso (lead magnet)", notas: "Lead magnet: Quiz huracán (resultado)",
  pagina: "https://unityinsurancepr.com/recursos/quiz-huracan", consentimiento: false,
};

describe("construirCampos", () => {
  it("arma los campos de Contactos por ID para un lead de formulario", () => {
    expect(construirCampos(formulario, ahora)).toEqual({
      fldufB2e3CQcgJsJR: "Ana Pérez",
      fldvmDLxIzhcN9Bdw: "+17875550100",
      fldqQyhX2M8cZK5ZJ: "ana@example.com",
      fldoUaEN5AesdFj49: "Prospecto",
      fldqcqzf8LIKC7mM1: "Página Web",
      fldAygh93t8c6sZH3: "Prospecto Nuevo",
      fldLhd7dArz3gJjHB: [
        "Seguro de interés: Hogar",
        "Fuente: Formulario web",
        "Página: https://unityinsurancepr.com/seguros/hogar",
        "Llegó: 08/09/2026 9:40 AM",
        "Consentimiento: sí",
        "Notas del visitante: Quiero revisar mi póliza",
      ].join("\n"),
    });
  });

  it("omite teléfono, seguro y consentimiento en un lead de recurso", () => {
    expect(construirCampos(recurso, ahora)).toEqual({
      fldufB2e3CQcgJsJR: "Luis Ortiz",
      fldqQyhX2M8cZK5ZJ: "luis@example.com",
      fldoUaEN5AesdFj49: "Prospecto",
      fldqcqzf8LIKC7mM1: "Página Web",
      fldAygh93t8c6sZH3: "Prospecto Nuevo",
      fldLhd7dArz3gJjHB: [
        "Fuente: Recurso (lead magnet)",
        "Página: https://unityinsurancepr.com/recursos/quiz-huracan",
        "Llegó: 08/09/2026 9:40 AM",
        "Notas del visitante: Lead magnet: Quiz huracán (resultado)",
      ].join("\n"),
    });
  });

  it("omite el correo vacío y las notas del visitante si no hay", () => {
    const campos = construirCampos({ ...formulario, email: "", notas: "" }, ahora);
    expect(campos).not.toHaveProperty("fldqQyhX2M8cZK5ZJ");
    expect(campos["fldLhd7dArz3gJjHB"]).not.toContain("Notas del visitante");
  });

  it("escribe tal cual un producto desconocido (Otro)", () => {
    const campos = construirCampos({ ...formulario, productoId: "vida", seguro: "Otro" }, ahora);
    expect(campos["fldLhd7dArz3gJjHB"].split("\n")[0]).toBe("Seguro de interés: Otro");
  });

  it("conserva tildes, ñ, apóstrofos y emojis del nombre", () => {
    const campos = construirCampos({ ...formulario, nombre: "Ñandú O'Neil 😀" }, ahora);
    expect(campos["fldufB2e3CQcgJsJR"]).toBe("Ñandú O'Neil 😀");
  });
});

describe("crearContactoEnAirtable", () => {
  const llamar = (respuesta: () => Response) => {
    const fetchMock = vi.fn(async () => respuesta());
    const promesa = crearContactoEnAirtable(formulario, {
      apiKey: "pat_test", fetch: fetchMock as unknown as typeof fetch, now: () => ahora,
    });
    return { fetchMock, promesa };
  };

  it("crea el registro y devuelve su id y su URL", async () => {
    const { fetchMock, promesa } = llamar(() => new Response(JSON.stringify({ id: "recABC" }), { status: 200 }));
    await expect(promesa).resolves.toEqual({
      id: "recABC",
      url: "https://airtable.com/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY/recABC",
    });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.airtable.com/v0/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ Authorization: "Bearer pat_test", "Content-Type": "application/json" });
    expect(JSON.parse(init.body as string).fields["fldufB2e3CQcgJsJR"]).toBe("Ana Pérez");
  });

  it("limita la petición a 6 s con una señal de aborto", async () => {
    const spy = vi.spyOn(AbortSignal, "timeout");
    const { fetchMock, promesa } = llamar(() => new Response(JSON.stringify({ id: "recABC" }), { status: 200 }));
    await promesa;
    expect(spy).toHaveBeenCalledWith(6000);
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.signal).toBeInstanceOf(AbortSignal);
    spy.mockRestore();
  });

  it("lanza AirtableError con el estado cuando la API rechaza", async () => {
    const { promesa } = llamar(() => new Response('{"error":{"type":"INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND"}}', { status: 403 }));
    await expect(promesa).rejects.toMatchObject({ name: "AirtableError", status: 403 });
  });

  it("propaga el error de red", async () => {
    const { promesa } = llamar(() => { throw new TypeError("fetch failed"); });
    await expect(promesa).rejects.toThrow("fetch failed");
  });
});
