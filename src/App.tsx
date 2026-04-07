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

// Lazy load pages (except Index which is the landing page)
const Servicos = lazy(() => import("./pages/Servicos"));
const Viagens = lazy(() => import("./pages/Viagens"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Gallery = lazy(() => import("./pages/Gallery"));
const GalleryAlbum = lazy(() => import("./pages/GalleryAlbum"));
const Vendas = lazy(() => import("./pages/Vendas"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 rounded-2xl bg-vermelho/10 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-vermelho" />
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
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
        {/* Cookie Consent Banner */}
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
