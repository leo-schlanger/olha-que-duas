import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  /**
   * Fallback opcional. Se omitido, mostra UI default. Pode ser ReactNode
   * estático ou função que recebe o erro e o reset handler.
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Callback chamado quando um erro é capturado. Útil para telemetria. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

/**
 * Captura erros lançados durante render/lifecycle de qualquer descendente
 * e mostra um fallback amigável em vez do "white screen of death".
 *
 * Não captura: erros em event handlers, Promises não-await'd, SSR (não há
 * SSR aqui, OK), nem erros no próprio fallback.
 *
 * Por design uma classe — error boundaries só funcionam como classes em
 * React 18.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Sempre logar — útil em dev e no console do utilizador para reportar
    console.error("[ErrorBoundary]", error, info);
    this.props.onError?.(error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback !== undefined) {
      return typeof this.props.fallback === "function"
        ? this.props.fallback(error, this.reset)
        : this.props.fallback;
    }

    return (
      <div
        role="alert"
        className="min-h-screen flex items-center justify-center bg-beige-dark text-cream p-6"
      >
        <div className="max-w-md w-full bg-cream/5 border border-cream/10 rounded-2xl p-6 md:p-8 text-center backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-vermelho/10 border border-vermelho/20 mb-4">
            <AlertTriangle className="w-7 h-7 text-vermelho" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Algo correu mal</h1>
          <p className="text-sm text-cream/60 mb-6">
            Ocorreu um erro inesperado. Tenta recarregar a página — se o
            problema persistir, contacta-nos.
          </p>
          <details className="text-left text-xs text-cream/40 bg-black/30 rounded-lg p-3 mb-6 overflow-auto max-h-40">
            <summary className="cursor-pointer text-cream/60 mb-2">
              Detalhes técnicos
            </summary>
            <code className="font-mono whitespace-pre-wrap break-words">
              {error.message}
            </code>
          </details>
          <button
            onClick={() => {
              this.reset();
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vermelho hover:bg-vermelho-dark text-cream font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
