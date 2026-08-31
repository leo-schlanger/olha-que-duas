# AdSense nas histórias

Passos por fazer **depois** de haver 15 a 20 episódios publicados. Candidaturas
com pouco conteúdo são recusadas e a recusa custa semanas de espera.

## Estado atual

| Item | Estado |
|---|---|
| Publisher ID | `pub-7365386697613870` |
| `public/app-ads.txt` | ✅ já existia (aplicações) |
| `public/ads.txt` | ✅ criado (web) |
| Política de privacidade | ✅ `/privacidade` |
| Banner de cookies | ⚠️ existe, mas não é uma CMP certificada |
| Script do AdSense | ❌ por colocar |
| Posições dos anúncios | ✅ decididas — ver abaixo |

## Consentimento na UE

O Google exige uma CMP certificada IAB TCF v2.2 para servir anúncios a
visitantes na União Europeia. O `CookieConsent` atual não é uma.

Usar o **Google Funding Choices** (Privacy & messaging na consola do AdSense):
é a CMP do próprio Google, é gratuita e é certificada. Substitui ou coexiste
com o banner atual — decidir na altura para não haver dois banners.

## Posições

Já estão marcadas no código com `<AdSlot />` em `src/pages/StoryEpisode.tsx`:

| Slot | Onde | Porquê |
|---|---|---|
| `episodio-meio` | ~40% do texto, a seguir ao bloco de email | O leitor já está preso; interromper aqui não o faz sair |
| `episodio-fim` | Depois do gancho, **acima** do botão "próximo episódio" | O clique de saída passa obrigatoriamente por ali |

O `AdSlot` renderiza uma `<div data-ad-slot="…">` vazia e sem altura. Quando o
AdSense estiver aprovado, é só preencher esse componente — as páginas não
precisam de ser tocadas.

### O que não fazer

**Nada de intersticiais entre episódios.** A receita desta secção vem de um
leitor consumir seis a dez episódios de seguida; um anúncio de ecrã inteiro a
cada transição quebra exatamente esse comportamento. Nos Auto Ads, desligar
"Anúncios intersticiais" e deixar só o âncora de telemóvel.

## Passos

1. Confirmar que `https://www.olhaqueduas.com/ads.txt` responde com a linha correta
2. Ativar o Funding Choices na consola do AdSense
3. Submeter o site para revisão
4. Depois de aprovado: colocar o script no `index.html` e preencher o `AdSlot`
5. Confirmar no `vercel.json` que o CSP permite os domínios do AdSense
   (`script-src` e `frame-src`: `pagead2.googlesyndication.com`,
   `googleads.g.doubleclick.net`, `tpc.googlesyndication.com`)

O passo 5 é fácil de esquecer — o CSP atual bloqueia o AdSense em silêncio,
sem erro visível na página.
