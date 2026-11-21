import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import { SkipToContent } from "./components/SkipToContent";
import { ErrorBoundary } from "./components/ErrorBoundary";
import RockInRioOverlay from "./components/RockInRioOverlay";
import { SeasonalOverlaySlot } from "./components/seasonal";
import { prefetchVinagrePost } from "./hooks/useVinagrePosts";
import { useAfterLoad } from "./hooks/useAfterLoad";

// Fixed overlays that never paint on first load: own chunks, off the entry
// (perf, 21/11/2026). The radix <Toaster /> was mounted here with no caller of
// its toast(); sonner is the one in use. TooltipProvider left
// too: no <Tooltip> anywhere, and it pulled radix-tooltip + floating-ui in.
const Sonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));
const PWAInstallPrompt = lazy(() => import("./components/PWAInstallPrompt").then((m) => ({ default: m.PWAInstallPrompt })));
const CookieConsent = lazy(() => import("./components/CookieConsent").then((m) => ({ default: m.CookieConsent })));
const WhatsAppFloat = lazy(() => import("./components/WhatsAppFloat").then((m) => ({ default: m.WhatsAppFloat })));

// Lazy load pages (except Index which is the landing page)
const Servicos = lazy(() => import("./pages/Servicos"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Gallery = lazy(() => import("./pages/Gallery"));
const GalleryAlbum = lazy(() => import("./pages/GalleryAlbum"));
// Histórias em episódios — em standby temporário (páginas mantidas no repo)
// const Stories = lazy(() => import("./pages/Stories"));
// const StoryDetail = lazy(() => import("./pages/StoryDetail"));
// const StoryEpisode = lazy(() => import("./pages/StoryEpisode"));
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
const RockInRio = lazy(() => import("./pages/RockInRio"));
const Exclusivo = lazy(() => import("./pages/Exclusivo"));
const ExclusivoPrograma = lazy(() => import("./pages/ExclusivoPrograma"));
const ExclusivoPost = lazy(() => import("./pages/ExclusivoPost"));
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

/** /exclusivo/... (old name of Programas, 20/11/2026) -> /programas/... */
const LegacyProgramasRedirect = () => {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={`${pathname.replace(/^\/exclusivo/i, "/programas")}${search}${hash}`} replace />;
};

/** PWA prompt, WhatsApp button and cookie banner: fixed, mounted after load (useAfterLoad). */
const DeferredOverlays = () => {
  const ready = useAfterLoad();
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <PWAInstallPrompt />
      <WhatsAppFloat />
      <CookieConsent />
    </Suspense>
  );
};

const queryClient = new QueryClient();

// A piece's text is its LCP: start its query now, in parallel with the route chunk.
prefetchVinagrePost(queryClient, window.location.pathname);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={null}>
      <Sonner />
    </Suspense>
    <BrowserRouter>
      <SkipToContent />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/noticias" element={<Blog />} />
            <Route path="/noticias/:slug" element={<BlogPost />} />
            <Route path="/programas" element={<Exclusivo />} />
            <Route path="/programas/:programSlug" element={<ExclusivoPrograma />} />
            <Route path="/programas/:programSlug/:postSlug" element={<ExclusivoPost />} />
            {/* Old addresses (Vercel answers 301 first; these cover in-app links) */}
            <Route path="/exclusivo/*" element={<LegacyProgramasRedirect />} />
            <Route path="/viagens" element={<Navigate to="/" replace />} />
            <Route path="/loja" element={<Navigate to="/" replace />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/galeria/:slug" element={<GalleryAlbum />} />
            {/* Histórias em episódios — em standby temporário
            <Route path="/historias" element={<Stories />} />
            <Route path="/historias/:storySlug" element={<StoryDetail />} />
            <Route path="/historias/:storySlug/:episodeNumber" element={<StoryEpisode />} />
            */}
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
            <Route path="/rockinrio" element={<RockInRio />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {/* Rock in Rio Lisboa — festival overlay (global) */}
      <RockInRioOverlay />
      {/* Seasonal overlay (Natal: snowfall), self-expiring */}
      <SeasonalOverlaySlot />
      <DeferredOverlays />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
