import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useMetaTags } from "@/hooks/useMetaTags";

const NotFound = () => {
  const location = useLocation();

  // SEO Meta Tags - noindex para páginas 404
  useMetaTags({
    title: 'Página Não Encontrada',
    description: 'A página que procura não existe ou foi movida. Volte à página inicial do Olha que Duas.',
    noindex: true,
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Página não encontrada</p>
        <p className="mb-6 text-muted-foreground">A página que procura não existe ou foi movida.</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
