import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { hasConsent } from '@/hooks/useCookieConsent';

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user dismissed before (only if consent was given)
    if (hasConsent()) {
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        // Show again after 7 days
        if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
          setIsDismissed(true);
        }
      }
    }

    // Delay showing the prompt
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (hasConsent()) {
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }
  };

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsDismissed(true);
    }
  };

  // Don't show if already installed, dismissed, or not installable
  if (isInstalled || isDismissed || !isInstallable || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-fade-in">
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/10 p-4 md:p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-vermelho to-vermelho-soft flex items-center justify-center shadow-lg shadow-vermelho/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Instala a nossa app
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Acede mais rápido e ouve a rádio mesmo offline!
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-vermelho hover:bg-vermelho/90 text-white rounded-lg h-11 px-4 text-sm font-medium"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Instalar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground rounded-lg h-11 px-3 text-sm"
              >
                Agora não
              </Button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
