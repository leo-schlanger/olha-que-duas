import { describe, expect, it } from "vitest";
import { exclusivoPostPath, exclusivoProgramPath } from "./exclusivoPaths";

describe("endereços do Exclusivo", () => {
  it("põe o programa antes da postagem", () => {
    expect(exclusivoProgramPath("curtas-biografias")).toBe("/exclusivo/curtas-biografias");
    expect(exclusivoPostPath("curtas-biografias", "marluce-revoredo-silva")).toBe(
      "/exclusivo/curtas-biografias/marluce-revoredo-silva",
    );
  });
});
