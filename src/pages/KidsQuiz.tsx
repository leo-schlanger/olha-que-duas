import { useCallback, useMemo, useState } from 'react';
import { RotateCcw, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';
import KidsGameShell from '@/components/kids/games/KidsGameShell';
import MoreGames from '@/components/kids/games/MoreGames';
import { kidsSfx } from '@/components/kids/games/gameSounds';
import alexandraCartoon from '@/assets/kids/alexandra-cartoon.webp';
import marluceCartoon from '@/assets/kids/marluce-cartoon.webp';
import leoCartoon from '@/assets/kids/leo-cartoon.webp';
import logoKids from '@/assets/kids/logo-kids.webp';

interface Option {
  text: string;
  correct: boolean;
}

interface Question {
  prompt: string;
  image?: string;
  imageAlt?: string;
  options: Option[];
}

const BANK: Question[] = [
  {
    prompt: 'Como se chamam as duas da rádio?',
    image: alexandraCartoon,
    imageAlt: 'Alexandra',
    options: [
      { text: 'Alexandra e Marluce', correct: true },
      { text: 'Leonor e Leo', correct: false },
      { text: 'Ana e Maria', correct: false },
      { text: 'Rita e Sara', correct: false },
    ],
  },
  {
    prompt: 'Quem apresenta o Cantinho da Pequenada?',
    options: [
      { text: 'A Leonor', correct: true },
      { text: 'O Micro', correct: false },
      { text: 'O sol', correct: false },
      { text: 'O Leo sozinho', correct: false },
    ],
  },
  {
    prompt: 'Qual é o mascote do Olha que Duas Kids?',
    image: logoKids,
    imageAlt: 'Micro, o mascote',
    options: [
      { text: 'O Microfone com boné', correct: true },
      { text: 'Um tubarão', correct: false },
      { text: 'Um robô', correct: false },
      { text: 'Um gato', correct: false },
    ],
  },
  {
    prompt: 'Onde podes ouvir o Cantinho da Pequenada?',
    options: [
      { text: 'Na Rádio Olha que Duas', correct: true },
      { text: 'Na televisão dos vizinhos', correct: false },
      { text: 'Só no cinema', correct: false },
      { text: 'No autocarro', correct: false },
    ],
  },
  {
    prompt: 'Quem está sempre a acenar “Olá!” no espaço Kids?',
    image: leoCartoon,
    imageAlt: 'Leo',
    options: [
      { text: 'O Leo', correct: true },
      { text: 'O Micro a dormir', correct: false },
      { text: 'Uma nuvem', correct: false },
      { text: 'O sol', correct: false },
    ],
  },
  {
    prompt: 'A Marluce usa calças com o quê?',
    image: marluceCartoon,
    imageAlt: 'Marluce',
    options: [
      { text: 'Bolinhas', correct: true },
      { text: 'Riscas de zebra', correct: false },
      { text: 'Folhas', correct: false },
      { text: 'Estrelas azuis', correct: false },
    ],
  },
  {
    prompt: 'De que cor é o sol no céu do Cantinho?',
    options: [
      { text: 'Amarelo', correct: true },
      { text: 'Azul', correct: false },
      { text: 'Roxo', correct: false },
      { text: 'Verde', correct: false },
    ],
  },
  {
    prompt: 'O que aparece no céu depois da chuva?',
    options: [
      { text: 'Um arco-íris', correct: true },
      { text: 'Um comboio', correct: false },
      { text: 'Um sapato', correct: false },
      { text: 'Um piano', correct: false },
    ],
  },
  {
    prompt: 'Qual animal diz “miau”?',
    options: [
      { text: 'O gato', correct: true },
      { text: 'O cão', correct: false },
      { text: 'A vaca', correct: false },
      { text: 'O peixe', correct: false },
    ],
  },
  {
    prompt: 'Qual animal nos dá leite?',
    options: [
      { text: 'A vaca', correct: true },
      { text: 'O galo', correct: false },
      { text: 'A tartaruga', correct: false },
      { text: 'O pinguim', correct: false },
    ],
  },
  {
    prompt: 'O que vemos no céu à noite?',
    options: [
      { text: 'A lua e as estrelas', correct: true },
      { text: 'O sol a ferver', correct: false },
      { text: 'Um comboio voador', correct: false },
      { text: 'Um chapéu', correct: false },
    ],
  },
  {
    prompt: 'O espaço Kids é feito para quem?',
    options: [
      { text: 'A pequenada e a família', correct: true },
      { text: 'Só os gatos', correct: false },
      { text: 'Robôs do silêncio', correct: false },
      { text: 'Nuvens zangadas', correct: false },
    ],
  },
];

const OPTION_COLORS = [
  { idle: 'bg-pink-500 shadow-[0_8px_0_#be185d]', mark: 'border-pink-200' },
  { idle: 'bg-sky-500 shadow-[0_8px_0_#0369a1]', mark: 'border-sky-200' },
  { idle: 'bg-amber-400 shadow-[0_8px_0_#b45309] text-sky-950', mark: 'border-amber-200' },
  { idle: 'bg-emerald-500 shadow-[0_8px_0_#047857]', mark: 'border-emerald-200' },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function deal(): Question[] {
  return shuffle(BANK).map((q) => ({ ...q, options: shuffle(q.options) }));
}

const quizJsonLd = [
  getPageBreadcrumbJsonLd('Quiz do Cantinho', 'https://www.olhaqueduas.com/kids/jogos/quiz', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    { name: 'Jogos', url: 'https://www.olhaqueduas.com/kids/jogos' },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Quiz do Cantinho — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/quiz',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: 'pt-PT',
    description:
      'Quiz do Cantinho da Pequenada: perguntas sobre a rádio Olha que Duas, a Alexandra, a Marluce, o Leo, o Micro e o mundo da pequenada.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  },
];

const KidsQuiz = () => {
  useMetaTags({
    title: 'Quiz do Cantinho — Perguntas da rádio Olha que Duas Kids',
    description:
      'Testa o que sabes sobre o Cantinho da Pequenada, as Duas e o Micro! Quiz educativo e gratuito do espaço Kids do Olha que Duas.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Quiz do Cantinho — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/quiz',
    tags: ['quiz infantil', 'cantinho da pequenada', 'olha que duas kids', 'quiz rádio'],
    jsonLd: quizJsonLd,
  });

  const [questions, setQuestions] = useState<Question[]>(() => deal());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const current = questions[index];

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (picked !== null) return;
      const ok = current.options[optionIndex].correct;
      setPicked(optionIndex);
      if (ok) {
        setScore((s) => s + 1);
        kidsSfx.correct();
      } else {
        kidsSfx.wrong();
      }
      window.setTimeout(() => {
        if (index + 1 >= total) {
          setFinished(true);
          if (ok || score + (ok ? 1 : 0) >= total * 0.6) kidsSfx.win();
        } else {
          setIndex((i) => i + 1);
        }
        setPicked(null);
      }, 1100);
    },
    [picked, current, index, total, score],
  );

  const restart = useCallback(() => {
    setQuestions(deal());
    setIndex(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
    kidsSfx.tap();
  }, []);

  const stars = useMemo(() => {
    const pct = score / total;
    if (pct >= 0.9) return 5;
    if (pct >= 0.7) return 4;
    if (pct >= 0.5) return 3;
    if (pct >= 0.3) return 2;
    return 1;
  }, [score, total]);

  const message = useMemo(() => {
    const pct = score / total;
    if (pct === 1) return 'Perfeito! És estrela do Cantinho!';
    if (pct >= 0.8) return 'Muito bem! A rádio tem orgulho em ti!';
    if (pct >= 0.6) return 'Boa! Ainda há mais músicas para aprender.';
    if (pct >= 0.4) return 'Bom esforço! Tenta outra vez com as Duas.';
    return 'Não desistas — o Micro acredita em ti!';
  }, [score, total]);

  return (
    <KidsGameShell
      title="Quiz do Cantinho"
      subtitle="Perguntas da rádio, das Duas e da pequenada."
      hud={
        !finished ? (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2 text-white font-extrabold">
              <span>
                Pergunta {index + 1} de {total}
              </span>
              <span className="inline-flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {score} {score === 1 ? 'ponto' : 'pontos'}
              </span>
            </div>
            <div className="h-4 rounded-full bg-white/40 border-2 border-white overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-amber-300 to-yellow-300 transition-all duration-500"
                style={{ width: `${((index + (picked !== null ? 1 : 0)) / total) * 100}%` }}
              />
            </div>
          </div>
        ) : null
      }
    >
      <div className="max-w-2xl mx-auto">
        {!finished ? (
          <div className="rounded-[1.75rem] bg-white/95 border-4 border-white p-5 md:p-8 shadow-[0_12px_0_rgba(190,24,93,0.2)]">
            {current.image && (
              <img
                src={current.image}
                alt={current.imageAlt ?? ''}
                className="mx-auto mb-4 h-28 md:h-36 w-auto object-contain drop-shadow-md"
              />
            )}
            <h2 className="font-kids font-extrabold text-2xl md:text-3xl text-sky-950 text-center mb-6">
              {current.prompt}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.options.map((option, idx) => {
                const color = OPTION_COLORS[idx];
                const isPicked = picked === idx;
                const showCorrect = picked !== null && option.correct;
                const showWrong = isPicked && !option.correct;
                let state = `${color.idle} ${color.mark}`;
                if (picked !== null) {
                  if (showCorrect) state = 'bg-emerald-500 shadow-[0_8px_0_#047857] border-emerald-200 scale-[1.02]';
                  else if (showWrong) state = 'bg-red-500 shadow-[0_8px_0_#991b1b] border-red-200';
                  else state = `${color.idle} opacity-45`;
                }
                return (
                  <button
                    key={option.text}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`min-h-[56px] w-full px-4 py-3 rounded-2xl text-white font-extrabold text-lg border-4 transition-all duration-200 cursor-pointer disabled:cursor-default hover:translate-y-0.5 ${state}`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <p
                className={`mt-5 text-center font-kids font-extrabold text-2xl ${
                  current.options[picked].correct ? 'text-emerald-600' : 'text-red-500'
                }`}
                aria-live="polite"
              >
                {current.options[picked].correct ? 'Boa, acertaste!' : 'Ups, não era essa!'}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-[1.75rem] bg-white/95 border-4 border-white p-8 md:p-10 text-center shadow-[0_12px_0_rgba(190,24,93,0.2)]">
            <img src={logoKids} alt="" className="mx-auto h-20 w-20 object-contain mb-3" />
            <h2 className="font-kids font-extrabold text-3xl md:text-4xl text-sky-950">Quiz terminado!</h2>
            <p className="mt-2 font-bold text-xl text-pink-600">{message}</p>
            <p className="mt-4 inline-flex rounded-2xl px-6 py-3 bg-gradient-to-r from-yellow-300 to-pink-400 text-white font-kids font-extrabold text-2xl">
              {score} de {total} pontos
            </p>
            <div className="flex justify-center gap-1.5 mt-5 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-10 h-10 ${
                    i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={restart}
              className="h-14 px-8 text-base font-kids font-extrabold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-[0_8px_0_rgba(190,24,93,0.6)] hover:translate-y-1 transition-all border-4 border-white cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Jogar outra vez
            </Button>
          </div>
        )}
        <MoreGames />
      </div>
    </KidsGameShell>
  );
};

export default KidsQuiz;
