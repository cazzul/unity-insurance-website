import { describe, expect, it } from "vitest";
import { CONTACT, enlaceWhatsApp } from "./constants";

describe("enlaceWhatsApp", () => {
  it("arma un enlace wa.me al número del sitio con el mensaje codificado", () => {
    const url = new URL(enlaceWhatsApp("Hola, ¿qué tal? 100% listo"));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/17879225558");
    expect(url.searchParams.get("text")).toBe("Hola, ¿qué tal? 100% listo");
  });
});

describe("enlaces de WhatsApp del sitio", () => {
  // Caracterización: el botón de clientes (Footer, MobileActionBar, Contacto)
  // no debe cambiar al compartir el armado del enlace con el de reclutamiento.
  it("el de clientes sigue igual", () => {
    expect(CONTACT.whatsappHref).toBe(
      "https://wa.me/17879225558?text=Hola%2C%20quiero%20agendar%20una%20consulta%20y%20orientaci%C3%B3n",
    );
  });

  it("el de reclutamiento escribe al mismo número con el mensaje de oportunidades de trabajo", () => {
    const url = new URL(CONTACT.whatsappTalentHref);
    expect(url.origin + url.pathname).toBe("https://wa.me/17879225558");
    expect(url.searchParams.get("text")).toBe(
      "Hola, me interesa saber más información sobre las oportunidades de trabajo y crecimiento dentro de Unity.",
    );
  });
});
