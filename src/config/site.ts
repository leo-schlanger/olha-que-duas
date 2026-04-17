/**
 * Configuração centralizada do site
 * Todas as variáveis que podem mudar frequentemente estão aqui
 */

export const siteConfig = {
  // Informações de contato
  contact: {
    email: "olhaqueduas.assessoria@gmail.com",
  },

  // Links de redes sociais
  social: {
    instagram: "https://www.instagram.com/olhaqueduas2025",
    facebook: "https://www.facebook.com/share/17npXT7nNb/",
    tiktok: "https://www.tiktok.com/@olha.que.duas_?_r=1&_t=ZG-93XRaLNGROL",
    youtube: "https://youtube.com/@olhaqueduas-l9m?si=hKFnzKpluIODLFFk",
  },

  // Links de navegação
  navLinks: [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "/servicos", label: "Serviços", isRoute: true },
    { href: "#radio", label: "Rádio" },
    { href: "/viagens", label: "Viagens", isRoute: true },
    { href: "/noticias", label: "Notícias", isRoute: true },
    { href: "/galeria", label: "Trabalhos", isRoute: true },
    { href: "/loja", label: "Loja", isRoute: true },
    { href: "/kids", label: "Kids", isRoute: true },
  ],

  // App móvel
  app: {
    androidPackage: "com.olhaqueduas.app",
    androidUrl: "https://play.google.com/store/apps/details?id=com.olhaqueduas.app",
    iosAvailable: false, // Em breve
    iosUrl: "",
  },

  // Informações gerais
  info: {
    name: "Olha que Duas",
    tagline: "Comunicação, Voz e Negócios com Propósito.",
    developerName: "Leo Schlanger",
    developerUrl: "https://leoschlanger.com",
  },

  // Vídeo de apresentação
  video: {
    youtubeId: "Lfl2DttvXK0",
    url: "https://www.youtube.com/watch?v=Lfl2DttvXK0",
    title: "Conheça Olha que Duas",
  },

  // Rádio / Stream - AzuraCast
  radio: {
    name: "Rádio Olha que Duas",
    // URL do stream AzuraCast
    streamUrl: "https://radio.olhaqueduas.com/listen/olha_que_duas/radio.mp3",
    isLive: true, // Rádio ativa
    tagline: "A sua companhia, 24 horas por dia",
    /**
     * Padrões de nomes de playlist (case-insensitive, parcial) que devem
     * ser tratados como ANÚNCIO/DESTAQUE no player — mostram capa + título
     * sem artista/álbum.
     *
     * Adicionar aqui sempre que criares uma playlist no AzuraCast cujo
     * conteúdo seja institucional (vinhetas longas, identidades de programa,
     * promos especiais, etc) em vez de música regular.
     *
     * Exemplos que cobrem o setup actual:
     *  - "Especiais Infantil - Abertura/Identidade/Fecho" → bate "Especiais"
     *  - "Anúncios Eventos" → bate "Anúncios"
     */
    announcementPlaylists: [
      "Especiais Infantil",  // cobre Abertura/Identidade/Fecho (54/55/56)
      // NÃO incluir "Especial" genérico — "Especial do Dia" é rotation
      // de música real, não anúncio.
    ],
  },

  // Parceiros
  partners: [
    {
      name: "Oriflame",
      logo: "/partners/oriflame.jpg",
      url: "https://shop.oriflame.com/PT-alexandraserra/bGOLVwKh5",
    },
    {
      name: "O Boticário",
      logo: "/partners/boticario2.jpg",
      url: "#",
    },
    {
      name: "Geek & Toys",
      logo: "/partners/geektoys.jpg",
      url: "https://www.geeketoys.com.br/",
    },
    {
      name: "Nortravel",
      logo: "/partners/nortravel.jpg",
      url: "#",
    },
    {
      name: "Casa da Guia",
      logo: "/partners/casadaguia.jpg",
      url: "https://casadaguiacascais.pt/",
    },
    {
      name: "R.Rodyner Gallery",
      logo: "/partners/rrodynergallery.jpg",
      url: "https://www.instagram.com/rrodynergallery/",
    },
  ],
} as const;
