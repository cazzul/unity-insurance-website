// app/api/leads/route.ts
// Flujo de un lead del sitio:
//   formulario → Airtable (tabla Contactos) → Make (webhook) → WhatsApp (Green API, grupo de leads).
// Make se avisa siempre, aunque Airtable haya fallado (con el aviso ⚠️ en `crm`). Éxito si al menos
// una vía funcionó; si fallan las dos, 502 para que el visitante vea las alternativas de contacto.
// Diseño: docs/superpowers/specs/2026-10-01-leads-airtable-contactos-design.md
import { AirtableError, crearContactoEnAirtable } from "@/lib/leads/airtable";
import { construirPayloadMake, notificarMake } from "@/lib/leads/make";
import { parseLeadBody } from "@/lib/leads/normalize";

const AVISO_CRM = "⚠️ NO se guardó en el CRM (Airtable). Anótalo a mano.";

// Tope de la función en Vercel: cubre Airtable (6 s) más Make (4 s) con margen.
export const maxDuration = 15;

export async function POST(req: Request) {
  // Se leen en cada petición (no al cargar el módulo) para fallar con claridad
  // si faltan y para poder probarlas.
  const apiKey = process.env.AIRTABLE_API_KEY;
  const webhookUrl = process.env.MAKE_LEADS_WEBHOOK_URL;
  if (!apiKey && !webhookUrl) {
    console.error("Faltan variables de entorno: AIRTABLE_API_KEY y MAKE_LEADS_WEBHOOK_URL");
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

  let urlRegistro: string | null = null;
  if (apiKey) {
    try {
      urlRegistro = (await crearContactoEnAirtable(parsed.lead, { apiKey, now: () => ahora })).url;
    } catch (err) {
      console.error("Airtable error:", err instanceof AirtableError ? err.message : err);
    }
  } else {
    console.error("Falta AIRTABLE_API_KEY: el lead no se guardó en Airtable");
  }

  let notificado = false;
  if (webhookUrl) {
    notificado = await notificarMake(
      construirPayloadMake(parsed.lead, urlRegistro ?? AVISO_CRM, ahora),
      { webhookUrl },
    );
  } else {
    console.error("Falta MAKE_LEADS_WEBHOOK_URL: no se avisó a WhatsApp");
  }

  const guardado = urlRegistro !== null;
  if (!guardado && !notificado) {
    return Response.json({ error: "No se pudo enviar la consulta" }, { status: 502 });
  }
  return Response.json({ success: true, guardado, notificado });
}
