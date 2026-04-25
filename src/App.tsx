import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { SkipToContent } from "./components/SkipToContent";
import { CookieConsent } from "./components/CookieConsent";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy load pages (except Index which is the landing page)
const Servicos = lazy(() => import("./pages/Servicos"));
const Viagens = lazy(() => import("./pages/Viagens"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Gallery = lazy(() => import("./pages/Gallery"));
const GalleryAlbum = lazy(() => import("./pages/GalleryAlbum"));
const Vendas = lazy(() => import("./pages/Vendas"));
const Kids = lazy(() => import("./pages/Kids"));
const KidsStories = lazy(() => import("./pages/KidsStories"));
const KidsGames = lazy(() => import("./pages/KidsGames"));
const KidsQuiz = lazy(() => import("./pages/KidsQuiz"));
const KidsMemory = lazy(() => import("./pages/KidsMemory"));
const KidsPacman = lazy(() => import("./pages/KidsPacman"));
const KidsSnake = lazy(() => import("./pages/KidsSnake"));
// const KidsKaraoke = lazy(() => import("./pages/KidsKaraoke")); — standby
const Newsletter = lazy(() => import("./pages/Newsletter"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Auditoria = lazy(() => import("./pages/Auditoria"));
const NotFound = lazy(() => import("./pages/NotFound"));

/**
 * Skeleton para páginas em lazy-load. Mostra um esqueleto aproximado da
 * página típica (header + hero + body) em vez de div vazio — reduz layout
 * shift quando a página real monta. min-h-screen garante que o footer não
 * salta para cima durante o load.
 */
const PageLoader = () => (
  <div className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
    {/* Header placeholder */}
    <div className="h-16 md:h-20 border-b border-border/50 bg-cream/5 backdrop-blur-sm" />
    {/* Hero placeholder */}
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-4 w-24 mx-auto bg-cream/10 rounded animate-pulse" />
        <div className="h-12 md:h-16 bg-cream/10 rounded-xl animate-pulse" />
        <div className="h-4 w-3/4 mx-auto bg-cream/10 rounded animate-pulse" />
        <div className="h-4 w-2/3 mx-auto bg-cream/10 rounded animate-pulse" />
      </div>
      {/* Spinner discreto no centro */}
      <div className="flex justify-center mt-12">
        <Loader2 className="w-8 h-8 animate-spin text-vermelho/60" />
        <span className="sr-only">A carregar página…</span>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SkipToContent />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/viagens" element={<Viagens />} />
              <Route path="/noticias" element={<Blog />} />
              <Route path="/noticias/:slug" element={<BlogPost />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/galeria/:slug" element={<GalleryAlbum />} />
              <Route path="/loja" element={<Vendas />} />
              <Route path="/kids" element={<Kids />} />
              <Route path="/kids/historias" element={<KidsStories />} />
              {/* <Route path="/kids/karaoke" element={<KidsKaraoke />} /> — standby until embed works */}
              <Route path="/kids/jogos" element={<KidsGames />} />
              <Route path="/kids/jogos/quiz" element={<KidsQuiz />} />
              <Route path="/kids/jogos/memoria" element={<KidsMemory />} />
              <Route path="/kids/jogos/pacman" element={<KidsPacman />} />
              <Route path="/kids/jogos/snake" element={<KidsSnake />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/privacidade" element={<PrivacyPolicy />} />
              <Route path="/termos" element={<TermsOfService />} />
              <Route path="/auditoria-gratuita" element={<Auditoria />} />
              <Route path="/faq" element={<FAQ />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
        {/* WhatsApp Channel Float */}
        <WhatsAppFloat />
        {/* Cookie Consent Banner */}
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
