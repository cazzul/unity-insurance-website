import { describe, expect, it } from "vitest";
import { footerLinks, products, seguroNombre, talentContent } from "./content";
import { mapSeguro } from "./leads/normalize";
import { productDetails } from "./product-details";

// Alta de un producto: además de `products` necesita su página (productDetails)
// y su etiqueta en el aviso de WhatsApp (mapSeguro). Si falta una, la página
// responde 404 o el lead llega etiquetado como "Otro".
const ids = products.map((p) => p.id);

describe("catálogo de productos", () => {
  it.each(ids)("%s tiene página de detalle", (id) => {
    expect(productDetails[id]?.slug).toBe(id);
  });

  it.each(ids)("%s tiene etiqueta propia en el aviso de WhatsApp", (id) => {
    expect(mapSeguro(id)).not.toBe("Otro");
  });
});

// Nombre del seguro tal como se ve en su página (rótulo y título del navegador).
describe("nombre del seguro en su página", () => {
  const nombre = (id: string) => seguroNombre(products.find((p) => p.id === id)!);

  it("Comercial es 'Seguro Comercial', no 'Seguro de Comercial'", () => {
    expect(nombre("comercial")).toBe("Seguro Comercial");
  });

  it("los demás siguen como 'Seguro de {título}'", () => {
    expect(nombre("hogar")).toBe("Seguro de Hogar");
  });
});

// Reclutamiento de agentes (/oportunidades y cierre del home). Las frases son
// las de los rótulos de las oficinas de Unity más "Te ayudamos en el proceso"
// (confirmado por el dueño); no se agregan condiciones que él no haya dado.
describe("reclutamiento de agentes", () => {
  it("usa las frases de las oficinas de Unity", () => {
    expect(talentContent.title).toBe("Desarrollamos profesionales");
    expect(talentContent.lead).toBe(
      "Ofrecemos capacitación, apoyo, herramientas y oportunidades para desarrollar tu negocio.",
    );
    expect(talentContent.welcome).toBe(
      "Agentes nuevos y con experiencia son bienvenidos. Te ayudamos en el proceso.",
    );
  });

  it("muestra lo que se ofrece en el orden de la frase", () => {
    expect(talentContent.pillars.map((p) => p.title)).toEqual([
      "Capacitación",
      "Apoyo",
      "Herramientas",
      "Oportunidades",
    ]);
  });

  it("el footer enlaza a la página de oportunidades", () => {
    expect(footerLinks.recursos).toContainEqual({
      label: "Oportunidades",
      href: "/oportunidades",
    });
  });
});
