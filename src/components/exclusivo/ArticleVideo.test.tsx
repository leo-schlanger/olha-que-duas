import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ArticleVideo } from "./ArticleVideo";

describe("ArticleVideo", () => {
  it("renderiza vídeo vertical com controlos, playsinline, poster e sem pré-carregar", () => {
    const { container } = render(
      <ArticleVideo
        video={{ src: "https://x.pt/v.mp4", poster: "https://x.pt/p.jpg", durationSeconds: 118 }}
        title="As bruxas"
      />,
    );
    const video = container.querySelector("video")!;
    expect(video.getAttribute("src")).toBe("https://x.pt/v.mp4");
    expect(video.getAttribute("poster")).toBe("https://x.pt/p.jpg");
    expect(video.hasAttribute("controls")).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.getAttribute("preload")).toBe("none");
    expect(video.getAttribute("aria-label")).toBe("Vídeo: As bruxas");
    expect(container.querySelector(".aspect-\\[9\\/16\\]")).not.toBeNull();
  });

  it("sem poster não escreve o atributo", () => {
    const { container } = render(
      <ArticleVideo video={{ src: "https://x.pt/v.mp4", poster: "", durationSeconds: null }} title="x" />,
    );
    expect(container.querySelector("video")!.hasAttribute("poster")).toBe(false);
  });
});
