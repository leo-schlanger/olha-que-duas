import { describe, expect, it } from "vitest";
import { exclusivoPostPath, exclusivoProgramPath } from "./exclusivoPaths";

describe("endereços dos Programas", () => {
  it("põe o programa antes da postagem", () => {
    expect(exclusivoProgramPath("curtas-biografias")).toBe("/programas/curtas-biografias");
    expect(exclusivoPostPath("curtas-biografias", "marluce-revoredo-silva")).toBe(
      "/programas/curtas-biografias/marluce-revoredo-silva",
    );
  });
});
