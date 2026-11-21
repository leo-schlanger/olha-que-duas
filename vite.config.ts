import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { imagetools } from "vite-imagetools";
import { siteConfig } from "./src/config/site";
import { heroPreloadScript, regularHrefFromFiles, seasonalSrcSetFromFiles } from "./src/lib/heroPreload";

/** Preloads the home hero photo (the LCP) from index.html; see src/lib/heroPreload.ts. */
function heroPreloadPlugin(): Plugin {
  return {
    name: "oqd-hero-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle ?? {});
        const regularHref = regularHrefFromFiles(files);
        if (!regularHref) throw new Error("hero preload: olha-que-duas-foto.jpg not in the bundle");
        const script = heroPreloadScript({
          seasonalSrcSet: seasonalSrcSetFromFiles(files),
          start: siteConfig.natal.start,
          end: siteConfig.natal.end,
          enabled: siteConfig.natal.enabled,
          regularHref,
        });
        return [{ tag: "script", children: script, injectTo: "head-prepend" }];
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    heroPreloadPlugin(),
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('webp')) {
          return new URLSearchParams({ format: 'webp' });
        }
        return new URLSearchParams();
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Only what every page needs at first paint (perf, 21/11/2026). The old object
        // form forced framer-motion, lucide and supabase-js into the entry (tslib, shared
        // by radix, was hoisted into vendor-supabase, so the entry preloaded all of it).
        // supabase-js is now a lazy import (lib/supabase.ts) and splits on its own.
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run[\\/]router)[\\/]/.test(id)) {
            return "vendor-react";
          }
          if (/[\\/]node_modules[\\/]@tanstack[\\/]/.test(id)) return "vendor-query";
        },
      },
    },
  },
}));
