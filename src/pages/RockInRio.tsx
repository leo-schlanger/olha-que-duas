import { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Clock, Music, Train, Bus, Car, Ticket,
  ExternalLink, Globe, Radio, Smartphone,
  Star, Users, Navigation, AlertTriangle, X, Info,
  Headphones, ChevronRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useMetaTags } from '@/hooks/useMetaTags';
import { siteConfig } from '@/config/site';

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

interface Artist { name: string; slug: string; headliner?: boolean; photo?: string }
interface Stage { name: string; artists: Artist[] }
interface Day { date: string; weekday: string; label: string; gradient: string; accent: string; accentBg: string; stages: Stage[] }

interface ArtistBio {
  origin: string;
  genre: string;
  since: string;
  bio: string;
  hits: string[];
}

const ARTIST_BIOS: Record<string, ArtistBio> = {
  'katy-perry': { origin: 'EUA', genre: 'Pop', since: '2001', bio: 'Uma das maiores estrelas pop do século XXI. Conhecida pelos espetáculos vibrantes e hits incontornáveis que marcaram toda uma geração.', hits: ['Roar', 'Firework', 'Teenage Dream', 'Dark Horse', 'I Kissed a Girl'] },
  'charlie-puth': { origin: 'EUA', genre: 'Pop', since: '2009', bio: 'Cantor, compositor e produtor com ouvido absoluto. Tornou-se viral nas redes sociais antes de conquistar as tabelas mundiais.', hits: ['Attention', 'See You Again', 'We Don\'t Talk Anymore', 'One Call Away'] },
  'alok': { origin: 'Brasil', genre: 'DJ / Eletrónica', since: '2010', bio: 'Um dos DJs mais populares do mundo. Filho de DJs brasileiros, cresceu rodeado de música eletrónica e hoje lidera festivais por todo o planeta.', hits: ['Hear Me Now', 'Never Let Me Go', 'Alive', 'Don\'t Say Goodbye'] },
  'nena': { origin: 'Alemanha', genre: 'New Wave / Pop', since: '1977', bio: 'Ícone da new wave alemã dos anos 80. O seu mega-hit anti-guerra tornou-se um hino global que atravessa gerações.', hits: ['99 Luftballons', 'Nur geträumt', 'Irgendwie Irgendwo Irgendwann'] },
  'bebe-rexha': { origin: 'EUA', genre: 'Pop', since: '2010', bio: 'Cantora e compositora de origem albanesa. Escreveu hits para Eminem e Rihanna antes de brilhar como artista solo.', hits: ['Meant to Be', 'I\'m a Mess', 'Say My Name', 'I Got You'] },
  'pedro-sampaio': { origin: 'Brasil', genre: 'Funk / DJ', since: '2018', bio: 'DJ e produtor carioca que revolucionou o funk brasileiro. Aos 20 anos já lotava estádios e festivais em todo o Brasil.', hits: ['No Chão Novinha', 'Vai Menina', 'Galopa', 'BEAT CHAMA'] },
  'calema': { origin: 'Portugal / São Tomé', genre: 'Pop / Kizomba', since: '2012', bio: 'Duo luso-são-tomense formado pelos irmãos António e Fradique. Fundem pop, kizomba e sonoridades africanas com enorme sucesso.', hits: ['A Nossa Vez', 'Te Amo', 'Vai', 'Onde Anda'] },
  'napa': { origin: 'Portugal', genre: 'Rap', since: '2019', bio: 'Rapper português da nova geração. Destacou-se no cenário hip-hop nacional com um estilo lírico introspetivo e beats contemporâneos.', hits: ['Freestyle', 'Noites', 'Passo a Passo'] },
  'maninho': { origin: 'Portugal / Angola', genre: 'Afrobeats / Kizomba', since: '2015', bio: 'Artista luso-angolano que mistura kizomba, afrobeats e pop urbana. Voz inconfundível e energia contagiante ao vivo.', hits: ['Tá Bom', 'Vou Te Amar', 'Minha'] },
  'audrey-nuna': { origin: 'EUA', genre: 'R&B / Hip-Hop', since: '2019', bio: 'Artista coreano-americana de New Jersey. Combina rap, R&B e pop alternativo com uma estética visual marcante.', hits: ['damn Right', 'Space', 'Comic Sans', 'Blossom'] },
  'sofia-camara': { origin: 'Portugal', genre: 'Pop', since: '2020', bio: 'Jovem cantora portuguesa que emergiu da nova cena pop nacional. Melodias frescas e letras que falam à geração Z.', hits: ['Não Sei', 'Quero Mais', 'Sozinha'] },

  'linkin-park': { origin: 'EUA', genre: 'Rock Alternativo', since: '1996', bio: 'Uma das bandas mais influentes do nu metal e rock alternativo. Venderam mais de 100 milhões de discos e definiram o som de uma geração.', hits: ['In the End', 'Numb', 'Crawling', 'One Step Closer', 'New Divide'] },
  'cypress-hill': { origin: 'EUA', genre: 'Hip-Hop', since: '1988', bio: 'Grupo pioneiro do hip-hop da costa oeste e do rap latino. Som único que funde hip-hop, rock e influências latinas.', hits: ['Insane in the Brain', 'How I Could Just Kill a Man', 'Hits from the Bong'] },
  'the-pretty-reckless': { origin: 'EUA', genre: 'Rock', since: '2009', bio: 'Banda liderada por Taylor Momsen. Conquistaram o topo das paradas de rock americanas com um som cru e poderoso.', hits: ['Make Me Wanna Die', 'Heaven Knows', 'Going to Hell', 'Death by Rock and Roll'] },
  'grandson': { origin: 'Canadá / EUA', genre: 'Rock Alternativo', since: '2016', bio: 'Artista canadiano-americano com raízes iranianas e turcas. Combina rock, eletrónica e mensagens de ativismo social.', hits: ['Blood // Water', 'Thoughts & Prayers', 'Stigmata', 'Oh No!!!'] },
  'kaiser-chiefs': { origin: 'Reino Unido', genre: 'Indie Rock', since: '2000', bio: 'Banda britânica de Leeds que se tornou num dos nomes maiores do indie rock dos anos 2000. Energia explosiva nos palcos.', hits: ['I Predict a Riot', 'Ruby', 'Oh My God', 'Every Day I Love You Less and Less'] },
  'hoobastank': { origin: 'EUA', genre: 'Rock', since: '1994', bio: 'Banda californiana que marcou o rock dos anos 2000. O seu mega-hit romântico é uma das canções mais reconhecidas da década.', hits: ['The Reason', 'Crawling in the Dark', 'Out of Control', 'Running Away'] },
  'blasted-mechanism': { origin: 'Portugal', genre: 'Rock / Eletrónica', since: '1998', bio: 'Projeto português que funde rock, eletrónica e world music com performances teatrais e visuais únicas.', hits: ['I Want', 'Blasted Empire', 'Come Along'] },
  'sepultura': { origin: 'Brasil', genre: 'Metal', since: '1984', bio: 'Lendas do metal brasileiro e mundial. Pioneiros do thrash/groove metal com influências tribais e percussão brasileira.', hits: ['Roots Bloody Roots', 'Arise', 'Territory', 'Ratamahatta'] },
  'pod': { origin: 'EUA', genre: 'Rock / Nu Metal', since: '1992', bio: 'Banda de San Diego que mistura rock, metal, hip-hop e reggae. Foram um dos pilares do nu metal nos anos 2000.', hits: ['Boom', 'Alive', 'Youth of the Nation', 'Satellite'] },
  'tara-perdida': { origin: 'Portugal', genre: 'Punk Rock', since: '1993', bio: 'Banda punk portuguesa com mais de 30 anos de estrada. Irreverentes e fiéis ao punk rock nacional.', hits: ['Chupem Isso', 'Mentes Destruídas', 'Rua da Mouraria'] },
  'sam-the-kid': { origin: 'Portugal', genre: 'Hip-Hop', since: '1994', bio: 'Um dos MCs e produtores mais respeitados do hip-hop português. Considerado um dos pilares do rap em Portugal.', hits: ['A Luz', 'Sobre(tudo)', 'Entre(tanto)', 'Pratica(mente)'] },
  'orelha-negra': { origin: 'Portugal', genre: 'Eletrónica / Hip-Hop', since: '2010', bio: 'Supergrupo português que junta músicos de hip-hop, jazz e eletrónica. Som eclético e colaborações com grandes nomes da música lusófona.', hits: ['Só Nós Dois', 'Coisas que Eu Bebi', 'Watt'] },

  'rod-stewart': { origin: 'Reino Unido', genre: 'Rock / Pop', since: '1962', bio: 'Um dos maiores cantores de rock e pop de todos os tempos. Com mais de 60 anos de carreira, vendeu mais de 250 milhões de discos.', hits: ['Maggie May', 'Da Ya Think I\'m Sexy?', 'Sailing', 'Have I Told You Lately'] },
  'cyndi-lauper': { origin: 'EUA', genre: 'Pop', since: '1977', bio: 'Ícone pop dos anos 80 e vencedora de Grammy, Emmy e Tony. A sua voz distinta e estilo excêntrico definiram uma era.', hits: ['Girls Just Want to Have Fun', 'Time After Time', 'True Colors', 'She Bop'] },
  '4-non-blondes': { origin: 'EUA', genre: 'Rock Alternativo', since: '1989', bio: 'Banda de San Francisco conhecida pelo mega-hit que se tornou viral décadas depois. Linda Perry, a vocalista, é também uma produtora lendária.', hits: ['What\'s Up?'] },
  'shaggy': { origin: 'Jamaica / EUA', genre: 'Reggae / Dancehall', since: '1993', bio: 'Cantor jamaicano-americano vencedor de dois Grammys. Estilo único que funde reggae, dancehall e pop com hits irresistíveis.', hits: ['It Wasn\'t Me', 'Boombastic', 'Angel', 'Oh Carolina'] },
  'xutos': { origin: 'Portugal', genre: 'Rock', since: '1978', bio: 'A banda de rock mais emblemática de Portugal. Mais de 45 anos de carreira com hinos que todo o país conhece de cor.', hits: ['A Minha Casinha', 'Contentores', 'Homem do Leme', 'Não Sou o Único'] },
  'gnr': { origin: 'Portugal', genre: 'Rock / New Wave', since: '1981', bio: 'Banda do Porto que marcou o rock português com um som eclético que vai do new wave ao fado, sempre com letras inteligentes.', hits: ['Portugal na CEE', 'Dunas', 'Pronúncia do Norte', 'Efectivamente'] },
  'uhf': { origin: 'Portugal', genre: 'Rock', since: '1978', bio: 'Banda pioneira do rock português, de Almada. António Manuel Ribeiro e a sua voz única são um marco da música portuguesa.', hits: ['Rua do Carmo', 'À Minha Maneira', 'Cavalos de Corrida'] },
  'taxi': { origin: 'Portugal', genre: 'Pop Rock', since: '1981', bio: 'Banda portuguesa dos anos 80 liderada por Manuela Azevedo. Pop rock elegante com letras marcantes e melodias que perduram.', hits: ['Chiclete', 'Sozinho', 'Aquela Rapariga'] },
  'jafumega': { origin: 'Portugal', genre: 'Rock / Blues', since: '2010', bio: 'Banda portuguesa com raízes no blues e rock. Energia crua ao vivo e sonoridade que evoca os grandes clássicos do rock.', hits: ['Balada do Desajeitado', 'Castelos de Areia'] },
  'joss-stone': { origin: 'Reino Unido', genre: 'Soul / R&B', since: '2003', bio: 'Cantora britânica de soul com uma voz poderosa que desafia a idade. Estreou-se aos 16 anos e encantou o mundo com talento natural.', hits: ['Fell in Love with a Boy', 'Right to Be Wrong', 'Super Duper Love'] },
  'the-wailers': { origin: 'Jamaica', genre: 'Reggae', since: '1963', bio: 'A lendária banda de Bob Marley. Continuam a levar a mensagem e a música do reggae a todo o mundo, décadas depois.', hits: ['Three Little Birds', 'Get Up Stand Up', 'Is This Love', 'No Woman No Cry'] },
  'belo': { origin: 'Brasil', genre: 'Pagode / R&B', since: '1998', bio: 'Cantor brasileiro de pagode e R&B. Começou no grupo Soweto e construiu uma carreira solo de enorme sucesso no Brasil.', hits: ['Tua Boca', 'Desafio', 'Perfume', 'Derê'] },
  'syro': { origin: 'Portugal', genre: 'Pop / R&B', since: '2019', bio: 'Artista português da nova geração que funde pop, R&B e sonoridades eletrónicas. Voz suave e produção moderna.', hits: ['Neve', 'Perto de Ti', 'Lua'] },

  '21-savage': { origin: 'Reino Unido / EUA', genre: 'Hip-Hop / Trap', since: '2013', bio: 'Rapper nascido em Londres e criado em Atlanta. O seu estilo direto e flows gelados tornaram-no num dos nomes maiores do trap mundial.', hits: ['a lot', 'Bank Account', 'Rockstar', 'redrum'] },
  'central-cee': { origin: 'Reino Unido', genre: 'Rap / Drill', since: '2020', bio: 'Rapper londrino que se tornou num fenómeno global do UK drill e rap. Colaborações com Drake e números de streaming astronómicos.', hits: ['Doja', 'Sprinter', 'Loading', 'Band4Band', 'Obsessed'] },
  'rema': { origin: 'Nigéria', genre: 'Afrobeats', since: '2019', bio: 'Estrela nigeriana do afrobeats que explodiu mundialmente com um hit que dominou o TikTok e as rádios globais.', hits: ['Calm Down', 'Soundgasm', 'Fame', 'Holiday'] },
  'matue': { origin: 'Brasil', genre: 'Rap / Trap', since: '2017', bio: 'Rapper cearense que revolucionou o rap brasileiro com letras criativas, flows únicos e uma estética visual marcante.', hits: ['777-666', 'Quer Voar', 'Kenny G', 'Máquina do Tempo'] },
  'filipe-ret': { origin: 'Brasil', genre: 'Rap', since: '2005', bio: 'Rapper carioca com quase 20 anos de carreira. Começou no underground e hoje é um dos maiores nomes do rap brasileiro.', hits: ['Neurótico', 'Chapa', 'Contatinho', 'Bené'] },
  'dennis': { origin: 'Brasil', genre: 'Funk / DJ', since: '2007', bio: 'DJ e produtor carioca, um dos maiores nomes do funk brasileiro. Os seus bailes e produções lotam estádios pelo Brasil.', hits: ['Vai Dar PT', 'Bota Com Tudo', 'Só Fé'] },
  'carlao': { origin: 'Portugal', genre: 'Hip-Hop / Soul', since: '2003', bio: 'Artista português de hip-hop e soul com raízes cabo-verdianas. Voz grave e presença de palco magnética.', hits: ['De Alma e Coração', 'Fala Só', 'Tempo de Mudar'] },
  'irina-barros': { origin: 'Portugal', genre: 'Pop / Urban', since: '2018', bio: 'Cantora e compositora portuguesa da cena urbana. Funde pop, R&B e influências lusófonas numa proposta fresca e atual.', hits: ['Não Me Toques', 'Café', 'Vem'] },
  'ceelo-green': { origin: 'EUA', genre: 'Soul / Pop', since: '2000', bio: 'Cantor, rapper e produtor de Atlanta. Como metade dos Gnarls Barkley e em carreira solo, criou hits memoráveis do século XXI.', hits: ['Crazy', 'Forget You', 'Bright Lights Bigger City'] },
  'lola-indigo': { origin: 'Espanha', genre: 'Pop / Reggaeton', since: '2018', bio: 'Cantora e bailarina espanhola que saltou de um talent show para o topo das tabelas em Espanha e América Latina.', hits: ['Ya No Quiero Ná', 'El Humo', 'Mala Cara', 'La Niña'] },
};

const A = (name: string, slug: string, headliner?: boolean): Artist => ({
  name, slug, headliner, photo: `/rockinrio/artists/${slug}.jpg`,
});

const LINEUP: Day[] = [
  {
    date: '20 Junho', weekday: 'Sábado', label: 'Pop Day',
    gradient: 'from-pink-600 to-rose-500',
    accent: 'text-pink-400', accentBg: 'bg-pink-500/10 border-pink-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [A('Katy Perry', 'katy-perry', true), A('Charlie Puth', 'charlie-puth'), A('Alok', 'alok'), A('Nena', 'nena')] },
      { name: 'Super Bock Stage', artists: [A('Bebe Rexha', 'bebe-rexha'), A('Pedro Sampaio', 'pedro-sampaio'), A('Calema', 'calema'), A('NAPA', 'napa')] },
      { name: 'Music Valley', artists: [A('Maninho', 'maninho'), A('Audrey Nuna', 'audrey-nuna'), A('Sofia Camara', 'sofia-camara')] },
    ],
  },
  {
    date: '21 Junho', weekday: 'Domingo', label: 'Rock Day',
    gradient: 'from-red-700 to-orange-500',
    accent: 'text-red-400', accentBg: 'bg-red-500/10 border-red-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [A('Linkin Park', 'linkin-park', true), A('Cypress Hill', 'cypress-hill'), A('The Pretty Reckless', 'the-pretty-reckless'), A('Grandson', 'grandson')] },
      { name: 'Music Valley', artists: [A('Kaiser Chiefs', 'kaiser-chiefs'), A('Hoobastank', 'hoobastank'), A('Blasted Mechanism', 'blasted-mechanism')] },
      { name: 'Super Bock Stage', artists: [A('Sepultura', 'sepultura'), A('P.O.D.', 'pod'), A('Tara Perdida', 'tara-perdida')] },
      { name: 'BacanaPlay Digital Stage', artists: [A('Sam the Kid', 'sam-the-kid'), A('Orelha Negra', 'orelha-negra')] },
    ],
  },
  {
    date: '27 Junho', weekday: 'Sábado', label: 'Legends Day',
    gradient: 'from-amber-600 to-yellow-400',
    accent: 'text-amber-400', accentBg: 'bg-amber-500/10 border-amber-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [A('Rod Stewart', 'rod-stewart', true), A('Cyndi Lauper', 'cyndi-lauper'), A('4 Non Blondes', '4-non-blondes'), A('Shaggy', 'shaggy')] },
      { name: 'Music Valley', artists: [A('Xutos & Pontapés', 'xutos'), A('GNR', 'gnr'), A('UHF', 'uhf'), A('Táxi', 'taxi'), A('Jafumega', 'jafumega')] },
      { name: 'Super Bock Stage', artists: [A('Joss Stone', 'joss-stone'), A('The Wailers', 'the-wailers'), A('Belo', 'belo'), A('SYRO', 'syro')] },
    ],
  },
  {
    date: '28 Junho', weekday: 'Domingo', label: 'Urban Day',
    gradient: 'from-violet-600 to-purple-500',
    accent: 'text-violet-400', accentBg: 'bg-violet-500/10 border-violet-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [A('21 Savage', '21-savage', true), A('Central Cee', 'central-cee'), A('Rema', 'rema'), A('Matué', 'matue')] },
      { name: 'Music Valley', artists: [A('Filipe Ret', 'filipe-ret'), A('DENNIS', 'dennis'), A('Carlão', 'carlao'), A('Irina Barros', 'irina-barros')] },
      { name: 'Super Bock Stage', artists: [A('CeeLo Green', 'ceelo-green'), A('Lola Indigo', 'lola-indigo')] },
    ],
  },
];

const STAGES_INFO = [
  { name: 'Palco Mundo', desc: 'O palco principal — os maiores nomes da música mundial', icon: Globe, img: '/rockinrio/palco-mundo.jpg' },
  { name: 'Music Valley', desc: 'Sons diversos, reuniões lendárias e artistas emergentes', icon: Music, img: '/rockinrio/music-valley.jpg' },
  { name: 'Super Bock Stage', desc: 'Rock, metal, alternativo e punk', icon: Radio, img: '/rockinrio/super-bock.jpg' },
  { name: 'BacanaPlay Digital Stage', desc: 'Entretenimento digital, humor e podcasters', icon: Smartphone, img: '/rockinrio/bacanaplay.jpg' },
];

const ATTRACTIONS = [
  { name: 'Roda Gigante', desc: 'Vista panorâmica da Cidade do Rock e do rio Tejo', img: '/rockinrio/roda-gigante.jpg' },
  { name: 'The Flight', desc: 'Acrobacia aérea com avião Rock in Rio', img: '/rockinrio/the-flight.jpg' },
  { name: 'Slide', desc: 'O escorrega gigante da Cidade do Rock', img: '/rockinrio/slide.jpg' },
  { name: 'Rota 85', desc: 'Experiência imersiva de som e luz', img: '/rockinrio/rota-85.jpg' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SEO
   ═══════════════════════════════════════════════════════════════════════════ */

const allPerformers = LINEUP.flatMap(d => d.stages.flatMap(s => s.artists)).map(a => ({ '@type': 'MusicGroup' as const, name: a.name }));

const eventJsonLd = {
  '@context': 'https://schema.org', '@type': 'MusicEvent',
  '@id': 'https://www.olhaqueduas.com/rockinrio#event',
  name: 'Rock in Rio Lisboa 2026',
  description: 'O maior festival de música e entretenimento do mundo. Katy Perry, Linkin Park, Rod Stewart, 21 Savage e dezenas de artistas no Parque Tejo, Lisboa — 20, 21, 27 e 28 de Junho de 2026.',
  startDate: '2026-06-20T13:00:00+01:00', endDate: '2026-06-28T03:00:00+01:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
  location: { '@type': 'Place', name: 'Parque Tejo', address: { '@type': 'PostalAddress', streetAddress: 'Passeio dos Heróis do Mar', addressLocality: 'Lisboa', postalCode: '1990-059', addressCountry: 'PT' }, geo: { '@type': 'GeoCoordinates', latitude: 38.7856, longitude: -9.0929 }, maximumAttendeeCapacity: 80000 },
  performer: allPerformers,
  organizer: { '@type': 'Organization', name: 'Rock in Rio', url: 'https://rockinriolisboa.pt/' },
  sponsor: { '@type': 'Organization', name: 'Olha que Duas', url: 'https://www.olhaqueduas.com' },
  offers: { '@type': 'Offer', url: 'https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', validFrom: '2025-12-01' },
  inLanguage: 'pt', isAccessibleForFree: false,
};

const breadcrumbJsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.olhaqueduas.com' },
  { '@type': 'ListItem', position: 2, name: 'Rock in Rio Lisboa 2026', item: 'https://www.olhaqueduas.com/rockinrio' },
]};

const webPageJsonLd = {
  '@context': 'https://schema.org', '@type': 'WebPage',
  '@id': 'https://www.olhaqueduas.com/rockinrio#webpage',
  url: 'https://www.olhaqueduas.com/rockinrio',
  name: 'Rock in Rio Lisboa 2026 — Parceiro Oficial | Olha que Duas',
  description: 'Lineup completo, palcos, como chegar e bilhetes do Rock in Rio Lisboa 2026. A Olha que Duas é parceira oficial.',
  isPartOf: { '@id': 'https://www.olhaqueduas.com/#website' },
  about: { '@id': 'https://www.olhaqueduas.com/rockinrio#event' },
  primaryImageOfPage: { '@type': 'ImageObject', url: 'https://www.olhaqueduas.com/og-rockinrio.jpg', width: 1200, height: 630 },
  inLanguage: 'pt-PT', datePublished: '2026-05-16', dateModified: '2026-05-17',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.hero-subtitle'] },
};

/* ═══════════════════════════════════════════════════════════════════════════
   LOGO COMPONENT — white RiR logo rotated 90deg, reused everywhere
   ═══════════════════════════════════════════════════════════════════════════ */

const RirLogo = ({ className = '' }: { className?: string }) => (
  <img
    src={siteConfig.rockInRio.partnerLogoWhite}
    alt="Rock in Rio Lisboa"
    className={`rotate-90 ${className}`}
  />
);

/* ═══════════════════════════════════════════════════════════════════════════
   ARTIST MODAL
   ═══════════════════════════════════════════════════════════════════════════ */

const ArtistModal = ({ artist, onClose }: { artist: Artist; onClose: () => void }) => {
  const bio = ARTIST_BIOS[artist.slug];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full sm:max-w-md bg-[#0c0c18] border-t sm:border border-white/[0.08] sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {artist.photo && (
          <div className="aspect-[16/10] relative">
            <img src={artist.photo} alt={artist.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c18] via-[#0c0c18]/20 to-transparent" />
          </div>
        )}

        <div className="p-5 sm:p-6 -mt-10 relative">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">{artist.name}</h3>

          {bio ? (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {bio.genre}
                </span>
                <span className="text-xs text-white/35">
                  <MapPin className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />{bio.origin}
                </span>
                <span className="text-xs text-white/20">·</span>
                <span className="text-xs text-white/35">
                  <Calendar className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />Desde {bio.since}
                </span>
              </div>

              <p className="text-sm text-white/50 leading-relaxed mb-5">{bio.bio}</p>

              {bio.hits.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold mb-2.5">
                    <Headphones className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                    Principais Músicas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {bio.hits.map((hit, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/50">
                        {hit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-white/35">Informação em breve.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSPORT CARD
   ═══════════════════════════════════════════════════════════════════════════ */

const TransportCard = ({ icon: Icon, title, children, badge }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode; badge?: string }) => (
  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 hover:bg-white/[0.03] transition-colors">
    <div className="flex items-start gap-3.5">
      <div className="w-10 h-10 rounded-lg bg-amber-400/[0.06] border border-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-amber-400/60" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <h4 className="font-bold text-white text-sm">{title}</h4>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
              {badge}
            </span>
          )}
        </div>
        <div className="text-sm text-white/40 leading-relaxed space-y-1">
          {children}
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const RockInRio = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  useMetaTags({
    title: 'Rock in Rio Lisboa 2026 — Parceiro Oficial',
    description: 'A Olha que Duas é parceira oficial do Rock in Rio Lisboa 2026. Lineup completo dia a dia: Katy Perry, Linkin Park, Rod Stewart, 21 Savage e +40 artistas. Mapa do Parque Tejo, palcos, transportes e bilhetes. 20, 21, 27 e 28 de Junho.',
    image: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
    imageAlt: 'Olha que Duas x Rock in Rio Lisboa 2026 — Parceiro Oficial',
    url: 'https://www.olhaqueduas.com/rockinrio',
    jsonLd: [eventJsonLd, breadcrumbJsonLd, webPageJsonLd],
  });

  const day = LINEUP[activeDay];

  return (
    <div className="min-h-screen bg-[#060610]">
      <Header />

      {/* ════════════════════════ HERO ════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/rockinrio/hero.jpg" alt="" className="w-full h-full object-cover" loading="eager" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,6,16,0.15) 0%, rgba(6,6,16,0.5) 40%, rgba(6,6,16,0.95) 70%, #060610 100%)' }} />
        </div>

        <div className="relative z-10 w-full">
          <Animated animation="fade-up" delay={150}>
            <div className="flex flex-col items-center pt-28 md:pt-36 pb-10 md:pb-14">
              <div className="flex items-center gap-4 sm:gap-8 md:gap-10">
                <RirLogo className="w-24 sm:w-40 md:w-52 lg:w-56 drop-shadow-[0_4px_40px_rgba(255,255,255,0.12)]" />
                <div className="flex flex-col items-center gap-1.5 self-stretch justify-center">
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <span className="text-white/15 text-lg select-none">&times;</span>
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>
                <img src="/icon-512x512.png" alt="Olha que Duas" className="w-20 sm:w-36 md:w-44 lg:w-48 rounded-full shadow-[0_4px_40px_rgba(180,40,40,0.2)]" />
              </div>
              <div className="mt-5 px-5 py-1.5 rounded-full bg-amber-400/[0.08] border border-amber-400/20">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.3em] text-amber-300/80">
                  <Star className="w-3 h-3 inline-block mr-1.5 -mt-0.5 text-amber-400" fill="currentColor" />
                  Parceiros Oficiais
                  <Star className="w-3 h-3 inline-block ml-1.5 -mt-0.5 text-amber-400" fill="currentColor" />
                </span>
              </div>
            </div>
          </Animated>

          <div className="max-w-4xl mx-auto px-5 pb-20 md:pb-28 text-center">
            <Animated animation="fade-up" delay={300}>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-4">
                Rock in Rio<br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Lisboa 2026</span>
              </h1>
            </Animated>
            <Animated animation="fade-up" delay={420}>
              <p className="hero-subtitle text-sm sm:text-lg md:text-xl text-white/40 max-w-xl mx-auto leading-relaxed mb-8">
                O maior festival de música e entretenimento do mundo.<br className="hidden sm:block" />
                4 dias, 5 palcos, <span className="text-white/60 font-semibold">80 000 pessoas por dia</span>.
              </p>
            </Animated>
            <Animated animation="fade-up" delay={520}>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                {[{ icon: Calendar, label: '20 · 21 · 27 · 28 Jun' }, { icon: MapPin, label: 'Parque Tejo, Lisboa' }, { icon: Clock, label: 'Portas 13h' }].map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.05] border border-white/[0.07] text-[11px] sm:text-sm text-white/40 font-medium">
                    <p.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400/50" />{p.label}
                  </span>
                ))}
              </div>
            </Animated>
            <Animated animation="fade-up" delay={620}>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_4px_24px_rgba(251,191,36,0.25)]">
                  <Ticket className="w-4 h-4" />Comprar Bilhetes<ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
                <a href="#lineup" className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-sm text-white/60 border border-white/[0.12] hover:bg-white/[0.05] hover:text-white/80 transition-all">Ver Lineup</a>
              </div>
            </Animated>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
          <div className="w-5 h-8 rounded-full border border-white/15 flex justify-center pt-1.5"><div className="w-0.5 h-2 rounded-full bg-white/30 animate-bounce" /></div>
        </div>
      </section>

      {/* ════════════════════════ LINEUP POSTER ═══════════════════════ */}
      <section className="py-16 px-5 bg-[#060610]">
        <Animated animation="fade-up">
          <div className="max-w-4xl mx-auto">
            <img src="/rockinrio/lineup-poster.jpg" alt="Rock in Rio Lisboa 2026 — Lineup Completo" className="w-full rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40" loading="lazy" />
          </div>
        </Animated>
      </section>

      {/* ════════════════════════ LINEUP ═════════════════════════════ */}
      <section id="lineup" className="py-24 md:py-32 px-5 bg-[#060610]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-4">Cartaz Completo</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">Lineup 2026</h2>
            </div>
          </Animated>

          {/* Day selector — scrollable on mobile */}
          <Animated animation="fade-up" delay={100}>
            <div className="flex justify-center mb-14">
              <div className="inline-flex rounded-2xl bg-white/[0.03] border border-white/[0.06] p-1.5 gap-1 sm:gap-1.5 overflow-x-auto max-w-full" style={{ scrollbarWidth: 'none' }}>
                {LINEUP.map((d, i) => (
                  <button key={i} onClick={() => setActiveDay(i)}
                    className={`px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold transition-all duration-200 shrink-0 ${activeDay === i ? 'bg-white text-[#060610] shadow-lg shadow-white/10' : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'}`}>
                    <span className="block text-sm sm:text-base leading-tight">{d.date.split(' ')[0]}</span>
                    <span className={`block text-[9px] sm:text-[10px] mt-0.5 uppercase tracking-widest ${activeDay === i ? 'text-black/40' : 'opacity-50'}`}>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Animated>

          {/* Day header */}
          <Animated animation="fade-up" delay={150}>
            <div className="flex items-center justify-between mb-10 px-1 gap-3">
              <div>
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">{day.date}, 2026</h3>
                <p className="text-sm text-white/35 mt-1 font-medium">{day.weekday}</p>
              </div>
              <span className={`px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[11px] font-extrabold uppercase tracking-widest border shrink-0 ${day.accentBg} ${day.accent}`}>{day.label}</span>
            </div>
          </Animated>

          {/* Headliner card — full width, large */}
          {day.stages[0]?.artists[0]?.headliner && (
            <Animated animation="fade-up" delay={200}>
              <div
                className={`relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r ${day.gradient} p-[1px] cursor-pointer group`}
                onClick={() => setSelectedArtist(day.stages[0].artists[0])}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedArtist(day.stages[0].artists[0])}
              >
                <div className="rounded-[15px] bg-[#0a0a14] p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group-hover:bg-[#0c0c16] transition-colors">
                  {day.stages[0].artists[0].photo && (
                    <img
                      src={day.stages[0].artists[0].photo}
                      alt={day.stages[0].artists[0].name}
                      className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-xl shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2">Headliner — {day.stages[0].name}</p>
                    <h4 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-3">
                      {day.stages[0].artists[0].name}
                    </h4>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${day.gradient} text-white`}>
                        {day.label}
                      </span>
                      <span className="text-[10px] text-white/25 flex items-center gap-1">
                        <Info className="w-3 h-3" />Toca para saber mais
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Animated>
          )}

          {/* Artists grid — visual cards with photos, clickable */}
          <Animated animation="fade-up" delay={300}>
            <div className="space-y-8">
              {day.stages.map((stage, si) => {
                const artists = si === 0 ? stage.artists.slice(1) : stage.artists;
                if (artists.length === 0) return null;
                return (
                  <div key={si}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                      <span className="text-xs font-extrabold text-white/40 uppercase tracking-wider">{stage.name}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {artists.map((artist, ai) => (
                        <div
                          key={ai}
                          className="group relative rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 aspect-square cursor-pointer"
                          onClick={() => setSelectedArtist(artist)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && setSelectedArtist(artist)}
                        >
                          {artist.photo ? (
                            <>
                              <img src={artist.photo} alt={artist.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-white/[0.01] flex items-center justify-center">
                              <Music className="w-8 h-8 text-white/10" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-lg">{artist.name}</p>
                          </div>
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-3 h-3 text-white/70" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Animated>
        </div>
      </section>

      {/* ════════════════════════ PALCOS ══════════════════════════════ */}
      <section className="py-24 px-5 bg-[#08080f]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-4">Onde Acontece a Magia</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">Palcos</h2>
            </div>
          </Animated>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STAGES_INFO.map((stage, i) => (
              <Animated key={i} animation="fade-up" delay={i * 100}>
                <div className="group relative rounded-2xl overflow-hidden border border-white/[0.06] aspect-[16/9]">
                  <img src={stage.img} alt={stage.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="flex items-center gap-2.5 mb-2">
                      <stage.icon className="w-4 h-4 text-amber-400/70" />
                      <h3 className="font-extrabold text-white text-base sm:text-lg tracking-wide">{stage.name}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ ATRAÇÕES ════════════════════════════ */}
      <section className="py-24 px-5 bg-[#060610]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-4">Cidade do Rock</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">Atrações</h2>
            </div>
          </Animated>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ATTRACTIONS.map((a, i) => (
              <Animated key={i} animation="fade-up" delay={i * 80}>
                <div className="group relative rounded-2xl overflow-hidden border border-white/[0.06] aspect-square">
                  <img src={a.img} alt={a.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="font-extrabold text-white text-xs sm:text-base mb-0.5 sm:mb-1">{a.name}</h3>
                    <p className="text-[10px] sm:text-[11px] text-white/45 leading-snug">{a.desc}</p>
                  </div>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ COMO CHEGAR ═════════════════════════ */}
      <section id="como-chegar" className="py-24 px-5 bg-[#08080f]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-4">Parque Tejo, Lisboa</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-3">Como Chegar</h2>
              <p className="text-sm text-white/30 font-medium">Passeio dos Heróis do Mar, 1990-059 Lisboa</p>
            </div>
          </Animated>

          {/* Warning — no parking */}
          <Animated animation="fade-up" delay={50}>
            <div className="flex items-start gap-3.5 p-5 rounded-xl bg-red-500/[0.06] border border-red-500/15 mb-8">
              <AlertTriangle className="w-5 h-5 text-red-400/70 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-300/80 mb-1">Sem estacionamento junto ao recinto</p>
                <p className="text-xs text-red-300/40 leading-relaxed">
                  Ruas envolventes de acesso exclusivo a moradores nos dias do festival. Não é possível estacionar nem aceder de carro ao Parque Tejo.
                </p>
              </div>
            </div>
          </Animated>

          {/* Map */}
          <Animated animation="fade-up" delay={100}>
            <div className="rounded-2xl overflow-hidden border border-white/[0.07] mb-8 aspect-[2/1] md:aspect-[16/7] shadow-xl shadow-black/20">
              <iframe src="https://www.google.com/maps?q=38.7856,-9.0929&z=15&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa — Parque Tejo, Lisboa" />
            </div>
          </Animated>

          {/* Shuttle CARRIS — recommended, highlighted */}
          <Animated animation="fade-up" delay={150}>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 sm:p-6 mb-6">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Bus className="w-6 h-6 text-emerald-400/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-extrabold text-white text-base">Shuttle CARRIS</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mb-4">Gare do Oriente → Cidade do Rock — direto, rápido e acessível.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400/50 shrink-0" />
                      <span className="text-white/40"><strong className="text-white/60">Ida:</strong> 12h — 21h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400/50 shrink-0" />
                      <span className="text-white/40"><strong className="text-white/60">Volta:</strong> 23h — 03h (04h a 27 Jun)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-3.5 h-3.5 text-emerald-400/50 shrink-0" />
                      <span className="text-white/40"><strong className="text-emerald-400/80">2€</strong> ida/volta (até 14 Jun) · <strong className="text-white/60">4€</strong> depois</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-400/50 shrink-0" />
                      <span className="text-white/40">Crianças até 12 anos: <strong className="text-white/60">grátis</strong></span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-500/10 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-white/25">Comprar bilhetes:</span>
                    <a href="https://rockinriolisboa.pt/en/how-to-get-there" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors font-semibold">
                      tickets.rockinriolisboa.pt<ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-xs text-white/15">ou</span>
                    <span className="text-xs text-white/40 font-medium">App Navegante</span>
                  </div>
                </div>
              </div>
            </div>
          </Animated>

          {/* Transport grid */}
          <Animated animation="fade-up" delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <TransportCard icon={Train} title="Comboio CP">
                <p><strong className="text-white/60">Estação de Sacavém</strong> — a mais próxima</p>
                <p className="flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-amber-400/40 shrink-0" />
                  <span>7 min a pé até ao recinto (~680m)</span>
                </p>
                <p>Linha da Azambuja · Tarifas promocionais nos dias do evento</p>
              </TransportCard>

              <TransportCard icon={Train} title="Metro de Lisboa">
                <p><strong className="text-white/60">Estação Oriente</strong> — Linha Vermelha</p>
                <p>Ligação direta ao Shuttle CARRIS na Gare do Oriente</p>
                <p>Horário alargado e reforço de carruagens nos dias do festival</p>
              </TransportCard>

              <TransportCard icon={Car} title="TVDE / Uber">
                <p>Pontos de pick-up e drop-off designados junto ao recinto</p>
                <p>Acesso limitado — trânsito condicionado pela PSP</p>
                <p className="text-white/25 text-xs">Espera maior após os concertos</p>
              </TransportCard>

              <TransportCard icon={Navigation} title="Park & Ride — Telpark">
                <p><strong className="text-white/60">13 parques</strong> estratégicos em Lisboa</p>
                <p>Roma, Alameda, Sete Rios, Berna, Marquês de Pombal, Santa Apolónia...</p>
                <p>Desde <strong className="text-amber-400/70">4,90€/24h</strong> · App Telpark</p>
              </TransportCard>
            </div>
          </Animated>

          {/* Long distance */}
          <Animated animation="fade-up" delay={250}>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 mb-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-400/[0.06] border border-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Bus className="w-5 h-5 text-amber-400/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm mb-2">Vens de fora de Lisboa?</h4>
                  <div className="text-sm text-white/40 space-y-1.5">
                    <p><strong className="text-white/60">Rede Expressos:</strong> 20% desconto em viagens nacionais (19–21 e 27–29 Jun)</p>
                    <p><strong className="text-white/60">FlixBus:</strong> 20% nacionais · 10% internacionais — válido todo o mês de Junho</p>
                    <p><strong className="text-white/60">Fertagus (Margem Sul):</strong> Tarifa especial ida/volta desde as estações da margem sul</p>
                    <p><strong className="text-white/60">CP Intercidades:</strong> Reforço especial de horários e tarifas promocionais</p>
                  </div>
                </div>
              </div>
            </div>
          </Animated>

          {/* Accessibility & tips */}
          <Animated animation="fade-up" delay={300}>
            <div className="flex items-start gap-3.5 p-5 rounded-xl bg-blue-500/[0.04] border border-blue-500/10">
              <Info className="w-4 h-4 text-blue-400/60 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300/50 leading-relaxed space-y-1">
                <p><strong className="text-blue-300/70">Acessibilidade:</strong> O shuttle CARRIS dispõe de veículos adaptados a cadeiras de rodas com fila prioritária na Gare do Oriente.</p>
                <p><strong className="text-blue-300/70">Estacionamento PMR:</strong> 80 lugares com reserva obrigatória até 10 de Junho — <span className="text-blue-400/60">acessibilidade@rockinrio.com</span></p>
              </div>
            </div>
          </Animated>
        </div>
      </section>

      {/* ════════════════════════ CTA ═════════════════════════════════ */}
      <section className="py-24 px-5 bg-[#060610]">
        <div className="max-w-4xl mx-auto">
          <Animated animation="fade-up">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
              <div className="absolute inset-0">
                <img src="/rockinrio/palco-mundo-sunset.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
              </div>

              <div className="relative z-10 p-6 sm:p-10 md:p-16 flex flex-col items-center gap-8 sm:gap-10">
                {/* Logos — smaller on mobile to prevent overflow */}
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                  <RirLogo className="w-24 sm:w-36 md:w-52 drop-shadow-[0_4px_40px_rgba(255,255,255,0.1)]" />
                  <div className="flex flex-col items-center gap-1 self-stretch justify-center">
                    <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
                    <span className="text-white/15 text-sm select-none">&times;</span>
                    <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
                  </div>
                  <img src="/icon-512x512.png" alt="Olha que Duas" className="w-20 sm:w-32 md:w-44 rounded-full shadow-lg" />
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-amber-400/10 border border-amber-400/20 mb-5">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">A Olha que Duas vai estar lá</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Garante o teu bilhete</h2>
                  <p className="text-xs sm:text-base text-white/40 mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
                    Junta-te a nós no maior festival do mundo. Bilhetes disponíveis na Worten e pontos de venda oficiais.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <a href="https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/20">
                      <Ticket className="w-4 h-4" />Comprar Bilhetes<ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                    <a href="https://rockinriolisboa.pt/" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm text-white/50 border border-white/[0.12] hover:bg-white/[0.05] hover:text-white/70 transition-all">
                      rockinriolisboa.pt<ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Animated>
        </div>
      </section>

      <Footer />
      <BackToTop />

      {/* ════════════════════════ ARTIST MODAL ════════════════════════ */}
      {selectedArtist && <ArtistModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />}
    </div>
  );
};

export default RockInRio;
