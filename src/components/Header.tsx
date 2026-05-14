import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Youtube, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import logo from "@/assets/logo-olha-que-duas.webp";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import RockInRioBanner from "./RockInRioBanner";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const location = useLocation();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section based on scroll position
      const sections = ["inicio", "sobre", "radio", "contacto"];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if link is active
  const isLinkActive = (href: string, isRoute?: boolean) => {
    if (isRoute) {
      return location.pathname === href;
    }
    // For hash links
    const sectionId = href.replace("#", "");
    return location.pathname === "/" && activeSection === sectionId;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      {/* Rock in Rio Lisboa — announcement banner */}
      <RockInRioBanner />

      <div className={cn(
        "container mx-auto px-4 sm:px-6 transition-all duration-500",
        isScrolled ? "py-2" : "py-3 md:py-4"
      )}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 group"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img
              src={logo}
              alt="Olha que Duas"
              width={80}
              height={80}
              className={cn(
                "w-auto shrink-0 object-contain transition-all duration-300 group-hover:scale-105",
                isScrolled ? "h-14 md:h-16" : "h-16 md:h-20"
              )}
              loading="eager"
              fetchPriority="high"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-full px-2 py-1 border border-border/50">
            {siteConfig.navLinks.map((link) => {
              const isRoute = "isRoute" in link && link.isRoute;
              const isActive = isLinkActive(link.href, isRoute);

              return isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                    isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-0 bg-primary/10 rounded-full -z-10" />
                  )}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                    isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-0 bg-primary/10 rounded-full -z-10 animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-vermelho/10 border border-vermelho/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Radio className="w-3.5 h-3.5 text-vermelho" />
              <span className="text-xs font-semibold text-vermelho">AO VIVO</span>
            </div>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 btn-magnetic"
            >
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <Youtube className="w-4 h-4" />
                YouTube
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90 btn-shine btn-magnetic"
            >
              <Link to="/#contacto">Fale Connosco</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full transition-colors",
                  isScrolled ? "text-foreground" : "text-foreground"
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-80 p-0 bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader className="p-6 pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-left">
                    <img src={logo} alt="Olha que Duas" className="h-12" loading="eager" />
                  </SheetTitle>
                  {/* Live badge mobile */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-vermelho/10 border border-vermelho/20">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-semibold text-vermelho">AO VIVO</span>
                  </div>
                </div>
              </SheetHeader>
              <nav className="flex flex-col p-4 gap-1">
                {siteConfig.navLinks.map((link, index) => {
                  const isRoute = "isRoute" in link && link.isRoute;
                  const isActive = isLinkActive(link.href, isRoute);

                  return isRoute ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-300",
                        "hover:bg-primary/5",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:text-foreground"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      key={link.href}
                      to={`/${link.href}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-300",
                        "hover:bg-primary/5",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:text-foreground"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 border-primary/50 text-primary hover:bg-primary hover:text-white rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    <a
                      href={siteConfig.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Youtube className="w-4 h-4" />
                      Ver no YouTube
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl btn-shine"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/#contacto">Fale Connosco</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
