import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./hooks/usePWA";
import { installRadioDebug } from "./lib/radioDebug";

// Register PWA Service Worker
registerServiceWorker();

// Diagnostic tools: window.__radioDebug() and window.__radioFix()
installRadioDebug();

createRoot(document.getElementById("root")!).render(<App />);
