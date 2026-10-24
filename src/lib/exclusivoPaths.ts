/** Endereços da secção Exclusivo. O primeiro segmento é sempre o programa. */

/** Where a post found without its program ends up (the old Vinagre posts live here since 2026-10-24). */
export const LEGACY_PROGRAM_SLUG = "noticias-olha-que-duas";

export function exclusivoProgramPath(programSlug: string): string {
  return `/exclusivo/${programSlug}`;
}

export function exclusivoPostPath(programSlug: string, postSlug: string): string {
  return `/exclusivo/${programSlug}/${postSlug}`;
}
