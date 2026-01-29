import { Instagram, Facebook, Heart } from "lucide-react";
import logo from "@/assets/logo-olha-que-duas.jpg";

const quickLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre Nós" },
  { href: "#podcast", label: "Podcast" },
  { href: "#servicos", label: "Serviços" },
  { href: "#contacto", label: "Contacto" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img src={logo} alt="Olha que Duas" className="h-16 w-auto rounded-lg mb-4" />
            <p className="text-primary-foreground/70 leading-relaxed">
              Comunicação, Voz e Negócios com Propósito. Onde o feminino é força, 
              a comunicação é ponte e o afeto é estratégia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Links Rápidos</h4>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-primary-foreground/70 hover:text-amarelo transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Segue-nos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/olhaqueduas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center hover:bg-amarelo hover:text-foreground transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/17npXT7nNb/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center hover:bg-amarelo hover:text-foreground transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Olha que Duas. Todos os direitos reservados.
            </p>
            <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-vermelho fill-current" /> em Portugal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
