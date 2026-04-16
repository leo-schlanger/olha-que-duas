# TODO - Olha que Duas

## Melhorias Futuras

### Dark Mode (Standby)
- [ ] Implementar toggle de dark mode com persistência em localStorage
- [ ] Criar variantes de cores para tema escuro no tailwind.config.ts
- [ ] Adicionar botão de toggle no Header
- [ ] Testar contraste e acessibilidade em modo escuro

### Performance
- [x] Code splitting para componentes pesados (RadioPlayer, páginas via lazy)
- [x] Otimizar imagens — todos os PNGs/JPGs principais convertidos para WebP (4.6MB → 1.8MB, -60%)
- [x] Throttle do scroll listener no Hero (rAF coalescing)
- [x] Adicionar loading skeletons (RadioPlayer painéis, WeatherStrip, Suspense)
- [ ] Implementar lazy loading para imagens fora do viewport (galeria/blog)
- [ ] Reduzir bundle inicial (`index.js` ~725KB) — code-split mais agressivo no Hero/SobreNos
- [ ] Substituir framer-motion por CSS animations no `Newsletter.tsx` (-50KB no chunk)
- [ ] Split de componentes gigantes: `Servicos.tsx` (1069), `Viagens.tsx` (831), `Kids.tsx` (723)

### SEO & Analytics
- [ ] Adicionar Google Analytics 4
- [ ] Implementar event tracking para CTAs
- [ ] Criar páginas de landing para campanhas
- [ ] Melhorar meta tags dinâmicas para blog posts

### Funcionalidades
- [ ] Implementar sistema de comentários no blog
- [ ] Adicionar busca no blog
- [ ] Criar página de episódios do podcast
- [ ] Integrar com Spotify API para mostrar episódios reais
- [ ] Implementar e-commerce real na loja (Shopify/Stripe)

### Acessibilidade
- [x] Skip-to-content link (já existia)
- [x] aria-label nos links sociais do Footer (Instagram/YouTube/Facebook/TikTok)
- [x] Labels associadas aos inputs de Newsletter
- [x] aria-required + aria-invalid + aria-describedby nos forms (Contacto, Newsletter)
- [ ] Melhorar navegação por teclado (verificar `<div onClick>` que devia ser `<button>`)
- [ ] Testar com screen readers
- [ ] Verificar contraste WCAG AA com Lighthouse

### Integrações
- [ ] Integrar Mailchimp/Brevo para newsletter
- [ ] Configurar backend próprio para formulários
- [x] Integrar calendário de programação da rádio (Supabase + fallback hardcoded)
- [ ] Adicionar chat ao vivo (Crisp/Intercom)

### Rádio
- [x] Sincronização áudio↔imagem com drift do relógio servidor + buffer real do `<audio>` + burst do icecast
- [x] Detecção de mudança de `now_playing.played_at` para forçar transição imediata
- [x] Backoff exponencial em falhas de fetch do now-playing
- [x] Auto-refresh do período/dia ao virar a hora (sem polling de minuto)
- [x] Reconexão automática com backoff em quebras de stream
- [x] Detectar pause externo (mobile/SO) e sincronizar UI
- [x] Overlay de debug `?debug=radio` para calibração ao vivo
- [x] Override de buffer via `localStorage.radio.bufferSec`
- [x] Testes unitários: 122 passing
- [ ] Pre-cache de artwork da próxima faixa quando duração ≥ 60s (eliminar flash)
- [ ] Modo "só metadata" sem áudio (já temos polling passivo, falta UI)

### Robustez
- [x] ErrorBoundary global com fallback amigável
- [x] Validação Zod em forms (Contacto, Newsletter) com erros inline
- [x] Timeout + retry no submit do Contacto
- [x] Timeout por cidade no useWeather (Promise.allSettled)
- [x] try/catch em todos os acessos a localStorage
- [x] TS strict mode + ESLint no-unused-vars
- [ ] Resolver 14 vulnerabilidades de `@vercel/node` devDep (precisa upgrade major)

---

**Última atualização:** Abril 2026
