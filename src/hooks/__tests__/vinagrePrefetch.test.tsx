import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Boot prefetch of a piece (perf, 21/11/2026): one request, shared with the page's hook.
const calls = vi.hoisted(() => ({ slugs: [] as string[] }));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => true,
  loadSupabase: async () => ({
    from: () => {
      const q = {
        select: () => q,
        eq: (column: string, value: string) => {
          if (column === "slug") calls.slugs.push(value);
          return q;
        },
        or: () => q,
        maybeSingle: async () => ({ data: null, error: null }),
      };
      return q;
    },
  }),
}));

import { postSlugFromPath, prefetchVinagrePost, useVinagrePost } from "../useVinagrePosts";

afterEach(() => {
  cleanup();
  calls.slugs = [];
});

describe("postSlugFromPath", () => {
  it("reads the slug of a piece URL only", () => {
    expect(postSlugFromPath("/programas/curtas-biografias/kina-a-mulher-que-se-fez-sozinha")).toBe(
      "kina-a-mulher-que-se-fez-sozinha",
    );
    expect(postSlugFromPath("/programas/noticias-olha-que-duas/apagao/")).toBe("apagao");
    expect(postSlugFromPath("/Programas/x/Caf%C3%A9")).toBe("Café");
    for (const path of ["/", "/programas", "/programas/curtas-biografias", "/programas/a/b/c", "/noticias/a/b", "/programas/a/%E0"]) {
      expect(postSlugFromPath(path)).toBeNull();
    }
  });
});

describe("prefetchVinagrePost", () => {
  it("does nothing outside a piece", () => {
    const client = new QueryClient();
    prefetchVinagrePost(client, "/programas/curtas-biografias");
    expect(client.getQueryCache().getAll()).toHaveLength(0);
  });

  it("starts the query the page uses, so the page does not fetch again", async () => {
    const client = new QueryClient();
    prefetchVinagrePost(client, "/programas/curtas-biografias/kina");
    expect(client.getQueryCache().find({ queryKey: ["vinagre-post", "kina"] })).toBeDefined();

    const Probe = () => {
      const { isLoading } = useVinagrePost("kina");
      return <p>{isLoading ? "loading" : "done"}</p>;
    };
    render(
      <QueryClientProvider client={client}>
        <Probe />
      </QueryClientProvider>,
    );
    expect(await screen.findByText("done")).toBeTruthy();
    expect(calls.slugs).toEqual(["kina"]);
  });
});
