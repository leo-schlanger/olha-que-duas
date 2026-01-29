import { Instagram, Facebook, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img 
              src={logo} 
              alt="Olha que Duas" 
              className="h-14 w-auto rounded-lg mb-5" 
            />
            <p className="text-white/60 leading-relaxed text-sm max-w-xs">
              Comunicação, Voz e Negócios com Propósito. Onde o feminino é força, 
              a comunicação é ponte e o afeto é estratégia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Navegação</h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/60 hover:text-amarelo transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Redes Sociais</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/olhaqueduas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amarelo hover:text-charcoal transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/17npXT7nNb/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amarelo hover:text-charcoal transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Olha que Duas. Todos os direitos reservados.
          </p>
          <p className="text-white/40 text-sm flex items-center gap-1.5">
            Feito com <Heart className="w-3.5 h-3.5 text-vermelho fill-current" /> em Portugal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
