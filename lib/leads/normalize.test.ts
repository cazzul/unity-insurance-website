import { describe, expect, it } from "vitest";
import {
  formatFechaPR,
  mapSeguro,
  normalizarTelefono,
  parseLeadBody,
} from "./normalize";

const PAGINA = "https://unityinsurancepr.com/seguros/hogar";

describe("normalizarTelefono", () => {
  it.each([
    ["787-555-1234", "+17875551234"],
    ["5551234", "+17875551234"],
    ["(939) 555-1234", "+19395551234"],
    ["+1 787 555 1234", "+17875551234"],
    ["1-787-555-1234", "+17875551234"],
  ])("convierte %s en %s", (entrada, esperado) => {
    expect(normalizarTelefono(entrada)).toBe(esperado);
  });

  it.each([["12345"], ["+34 600 000 000"], [""], ["   "]])(
    "rechaza %j",
    (entrada) => {
      expect(normalizarTelefono(entrada)).toBeNull();
    },
  );

  it("rechaza valores que no son texto", () => {
    expect(normalizarTelefono(undefined)).toBeNull();
    expect(normalizarTelefono(7875551234)).toBeNull();
  });
});

describe("mapSeguro", () => {
  it.each([
    ["auto", "Auto"],
    ["hogar", "Hogar"],
    ["viajero", "Viajero"],
    ["cancer", "Cáncer"],
    ["comercial", "Comercial"],
    ["escolar", "Escolar"],
  ])("mapea %s a la opción %s de Airtable", (id, opcion) => {
    expect(mapSeguro(id)).toBe(opcion);
  });

  it("devuelve null sin producto y Otro con un id desconocido", () => {
    expect(mapSeguro("")).toBeNull();
    expect(mapSeguro("vida")).toBe("Otro");
  });
});

describe("formatFechaPR", () => {
  it("formatea en hora de Puerto Rico (UTC-4, sin horario de verano)", () => {
    expect(formatFechaPR(new Date("2026-09-08T13:40:00.000Z"))).toBe("08/09/2026 9:40 AM");
    expect(formatFechaPR(new Date("2026-01-15T03:05:00.000Z"))).toBe("14/01/2026 11:05 PM");
  });
});

describe("parseLeadBody", () => {
  it("acepta el payload de ConsultForm", () => {
    const r = parseLeadBody(
      { nombre: " Ana Pérez ", telefono: "787-555-0100", email: "", producto: "hogar", consentimiento: true },
      PAGINA,
    );
    expect(r).toEqual({
      ok: true,
      lead: {
        nombre: "Ana Pérez",
        telefono: "+17875550100",
        email: "",
        productoId: "hogar",
        seguro: "Hogar",
        fuente: "Formulario web",
        notas: "",
        pagina: PAGINA,
        consentimiento: true,
      },
    });
  });

  it("acepta el payload de LeadCaptureModal (sin teléfono, con notas)", () => {
    const r = parseLeadBody(
      { nombre: "Luis Ortiz", email: "Luis@Example.com", notas: "Lead magnet: Quiz huracán (resultado)", consentimiento: true },
      "https://unityinsurancepr.com/recursos/quiz-huracan",
    );
    expect(r).toEqual({
      ok: true,
      lead: {
        nombre: "Luis Ortiz",
        telefono: null,
        email: "luis@example.com",
        productoId: "",
        seguro: null,
        fuente: "Recurso (lead magnet)",
        notas: "Lead magnet: Quiz huracán (resultado)",
        pagina: "https://unityinsurancepr.com/recursos/quiz-huracan",
        consentimiento: true,
      },
    });
  });

  it("rechaza sin nombre", () => {
    expect(parseLeadBody({ telefono: "787-555-0100" }, PAGINA)).toEqual({
      ok: false,
      error: "El nombre es requerido",
    });
  });

  it("rechaza sin teléfono ni correo", () => {
    expect(parseLeadBody({ nombre: "Ana" }, PAGINA)).toEqual({
      ok: false,
      error: "Teléfono o correo son requeridos",
    });
  });

  it("explica cuando el teléfono no es válido y no hay correo", () => {
    expect(parseLeadBody({ nombre: "Ana", telefono: "123" }, PAGINA)).toEqual({
      ok: false,
      error: "Teléfono no válido: usa un número de Puerto Rico o Estados Unidos",
    });
  });

  it("rechaza cuerpos que no son objetos", () => {
    expect(parseLeadBody(null, PAGINA).ok).toBe(false);
    expect(parseLeadBody("texto", PAGINA).ok).toBe(false);
  });

  it("consentimiento solo es true si llega exactamente true", () => {
    const r = parseLeadBody({ nombre: "Ana", telefono: "787-555-0100", consentimiento: "sí" }, PAGINA);
    expect(r.ok && r.lead.consentimiento).toBe(false);
  });
});
