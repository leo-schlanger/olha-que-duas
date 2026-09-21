import { describe, it, expect } from "vitest";
import { getCloudinaryUrl, getCloudinaryPlaceholder } from "@/lib/cloudinary";

const ID = "olhaqueduas/galeria/album-exemplo/01";

describe("getCloudinaryUrl", () => {
  it("recorta a preencher, com gravidade automática", () => {
    // O recorte assume que a foto 01 já vem em formato horizontal. Tentámos
    // resolver as capas verticais com uma condicional na URL (encaixar em vez
    // de recortar) e o resultado foi pior: a imagem ficava pequena ao centro,
    // cercada de barras. A regra passou a viver no ficheiro — a capa é
    // desenhada em 1200x630. Ver CLAUDE.md.
    expect(getCloudinaryUrl(ID, "og")).toContain("w_1200,h_630,q_auto,c_fill,g_auto");
  });

  it("dá a cada preset as suas dimensões", () => {
    expect(getCloudinaryUrl(ID, "thumbnail")).toContain("w_600,h_400");
    expect(getCloudinaryUrl(ID, "grid")).toContain("w_401,h_401");
    expect(getCloudinaryUrl(ID, "hero")).toContain("w_1920,h_800");
  });

  it("usa c_fit no lightbox, para mostrar a imagem toda", () => {
    const url = getCloudinaryUrl(ID, "lightbox");
    expect(url).toContain("c_fit");
    expect(url).not.toContain("c_fill");
  });

  it("insere a versão antes do public_id, para furar a cache do CDN", () => {
    expect(getCloudinaryUrl(ID, "og", 1790017942)).toContain(`/v1790017942/${ID}`);
    expect(getCloudinaryUrl(ID, "og")).toContain(`f_auto/${ID}`);
  });

  it("usa thumbnail por omissão", () => {
    expect(getCloudinaryUrl(ID)).toContain("w_600,h_400");
  });
});

describe("getCloudinaryPlaceholder", () => {
  it("devolve uma imagem minúscula e desfocada", () => {
    const url = getCloudinaryPlaceholder(ID, 1790017942);
    expect(url).toContain("w_50,h_50");
    expect(url).toContain("e_blur:1000");
    expect(url).toContain(`/v1790017942/${ID}`);
  });
});
