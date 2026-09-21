import { describe, it, expect } from "vitest";
import {
  getYouTubeId,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
} from "@/lib/youtube";

describe("getYouTubeId", () => {
  it("lê os formatos guardados em gallery_videos", () => {
    // Os quatro formatos que estão mesmo na tabela hoje.
    expect(getYouTubeId("https://www.youtube.com/watch?v=l4pnW2DHr-8")).toBe("l4pnW2DHr-8");
    expect(getYouTubeId("https://youtu.be/9uqYBnl9Zes")).toBe("9uqYBnl9Zes");
    expect(getYouTubeId("https://youtube.com/shorts/Swl9K-qZwDQ")).toBe("Swl9K-qZwDQ");
    expect(getYouTubeId("https://www.youtube-nocookie.com/embed/kZ1gtfQeeT0")).toBe("kZ1gtfQeeT0");
  });

  it("aceita parâmetros extra depois do id", () => {
    expect(getYouTubeId("https://youtube.com/watch?v=l4pnW2DHr-8&feature=shared")).toBe(
      "l4pnW2DHr-8",
    );
    expect(getYouTubeId("https://www.youtube.com/watch?t=90&v=l4pnW2DHr-8")).toBe("l4pnW2DHr-8");
  });

  it("devolve null quando não há id — o chamador salta o vídeo", () => {
    expect(getYouTubeId("https://vimeo.com/123456789")).toBeNull();
    expect(getYouTubeId("https://www.youtube.com/@OlhaQueDuas-l9m")).toBeNull();
    expect(getYouTubeId("")).toBeNull();
  });

  it("rejeita ids com comprimento errado", () => {
    // O id do YouTube tem sempre 11 caracteres; aceitar menos deixava passar
    // lixo para dentro do embedUrl e do JSON-LD.
    expect(getYouTubeId("https://youtu.be/curto")).toBeNull();
  });
});

describe("URLs derivadas do id", () => {
  const id = "l4pnW2DHr-8";

  it("usa hqdefault, que existe para todos os vídeos", () => {
    // maxresdefault dá 404 em vídeos abaixo de 720p e partia a miniatura
    // no resultado de pesquisa.
    expect(getYouTubeThumbnail(id)).toBe(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  });

  it("embebe pelo domínio sem cookies que a CSP permite", () => {
    expect(getYouTubeEmbedUrl(id)).toBe(`https://www.youtube-nocookie.com/embed/${id}`);
  });

  it("aponta o VideoObject para a página canónica do vídeo", () => {
    expect(getYouTubeWatchUrl(id)).toBe(`https://www.youtube.com/watch?v=${id}`);
  });

  it("fecha o ciclo: o embed gerado volta a dar o mesmo id", () => {
    expect(getYouTubeId(getYouTubeEmbedUrl(id))).toBe(id);
    expect(getYouTubeId(getYouTubeWatchUrl(id))).toBe(id);
  });
});
