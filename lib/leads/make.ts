// Aviso al escenario de Make "Unity Seguros — Leads a WhatsApp" (webhook),
// que reenvía el lead al grupo de WhatsApp "Leads Unity" vía Green API.
// Es "mejor esfuerzo": cuando se llama aquí, el lead ya está en Airtable.
import { formatFechaPR, type Lead } from "./normalize";

export interface MakePayload {
  nombre: string;
  telefono: string;
  email: string;
  seguro: string;
  fuente: string;
  notas: string;
  pagina: string;
  /** ISO UTC */
  fecha: string;
  /** "08/09/2026 9:40 AM", hora de Puerto Rico */
  fecha_local: string;
  airtable_url: string;
}

export function construirPayloadMake(lead: Lead, airtableUrl: string, ahora: Date): MakePayload {
  return {
    nombre: lead.nombre,
    telefono: lead.telefono ?? "No indicado",
    email: lead.email || "No indicado",
    seguro: lead.seguro ?? "No especificado",
    fuente: lead.fuente,
    notas: lead.notas || "Sin notas",
    pagina: lead.pagina,
    fecha: ahora.toISOString(),
    fecha_local: formatFechaPR(ahora),
    airtable_url: airtableUrl,
  };
}

export async function notificarMake(
  payload: MakePayload,
  deps: { webhookUrl: string; fetch?: typeof fetch },
): Promise<boolean> {
  const doFetch = deps.fetch ?? fetch;
  try {
    const res = await doFetch(deps.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error("Make webhook error:", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("Make webhook error:", err);
    return false;
  }
}
