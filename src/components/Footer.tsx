import { Instagram, Facebook, Heart } from "lucide-react";
import logo from "@/assets/logo-olha-que-duas.jpg";

const quickLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#podcast", label: "Podcast" },
  { href: "#contacto", label: "Contacto" },
];

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white">
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
            <p className="text-white/50 text-xs md:text-sm text-center md:text-left max-w-xs leading-relaxed">
              Comunicação, Voz e Negócios com Propósito.
            </p>
          </div>

          {/* Quick Links - Horizontal on mobile */}
          <nav className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/50 hover:text-amarelo transition-colors text-xs md:text-sm"
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
              className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amarelo hover:text-charcoal transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/share/17npXT7nNb/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amarelo hover:text-charcoal transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} Olha que Duas
            </p>
            <p className="text-white/30 text-xs flex items-center gap-1">
              Feito com{" "}
              <Heart className="w-3 h-3 text-vermelho fill-current" /> em
              Portugal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
