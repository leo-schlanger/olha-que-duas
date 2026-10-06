import { describe, expect, it } from "vitest";
import { readingMinutes, sanitizeArticleHtml } from "./articleHtml";

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
});
