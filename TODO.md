# TODO - Olha que Duas

## Melhorias Futuras

### Dark Mode (Standby)
- [ ] Implementar toggle de dark mode com persistência em localStorage
- [ ] Criar variantes de cores para tema escuro no tailwind.config.ts
- [ ] Adicionar botão de toggle no Header
- [ ] Testar contraste e acessibilidade em modo escuro

### Performance
- [x] Code splitting para componentes pesados (RadioPlayer, páginas via lazy)
- [ ] Implementar lazy loading para imagens fora do viewport
- [ ] Otimizar imagens (WebP, compression) — galeria já usa Cloudinary com transforms
- [x] Adicionar loading skeletons (RadioPlayer painéis, WeatherStrip, etc.)
- [ ] Reduzir bundle inicial (`index.js` ~660KB) — code-split mais agressivo no Hero/SobreNos

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
- [ ] Adicionar skip-to-content link
- [ ] Melhorar navegação por teclado
- [ ] Testar com screen readers
- [ ] Verificar contraste WCAG AA

### Integrações
- [ ] Integrar Mailchimp/Brevo para newsletter
- [ ] Configurar backend próprio para formulários
- [x] Integrar calendário de programação da rádio (Supabase + fallback hardcoded)
- [ ] Adicionar chat ao vivo (Crisp/Intercom)

### Rádio
- [x] Sincronização áudio↔imagem com drift do relógio servidor + buffer real do `<audio>` + burst do icecast
- [x] Backoff exponencial em falhas de fetch do now-playing
- [x] Auto-refresh do período/dia ao virar a hora (sem polling de minuto)
- [x] Reconexão automática com backoff em quebras de stream
- [x] Detectar pause externo (mobile/SO) e sincronizar UI
- [x] Testes unitários para `pickCategory`, `pickAudibleEntry`, `addDurations`, etc.
- [ ] Pre-cache de artwork da próxima faixa quando duração ≥ 60s (eliminar flash)
- [ ] Modo "só metadata" sem áudio (já temos polling passivo, falta UI)

---

**Última atualização:** Abril 2026
