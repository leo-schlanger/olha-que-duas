/**
 * Title/description/OG of the fixed routes: ONE source for the pages (useMetaTags)
 * and middleware.ts (crawlers), so they never diverge again (qa r4, 20/11/2026).
 * The middleware may still swap the image for a live one (/galeria, /programas).
 */
export interface RouteMeta {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

/** Interview albums moved to Programas › Entrevistas (20/11/2026): old /galeria slug -> new path. */
export const MOVED_ALBUMS: Record<string, string> = {
  "senhor-televisao-carlos-cruz-20260920": "/programas/entrevistas/carlos-cruz-senhor-televisao",
  "helena-isabel-20260707": "/programas/entrevistas/helena-isabel",
};

export const SITE_URL = "https://www.olhaqueduas.com";

export const ROUTE_META: Record<string, RouteMeta> = {
  "/noticias": {
    title: "Notícias",
    description: "Acompanhe as principais notícias de política, empreendedorismo, comunicação e acontecimentos em Portugal, Brasil e no mundo. Olha que Duas - Informação com propósito.",
  },
  "/galeria": {
    title: "Galeria",
    description: "Explore a nossa galeria de fotos de entrevistas, eventos e bastidores do Olha que Duas. Momentos especiais capturados em imagens.",
  },
  "/kids": {
    title: "Kids — Espaço Infantil de Rádio, Música e Histórias",
    description: "O espaço Kids do Olha que Duas já está no ar! Um espaço exclusivo para crianças, com música, histórias, brincadeiras e o programa \"O Cantinho da Pequenada com a Leonor\". Conteúdo seguro e educativo para toda a família.",
    image: "https://www.olhaqueduas.com/og-kids.jpg",
    imageAlt: "Olha que Duas Kids — Espaço infantil com música e histórias",
  },
  "/rockinrio": {
    title: "Rock in Rio Lisboa 2026 — A Nossa Recordação",
    description: "A Olha que Duas foi parceira oficial do Rock in Rio Lisboa 2026. Reviva connosco os 4 dias de festival — lineup completo, palcos e a nossa galeria de fotos. 20, 21, 27 e 28 de Junho, Parque Tejo.",
    image: "https://www.olhaqueduas.com/og-rockinrio.jpg",
    imageAlt: "Olha que Duas x Rock in Rio Lisboa 2026 — Parceiro Oficial",
  },
  "/auditoria-gratuita": {
    title: "Auditoria Gratuita de Comunicação",
    description: "Descubra em 15 minutos o que está a travar o crescimento da sua marca — e como resolvê-lo. Análise gratuita de presença digital, redes sociais e estratégia de comunicação. Sem compromisso.",
    image: "https://www.olhaqueduas.com/og-auditoria.jpg",
    imageAlt: "Olha que Duas — Auditoria Gratuita de Comunicação: A sua marca tem potencial, falta-lhe voz.",
  },
  "/faq": {
    title: "Perguntas Frequentes (FAQ)",
    description: "Encontre respostas para as perguntas mais frequentes sobre a aplicação Olha que Duas. Saiba como usar a rádio, configurar lembretes, gerir a sua conta e muito mais.",
  },
  "/newsletter": {
    title: "Newsletter",
    description: "Subscreva a newsletter do Olha que Duas e receba em primeira mão novidades exclusivas, descontos especiais e conteúdo que não partilhamos em mais lado nenhum.",
  },
  "/privacidade": {
    title: "Política de Privacidade",
    description: "Política de Privacidade do Olha que Duas. Saiba como recolhemos, utilizamos e protegemos os seus dados pessoais em conformidade com o RGPD.",
  },
  "/termos": {
    title: "Termos de Utilização",
    description: "Termos de Utilização do Olha que Duas. Ao utilizar os nossos serviços, concorda com estes termos. Leia atentamente antes de continuar.",
  },
  "/servicos": {
    title: "Serviços de comunicação para negócios",
    description: "Consultoria de comunicação, gestão de redes sociais, anúncios na rádio e reels para o seu negócio. Agência com rádio própria. Peça um orçamento à medida.",
    image: "https://www.olhaqueduas.com/og-image.jpg",
    imageAlt: "Olha que Duas — comunicação para negócios: redes, rádio e vídeo",
  },
  "/programas": {
    title: "Programas",
    description: "Os programas do Olha que Duas: notícias, biografias, opinião e reflexão, com Alexandra Serra, Marluce Revorêdo e a redação.",
    imageAlt: "Programas Olha que Duas",
  },
};

/** Meta for a fixed route, with its canonical URL (no trailing slash). */
export function routeMeta(path: string): RouteMeta & { url: string } {
  return { ...ROUTE_META[path], url: `${SITE_URL}${path}` };
}
