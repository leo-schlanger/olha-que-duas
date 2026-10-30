import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { ArticleVideo } from "./ArticleVideo";

describe("ArticleVideo", () => {
  it("renderiza vídeo vertical com controlos, playsinline, poster e sem pré-carregar", () => {
    const { container } = render(
      <ArticleVideo
        video={{ kind: "mp4", src: "https://x.pt/v.mp4", embedUrl: "", poster: "https://x.pt/p.jpg", durationSeconds: 118 }}
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
      <ArticleVideo video={{ kind: "mp4", src: "https://x.pt/v.mp4", embedUrl: "", poster: "", durationSeconds: null }} title="x" />,
    );
    expect(container.querySelector("video")!.hasAttribute("poster")).toBe(false);
  });

  it("YouTube: miniatura clicável e só carrega o iframe nocookie depois do clique", () => {
    const { container, getByRole } = render(
      <ArticleVideo
        video={{
          kind: "youtube",
          src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          poster: "https://x.pt/poster.jpg",
          durationSeconds: null,
        }}
        title="As bruxas"
      />,
    );
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.querySelector("img")!.getAttribute("src")).toBe("https://x.pt/poster.jpg");
    fireEvent.click(getByRole("button", { name: "Ver o vídeo: As bruxas" }));
    const iframe = container.querySelector("iframe")!;
    expect(iframe.getAttribute("src")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&playsinline=1&rel=0");
    expect(iframe.getAttribute("loading")).toBe("lazy");
    expect(container.querySelector(".aspect-\\[9\\/16\\]")).not.toBeNull();
  });
});
