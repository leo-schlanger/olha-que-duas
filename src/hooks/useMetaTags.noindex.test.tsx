import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { getBlogPostMetaConfig, useMetaTags } from "./useMetaTags";

// Aggregated news: noindex, follow in the SPA too (Leo, 21/11/2026).
describe("news pages in the SPA", () => {
  it("set robots and googlebot to noindex, follow and reset on leave", () => {
    const config = getBlogPostMetaConfig({ title: "Notícia", slug: "uma-noticia", summary: "Resumo" });
    expect(config.noindex).toBe("follow");
    const { unmount } = renderHook(() => useMetaTags(config));
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, follow");
    expect(document.querySelector('meta[name="googlebot"]')?.getAttribute("content")).toBe("noindex, follow");
    unmount();
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toMatch(/^index, follow/);
    expect(document.querySelector('meta[name="googlebot"]')?.getAttribute("content")).toMatch(/^index, follow/);
  });
});
