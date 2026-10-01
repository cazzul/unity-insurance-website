import { describe, expect, it } from "vitest";
import { products } from "./content";
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
