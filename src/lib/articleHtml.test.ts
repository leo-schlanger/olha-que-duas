import { describe, expect, it } from "vitest";
import { articleShareImage, readingMinutes, sanitizeArticleHtml } from "./articleHtml";

describe("sanitizeArticleHtml", () => {
  it("mantém parágrafos e remove script", () => {
    const clean = sanitizeArticleHtml(
      '<p>Olá <strong>Zé</strong></p><script>alert(1)</script><a href="https://olhaqueduas.com">site</a><a href="javascript:alert(1)">mau</a>',
    );
    expect(clean).toContain("<p>Olá <strong>Zé</strong></p>");
    expect(clean).not.toContain("script");
    expect(clean).toContain('href="https://olhaqueduas.com"');
    expect(clean).not.toContain("javascript:");
  });

  it("conta o tempo de leitura", () => {
    expect(readingMinutes(`<p>${"palavra ".repeat(400)}</p>`)).toBe(2);
  });

  it("usa a capa larga da partilha quando a foto é a da crónica", () => {
    expect(articleShareImage({ cover_url: "/exclusivo/abel-dias-betty.jpg" })).toBe(
      "https://www.olhaqueduas.com/exclusivo/abel-dias-betty-og.jpg",
    );
    expect(
      articleShareImage({
        cover_url: "https://cdn.example/foto.jpg",
        og_image_url: "https://cdn.example/partilha.jpg",
      }),
    ).toBe("https://cdn.example/partilha.jpg");
  });
});
