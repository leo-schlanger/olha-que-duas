import { Smartphone, Bell, Radio, Headphones, Sparkles, Apple, Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import logo from "@/assets/logo-olha-que-duas.png";

// Badge oficial Google Play (PT) — servido localmente para performance
// Guidelines: https://partnermarketinghub.withgoogle.com/brands/google-play/visual-identity/badge-guidelines/
const GOOGLE_PLAY_BADGE = "/badges/google-play-pt.png";

const features = [
  { icon: Radio, text: "Rádio ao vivo 24/7 sempre contigo" },
  { icon: Bell, text: "Notificações dos novos programas" },
  { icon: Headphones, text: "Podcasts e episódios em destaque" },
  { icon: Sparkles, text: "Experiência otimizada para telemóvel" },
];

const AppDownload = () => {
  // QR Code apontando para a Play Store (gerado pelo serviço público qrserver.com)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
    siteConfig.app.androidUrl
  )}`;

  return (
    <section
      id="app"
      className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-charcoal via-charcoal to-[#1a1416]"
    >
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(180,41,43,0.18) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — Phone mockup */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              {/* Glow behind phone */}
              <div
                className="absolute -inset-10 rounded-full blur-3xl opacity-60"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(180,41,43,0.15) 50%, transparent 80%)",
                }}
              />

              {/* Phone frame */}
              <div className="relative w-[260px] sm:w-[280px] md:w-[300px] aspect-[9/19] rounded-[2.8rem] bg-gradient-to-b from-zinc-800 to-zinc-900 p-3 shadow-2xl shadow-black/60 border border-zinc-700/50">
                {/* Inner screen */}
                <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-gradient-to-b from-vermelho via-charcoal to-charcoal">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl z-10" />

                  {/* Status bar */}
                  <div className="relative z-0 flex items-center justify-between px-6 pt-3 text-[10px] text-cream/80 font-medium">
                    <span>9:41</span>
                    <span>•••</span>
                  </div>

                  {/* App content */}
                  <div className="flex flex-col items-center justify-center h-full pb-12 px-6 -mt-4">
                    <div className="bg-cream/5 backdrop-blur-sm rounded-2xl p-4 border border-cream/10 mb-4">
                      <img
                        src={logo}
                        alt="Olha que Duas App"
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                    <div className="text-cream text-center">
                      <div className="text-xs uppercase tracking-widest text-amarelo mb-1">
                        Em direto
                      </div>
                      <div className="font-display text-xl font-semibold mb-3">
                        Rádio Olha que Duas
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-cream/60 mb-6">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        AO VIVO • 24/7
                      </div>

                      {/* Fake play button */}
                      <div className="w-14 h-14 mx-auto rounded-full bg-vermelho flex items-center justify-center shadow-lg shadow-vermelho/50">
                        <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-cream ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating "NOVO" badge */}
              <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 bg-gradient-to-r from-amarelo to-amarelo-soft text-charcoal px-4 py-2 rounded-full font-display text-sm font-bold shadow-xl shadow-amarelo/30 rotate-6">
                NOVO
              </div>
            </div>
          </div>

          {/* RIGHT — Content */}
          <div className="text-cream order-1 lg:order-2">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/5 border border-cream/10 backdrop-blur-sm mb-5">
              <Smartphone className="w-3.5 h-3.5 text-amarelo" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-cream/80">
                Disponível agora
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold leading-[1.1] tracking-tight mb-5">
              Leva-nos contigo para{" "}
              <span className="text-amarelo relative inline-block">
                onde fores
                <span className="absolute inset-x-0 -bottom-1 h-3 bg-amarelo/20 -skew-x-3" />
              </span>
            </h2>

            <p className="text-base md:text-lg text-cream/70 leading-relaxed mb-7 max-w-lg">
              A nossa app já está na Google Play. Ouve a rádio, acompanha
              programas e fica por dentro de tudo o que se passa no Olha que
              Duas — a um toque de distância.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature.text} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-vermelho/20 to-amarelo/10 border border-cream/10 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-amarelo" />
                  </div>
                  <span className="text-sm md:text-base text-cream/80">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Badges + QR */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Store badges */}
              <div className="flex flex-col gap-3">
                <a
                  href={siteConfig.app.androidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Descarregar Olha que Duas na Google Play Store"
                  className="inline-block transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-amarelo/50 rounded-lg"
                >
                  <img
                    src={GOOGLE_PLAY_BADGE}
                    alt="Disponível no Google Play"
                    width={155}
                    height={60}
                    className="h-[60px] w-auto"
                    loading="lazy"
                  />
                </a>

                {/* iOS coming soon */}
                <div
                  className="inline-flex items-center gap-2.5 h-[44px] px-4 rounded-lg bg-cream/5 border border-cream/15 text-cream/50 cursor-not-allowed select-none"
                  aria-label="App Store em breve"
                >
                  <Apple className="w-5 h-5" />
                  <div className="leading-tight">
                    <div className="text-[9px] uppercase tracking-wider">Brevemente na</div>
                    <div className="text-sm font-semibold -mt-0.5">App Store</div>
                  </div>
                </div>
              </div>

              {/* QR Code (desktop only) */}
              <div className="hidden sm:flex flex-col items-center gap-2 pl-6 sm:border-l sm:border-cream/10">
                <div className="bg-cream rounded-xl p-2 shadow-lg">
                  <img
                    src={qrUrl}
                    alt="QR code para descarregar a app"
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] block"
                    loading="lazy"
                  />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-cream/50 text-center">
                  Lê com o telemóvel
                </span>
              </div>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-2 mt-6 text-xs text-cream/40">
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span>Gratuita • Português • Sem registo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
