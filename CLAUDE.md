# Contexto do Projeto - Olha que Duas

## Credenciais

### Cloudinary
- **Cloud Name:** dfljesvj7
- **API Key:** ***CLOUDINARY_API_KEY_REMOVED***
- **API Secret:** ***CLOUDINARY_SECRET_REMOVED***
- **Pasta base:** olhaqueduas/galeria/

### Supabase
- **Project Ref:** jjifjbdfpvgeseqbjpkg
- **URL:** https://jjifjbdfpvgeseqbjpkg.supabase.co

---

## Galeria de Fotos - Workflow

### Adicionar novo álbum:

1. **Criar pasta local:**
```
C:\Users\leosc\Downloads\galeria-[slug]-[YYYYMMDD]\
```

2. **Nomear fotos:** 01.jpg, 02.jpg, 03.jpg... (ordem de exibição)

3. **Upload Cloudinary:**
```bash
cd "C:\Users\leosc\Downloads\galeria-[slug]"
node upload.js
```

4. **Inserir no Supabase:**
```bash
cd "D:\Projetos\olha-que-duas"
supabase db query --linked -f "[caminho-sql]"
```

### SQL template para novo álbum:
```sql
INSERT INTO gallery_albums (slug, title, description, event_date, location, photo_count, is_published, published_at)
VALUES (
    '[slug]',
    '[Título do Evento]',
    '[Descrição]',
    '[YYYY-MM-DD]',
    '[Local]',
    [N],
    TRUE,
    NOW()
);

INSERT INTO gallery_photos (album_id, cloudinary_public_id, display_order, is_cover)
VALUES
    ((SELECT id FROM gallery_albums WHERE slug = '[slug]'), 'olhaqueduas/galeria/[slug]/01', 1, TRUE),
    ((SELECT id FROM gallery_albums WHERE slug = '[slug]'), 'olhaqueduas/galeria/[slug]/02', 2, FALSE),
    ...
```

### Alterar capa:
```sql
UPDATE gallery_photos SET is_cover = FALSE WHERE album_id = X;
UPDATE gallery_photos SET is_cover = TRUE WHERE cloudinary_public_id = 'olhaqueduas/galeria/[slug]/[NN]';
```

### Reordenar fotos:
```sql
UPDATE gallery_photos SET display_order = [N] WHERE cloudinary_public_id = 'olhaqueduas/galeria/[slug]/[NN]';
```

---

## Estrutura da Galeria

- **Página listagem:** /galeria (timeline por ano)
- **Página álbum:** /galeria/:slug
- **Componentes:** src/components/gallery/
- **Hook:** src/hooks/useGallery.ts
- **Cloudinary lib:** src/lib/cloudinary.ts

---

## Álbuns Existentes

| Slug | Título | Data | Local | Fotos |
|------|--------|------|-------|-------|
| fragmentos-temas-cascais-20260329 | Fragmentos de Temas | 2026-03-29 | Casa da Guia, Cascais | 7 |
