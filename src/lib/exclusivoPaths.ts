/** Endereços da secção Exclusivo. O primeiro segmento é sempre o programa. */

export const VINAGRE_PROGRAM_SLUG = "olha-que-duas-e-eu";

export function exclusivoProgramPath(programSlug: string): string {
  return `/exclusivo/${programSlug}`;
}

export function exclusivoPostPath(programSlug: string, postSlug: string): string {
  return `/exclusivo/${programSlug}/${postSlug}`;
}
