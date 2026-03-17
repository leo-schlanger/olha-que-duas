import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, Sparkles, Gift, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewsletterSignup } from '@/hooks/useNewsletterSignup';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { signup, loading } = useNewsletterSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const result = await signup(email);

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

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-vermelho via-vermelho to-vermelho-soft" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-amarelo/20 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/5 to-transparent rounded-full" />

        {/* Floating icons */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[15%] w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <Mail className="w-6 h-6 text-white/60" />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-[10%] w-14 h-14 bg-amarelo/30 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <Gift className="w-7 h-7 text-white/80" />
        </motion.div>
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-[20%] w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5 text-amarelo" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          {!isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
              >
                <span className="w-2 h-2 bg-amarelo rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium">Newsletter Exclusiva</span>
              </motion.div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
                Junta-te à Nossa{' '}
                <span className="text-amarelo">Comunidade</span>
              </h2>

              {/* Description */}
              <p className="text-white/80 text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Recebe <span className="text-amarelo font-semibold">novidades em primeira mão</span>,
                descontos exclusivos dos nossos parceiros e conteúdo que não partilhamos em mais lado nenhum.
              </p>

              {/* Benefits pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {['Novidades Exclusivas', 'Descontos & Promoções', 'Convites VIP', 'Bastidores'].map((benefit, index) => (
                  <motion.span
                    key={benefit}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    className="bg-white/10 backdrop-blur-sm text-white/90 text-xs sm:text-sm px-4 py-2 rounded-full border border-white/10"
                  >
                    {benefit}
                  </motion.span>
                ))}
              </div>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
              >
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                  <Input
                    type="email"
                    placeholder="Introduz o teu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 pr-4 bg-white border-0 rounded-2xl text-charcoal placeholder:text-charcoal/40 text-base shadow-xl shadow-black/10 focus:ring-4 focus:ring-amarelo/30"
                    disabled={loading}
                    required
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 px-8 bg-charcoal hover:bg-charcoal/90 text-white font-semibold rounded-2xl shadow-xl shadow-black/20 transition-all duration-300 text-base w-full sm:w-auto"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Subscrever
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              {/* Privacy note */}
              <p className="text-white/50 text-xs mt-6">
                Sem spam, prometemos. Cancela quando quiseres.
              </p>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-amarelo" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                Bem-vindo à família!
              </h3>
              <p className="text-white/80 text-lg">
                Em breve vais receber novidades incríveis no teu email.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
