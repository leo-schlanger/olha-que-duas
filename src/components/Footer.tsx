import { Instagram, Facebook, Heart } from "lucide-react";
import logo from "@/assets/logo-olha-que-duas.png";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const quickLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#podcast", label: "Podcast" },
  { href: "#contacto", label: "Contacto" },
];

const Footer = () => {
  return (
    <footer className="bg-beige-dark text-cream">
      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={logo}
              alt="Olha que Duas"
              className="h-10 md:h-12 w-auto rounded-lg mb-3"
            />
            <p className="text-cream/70 text-xs md:text-sm text-center md:text-left max-w-xs leading-relaxed">
              Comunicação, Voz e Negócios com Propósito.
            </p>
          </div>

          {/* Quick Links - Horizontal on mobile */}
          <nav className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-cream/70 hover:text-amarelo transition-colors text-xs md:text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex justify-center md:justify-start gap-2">
            <a
              href="https://www.instagram.com/olhaqueduas2025"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-cream/10 rounded-lg flex items-center justify-center hover:bg-amarelo hover:text-charcoal transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/share/17npXT7nNb/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-cream/10 rounded-lg flex items-center justify-center hover:bg-amarelo hover:text-charcoal transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@olha.que.duas_?_r=1&_t=ZG-93XRaLNGROL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-cream/10 rounded-lg flex items-center justify-center hover:bg-amarelo hover:text-charcoal transition-all"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-cream/40 text-xs">
              © {new Date().getFullYear()} Olha que Duas
            </p>
            <p className="text-cream/40 text-xs flex items-center gap-1">
              Feito com{" "}
              <Heart className="w-3 h-3 text-vermelho fill-current" /> em
              Portugal
              <span className="mx-2 opacity-50">•</span>
              <a
                href="https://leoschlanger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amarelo transition-colors"
              >
                Por Leo Schlanger *(Clique aqui para ver o meu trabalho)
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
