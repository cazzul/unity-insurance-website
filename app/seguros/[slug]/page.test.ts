import { describe, expect, it } from "vitest";
import { generateMetadata } from "./page";

const titulo = async (slug: string) =>
  (await generateMetadata({ params: Promise.resolve({ slug }) })).title;

describe("título del navegador de /seguros/[slug]", () => {
  it("Comercial dice 'Seguro Comercial', no 'Seguro de Comercial'", async () => {
    expect(await titulo("comercial")).toBe(
      "Seguro Comercial en Puerto Rico | Unity Insurance Group",
    );
  });

  it("Hogar conserva 'Seguro de Hogar'", async () => {
    expect(await titulo("hogar")).toBe(
      "Seguro de Hogar en Puerto Rico | Unity Insurance Group",
    );
  });
});
