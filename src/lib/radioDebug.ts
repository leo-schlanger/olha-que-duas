/**
 * Diagnóstico de rádio — acessível via consola do browser:
 *
 *   window.__radioDebug()
 *
 * Testa: Service Worker, cache, localStorage, autoplay policy, stream,
 * AudioContext, ICY support. Imprime relatório completo na consola.
 */

interface DiagResult {
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
}

async function diagnose(): Promise<DiagResult[]> {
  const results: DiagResult[] = [];

  // ── 1. Service Worker ──
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        const state = reg.active
          ? "active"
          : reg.waiting
            ? "waiting"
            : reg.installing
              ? "installing"
              : "none";
        results.push({
          label: "Service Worker",
          status: state === "active" ? "ok" : "warn",
          detail: `state=${state}, scope=${reg.scope}`,
        });
      } else {
        results.push({
          label: "Service Worker",
          status: "ok",
          detail: "not registered",
        });
      }
    } else {
      results.push({
        label: "Service Worker",
        status: "ok",
        detail: "not supported by browser",
      });
    }
  } catch (e) {
    results.push({ label: "Service Worker", status: "fail", detail: String(e) });
  }

  // ── 2. Caches ──
  try {
    if ("caches" in window) {
      const names = await caches.keys();
      results.push({
        label: "Cache Storage",
        status: "ok",
        detail: names.length > 0 ? names.join(", ") : "empty",
      });
    }
  } catch (e) {
    results.push({ label: "Cache Storage", status: "warn", detail: String(e) });
  }

  // ── 3. localStorage radio state ──
  try {
    const vol = localStorage.getItem("radio.volume");
    const muted = localStorage.getItem("radio.muted");
    const buf = localStorage.getItem("radio.bufferSec");
    const detail = `volume=${vol ?? "null"}, muted=${muted ?? "null"}, bufferSec=${buf ?? "null"}`;

    let status: DiagResult["status"] = "ok";
    if (muted === "true") status = "warn";
    if (vol !== null && (Number(vol) === 0 || !Number.isFinite(Number(vol))))
      status = "warn";

    results.push({ label: "localStorage (radio)", status, detail });
  } catch (e) {
    results.push({ label: "localStorage", status: "fail", detail: String(e) });
  }

  // ── 4. AudioContext state ──
  try {
    const ctx = new AudioContext();
    results.push({
      label: "AudioContext",
      status: ctx.state === "running" ? "ok" : "warn",
      detail: `state=${ctx.state}, sampleRate=${ctx.sampleRate}`,
    });
    ctx.close();
  } catch (e) {
    results.push({
      label: "AudioContext",
      status: "fail",
      detail: `cannot create: ${e}`,
    });
  }

  // ── 5. Autoplay policy (silent test) ──
  try {
    const audio = new Audio();
    audio.volume = 0; // silent test
    audio.src =
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
    await audio.play();
    audio.pause();
    results.push({
      label: "Autoplay policy",
      status: "ok",
      detail: "silent audio play allowed",
    });
  } catch (e) {
    results.push({
      label: "Autoplay policy",
      status: "fail",
      detail: `blocked: ${(e as Error).message}`,
    });
  }

  // ── 6. Stream reachability (fetch HEAD) ──
  const streamUrl =
    "https://radio.olhaqueduas.com/listen/olha_que_duas/radio.mp3";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(streamUrl, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
    });
    clearTimeout(timer);
    results.push({
      label: "Stream reachable",
      status: "ok",
      detail: `type=${res.type}, status=${res.status}`,
    });
  } catch (e) {
    results.push({
      label: "Stream reachable",
      status: "fail",
      detail: `${(e as Error).message} — extensão a bloquear?`,
    });
  }

  // ── 7. Actual audio play test (with sound, 2s) ──
  try {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = 0.01; // near-silent
    audio.src = streamUrl;

    const playResult = await Promise.race<string>([
      audio.play().then(() => "play-resolved"),
      new Promise<string>((_, reject) =>
        audio.addEventListener("error", () => reject(new Error("audio-error")), {
          once: true,
        }),
      ),
      new Promise<string>((resolve) => setTimeout(() => resolve("timeout-5s"), 5000)),
    ]);

    // Wait a moment to see if it actually produces audio
    if (playResult === "play-resolved") {
      const actuallyPlaying = await new Promise<boolean>((resolve) => {
        if (!audio.paused && audio.readyState >= 2) {
          resolve(true);
          return;
        }
        const t = setTimeout(() => resolve(false), 3000);
        audio.addEventListener(
          "playing",
          () => {
            clearTimeout(t);
            resolve(true);
          },
          { once: true },
        );
      });

      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      results.push({
        label: "Audio play test",
        status: actuallyPlaying ? "ok" : "warn",
        detail: actuallyPlaying
          ? "stream playing successfully"
          : "play() resolved but audio not producing output",
      });
    } else {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      results.push({
        label: "Audio play test",
        status: "fail",
        detail: playResult,
      });
    }
  } catch (e) {
    results.push({
      label: "Audio play test",
      status: "fail",
      detail: `${(e as Error).message}`,
    });
  }

  // ── 8. ICY player support ──
  try {
    const { default: IMP } = await import("icecast-metadata-player");
    const support = IMP.canPlayType("audio/mpeg");
    const canPlay = !!(
      (support as Record<string, unknown>).mediasource ||
      (support as Record<string, unknown>).html5 ||
      (support as Record<string, unknown>).webaudio
    );
    results.push({
      label: "ICY player support",
      status: canPlay ? "ok" : "warn",
      detail: JSON.stringify(support),
    });
  } catch (e) {
    results.push({
      label: "ICY player support",
      status: "fail",
      detail: String(e),
    });
  }

  return results;
}

export function installRadioDebug() {
  (window as unknown as Record<string, unknown>).__radioDebug = async () => {
    console.log(
      "%c🔍 Radio Diagnostics",
      "font-size:16px;font-weight:bold;color:#fbbf24",
    );
    console.log("Running tests...\n");

    const results = await diagnose();

    const icons = { ok: "✅", warn: "⚠️", fail: "❌" };
    for (const r of results) {
      console.log(`${icons[r.status]} ${r.label}: ${r.detail}`);
    }

    const fails = results.filter((r) => r.status === "fail");
    const warns = results.filter((r) => r.status === "warn");

    console.log("\n---");
    if (fails.length === 0 && warns.length === 0) {
      console.log("All tests passed. Issue may be extension-related.");
      console.log("Try: disable all extensions and reload.");
    } else {
      if (fails.length > 0) {
        console.log(
          `%c${fails.length} FAILED:`,
          "color:red;font-weight:bold",
          fails.map((f) => f.label).join(", "),
        );
      }
      if (warns.length > 0) {
        console.log(
          `%c${warns.length} WARNINGS:`,
          "color:orange;font-weight:bold",
          warns.map((w) => `${w.label} (${w.detail})`).join(", "),
        );
      }
    }

    console.log("\nTo fix stale cache, run:");
    console.log(
      "  caches.keys().then(n => n.forEach(k => caches.delete(k))); navigator.serviceWorker.getRegistration().then(r => r?.unregister()); location.reload();",
    );

    return results;
  };

  // Also expose a quick fix command
  (window as unknown as Record<string, unknown>).__radioFix = async () => {
    console.log("🔧 Clearing all caches and unregistering service worker...");
    const names = await caches.keys();
    await Promise.all(names.map((n) => caches.delete(n)));
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) await reg.unregister();
    console.log("✅ Done. Reloading page...");
    location.reload();
  };
}
