import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("incluye la página de oportunidades para agentes", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://www.unityinsurancepr.com/oportunidades");
  });
});
