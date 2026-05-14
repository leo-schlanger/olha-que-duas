import { Instagram, Facebook, Heart, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-olha-que-duas.webp";
import { siteConfig } from "@/config/site";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-beige-dark to-charcoal text-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-32 bg-vermelho/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-24 bg-amarelo/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            {/* Logos side by side */}
            <div className="flex items-center gap-4 md:gap-5 mb-4">
              <img
                src={logo}
                alt={siteConfig.info.name}
                className="h-24 md:h-28 w-auto"
                loading="lazy"
              />
              {siteConfig.rockInRio.enabled && (
                <a
                  href={siteConfig.rockInRio.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative shrink-0"
                >
                  <div
                    className="absolute -inset-2 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"
                    style={{ background: "linear-gradient(135deg, hsla(217,85%,55%,0.5), hsla(0,75%,50%,0.4))" }}
                  />
                  <div
                    className="relative rounded-xl p-2.5 md:p-3 border border-white/20 group-hover:border-white/40 transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, hsl(217 85% 35%), hsl(0 70% 38%))" }}
                  >
                    <img
                      src={siteConfig.rockInRio.partnerLogo}
                      alt={siteConfig.rockInRio.partnerName}
                      className="h-14 md:h-16 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-white whitespace-nowrap shadow-md"
                      style={{ background: "linear-gradient(90deg, hsl(217 85% 50%), hsl(0 75% 48%))" }}
                    >
                      Parceiro Oficial
                    </span>
                  </div>
                </a>
              )}
            </div>
            <p className="text-cream/60 text-sm md:text-base text-center md:text-left max-w-xs leading-relaxed">
              {siteConfig.info.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-col items-center md:items-start gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-amarelo mb-1">Navegação</span>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2">
              {siteConfig.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-cream/60 hover:text-amarelo transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Social + App */}
          <div className="flex flex-col items-center md:items-end gap-5">
            {/* App badge */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-amarelo">Descarrega a App</span>
              <a
                href={siteConfig.app.androidUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Disponível no Google Play"
                className="inline-block transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="/badges/google-play-pt.png"
                  alt="Disponível no Google Play"
                  width={124}
                  height={48}
                  className="h-12 w-auto"
                  loading="lazy"
                />
              </a>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-amarelo">Redes Sociais</span>
              <div className="flex gap-2">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (abre numa nova aba)"
                className="w-11 h-11 bg-cream/10 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube (abre numa nova aba)"
                className="w-11 h-11 bg-cream/10 rounded-xl flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all duration-300 shadow-sm"
              >
                <Youtube className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook (abre numa nova aba)"
                className="w-11 h-11 bg-cream/10 rounded-xl flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok (abre numa nova aba)"
                className="w-11 h-11 bg-cream/10 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
              >
                <TikTokIcon className="w-4 h-4" aria-hidden="true" />
              </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cream/10 pt-8">
          {/* Legal Links */}
          <div className="flex justify-center gap-6 mb-6">
            <Link
              to="/faq"
              className="text-cream/40 hover:text-amarelo transition-colors text-sm"
            >
              Ajuda (FAQ)
            </Link>
            <span className="text-cream/20">•</span>
            <Link
              to="/privacidade"
              className="text-cream/40 hover:text-amarelo transition-colors text-sm"
            >
              Política de Privacidade
            </Link>
            <span className="text-cream/20">•</span>
            <Link
              to="/termos"
              className="text-cream/40 hover:text-amarelo transition-colors text-sm"
            >
              Termos de Utilização
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-cream/30 text-sm">
              © {new Date().getFullYear()} {siteConfig.info.name}. Todos os direitos reservados.
            </p>
            <p className="text-cream/30 text-sm flex items-center gap-1.5">
              Feito com{" "}
              <Heart className="w-3.5 h-3.5 text-vermelho fill-current animate-pulse" /> em
              Portugal
              <span className="mx-2 opacity-30">•</span>
              <a
                href={siteConfig.info.developerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amarelo transition-colors underline-offset-2 hover:underline"
              >
                Por {siteConfig.info.developerName}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
