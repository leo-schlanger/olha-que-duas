import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./hooks/usePWA";

// Register PWA Service Worker
registerServiceWorker();

// Diagnostic tools window.__radioDebug() / window.__radioFix(): stubs that load
// the real code on first call (kept out of the entry chunk, perf 21/11/2026).
type DebugWindow = Window & Record<"__radioDebug" | "__radioFix", () => Promise<unknown>>;
const debugWindow = window as unknown as DebugWindow;
for (const name of ["__radioDebug", "__radioFix"] as const) {
  debugWindow[name] = () =>
    import("./lib/radioDebug").then(({ installRadioDebug }) => {
      installRadioDebug();
      return debugWindow[name]();
    });
}

createRoot(document.getElementById("root")!).render(<App />);
