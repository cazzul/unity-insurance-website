// Escritura de leads en la base "Unity Insurance CRM", tabla Leads.
// Usa la REST API de Airtable con fetch nativo (sin SDK).
import type { Lead } from "./normalize";

export const AIRTABLE_BASE_ID = "appsTFfScFOoCwuTo"; // Unity Insurance CRM
export const AIRTABLE_LEADS_TABLE_ID = "tblxELd9tOgKTSAIK"; // tabla Leads

// Nombres exactos de columna. Si alguien renombra una columna en Airtable,
// la API responde 422 y el formulario muestra error: actualizar aquí.
const CAMPOS = {
  nombre: "Nombre",
  telefono: "Teléfono",
  email: "Correo Electrónico",
  seguro: "Seguro de Interés",
  status: "Status",
  fecha: "Fecha de Llegada",
  fuente: "Fuente",
  notasFormulario: "Notas del formulario",
  consentimiento: "Consentimiento",
} as const;

export interface AirtableDeps {
  apiKey: string;
  fetch?: typeof fetch;
  now?: () => Date;
}

export interface AirtableRecord {
  id: string;
  url: string;
}

export class AirtableError extends Error {
  status: number;
  constructor(status: number, body: string) {
    super(`Airtable ${status}: ${body}`);
    this.name = "AirtableError";
    this.status = status;
  }
}

export function construirCampos(lead: Lead, ahora: Date): Record<string, unknown> {
  const notas = [
    `Página: ${lead.pagina}`,
    lead.notas ? `Notas: ${lead.notas}` : "",
    lead.seguro === "Otro" && lead.productoId ? `Producto del sitio: ${lead.productoId}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const campos: Record<string, unknown> = {
    [CAMPOS.nombre]: lead.nombre,
    [CAMPOS.status]: "Nuevo",
    [CAMPOS.fecha]: ahora.toISOString(),
    [CAMPOS.fuente]: lead.fuente,
    [CAMPOS.notasFormulario]: notas,
  };
  if (lead.telefono) campos[CAMPOS.telefono] = lead.telefono;
  if (lead.email) campos[CAMPOS.email] = lead.email;
  if (lead.seguro) campos[CAMPOS.seguro] = lead.seguro;
  // La casilla solo se manda cuando es true: Airtable trata "sin valor" como desmarcada.
  if (lead.consentimiento) campos[CAMPOS.consentimiento] = true;
  return campos;
}

export async function crearLeadEnAirtable(lead: Lead, deps: AirtableDeps): Promise<AirtableRecord> {
  const doFetch = deps.fetch ?? fetch;
  const ahora = (deps.now ?? (() => new Date()))();
  const res = await doFetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_LEADS_TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${deps.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: construirCampos(lead, ahora) }),
  });
  if (!res.ok) throw new AirtableError(res.status, await res.text());
  const data = (await res.json()) as { id: string };
  return {
    id: data.id,
    url: `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_LEADS_TABLE_ID}/${data.id}`,
  };
}
