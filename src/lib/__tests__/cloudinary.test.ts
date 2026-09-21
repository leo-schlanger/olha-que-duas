import { describe, it, expect } from "vitest";
import { getCloudinaryUrl, getCloudinaryPlaceholder } from "@/lib/cloudinary";

const ID = "olhaqueduas/galeria/album-exemplo/01";

describe("getCloudinaryUrl", () => {
  it("decide entre recortar e encaixar conforme o rácio da origem", () => {
    // O Cloudinary só sabe o tamanho do ficheiro na entrega, por isso a
    // decisão vai na URL como condicional em vez de ser tomada aqui.
    const url = getCloudinaryUrl(ID, "og");
    expect(url).toContain("if_ar_lt_0.7,c_pad,b_auto,w_1200,h_630");
    expect(url).toContain("c_fill,g_auto,w_1200,h_630");
    expect(url).toContain("/if_end/");
  });

  it("põe o if_else num componente próprio do caminho", () => {
    // Juntá-lo por vírgula ao ramo seguinte devolve HTTP 400.
    expect(getCloudinaryUrl(ID, "og")).toContain("/if_else/");
  });

  it("aplica a condicional a todos os recortes, não só ao og", () => {
    // O cartaz vertical aparece na grelha e no cartão da galeria, não só
    // quando é partilhado.
    for (const t of ["thumbnail", "grid", "hero"] as const) {
      expect(getCloudinaryUrl(ID, t)).toContain("if_ar_lt_0.7");
      expect(getCloudinaryUrl(ID, t)).toContain("if_end");
    }
  });

  it("deixa o lightbox em paz — c_fit já mostra a imagem toda", () => {
    const url = getCloudinaryUrl(ID, "lightbox");
    expect(url).toContain("c_fit");
    expect(url).not.toContain("if_ar_lt");
    expect(url).not.toContain("if_else");
  });

  it("insere a versão antes do public_id, para furar a cache do CDN", () => {
    expect(getCloudinaryUrl(ID, "og", 1790017126)).toContain(`/if_end/v1790017126/${ID}`);
    expect(getCloudinaryUrl(ID, "og")).not.toContain("/v/");
  });

  it("usa thumbnail por omissão", () => {
    expect(getCloudinaryUrl(ID)).toContain("w_600,h_400");
  });
});

describe("getCloudinaryPlaceholder", () => {
  it("devolve uma imagem minúscula e desfocada", () => {
    const url = getCloudinaryPlaceholder(ID, 1790017126);
    expect(url).toContain("w_50,h_50");
    expect(url).toContain("e_blur:1000");
    expect(url).toContain(`/v1790017126/${ID}`);
  });
});
