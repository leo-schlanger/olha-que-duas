/**
 * Regra dos Especiais: um programa só aparece (lista, abas, página, sitemap)
 * quando tem pelo menos uma peça publicada com a hora já passada.
 */
export function programsWithLivePosts<T extends { id: string }>(
  programs: T[],
  livePosts: { program_id?: unknown }[],
): T[] {
  const live = new Set(livePosts.map((post) => post.program_id).filter((id): id is string => typeof id === "string"));
  return programs.filter((program) => live.has(program.id));
}
