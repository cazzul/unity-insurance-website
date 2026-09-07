import { NextRequest, NextResponse } from "next/server";

// Envío de leads a Make (webhook) → WhatsApp vía CallMeBot.
// El webhook de Make también puede reenviar a HubSpot cuando esté configurado.
const MAKE_WEBHOOK_URL =
  "https://hook.us2.make.com/iqdy7iiuizvqz631orbapj9ghpszwspx";

// Etiqueta legible del producto para el mensaje de WhatsApp
const PRODUCTO_LABEL: Record<string, string> = {
  auto: "Auto",
  hogar: "Hogar",
  comercial: "Comercial",
  cancer: "Cáncer",
  viajero: "Viajero",
  escolar: "Escolar",
};

// Mismas reglas que migration/clean_excel.py: 7 dígitos -> área 787; salida E.164.
function normalizarTelefono(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  let d = v.replace(/\D/g, "");
  if (d.length === 7) d = "787" + d;
  if (d.length === 10) d = "1" + d;
  return d.length === 11 && d.startsWith("1") ? `+${d}` : null;
}

function texto(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nombre = texto(body.nombre);
    const email = texto(body.email).toLowerCase();
    const telefono = normalizarTelefono(body.telefono);
    const producto = texto(body.producto);
    const notas = texto(body.notas);

    // ConsultForm manda nombre + teléfono (+ email opcional); LeadCaptureModal
    // manda nombre + email. Basta nombre + (teléfono o correo).
    if (!nombre || (!telefono && !email)) {
      return NextResponse.json(
        { error: "Nombre y (teléfono o correo) son requeridos" },
        { status: 400 }
      );
    }

    const esLeadMagnet = !producto && notas.length > 0;
    const seguroLabel = PRODUCTO_LABEL[producto] ?? producto ?? "No especificado";

    // Payload que recibe Make → WhatsApp (CallMeBot) + Google Sheets (futuro)
    const makePayload = {
      nombre,
      email: email || "",
      telefono: telefono || "",
      seguro: seguroLabel,
      fuente: esLeadMagnet ? "lead_magnet" : "pagina_web",
      notas: notas || "",
      pagina: req.headers.get("referer") ?? "https://unityinsurancepr.com",
      fecha: new Date().toISOString(),
    };

    const res = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(makePayload),
    });

    if (!res.ok) {
      console.error("Make webhook error:", res.status);
      return NextResponse.json({ error: "Webhook error" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
