// Validación y normalización del cuerpo que mandan ConsultForm y
// LeadCaptureModal. Sin dependencias de Next para probarlo en Node.

export type Fuente = "Formulario web" | "Recurso (lead magnet)";

export interface Lead {
  nombre: string;
  /** E.164, por ejemplo +17875551234. null si no llegó o no es válido. */
  telefono: string | null;
  /** En minúsculas. "" si no llegó. */
  email: string;
  /** id del producto en el sitio (auto, hogar, comercial, cancer, viajero, escolar) o "". */
  productoId: string;
  /** Opción de "Seguro de Interés" en Airtable. null si no hay producto. */
  seguro: string | null;
  fuente: Fuente;
  notas: string;
  /** URL desde la que se envió (cabecera referer). */
  pagina: string;
  consentimiento: boolean;
}

export type ParseResult =
  | { ok: true; lead: Lead }
  | { ok: false; error: string };

// Opciones de "Seguro de Interés" en la tabla Leads de Airtable.
// Si cambian los productos del sitio (lib/content.ts) o las opciones en
// Airtable, hay que actualizar este mapa.
const SEGURO_POR_PRODUCTO: Record<string, string> = {
  auto: "Auto",
  hogar: "Hogar",
  comercial: "Comercial",
  cancer: "Cáncer",
  viajero: "Viajero",
  escolar: "Escolar",
};

export function texto(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// 7 dígitos: área 787. 10 dígitos: código de país 1. Salida E.164 o null.
export function normalizarTelefono(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  let d = v.replace(/\D/g, "");
  if (d.length === 7) d = "787" + d;
  if (d.length === 10) d = "1" + d;
  return d.length === 11 && d.startsWith("1") ? `+${d}` : null;
}

export function mapSeguro(productoId: string): string | null {
  if (!productoId) return null;
  return SEGURO_POR_PRODUCTO[productoId] ?? "Otro";
}

export function parseLeadBody(body: unknown, pagina: string): ParseResult {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const nombre = texto(b.nombre);
  const email = texto(b.email).toLowerCase();
  const telefonoCrudo = texto(b.telefono);
  const telefono = normalizarTelefono(telefonoCrudo);
  const productoId = texto(b.producto);
  const notas = texto(b.notas);

  if (!nombre) return { ok: false, error: "El nombre es requerido" };
  if (!telefono && !email) {
    return {
      ok: false,
      error: telefonoCrudo
        ? "Teléfono no válido: usa un número de Puerto Rico o Estados Unidos"
        : "Teléfono o correo son requeridos",
    };
  }

  // LeadCaptureModal manda notas y ningún producto; ConsultForm manda producto.
  const esLeadMagnet = !productoId && notas.length > 0;

  return {
    ok: true,
    lead: {
      nombre,
      telefono,
      email,
      productoId,
      seguro: mapSeguro(productoId),
      fuente: esLeadMagnet ? "Recurso (lead magnet)" : "Formulario web",
      notas,
      pagina,
      consentimiento: b.consentimiento === true,
    },
  };
}

// "08/09/2026 9:40 AM" en hora de Puerto Rico. Se arma a partir de las
// partes para que no dependa del locale del servidor.
export function formatFechaPR(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Puerto_Rico",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
}
