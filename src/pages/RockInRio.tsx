import { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Clock, Music, Train, Bus, Car, Ticket,
  ExternalLink, Globe, Radio, Smartphone,
  Star, Users, Navigation, AlertTriangle, X, Info,
  Headphones, ChevronRight, Plane, Utensils, Gamepad2,
  Sparkles, Leaf,
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
  'katy-perry': { origin: 'EUA', genre: 'Pop', since: '2001', bio: 'Primeira artista na história a ter cinco singles de um único álbum (Teenage Dream) no #1 da Billboard, igualando o recorde de Michael Jackson. O seu show no Super Bowl XLIX atraiu 118,5 milhões de espectadores. Vendeu mais de 143 milhões de discos em todo o mundo.', hits: ['Roar', 'Firework', 'Teenage Dream', 'Dark Horse', 'I Kissed a Girl'] },
  'charlie-puth': { origin: 'EUA', genre: 'Pop', since: '2009', bio: 'Tem ouvido absoluto — consegue identificar qualquer nota musical de ouvido. Co-escreveu "See You Again" para Velocidade Furiosa 7, que passou 12 semanas no #1 da Billboard e foi o vídeo mais visto do YouTube. Explodiu no TikTok ao mostrar como produz hits com sons do quotidiano.', hits: ['Attention', 'See You Again', 'We Don\'t Talk Anymore', 'One Call Away'] },
  'alok': { origin: 'Brasil', genre: 'DJ / Eletrónica', since: '2010', bio: 'Top 5 do DJ Mag, com "Hear Me Now" a ultrapassar mil milhões de streams no Spotify. Filho dos DJs Ekanta e Swarup, pioneiros do psytrance no Brasil — o irmão gémeo Bhaskar também é DJ de sucesso. Fundou o Instituto Alok e doou mais de R$6 milhões durante a pandemia.', hits: ['Hear Me Now', 'Never Let Me Go', 'Alive', 'Don\'t Say Goodbye'] },
  'nena': { origin: 'Alemanha', genre: 'New Wave / Pop', since: '1977', bio: 'A canção "99 Luftballons" nasceu quando o guitarrista viu balões num concerto dos Rolling Stones em Berlim Ocidental e imaginou o que aconteceria se flutuassem sobre o Muro e fossem confundidos com OVNIs pelo radar militar. Chegou ao #1 nos EUA em alemão — um feito raríssimo. Vendeu mais de 25 milhões de discos.', hits: ['99 Luftballons', 'Nur geträumt', 'Irgendwie Irgendwo Irgendwann'] },
  'bebe-rexha': { origin: 'EUA', genre: 'Pop', since: '2010', bio: 'De origem albanesa, co-escreveu "The Monster" para Eminem ft. Rihanna antes de ser conhecida como artista solo. O dueto "Meant to Be" com Florida Georgia Line passou 50 semanas no #1 da Hot Country Songs — o reinado mais longo na história daquela tabela.', hits: ['Meant to Be', 'I\'m a Mess', 'Say My Name', 'I Got You'] },
  'pedro-sampaio': { origin: 'Brasil', genre: 'Funk / DJ', since: '2018', bio: 'Largou Economia na PUC-Rio para ser DJ — aprendeu a mixar no YouTube. Aos 24 anos, já era um dos maiores nomes do funk brasileiro, com "VERMELHO" a chegar ao #1 do Spotify Brasil. O seu set no Lollapalooza Brasil foi um dos mais concorridos da história do festival.', hits: ['No Chão Novinha', 'Vai Menina', 'Galopa', 'BEAT CHAMA'] },
  'calema': { origin: 'Portugal / São Tomé', genre: 'Pop / Kizomba', since: '2012', bio: 'Os irmãos gémeos António e Fradique, nascidos em São Tomé e criados em Portugal, foram os primeiros artistas são-tomenses a chegar ao mainstream português. "A Nossa Vez" ultrapassou 100 milhões de visualizações no YouTube. Esgotam salas em Portugal, França e em toda a África lusófona.', hits: ['A Nossa Vez', 'Te Amo', 'Vai', 'Onde Anda'] },
  'napa': { origin: 'Portugal', genre: 'Rap', since: '2019', bio: 'Voz da nova vaga do rap lisboeta, emergiu da cena underground com singles virais que misturaram trap e drill com lirismo em português. Colaborou com nomes-chave da cena urbana nacional antes de saltar para cartazes de festivais.', hits: ['Freestyle', 'Noites', 'Passo a Passo'] },
  'maninho': { origin: 'Portugal / Angola', genre: 'Afrobeats / Kizomba', since: '2015', bio: 'Figura central da ponte musical entre Lisboa e Luanda, mantém viva a kizomba tradicional enquanto moderniza a produção. Presença fixa no circuito de música ao vivo da comunidade luso-africana, com seguidores fiéis em toda a diáspora lusófona na Europa.', hits: ['Tá Bom', 'Vou Te Amar', 'Minha'] },
  'audrey-nuna': { origin: 'EUA', genre: 'R&B / Hip-Hop', since: '2019', bio: 'Coreano-americana de New Jersey, o seu EP de estreia "a liquid breakfast" foi aclamado pela crítica. Destacada como artista a seguir pela Complex e Pigeons & Planes. A faixa "damn Right" entrou na banda sonora do NBA 2K22 e ela própria cria toda a direção artística e visual dos seus projetos.', hits: ['damn Right', 'Space', 'Comic Sans', 'Blossom'] },
  'sofia-camara': { origin: 'Portugal', genre: 'Pop', since: '2020', bio: 'Parte da nova geração de pop português que canta em português e compete com artistas internacionais nas tabelas nacionais. Os seus concertos ao vivo misturam pop com influências de dancehall e afrobeats, refletindo o som multicultural de Lisboa.', hits: ['Não Sei', 'Quero Mais', 'Sozinha'] },

  'linkin-park': { origin: 'EUA', genre: 'Rock Alternativo', since: '1996', bio: '"Hybrid Theory" vendeu mais de 30 milhões de cópias — o álbum de estreia mais vendido do século XXI. Após a morte de Chester Bennington em 2017, o vídeo de "One More Light" ultrapassou mil milhões de visualizações. Regressaram em 2024 com a nova vocalista Emily Armstrong, esgotando uma digressão mundial.', hits: ['In the End', 'Numb', 'Crawling', 'One Step Closer', 'New Divide'] },
  'cypress-hill': { origin: 'EUA', genre: 'Hip-Hop', since: '1988', bio: 'Primeiro grupo latino de hip-hop a atingir platina. "Black Sunday" estreou no #1 da Billboard 200 e foram o primeiro grupo de rap a ter uma estrela no Passeio da Fama de Hollywood. A voz nasal icónica de B-Real — conseguida ao rappar pelas cavidades nasais — é uma das mais reconhecíveis do hip-hop.', hits: ['Insane in the Brain', 'How I Could Just Kill a Man', 'Hits from the Bong'] },
  'the-pretty-reckless': { origin: 'EUA', genre: 'Rock', since: '2009', bio: 'Taylor Momsen era atriz infantil — foi a Cindy Lou Who em "O Grinch" e a Jenny Humphrey em "Gossip Girl" — antes de trocar tudo pelo rock. A banda detém o recorde de mais #1 consecutivos na Billboard Mainstream Rock por uma banda com vocalista feminina, com sete singles no topo.', hits: ['Make Me Wanna Die', 'Heaven Knows', 'Going to Hell', 'Death by Rock and Roll'] },
  'grandson': { origin: 'Canadá / EUA', genre: 'Rock Alternativo', since: '2016', bio: 'Nascido no Canadá com raízes iranianas e turcas, "Blood // Water" ultrapassou mil milhões de streams no Spotify. A sua música é usada extensivamente em transmissões da NFL e NHL e trailers de videojogos. Fundou a comunidade "XX Resistance" para conectar fãs a causas de justiça social.', hits: ['Blood // Water', 'Thoughts & Prayers', 'Stigmata', 'Oh No!!!'] },
  'kaiser-chiefs': { origin: 'Reino Unido', genre: 'Indie Rock', since: '2000', bio: 'O nome vem do clube de futebol sul-africano Kaizer Chiefs. "Ruby" chegou ao #1 no Reino Unido e o álbum de estreia "Employment" ganhou Melhor Álbum Britânico nos BRIT Awards. O vocalista Ricky Wilson foi jurado no "The Voice UK", apresentando a banda a toda uma nova geração.', hits: ['I Predict a Riot', 'Ruby', 'Oh My God', 'Every Day I Love You Less and Less'] },
  'hoobastank': { origin: 'EUA', genre: 'Rock', since: '1994', bio: '"The Reason" chegou ao #2 da Billboard e é certificado 6× platina nos EUA — foi a canção mais tocada nas rádios americanas em 2004. Nos anos 2010, tornou-se viral como meme, apresentando a banda a audiências que nem tinham nascido quando saiu. Formaram-se em Agoura Hills, Califórnia — a mesma cena local dos Linkin Park.', hits: ['The Reason', 'Crawling in the Dark', 'Out of Control', 'Running Away'] },
  'blasted-mechanism': { origin: 'Portugal', genre: 'Rock / Eletrónica', since: '1998', bio: 'Uma das bandas visualmente mais distintas de Portugal — fatos alienígenas, pintura facial e espetáculos teatrais que fundem rock, eletrónica e world music. Presença regular no Boom Festival e nos maiores festivais europeus. Construíram o seu próprio cenário de "nave espacial" para as digressões.', hits: ['I Want', 'Blasted Empire', 'Come Along'] },
  'sepultura': { origin: 'Brasil', genre: 'Metal', since: '1984', bio: 'A banda de metal mais importante do Brasil e uma das mais influentes da história do thrash. No álbum "Roots", gravaram com o povo indígena Xavante na sua aldeia, fundindo metal com percussão tribal brasileira — uma fusão revolucionária que influenciou o nu metal. Mais de 40 anos de carreira e milhões de discos vendidos.', hits: ['Roots Bloody Roots', 'Arise', 'Territory', 'Ratamahatta'] },
  'pod': { origin: 'EUA', genre: 'Rock / Nu Metal', since: '1992', bio: '"Youth of the Nation" foi escrita em resposta ao tiroteio na Santana High School e tornou-se uma das canções de rock mais marcantes sobre violência armada nos EUA. O álbum "Satellite" é tripla platina e valeu-lhes uma nomeação para o Grammy. Venderam mais de 12 milhões de discos, provando que rock de raiz cristã podia competir no mainstream.', hits: ['Boom', 'Alive', 'Youth of the Nation', 'Satellite'] },
  'tara-perdida': { origin: 'Portugal', genre: 'Punk Rock', since: '1993', bio: 'Uma das bandas punk mais longevas de Portugal — mais de 30 anos de estrada sem cedências ao mainstream. Letras cruas e politicamente carregadas sobre a realidade social portuguesa. Mantêm uma base de fãs devota construída em décadas de digressões incansáveis pelo circuito underground.', hits: ['Chupem Isso', 'Mentes Destruídas', 'Rua da Mouraria'] },
  'sam-the-kid': { origin: 'Portugal', genre: 'Hip-Hop', since: '1994', bio: 'Samuel Mira é amplamente considerado um dos maiores rappers de sempre em língua portuguesa. O álbum "Entre(tanto)" é frequentemente citado como o melhor disco de hip-hop português. Também é um produtor respeitadíssimo que elevou a qualidade sonora do rap nacional a padrões internacionais.', hits: ['A Luz', 'Sobre(tudo)', 'Entre(tanto)', 'Pratica(mente)'] },
  'orelha-negra': { origin: 'Portugal', genre: 'Eletrónica / Hip-Hop', since: '2010', bio: 'Supergrupo formado por DJ Ride, Hugu Leite (ex-Buraka Som Sistema) e Francisco Rebelo. Os concertos ao vivo misturam turntablism, baixo e bateria num formato único e intenso. O álbum de estreia ganhou Melhor Álbum Português nos Play Awards e já colaboraram com dezenas de artistas nacionais.', hits: ['Só Nós Dois', 'Coisas que Eu Bebi', 'Watt'] },

  'rod-stewart': { origin: 'Reino Unido', genre: 'Rock / Pop', since: '1962', bio: 'Vendeu mais de 250 milhões de discos e teve seis álbuns consecutivos no #1 no Reino Unido. Foi nomeado cavaleiro (Sir) pela Rainha Isabel II em 2016. Curiosidade: tem uma maqueta ferroviária à escala 1:87 de uma cidade americana dos anos 40 com 7m × 38m — trabalhou nela durante 26 anos e leva-a em digressão.', hits: ['Maggie May', 'Da Ya Think I\'m Sexy?', 'Sailing', 'Have I Told You Lately'] },
  'cyndi-lauper': { origin: 'EUA', genre: 'Pop', since: '1977', bio: '"Girls Just Want to Have Fun" tornou-se um hino feminista e ela foi a primeira artista feminina a ter quatro singles no top 5 de um álbum de estreia. Compôs a música do musical da Broadway "Kinky Boots", ganhando o Tony de Melhor Partitura Original — a primeira mulher a vencê-lo a solo. Vencedora de Grammy, Emmy e Tony.', hits: ['Girls Just Want to Have Fun', 'Time After Time', 'True Colors', 'She Bop'] },
  '4-non-blondes': { origin: 'EUA', genre: 'Rock Alternativo', since: '1989', bio: 'Lançaram apenas um álbum, mas "What\'s Up?" tornou-se viral décadas depois e ultrapassa 2 mil milhões de streams no Spotify — muito mais bem-sucedida agora do que no lançamento original. A vocalista Linda Perry tornou-se uma das produtoras mais requisitadas do pop, escrevendo "Beautiful" para Christina Aguilera e "Get the Party Started" para P!nk. A canção tem uma devoção especial em Portugal.', hits: ['What\'s Up?'] },
  'shaggy': { origin: 'Jamaica / EUA', genre: 'Reggae / Dancehall', since: '1993', bio: 'Nascido Orville Richard Burrell em Kingston, serviu nos US Marines na Guerra do Golfo antes de seguir a música — financiou as primeiras gravações com as poupanças militares. "It Wasn\'t Me" fez de "Hot Shot" o álbum #1 nos EUA. O nome artístico vem do personagem Salsicha do Scooby-Doo e o álbum com Sting ganhou o Grammy de Melhor Álbum de Reggae.', hits: ['It Wasn\'t Me', 'Boombastic', 'Angel', 'Oh Carolina'] },
  'xutos': { origin: 'Portugal', genre: 'Rock', since: '1978', bio: 'A banda de rock mais emblemática de Portugal — mais de 45 anos e 2500 concertos. "A Minha Casinha" é praticamente um hino nacional não oficial. Perderam o guitarrista Zé Pedro em 2017, mas continuaram a honrar o seu legado. São para Portugal o que os Rolling Stones são para a Inglaterra — uma instituição.', hits: ['A Minha Casinha', 'Contentores', 'Homem do Leme', 'Não Sou o Único'] },
  'gnr': { origin: 'Portugal', genre: 'Rock / New Wave', since: '1981', bio: 'O nome significa "Grupo Novo Rock" e a banda portuguesa é anterior aos americanos Guns N\' Roses. O álbum "Independança" (1982) é um marco do rock lusitano. Rui Reininho é uma das figuras mais excêntricas e queridas da cultura portuguesa — músico, artista plástico e provocador nato.', hits: ['Portugal na CEE', 'Dunas', 'Pronúncia do Norte', 'Efectivamente'] },
  'uhf': { origin: 'Portugal', genre: 'Rock', since: '1978', bio: 'Nasceram em Almada logo após a Revolução dos Cravos (1974), quando a expressão cultural florescia. O nome vem das ondas de rádio Ultra High Frequency — símbolo do desejo de transmitir livremente. "Rua do Carmo" é uma das canções mais emblemáticas do rock português e António Manuel Ribeiro é considerado uma das vozes fundadoras do género.', hits: ['Rua do Carmo', 'À Minha Maneira', 'Cavalos de Corrida'] },
  'taxi': { origin: 'Portugal', genre: 'Pop Rock', since: '1981', bio: 'Parte do boom do rock português dos anos 80, ao lado dos Xutos, GNR e UHF — a era dourada em que se provou que rock cantado em português podia encher estádios. "Chiclete" e "Sozinho" são marcos da cultura pop portuguesa que continuam a ser tocados nas rádios décadas depois.', hits: ['Chiclete', 'Sozinho', 'Aquela Rapariga'] },
  'jafumega': { origin: 'Portugal', genre: 'Rock / Blues', since: '2010', bio: 'Dedicação total ao blues num país onde o género tem um público pequeno mas devoto. Concertos crus e autênticos que bebem do Delta blues, Chicago blues e Southern rock americano. Uma das bandas mais fiáveis ao vivo no nicho do blues-rock português.', hits: ['Balada do Desajeitado', 'Castelos de Areia'] },
  'joss-stone': { origin: 'Reino Unido', genre: 'Soul / R&B', since: '2003', bio: 'Estreou-se aos 16 com "The Soul Sessions", que foi multi-platina e a consagrou como a melhor voz soul britânica desde Dusty Springfield. Ganhou o Grammy de Melhor Colaboração Pop com apenas 17 anos. Realizou a "Total World Tour" (2014–2019), atuando em todos os países do mundo — mais de 200 territórios, algo que nenhum outro artista tentou.', hits: ['Fell in Love with a Boy', 'Right to Be Wrong', 'Super Duper Love'] },
  'the-wailers': { origin: 'Jamaica', genre: 'Reggae', since: '1963', bio: 'A banda que acompanhou Bob Marley e ajudou a levar o reggae ao mundo. "Legend" (1984) vendeu mais de 33 milhões de cópias — o álbum de reggae mais vendido de todos os tempos. Os membros originais — Marley, Peter Tosh e Bunny Wailer — tornaram-se todos estrelas solo, um feito sem precedentes na música.', hits: ['Three Little Birds', 'Get Up Stand Up', 'Is This Love', 'No Woman No Cry'] },
  'belo': { origin: 'Brasil', genre: 'Pagode / R&B', since: '1998', bio: 'Um dos maiores nomes do pagode brasileiro, com mais de 7 milhões de discos vendidos. "Perfume" é um dos temas mais icónicos do pagode romântico dos anos 2000. Os seus DVDs ao vivo estão entre os mais vendidos da história da música brasileira, reflexo da escala gigantesca dos seus concertos.', hits: ['Tua Boca', 'Desafio', 'Perfume', 'Derê'] },
  'syro': { origin: 'Portugal', genre: 'Pop / R&B', since: '2019', bio: 'De ascendência cabo-verdiana, mistura pop, R&B e sonoridades afro-portuguesas, representando a identidade cada vez mais multicultural da cena musical de Lisboa. Presença crescente em playlists internacionais e colaborações com artistas de todo o mundo lusófono.', hits: ['Neve', 'Perto de Ti', 'Lua'] },

  '21-savage': { origin: 'Reino Unido / EUA', genre: 'Hip-Hop / Trap', since: '2013', bio: 'Nascido em Londres mas criado em Atlanta — em 2019, o ICE revelou que era cidadão britânico com visto expirado, gerando um debate nacional sobre imigração nos EUA. "a lot" com J. Cole ganhou o Grammy de Melhor Canção Rap. "Her Loss" com Drake estreou no #1 com 404 mil unidades na primeira semana. Fundou a campanha "Bank Account" para ensinar literacia financeira a jovens de Atlanta.', hits: ['a lot', 'Bank Account', 'Rockstar', 'redrum'] },
  'central-cee': { origin: 'Reino Unido', genre: 'Rap / Drill', since: '2020', bio: 'O artista de UK drill com mais sucesso comercial de sempre. "Doja" chegou ao #1 no Reino Unido e entrou nas tabelas de mais de 30 países, colocando o drill britânico no mapa global. De herança irlandesa, guianense e colombiana, o seu flow multilingue expandiu o alcance do género. Ultrapassou muitos artistas pop britânicos estabelecidos em streams no Spotify.', hits: ['Doja', 'Sprinter', 'Loading', 'Band4Band', 'Obsessed'] },
  'rema': { origin: 'Nigéria', genre: 'Afrobeats', since: '2019', bio: '"Calm Down" (remix com Selena Gomez) tornou-se a canção africana mais ouvida na história do Spotify, passando mais de 40 semanas na Billboard Hot 100 — um recorde para um artista africano. Tinha apenas 18 anos quando o EP de estreia o tornou estrela na Nigéria. Pioneiro do "Afrorave", o seu género auto-criado que funde afrobeats, melodias indianas e música eletrónica.', hits: ['Calm Down', 'Soundgasm', 'Fame', 'Holiday'] },
  'matue': { origin: 'Brasil', genre: 'Rap / Trap', since: '2017', bio: 'De Fortaleza, Ceará — quebrou o estereótipo de que o rap brasileiro só vem de São Paulo e Rio. "Máquina do Tempo" bateu recordes de streaming no primeiro dia no Brasil. Conhecido pelo estilo visual cinematográfico — os seus videoclipes têm estética de ficção científica com produção de nível inédito no rap brasileiro.', hits: ['777-666', 'Quer Voar', 'Kenny G', 'Máquina do Tempo'] },
  'filipe-ret': { origin: 'Brasil', genre: 'Rap', since: '2005', bio: 'Começou nas batalhas de freestyle do underground carioca. O álbum "AUDAZ" bateu recordes brasileiros de streaming com mais de 30 milhões de streams nas primeiras 24 horas no Spotify. Os seus sets no Lollapalooza Brasil estão entre os mais concorridos na história do festival. Rapa sobre a realidade das favelas do Rio com uma profundidade lírica que lhe vale comparações com Mano Brown.', hits: ['Neurótico', 'Chapa', 'Contatinho', 'Bené'] },
  'dennis': { origin: 'Brasil', genre: 'Funk / DJ', since: '2007', bio: 'Começou a tocar em bailes funk nas favelas do Rio em adolescente e é creditado como um dos responsáveis por levar o funk carioca das festas comunitárias para os festivais internacionais. Mais de 20 milhões de ouvintes mensais no Spotify e o seu canal no YouTube ultrapassa 10 mil milhões de visualizações — um dos músicos brasileiros mais vistos na plataforma.', hits: ['Vai Dar PT', 'Bota Com Tudo', 'Só Fé'] },
  'carlao': { origin: 'Portugal', genre: 'Hip-Hop / Soul', since: '2003', bio: 'Carlos Ribeiro, de raízes cabo-verdianas, mistura rap com funk e soul num estilo único. Veterano com mais de duas décadas no cenário musical português, já colaborou com artistas de rock, eletrónica e fado. Presença de palco arrebatadora e cabeça de cartaz habitual nos festivais portugueses — ajudou a legitimar o hip-hop no panorama cultural de Portugal.', hits: ['De Alma e Coração', 'Fala Só', 'Tempo de Mudar'] },
  'irina-barros': { origin: 'Portugal', genre: 'Pop / Urban', since: '2018', bio: 'Cantora e personalidade portuguesa que construiu uma base de fãs significativa através da TV e das redes sociais. Parte da vaga de artistas femininas portuguesas que trazem o pop de influência urbana — dancehall, R&B e sonoridades lusófonas — ao mainstream nacional.', hits: ['Não Me Toques', 'Café', 'Vem'] },
  'ceelo-green': { origin: 'EUA', genre: 'Soul / Pop', since: '2000', bio: '"Crazy" (como metade dos Gnarls Barkley, com Danger Mouse) foi a primeira canção a chegar ao #1 no Reino Unido baseada apenas em downloads digitais, em 2006 — permaneceu 9 semanas no topo. "Forget You" valeu-lhe um Grammy e tornou-se uma das canções mais reconhecíveis da década. Como membro dos Goodie Mob (ao lado dos OutKast), foi figura fundadora do hip-hop sulista e do movimento Dirty South.', hits: ['Crazy', 'Forget You', 'Bright Lights Bigger City'] },
  'lola-indigo': { origin: 'Espanha', genre: 'Pop / Reggaeton', since: '2018', bio: 'Mimi Doblas participou no Operación Triunfo 2017 — não ganhou, mas tornou-se a artista de maior sucesso comercial daquela edição. Antes da música, estudou dança na Debbie Allen Dance Academy em Los Angeles, e as suas performances com coreografia distinguem-na no pop espanhol. "Ya No Quiero Ná" foi um dos temas pop mais virais de Espanha em 2018.', hits: ['Ya No Quiero Ná', 'El Humo', 'Mala Cara', 'La Niña'] },
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
  { name: 'Palco Mundo', desc: 'O palco principal e maior do festival, com novo espetáculo audiovisual para 2026. Aqui atuam os headliners e os maiores nomes da música mundial perante 80 000 pessoas.', icon: Globe, img: '/rockinrio/palco-mundo.jpg' },
  { name: 'Music Valley', desc: 'O vale dos sons diversos — reuniões lendárias, artistas emergentes e descobertas inesperadas. Powered by Galp, é o palco onde nascem as surpresas do festival.', icon: Music, img: '/rockinrio/music-valley.jpg' },
  { name: 'Super Bock Stage', desc: 'A casa do rock, metal, alternativo e punk na Cidade do Rock. Palco com identidade própria e público fiel que procura sons mais pesados e intensos.', icon: Radio, img: '/rockinrio/super-bock.jpg' },
  { name: 'BacanaPlay Digital Stage', desc: 'O palco mais digital do festival — música, humor, podcasts, talk shows e fenómenos virais. Co-curado por New Sheet Entertainment e milk&black, maior e mais relevante do que nunca em 2026.', icon: Smartphone, img: '/rockinrio/bacanaplay.jpg' },
];

const PHOTO_ATTRACTIONS = [
  { name: 'Roda Gigante PiscaPisca', desc: '24 cabines temáticas — Disco, Tropical, Fifties, Back to 90\'s e Tiro-liro-liro. Cada cabine tem a sua playlist e fragrância, e há sorteios com prémios de visitas aos bastidores.', img: '/rockinrio/roda-gigante.jpg' },
  { name: 'Slide', desc: 'Tirolesa a 15 metros de altura que sobrevoa o recinto ao longo de 157 metros, com vista aérea sobre o Palco Mundo e toda a Cidade do Rock.', img: '/rockinrio/slide.jpg' },
  { name: 'Rota 85', desc: 'Viagem pela história do Rock in Rio desde 1985, com cenografia vintage e o icónico "ténis enlameado" da primeira edição. Inclui a Capela Cupido ao estilo Las Vegas e o CineStage School of Rock.', img: '/rockinrio/rota-85.jpg' },
];

const ICON_EXPERIENCES = [
  { name: 'Chef\'s Garden Continente', desc: 'Área gastronómica premium com os chefs Justa Nobre, Miguel Castro e Silva, Noélia Jerónimo e Vítor Sobral. 400 lugares, Wine Bar da Sogrape e palco próprio com concertos diários curados pelo chef Ljubomir Stanisic.', icon: Utensils },
  { name: 'Rock Your Street', desc: 'O boulevard mais eclético da Cidade do Rock — fado, jazz, ritmos africanos, K-pop, eletrónica e sons brasileiros ao vivo. Palco próprio com curadoria de world music e cenografia renovada.', icon: Music },
  { name: 'Game Square', desc: '14 horas diárias de gaming: arcades retro (Pinball, Tetris, Metal Slug), OMEN by HP, uma arena secreta VALORANT, e o Worten Game Stage com 11 horas de programação com os maiores gamers e streamers portugueses.', icon: Gamepad2 },
  { name: 'Rock in Rio Kids', desc: '3 000 m² para famílias com crianças dos 3 aos 10 anos. Mini Palco Mundo com Just Dance e espetáculos, mini Slide e mini Roda Gigante, oficinas de ciência e ilustração, e pool parties de bolas.', icon: Users },
  { name: 'Smart City of Rock', desc: 'Laboratório urbano vivo — 13 startups selecionadas de 8 países testam inovação para 100 000 visitantes/dia. Digital Twin do recinto, sala de operações integrada e gestão de fluxos em tempo real. Novo em 2026.', icon: Sparkles },
  { name: '40+ Artistas de Rua', desc: 'Mágicos, mímicos, malabaristas, palhaços, figuras em andas, monociclos, homens-espelho, artistas de bolhas de sabão, caricaturistas e estátuas humanas — espalhados por todo o recinto o dia inteiro.', icon: Star },
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

      {/* ════════════════════════ A EXPERIÊNCIA ═════════════════════════ */}
      <section className="py-24 px-5 bg-[#060610]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-4">145 000 m² de Festival</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-3">Cidade do Rock</h2>
              <p className="text-sm text-white/30 max-w-lg mx-auto">Muito mais do que música — atrações, gastronomia, gaming, experiências imersivas e inovação.</p>
            </div>
          </Animated>

          {/* The Flight — NOVO 2026 — full-width hero */}
          <Animated animation="fade-up" delay={80}>
            <div className="relative rounded-2xl overflow-hidden border border-amber-400/15 mb-8 group">
              <div className="aspect-[21/9] sm:aspect-[21/7] relative">
                <img src="/rockinrio/the-flight.jpg" alt="The Flight — Show aéreo Rock in Rio Lisboa 2026" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Plane className="w-4 h-4 text-amber-400" />
                  <h3 className="font-black text-white text-lg sm:text-2xl">The Flight</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/25 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                    Novo 2026
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-2xl">
                  Cinco aviões Yak-52 da equipa acrobática Yakstars executam um ballet aéreo sincronizado sobre a Cidade do Rock — loops, mergulhos e cruzamentos milimétricos, acompanhados por uma partitura musical original e mais de 400 tiros pirotécnicos. Todos os dias entre as 20h e as 21h, com o Tejo e a Ponte Vasco da Gama como cenário.
                </p>
              </div>
            </div>
          </Animated>

          {/* Photo attraction cards */}
          <Animated animation="fade-up" delay={150}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {PHOTO_ATTRACTIONS.map((a, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/[0.06] aspect-[4/3]">
                  <img src={a.img} alt={a.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="font-extrabold text-white text-sm sm:text-base mb-1">{a.name}</h3>
                    <p className="text-[11px] sm:text-xs text-white/45 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Animated>

          {/* Icon-based experience cards */}
          <Animated animation="fade-up" delay={220}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {ICON_EXPERIENCES.map((exp, i) => (
                <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-amber-400/[0.06] border border-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
                      <exp.icon className="w-5 h-5 text-amber-400/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-bold text-white text-sm">{exp.name}</h4>
                        {exp.name.includes('Smart City') && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[8px] font-bold uppercase tracking-wider text-amber-400">Novo</span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">{exp.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Animated>

          {/* Sustainability banner */}
          <Animated animation="fade-up" delay={300}>
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-5 h-5 text-emerald-400/60" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-2">Sustentabilidade</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-emerald-300/50">
                    <span>100% energia renovável</span>
                    <span className="text-emerald-500/20">·</span>
                    <span>Zero resíduos para aterro</span>
                    <span className="text-emerald-500/20">·</span>
                    <span>Compensação carbónica via reflorestação</span>
                    <span className="text-emerald-500/20">·</span>
                    <span>Reciclagem gamificada "Acerta & Recicla"</span>
                  </div>
                </div>
              </div>
            </div>
          </Animated>
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
