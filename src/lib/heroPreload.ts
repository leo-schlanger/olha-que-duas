/**
 * Home hero photo = the LCP. In this SPA the <img> only exists after ~300 KB
 * of JS, so the build (vite.config.ts, heroPreloadPlugin) writes this inline
 * script into index.html: on "/" it preloads the photo the Hero will show
 * (Natal ladder inside siteConfig.natal's window, the regular photo outside),
 * with the same srcset/sizes as the <source>, so the browser reuses the file.
 * Pure (no asset imports) so vite.config.ts can load it. perf, 21/11/2026.
 */

/** Rendered width of the hero photo box (Hero.tsx uses the same string). */
export const HERO_SIZES =
  "(min-width: 1280px) 560px, (min-width: 1024px) 45vw, (min-width: 640px) 448px, calc(100vw - 2rem)";

export type HeroPreloadInput = {
  /** WebP srcset of the seasonal photo ("url 320w, url 480w, …"). */
  seasonalSrcSet: string;
  /** Season window [start, end) as ISO strings, plus its on/off switch. */
  start: string;
  end: string;
  enabled: boolean;
  /** Regular photo URL (outside the window). */
  regularHref: string;
};

/** Inline <script> body. Only Natal swaps the hero photo (seasonal/index.tsx, HERO_IMAGES). */
export function heroPreloadScript(input: HeroPreloadInput): string {
  const start = Date.parse(input.start);
  const end = Date.parse(input.end);
  const seasonal = input.enabled && Number.isFinite(start) && Number.isFinite(end) && input.seasonalSrcSet !== "";
  return [
    "(function(){",
    'if(location.pathname!=="/")return;',
    'var t=Date.now(),l=document.createElement("link");',
    'l.rel="preload";l.as="image";l.setAttribute("fetchpriority","high");',
    seasonal
      ? `if(t>=${start}&&t<${end}){l.type="image/webp";l.setAttribute("imagesrcset",${JSON.stringify(input.seasonalSrcSet)});l.setAttribute("imagesizes",${JSON.stringify(HERO_SIZES)})}else{l.href=${JSON.stringify(input.regularHref)}}`
      : `l.href=${JSON.stringify(input.regularHref)};`,
    "document.head.appendChild(l)",
    "})()",
  ].join("");
}

/** Bundle file names -> seasonal WebP srcset ("/assets/hero-natal-320-<hash>.webp 320w, …"), widest last. */
export function seasonalSrcSetFromFiles(files: string[], base = "/"): string {
  return files
    .map((file) => ({ file, match: /(?:^|\/)hero-natal-(\d+)-[\w-]+\.webp$/.exec(file) }))
    .filter((entry): entry is { file: string; match: RegExpExecArray } => entry.match !== null)
    .map(({ file, match }) => ({ url: `${base}${file}`, width: Number(match[1]) }))
    .sort((a, b) => a.width - b.width)
    .map(({ url, width }) => `${url} ${width}w`)
    .join(", ");
}

/** Bundle file names -> regular hero photo URL, or null. */
export function regularHrefFromFiles(files: string[], base = "/"): string | null {
  const file = files.find((name) => /(?:^|\/)olha-que-duas-foto-[\w-]+\.jpg$/.test(name));
  return file ? `${base}${file}` : null;
}
