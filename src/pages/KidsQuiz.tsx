import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

/* ---------- Types ---------- */

interface Question {
  emoji: string;
  question: string;
  options: { emoji: string; text: string }[];
  correctIndex: number;
}

/* ---------- Questions ---------- */

const allQuestions: Question[] = [
  {
    emoji: '🐱',
    question: 'Qual animal diz "Miau"?',
    options: [
      { emoji: '🐱', text: 'Gato' },
      { emoji: '🐶', text: 'Cão' },
      { emoji: '🐸', text: 'Sapo' },
      { emoji: '🐦', text: 'Pássaro' },
    ],
    correctIndex: 0,
  },
  {
    emoji: '☀️',
    question: 'De que cor é o sol?',
    options: [
      { emoji: '🔴', text: 'Vermelho' },
      { emoji: '🟡', text: 'Amarelo' },
      { emoji: '🔵', text: 'Azul' },
      { emoji: '🟢', text: 'Verde' },
    ],
    correctIndex: 1,
  },
  {
    emoji: '🐶',
    question: 'Qual animal é o melhor amigo do Homem?',
    options: [
      { emoji: '🐍', text: 'Cobra' },
      { emoji: '🐟', text: 'Peixe' },
      { emoji: '🐶', text: 'Cão' },
      { emoji: '🦎', text: 'Lagarto' },
    ],
    correctIndex: 2,
  },
  {
    emoji: '🍎',
    question: 'De que cor é uma maçã madura?',
    options: [
      { emoji: '🔵', text: 'Azul' },
      { emoji: '🟣', text: 'Roxo' },
      { emoji: '🟢', text: 'Verde' },
      { emoji: '🔴', text: 'Vermelho' },
    ],
    correctIndex: 3,
  },
  {
    emoji: '🐔',
    question: 'Qual animal põe ovos e faz "Có-có-ró-có"?',
    options: [
      { emoji: '🐔', text: 'Galinha' },
      { emoji: '🐷', text: 'Porco' },
      { emoji: '🐴', text: 'Cavalo' },
      { emoji: '🐑', text: 'Ovelha' },
    ],
    correctIndex: 0,
  },
  {
    emoji: '🌈',
    question: 'O que aparece no céu depois da chuva?',
    options: [
      { emoji: '⭐', text: 'Estrela' },
      { emoji: '🌈', text: 'Arco-íris' },
      { emoji: '🌙', text: 'Lua' },
      { emoji: '❄️', text: 'Neve' },
    ],
    correctIndex: 1,
  },
  {
    emoji: '🍌',
    question: 'Qual fruta é amarela e os macacos adoram?',
    options: [
      { emoji: '🍇', text: 'Uvas' },
      { emoji: '🍓', text: 'Morango' },
      { emoji: '🍌', text: 'Banana' },
      { emoji: '🍊', text: 'Laranja' },
    ],
    correctIndex: 2,
  },
  {
    emoji: '🐄',
    question: 'Qual animal nos dá leite?',
    options: [
      { emoji: '🐓', text: 'Galo' },
      { emoji: '🐄', text: 'Vaca' },
      { emoji: '🐢', text: 'Tartaruga' },
      { emoji: '🐧', text: 'Pinguim' },
    ],
    correctIndex: 1,
  },
  {
    emoji: '🌙',
    question: 'O que vemos no céu à noite?',
    options: [
      { emoji: '🌞', text: 'Sol' },
      { emoji: '🌧️', text: 'Chuva' },
      { emoji: '🌪️', text: 'Tornado' },
      { emoji: '🌙', text: 'Lua e estrelas' },
    ],
    correctIndex: 3,
  },
  {
    emoji: '🐸',
    question: 'Qual animal salta e diz "Coaxar"?',
    options: [
      { emoji: '🐸', text: 'Sapo' },
      { emoji: '🐛', text: 'Lagarta' },
      { emoji: '🐝', text: 'Abelha' },
      { emoji: '🐞', text: 'Joaninha' },
    ],
    correctIndex: 0,
  },
];

/* ---------- Helpers ---------- */

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ---------- Answer button color palettes ---------- */

const optionColors = [
  {
    bg: 'bg-pink-500',
    hover: 'hover:bg-pink-600',
    shadow: 'shadow-[0_10px_0_rgba(190,24,93,0.6)]',
    hoverShadow: 'hover:shadow-[0_6px_0_rgba(190,24,93,0.6)]',
    border: 'border-pink-300',
  },
  {
    bg: 'bg-sky-500',
    hover: 'hover:bg-sky-600',
    shadow: 'shadow-[0_10px_0_rgba(3,105,161,0.6)]',
    hoverShadow: 'hover:shadow-[0_6px_0_rgba(3,105,161,0.6)]',
    border: 'border-sky-300',
  },
  {
    bg: 'bg-amber-400',
    hover: 'hover:bg-amber-500',
    shadow: 'shadow-[0_10px_0_rgba(180,83,9,0.6)]',
    hoverShadow: 'hover:shadow-[0_6px_0_rgba(180,83,9,0.6)]',
    border: 'border-amber-300',
  },
  {
    bg: 'bg-emerald-500',
    hover: 'hover:bg-emerald-600',
    shadow: 'shadow-[0_10px_0_rgba(6,95,70,0.6)]',
    hoverShadow: 'hover:shadow-[0_6px_0_rgba(6,95,70,0.6)]',
    border: 'border-emerald-300',
  },
];

/* ---------- Component ---------- */

const KidsQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>(() => shuffleArray(allQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const current = questions[currentIndex];

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return; // prevent double-click

      const correct = optionIndex === current.correctIndex;
      setSelectedOption(optionIndex);
      setIsCorrect(correct);

      if (correct) setScore((s) => s + 1);

      setTimeout(() => {
        if (currentIndex + 1 >= total) {
          setFinished(true);
        } else {
          setCurrentIndex((i) => i + 1);
        }
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1200);
    },
    [selectedOption, current, currentIndex, total],
  );

  const restart = useCallback(() => {
    setQuestions(shuffleArray(allQuestions));
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setFinished(false);
  }, []);

  const starRating = useMemo(() => {
    const pct = score / total;
    if (pct >= 0.9) return 5;
    if (pct >= 0.7) return 4;
    if (pct >= 0.5) return 3;
    if (pct >= 0.3) return 2;
    return 1;
  }, [score, total]);

  const celebrationMessage = useMemo(() => {
    const pct = score / total;
    if (pct === 1) return 'Perfeito! Es um verdadeiro campeão! 🏆';
    if (pct >= 0.8) return 'Muito bem! Sabes imenso! 🎉';
    if (pct >= 0.6) return 'Boa! Estás a aprender muito! 💪';
    if (pct >= 0.4) return 'Bom esforço! Tenta outra vez! 😊';
    return 'Não desistas! Vais conseguir! 🌟';
  }, [score, total]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section
          className="relative min-h-[80vh] overflow-hidden pt-20 md:pt-24 pb-20 md:pb-28"
          style={{
            background:
              'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 30%, #fde047 70%, #f472b6 100%)',
          }}
        >
          {/* Decorative floating dots */}
          <FloatingDots />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Back button */}
            <div className="mb-6">
              <Button
                asChild
                className="h-12 px-6 text-sm font-extrabold rounded-full bg-white/90 hover:bg-white text-pink-600 shadow-[0_6px_0_rgba(0,0,0,0.1)] hover:shadow-[0_3px_0_rgba(0,0,0,0.1)] hover:translate-y-1 transition-all border-4 border-pink-200"
              >
                <Link to="/kids/jogos" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Voltar aos Jogos
                </Link>
              </Button>
            </div>

            {/* Title */}
            <div className="text-center mb-8 md:mb-10">
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-md">
                Quiz dos Pequeninos
              </h1>
              <p className="mt-3 text-lg md:text-xl font-bold text-white/90 drop-shadow-sm">
                Testa o que sabes sobre animais, cores e natureza!
              </p>
            </div>

            {/* Quiz card */}
            <div className="max-w-2xl mx-auto">
              {!finished ? (
                /* ----- Question phase ----- */
                <div className="rounded-3xl bg-white/95 backdrop-blur-sm border-4 border-white shadow-2xl p-6 md:p-10">
                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-pink-600 text-sm md:text-base">
                        Pergunta {currentIndex + 1} de {total}
                      </span>
                      <span className="font-display font-bold text-amber-600 text-sm md:text-base flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {score} ponto{score !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="w-full h-4 bg-pink-100 rounded-full overflow-hidden border-2 border-pink-200">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${((currentIndex + 1) / total) * 100}%`,
                          background:
                            'linear-gradient(90deg, #ec4899 0%, #f472b6 50%, #fde047 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Question emoji and text */}
                  <div className="text-center mb-8">
                    <div className="text-7xl md:text-8xl mb-4 animate-bounce">
                      {current.emoji}
                    </div>
                    <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-800">
                      {current.question}
                    </h2>
                  </div>

                  {/* Answer options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {current.options.map((option, idx) => {
                      const color = optionColors[idx];
                      const isSelected = selectedOption === idx;
                      const isCorrectAnswer = idx === current.correctIndex;

                      let stateClasses = '';
                      if (selectedOption !== null) {
                        if (isCorrectAnswer) {
                          stateClasses =
                            'bg-emerald-500 shadow-[0_10px_0_rgba(6,95,70,0.6)] border-emerald-300 scale-105';
                        } else if (isSelected && !isCorrect) {
                          stateClasses =
                            'bg-red-500 shadow-[0_10px_0_rgba(153,27,27,0.6)] border-red-300 animate-shake';
                        } else {
                          stateClasses = 'opacity-50 ' + color.bg + ' ' + color.shadow + ' ' + color.border;
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={selectedOption !== null}
                          className={`
                            w-full flex items-center gap-3 px-5 py-4 md:py-5
                            rounded-2xl text-white font-extrabold text-lg md:text-xl
                            border-4 transition-all duration-200 cursor-pointer
                            disabled:cursor-default
                            hover:translate-y-1
                            ${
                              selectedOption !== null
                                ? stateClasses
                                : `${color.bg} ${color.hover} ${color.shadow} ${color.hoverShadow} ${color.border}`
                            }
                          `}
                        >
                          <span className="text-3xl">{option.emoji}</span>
                          <span className="drop-shadow-sm">{option.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback flash */}
                  {selectedOption !== null && (
                    <div className="mt-6 text-center">
                      <p
                        className={`font-display font-bold text-2xl ${
                          isCorrect ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {isCorrect ? '✅ Boa, acertaste!' : '❌ Ups, não era essa!'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* ----- Results phase ----- */
                <div className="rounded-3xl bg-white/95 backdrop-blur-sm border-4 border-white shadow-2xl p-8 md:p-12 text-center">
                  {/* Celebration emoji */}
                  <div className="text-7xl md:text-8xl mb-4">🎉</div>

                  <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-800 mb-2">
                    Quiz Terminado!
                  </h2>

                  <p className="font-display font-bold text-xl md:text-2xl text-pink-600 mb-4">
                    {celebrationMessage}
                  </p>

                  {/* Score */}
                  <div
                    className="inline-block rounded-2xl px-8 py-4 mb-6 border-4 border-white shadow-lg"
                    style={{
                      background:
                        'linear-gradient(135deg, #fde047 0%, #f472b6 100%)',
                    }}
                  >
                    <p className="font-display font-bold text-white text-2xl md:text-3xl drop-shadow-md">
                      {score} de {total} pontos
                    </p>
                  </div>

                  {/* Star rating */}
                  <div className="flex justify-center gap-2 mb-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-300 ${
                          i < starRating
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_2px_4px_rgba(250,204,21,0.5)]'
                            : 'text-gray-300 fill-gray-200'
                        }`}
                        style={{
                          animationDelay: `${i * 150}ms`,
                          ...(i < starRating ? { animation: 'star-pop 0.4s ease-out forwards', animationDelay: `${i * 150}ms` } : {}),
                        }}
                      />
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      onClick={restart}
                      className="h-14 px-8 text-base font-extrabold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-[0_10px_0_rgba(190,24,93,0.6)] hover:shadow-[0_6px_0_rgba(190,24,93,0.6)] hover:translate-y-1 transition-all duration-200 border-4 border-white"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Jogar outra vez
                    </Button>
                    <Button
                      asChild
                      className="h-14 px-8 text-base font-extrabold rounded-full bg-yellow-400 hover:bg-yellow-500 text-pink-700 shadow-[0_10px_0_rgba(202,138,4,0.6)] hover:shadow-[0_6px_0_rgba(202,138,4,0.6)] hover:translate-y-1 transition-all duration-200 border-4 border-white"
                    >
                      <Link to="/kids/jogos" className="inline-flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        Voltar aos Jogos
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      {/* Keyframe animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes star-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/* ---------- Decorative subcomponent ---------- */

const FloatingDots = () => {
  const dots = [
    { top: '12%', left: '6%', cls: 'bg-white/40 w-4 h-4 animate-float-1' },
    { top: '25%', left: '88%', cls: 'bg-yellow-300/50 w-5 h-5 animate-float-2' },
    { top: '40%', left: '10%', cls: 'bg-pink-300/50 w-3 h-3 animate-float-3' },
    { top: '55%', left: '93%', cls: 'bg-white/30 w-4 h-4 animate-float-1' },
    { top: '70%', left: '4%', cls: 'bg-amber-300/50 w-3 h-3 animate-float-2' },
    { top: '80%', left: '85%', cls: 'bg-sky-300/50 w-5 h-5 animate-float-3' },
    { top: '18%', left: '48%', cls: 'bg-white/30 w-3 h-3 animate-float-1' },
    { top: '65%', left: '50%', cls: 'bg-pink-200/40 w-4 h-4 animate-float-2' },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((dot, i) => (
        <span
          key={i}
          className={`absolute rounded-full ${dot.cls}`}
          style={{ top: dot.top, left: dot.left }}
        />
      ))}
    </div>
  );
};

export default KidsQuiz;
