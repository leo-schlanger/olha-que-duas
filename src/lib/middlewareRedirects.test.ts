import { afterEach, describe, expect, it, vi } from "vitest";
import middleware from "../../middleware";
import vercel from "../../vercel.json";

// 20/11/2026: «Especiais» (/exclusivo) became «Programas» (/programas); Loja and Viagens left.
afterEach(() => vi.unstubAllGlobals());

async function hit(path: string, ua = "Mozilla/5.0") {
  vi.stubGlobal("fetch", vi.fn(async () => new Response("[]")));
  return middleware(new Request(`https://www.olhaqueduas.com${path}`, { headers: { "user-agent": ua } }));
}

describe("middleware: /exclusivo -> /programas", () => {
  it.each([
    ["/exclusivo", "/programas"],
    ["/exclusivo/", "/programas"],
    ["/exclusivo/mente-aberta", "/programas/mente-aberta"],
    ["/Exclusivo/Mente-Aberta/", "/programas/mente-aberta"],
    ["/exclusivo/lendas-de-portugal/bruxas-de-tras-os-montes", "/programas/lendas-de-portugal/bruxas-de-tras-os-montes"],
    ["/exclusivo/olha-que-duas-e-eu/x", "/programas/noticias-olha-que-duas/x"],
  ])("%s -> 301 %s", async (from, to) => {
    const res = await hit(from);
    expect(res?.status).toBe(301);
    expect(res?.headers.get("Location")).toBe(`https://www.olhaqueduas.com${to}`);
  });

  it("keeps the files under /exclusivo/ (covers used by the pieces)", async () => {
    expect(await hit("/exclusivo/abel-dias-betty-og.jpg")).toBeUndefined();
  });

  it("lets people through on /programas (SPA)", async () => {
    expect(await hit("/programas/mente-aberta")).toBeUndefined();
  });
});

describe("vercel.json redirects", () => {
  const redirects = vercel.redirects as Array<{ source: string; destination: string; permanent: boolean }>;
  const find = (source: string) => redirects.find((r) => r.source === source);

  it.each(["/loja", "/loja/:path*", "/viagens", "/viagens/:path*"])("%s -> 301 /", (source) => {
    expect(find(source)).toMatchObject({ destination: "/", permanent: true });
  });

  it("sends /exclusivo/* to /programas/* except files", () => {
    const rule = redirects.find((r) => r.destination === "/programas/:path");
    expect(rule?.permanent).toBe(true);
    const re = new RegExp(`^${rule!.source.replace("/exclusivo/:path", "/exclusivo/")}$`);
    expect(re.test("/exclusivo/mente-aberta/peca")).toBe(true);
    expect(re.test("/exclusivo/capa.jpg")).toBe(false);
  });

  it("no redirect still points to /exclusivo", () => {
    expect(redirects.filter((r) => r.destination.startsWith("/exclusivo"))).toEqual([]);
  });
});
