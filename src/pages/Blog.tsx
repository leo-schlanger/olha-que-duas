import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogList } from '@/components/blog/BlogList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';

export default function Blog() {
  // SEO Meta Tags
  useMetaTags({
    title: 'Notícias',
    description: 'Acompanhe as principais notícias de política, empreendedorismo, comunicação e acontecimentos em Portugal, Brasil e no mundo. Olha que Duas - Informação com propósito.',
    url: 'https://www.olhaqueduas.com/noticias',
    jsonLd: getPageBreadcrumbJsonLd('Notícias', 'https://www.olhaqueduas.com/noticias'),
  });

  // Scroll para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-beige-light">
      <Header />

      <main className="flex-1 pt-32 md:pt-40">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-charcoal to-charcoal/90 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Newspaper className="w-8 h-8 text-vermelho" />
                <span className="label-sm text-vermelho">Notícias</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-cream mb-4">
                Últimas Notícias
              </h1>
              <p className="text-lg text-cream/80">
                Acompanhe as principais notícias de política, controvérsias e acontecimentos
                em Portugal, Brasil e no mundo.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao início
                </Button>
              </Link>
            </div>

            <BlogList />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
