// Escritura de leads en la tabla Contactos de la base "Unity Base De Datos".
// Usa la REST API de Airtable con fetch nativo (sin SDK).
import { formatFechaPR, type Lead } from "./normalize";

export const AIRTABLE_BASE_ID = "apppVYXN8TeViNaNp"; // Unity Base De Datos
export const AIRTABLE_CONTACTOS_TABLE_ID = "tblqpMjs8KSRkT6uY"; // tabla Contactos

// IDs de campo (el nombre actual va al lado): sobreviven a que se renombren columnas.
// Si se recrea la base, hay que actualizar estos IDs y los dos de arriba.
const CAMPOS = {
  nombre: "fldufB2e3CQcgJsJR", // Nombre Completo
  telefono: "fldvmDLxIzhcN9Bdw", // Teléfono
  email: "fldqQyhX2M8cZK5ZJ", // Correo Electrónico
  tipoContacto: "fldoUaEN5AesdFj49", // Tipo de Contacto
  origen: "fldqcqzf8LIKC7mM1", // Origen del Lead
  fase: "fldAygh93t8c6sZH3", // Fase del Lead (Pipeline)
  notas: "fldLhd7dArz3gJjHB", // Notas
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

// Las opciones de selección se escriben por nombre exacto: si se renombran en Airtable, responde 422.
export function construirCampos(lead: Lead, ahora: Date): Record<string, string> {
  const notas = [
    lead.seguro ? `Seguro de interés: ${lead.seguro}` : "",
    `Fuente: ${lead.fuente}`,
    `Página: ${lead.pagina}`,
    `Llegó: ${formatFechaPR(ahora)}`,
    lead.consentimiento ? "Consentimiento: sí" : "",
    lead.notas ? `Notas del visitante: ${lead.notas}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const campos: Record<string, string> = {
    [CAMPOS.nombre]: lead.nombre,
    [CAMPOS.tipoContacto]: "Prospecto",
    [CAMPOS.origen]: "Página Web",
    [CAMPOS.fase]: "Prospecto Nuevo",
    [CAMPOS.notas]: notas,
  };
  if (lead.telefono) campos[CAMPOS.telefono] = lead.telefono;
  if (lead.email) campos[CAMPOS.email] = lead.email;
  return campos;
}

export async function crearContactoEnAirtable(lead: Lead, deps: AirtableDeps): Promise<AirtableRecord> {
  const doFetch = deps.fetch ?? fetch;
  const ahora = (deps.now ?? (() => new Date()))();
  const res = await doFetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_CONTACTOS_TABLE_ID}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${deps.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: construirCampos(lead, ahora) }),
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new AirtableError(res.status, await res.text());
  const data = (await res.json()) as { id: string };
  return {
    id: data.id,
    url: `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_CONTACTOS_TABLE_ID}/${data.id}`,
  };
}
