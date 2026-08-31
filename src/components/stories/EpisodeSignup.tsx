import { useState } from 'react';
import { Loader2, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNewsletterSignup } from '@/hooks/useNewsletterSignup';

interface EpisodeSignupProps {
  storyTitle: string;
  /** Muda o texto conforme haja ou não episódio seguinte disponível. */
  variant: 'meio' | 'fim' | 'aguardar';
}

const COPY: Record<
  EpisodeSignupProps['variant'],
  { title: (t: string) => string; body: string; cta: string }
> = {
  meio: {
    title: () => 'Não perca o próximo episódio',
    body: 'Deixe o email e avisamos assim que sair. Sem spam, só a história.',
    cta: 'Avisem-me',
  },
  fim: {
    title: (t) => `Quer acompanhar ${t} até ao fim?`,
    body: 'Recebe cada episódio novo no email, no dia em que sai.',
    cta: 'Quero receber',
  },
  aguardar: {
    title: () => 'Este foi o último episódio publicado',
    body: 'O próximo está a caminho. Deixe o email e não precisa de andar à procura.',
    cta: 'Avisem-me',
  },
};

/**
 * Captação de email dentro do episódio.
 *
 * É o objetivo primário da secção: uma lista própria vale mais do que
 * o alcance emprestado do Facebook. Aparece a meio (quando o leitor já
 * está preso) e no fim, junto à navegação.
 */
export function EpisodeSignup({ storyTitle, variant }: EpisodeSignupProps) {
  const { signup, loading } = useNewsletterSignup();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const copy = COPY[variant];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const result = await signup(email.trim());
    setMessage(result.message);
    if (result.success) {
      setDone(true);
      setEmail('');
    }
  };

  return (
    <aside className="my-10 rounded-2xl border border-vermelho/20 bg-vermelho/5 p-6 sm:p-8">
      {done ? (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">
              Está feito.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {message || 'Avisamos assim que o próximo episódio sair.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-vermelho/15 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-vermelho" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground leading-tight">
                {copy.title(storyTitle)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{copy.body}</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <label htmlFor={`signup-${variant}`} className="sr-only">
              O seu email
            </label>
            <input
              id={`signup-${variant}`}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="o.seu@email.com"
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-vermelho"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-11 bg-vermelho hover:bg-vermelho/90 px-6"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {copy.cta}
            </Button>
          </form>

          {message && !done && (
            <p className="text-sm text-vermelho mt-3" role="alert">
              {message}
            </p>
          )}
        </>
      )}
    </aside>
  );
}
