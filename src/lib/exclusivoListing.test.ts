import { describe, expect, it } from "vitest";
import { programsWithLivePosts } from "./exclusivoListing";

describe("programsWithLivePosts", () => {
  const programs = [{ id: "a", slug: "noticias" }, { id: "b", slug: "lendas-de-portugal" }, { id: "c", slug: "mente-aberta" }];

  it("só deixa os programas com pelo menos uma peça viva, pela ordem original", () => {
    expect(programsWithLivePosts(programs, [{ program_id: "c" }, { program_id: "a" }, { program_id: "a" }]).map((p) => p.slug)).toEqual([
      "noticias",
      "mente-aberta",
    ]);
  });

  it("sem peças vivas não lista nada; ignora program_id inválido", () => {
    expect(programsWithLivePosts(programs, [])).toEqual([]);
    expect(programsWithLivePosts(programs, [{ program_id: null }, {}])).toEqual([]);
  });
});
