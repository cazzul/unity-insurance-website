// WhatsApp del negocio: el mismo para clientes y para candidatos a agente.
const WHATSAPP_NUMERO = "17879225558";

// Enlace directo a WhatsApp (wa.me) con el mensaje ya escrito.
export function enlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

export const CONTACT = {
  phone: "787-922-5558",
  phoneHref: "tel:7879225558",
  email: "service@unityinsurancepr.com",
  emailHref: "mailto:service@unityinsurancepr.com",
  whatsappHref: enlaceWhatsApp("Hola, quiero agendar una consulta y orientación"),
  // Reclutamiento de agentes (página /oportunidades y cierre del home).
  whatsappTalentHref: enlaceWhatsApp(
    "Hola, me interesa saber más información sobre las oportunidades de trabajo y crecimiento dentro de Unity.",
  ),
  instagram: "https://instagram.com/unityigpr",
  instagramHandle: "@unityigpr",
  facebook: "https://facebook.com/unityigpr",
};

export const BRAND = {
  name: "Unity Insurance Group",
  tagline: "Unidos para protegerte",
  yearsExperience: "18",
};

// Datos legales y de confianza. Cada campo vacío se oculta solo en el sitio.
// Se completan cuando el dueño los confirme (ver PENDIENTES.md).
export const LEGAL = {
  // Confirmado por el dueño el 2026-10-01, tal como lo escribió.
  nombreLegal: "UNITY INS GROUP LLC",
  numeroLicencia: "",
  jurisdiccion: "",
  // Provisional (2026-10-01): el dueño dio calle y pueblo, pero no tiene a mano
  // el número ni el código postal. Completar cuando los confirme.
  direccion: "Calle Torrado, Jayuya, Puerto Rico",
  // Confirmado por el dueño el 2026-08-29.
  horario: "Lunes a viernes, 8:00 a.m. a 5:00 p.m.",
  disclaimer:
    "Toda cotización está sujeta a elegibilidad, términos, condiciones, exclusiones y aprobación de la aseguradora.",
};
