import { Instagram, Facebook, Heart, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-olha-que-duas.png";
import { siteConfig } from "@/config/site";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

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
            <img
              src={logo}
              alt={siteConfig.info.name}
              className="h-24 md:h-28 w-auto mb-4"
            />
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

          {/* Social */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-amarelo mb-1">Redes Sociais</span>
            <div className="flex gap-2">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 rounded-xl flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all duration-300 shadow-sm"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 rounded-xl flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
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
