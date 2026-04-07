import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CookieConsent() {
  const { consent, accept, reject } = useCookieConsent();

  if (consent !== 'pending') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6" role="dialog" aria-label="Consentimento de cookies">
      <div className="max-w-3xl mx-auto bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/10 p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-vermelho/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-vermelho" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1">
              A tua privacidade importa
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Utilizamos cookies funcionais para melhorar a tua experiencia no site
              (como guardar preferencias e o estado da instalacao da app).
              Nao utilizamos cookies de rastreamento ou publicidade.
              Consulta a nossa{' '}
              <Link to="/privacidade" className="text-vermelho underline hover:text-vermelho/80">
                Politica de Privacidade
              </Link>{' '}
              para mais detalhes.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={accept}
                className="bg-vermelho hover:bg-vermelho/90 text-white rounded-xl h-10 px-6 text-sm font-medium"
              >
                Aceitar
              </Button>
              <Button
                onClick={reject}
                variant="outline"
                className="rounded-xl h-10 px-6 text-sm font-medium"
              >
                Recusar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
