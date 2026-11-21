import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  // An event caught at boot (main.tsx) before this hook mounted.
  const [isInstallable, setIsInstallable] = useState(() => Boolean(window.__oqdInstallPrompt));
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => (window.__oqdInstallPrompt as BeforeInstallPromptEvent | undefined) ?? null,
  );

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // iOS Safari não-standard: `navigator.standalone` indica modo PWA
    const isIOSStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone || isIOSStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      window.__oqdInstallPrompt = undefined;
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        window.__oqdInstallPrompt = undefined;
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [deferredPrompt]);

  return { isInstallable, isInstalled, installApp };
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        // Force update check on every page load
        reg.update();
      } catch (err) {
        // SW registration failure não é crítico — site continua a funcionar
        // sem PWA. Logar para diagnóstico.
        console.warn('[PWA] service worker registration failed:', err);
      }
    });
  }
}
