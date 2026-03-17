import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Gift,
  Sparkles,
  Bell,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Percent,
  Heart,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewsletterSignup } from '@/hooks/useNewsletterSignup';
import logoImage from '@/assets/logo-olha-que-duas.png';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signup, loading } = useNewsletterSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const result = await signup(email, name);

    if (result.success) {
      setIsSubscribed(true);
      toast.success('Bem-vindo à família!', {
        description: result.message,
      });
    } else {
      toast.error('Ops! Algo correu mal', {
        description: result.message,
      });
    }
  };

  const stats = [
    { value: '50+', label: 'Episódios', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0] relative overflow-hidden">
      {/* Animated Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-vermelho/20 to-vermelho/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-amarelo/30 to-amarelo/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-vermelho/10 to-amarelo/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">

                  {/* Main Card - Logo & Form */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="md:col-span-7 bg-white/70 backdrop-blur-2xl rounded-[28px] p-6 md:p-8 shadow-xl shadow-charcoal/5 border border-white/50"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <motion.img
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        src={logoImage}
                        alt="Olha que Duas"
                        className="w-16 h-16 rounded-2xl shadow-lg"
                      />
                      <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-charcoal">
                          Olha que Duas
                        </h1>
                        <p className="text-charcoal/50 text-sm">Newsletter Exclusiva</p>
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal mb-3 leading-tight">
                      Junta-te a milhares de{' '}
                      <span className="bg-gradient-to-r from-vermelho to-vermelho-soft bg-clip-text text-transparent">
                        pessoas inspiradoras
                      </span>
                    </h2>

                    <p className="text-charcoal/60 mb-8 text-base md:text-lg leading-relaxed">
                      Recebe em primeira mão novidades, descontos exclusivos e conteúdo
                      que não partilhamos em mais lado nenhum.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <motion.div
                        animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Input
                          type="text"
                          placeholder="O teu nome (opcional)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="h-14 bg-white/80 backdrop-blur-sm border-2 border-beige-medium/30 rounded-2xl text-charcoal placeholder:text-charcoal/30 focus:border-vermelho/50 focus:ring-4 focus:ring-vermelho/10 transition-all duration-300 text-base px-5"
                          disabled={loading}
                        />
                      </motion.div>
                      <motion.div
                        animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Input
                          type="email"
                          placeholder="O teu melhor email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="h-14 bg-white/80 backdrop-blur-sm border-2 border-beige-medium/30 rounded-2xl text-charcoal placeholder:text-charcoal/30 focus:border-vermelho/50 focus:ring-4 focus:ring-vermelho/10 transition-all duration-300 text-base px-5"
                          disabled={loading}
                          required
                        />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-14 bg-gradient-to-r from-vermelho via-vermelho to-vermelho-soft hover:from-vermelho-soft hover:via-vermelho hover:to-vermelho text-white font-semibold rounded-2xl shadow-xl shadow-vermelho/30 transition-all duration-500 text-base"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              Quero Fazer Parte
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>

                    <p className="text-center text-xs text-charcoal/40 mt-6">
                      Sem spam. Cancela quando quiseres.{' '}
                      <a href="/privacidade" className="underline hover:text-vermelho">
                        Política de Privacidade
                      </a>
                    </p>
                  </motion.div>

                  {/* Right Column - Benefits Grid */}
                  <div className="md:col-span-5 grid grid-cols-2 gap-4 md:gap-5">

                    {/* Benefit 1 - Novidades */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="col-span-2 bg-gradient-to-br from-vermelho to-vermelho-soft rounded-[24px] p-5 md:p-6 text-white shadow-xl shadow-vermelho/20"
                    >
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                        <Bell className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">Novidades em Primeira Mão</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Sê a primeira a saber sobre novos episódios, entrevistas exclusivas e eventos especiais.
                      </p>
                    </motion.div>

                    {/* Benefit 2 - Descontos */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-gradient-to-br from-amarelo to-amarelo-soft rounded-[24px] p-5 shadow-lg shadow-amarelo/20"
                    >
                      <div className="w-10 h-10 bg-charcoal/10 rounded-xl flex items-center justify-center mb-3">
                        <Percent className="w-5 h-5 text-charcoal" />
                      </div>
                      <h3 className="font-semibold text-charcoal text-sm mb-1">Descontos</h3>
                      <p className="text-charcoal/60 text-xs leading-relaxed">
                        Promoções exclusivas dos parceiros
                      </p>
                    </motion.div>

                    {/* Benefit 3 - Exclusivo */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-white/70 backdrop-blur-2xl rounded-[24px] p-5 border border-white/50 shadow-lg"
                    >
                      <div className="w-10 h-10 bg-vermelho/10 rounded-xl flex items-center justify-center mb-3">
                        <Sparkles className="w-5 h-5 text-vermelho" />
                      </div>
                      <h3 className="font-semibold text-charcoal text-sm mb-1">Exclusivo</h3>
                      <p className="text-charcoal/60 text-xs leading-relaxed">
                        Bastidores e dicas únicas
                      </p>
                    </motion.div>

                    {/* Benefit 4 - Gift */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-white/70 backdrop-blur-2xl rounded-[24px] p-5 border border-white/50 shadow-lg"
                    >
                      <div className="w-10 h-10 bg-amarelo/20 rounded-xl flex items-center justify-center mb-3">
                        <Gift className="w-5 h-5 text-charcoal" />
                      </div>
                      <h3 className="font-semibold text-charcoal text-sm mb-1">Surpresas</h3>
                      <p className="text-charcoal/60 text-xs leading-relaxed">
                        Ofertas e brindes especiais
                      </p>
                    </motion.div>

                    {/* Community Love */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-charcoal rounded-[24px] p-5 text-white shadow-lg"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                        <Heart className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">Comunidade</h3>
                      <p className="text-white/60 text-xs leading-relaxed">
                        Faz parte de algo maior
                      </p>
                    </motion.div>

                  </div>
                </div>

                {/* Stats Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-6 flex justify-center gap-8"
                >
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                        <stat.icon className="w-5 h-5 text-vermelho" />
                      </div>
                      <div>
                        <p className="font-bold text-charcoal">{stat.value}</p>
                        <p className="text-xs text-charcoal/50">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>

              </motion.div>
            ) : (
              /* Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-lg mx-auto"
              >
                <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-2xl shadow-charcoal/10 border border-white/50 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/30"
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
                      Bem-vindo à família!
                    </h2>
                    <p className="text-charcoal/60 text-lg mb-8 leading-relaxed">
                      Estamos super felizes por te ter connosco. Em breve vais receber novidades incríveis no teu email!
                    </p>

                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-vermelho to-vermelho-soft text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-vermelho/30 transition-all"
                    >
                      Explorar o Site
                      <ArrowRight className="w-5 h-5" />
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-charcoal/30 text-xs">
          &copy; {new Date().getFullYear()} Olha que Duas. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
