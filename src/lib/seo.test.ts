import { describe, expect, it } from "vitest";
import { articleHeadline, documentTitle, metaDescription } from "./seo";

describe("documentTitle", () => {
  it("adds the site name when it fits in 60", () => {
    expect(documentTitle("Rute Cardoso: corrida e boxe no luto de Diogo Jota")).toBe(
      "Rute Cardoso: corrida e boxe no luto de Diogo Jota",
    );
    expect(documentTitle("Curtas Biografias")).toBe("Curtas Biografias | Olha que Duas");
  });

  it("never goes past 60 and cuts at a natural break", () => {
    const long =
      'Explosivo! A vida secreta da "picarota" Ana Gomes: a "prisão" da SIC, o "chopinho" em Bruxelas e os dias no Pico';
    const out = documentTitle(long);
    expect(out.length).toBeLessThanOrEqual(60);
    expect(out).not.toMatch(/\.\.\.|…$/);
  });

  it("does not end on a preposition or an open quote", () => {
    const a = documentTitle("UEFA suspende provisoriamente jogador do Benfica devido a insultos racistas no jogo");
    expect(a).not.toMatch(/\s(a|de|em|com|e)$/);
    const b = documentTitle("Netanyahu afirma que conflito com Irão não será 'guerra sem fim' e promete resposta");
    expect(b.split("'").length % 2).toBe(1);
    expect(b.length).toBeLessThanOrEqual(60);
  });

  it("falls back to the site name when empty", () => {
    expect(documentTitle("  ")).toBe("Olha que Duas");
  });
});

describe("metaDescription", () => {
  it("keeps short text whole", () => {
    expect(metaDescription("Uma frase curta.")).toBe("Uma frase curta.");
  });

  it("stays within 155 characters", () => {
    const text = "Palavra ".repeat(40).trim();
    const out = metaDescription(text);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("articleHeadline", () => {
  it("uses the short title only when the headline is over 110", () => {
    expect(articleHeadline("Curto", "SEO")).toBe("Curto");
    expect(articleHeadline("x ".repeat(80), "Título SEO")).toBe("Título SEO");
  });
});
