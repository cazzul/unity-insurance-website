// app/api/leads/route.ts
// Flujo de un lead del sitio:
//   formulario → Airtable (tabla Leads, fuente de verdad) → Make (webhook) → WhatsApp (Green API, grupo "Leads Unity").
// Si Airtable falla, el visitante ve el error y las alternativas de contacto (502).
// Si Make falla, el lead ya está guardado: se registra el error y se responde 200.
// Diseño: docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md
import { AirtableError, crearLeadEnAirtable, type AirtableRecord } from "@/lib/leads/airtable";
import { construirPayloadMake, notificarMake } from "@/lib/leads/make";
import { parseLeadBody } from "@/lib/leads/normalize";

export async function POST(req: Request) {
  // Se leen en cada petición (no al cargar el módulo) para fallar con claridad
  // si faltan y para poder probarlas.
  const apiKey = process.env.AIRTABLE_API_KEY;
  const webhookUrl = process.env.MAKE_LEADS_WEBHOOK_URL;
  if (!apiKey || !webhookUrl) {
    console.error("Faltan variables de entorno: AIRTABLE_API_KEY y/o MAKE_LEADS_WEBHOOK_URL");
    return Response.json({ error: "Configuración incompleta del servidor" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const pagina = req.headers.get("referer") ?? "https://unityinsurancepr.com";
  const parsed = parseLeadBody(body, pagina);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const ahora = new Date();
  let registro: AirtableRecord;
  try {
    registro = await crearLeadEnAirtable(parsed.lead, { apiKey, now: () => ahora });
  } catch (err) {
    console.error("Airtable error:", err instanceof AirtableError ? err.message : err);
    return Response.json({ error: "No se pudo guardar la consulta" }, { status: 502 });
  }

  const notificado = await notificarMake(construirPayloadMake(parsed.lead, registro.url, ahora), {
    webhookUrl,
  });

  return Response.json({ success: true, id: registro.id, notificado });
}
