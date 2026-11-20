import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// /servicos (20/11/2026): card buttons pre-select the embedded form's subject.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
window.HTMLElement.prototype.scrollIntoView ??= function () {};

import Servicos, { FAQ, SERVICES, askAbout } from "../Servicos";
import Contacto from "@/components/Contacto";

const wrap = (ui: React.ReactNode, path = "/servicos") =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );

const nativeSelect = (c: HTMLElement) => c.querySelector("#fale-connosco select, select") as HTMLSelectElement | null;

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

describe("/servicos", () => {
  it("each card button sends its own subject", () => {
    const heard: string[] = [];
    const on = (e: Event) => heard.push((e as CustomEvent<string>).detail);
    window.addEventListener("select-contact-subject", on);
    wrap(<Servicos />);
    for (const s of SERVICES) fireEvent.click(screen.getByRole("link", { name: s.cta }));
    window.removeEventListener("select-contact-subject", on);
    expect(heard).toEqual(["consultoria", "redes", "radio", "video"]);
  });

  it("clicking «Anunciar na rádio» selects «Anúncio na rádio» in the embedded form", () => {
    const { container } = wrap(<Servicos />);
    act(() => askAbout("radio"));
    expect(nativeSelect(container)?.value).toBe("radio");
    expect(screen.getByRole("button", { name: /Enviar pedido/ })).toBeTruthy();
    expect(container.querySelector("#contacto")).toBeNull(); // embedded: no home section
  });

  it("?assunto=redes pre-selects the subject", () => {
    window.history.replaceState(null, "", "/servicos?assunto=redes");
    const { container } = wrap(<Contacto variant="servicos" />);
    expect(nativeSelect(container)?.value).toBe("redes");
  });

  it("every FAQ answer is in the DOM, closed ones included (FAQPage = visible text)", () => {
    const { container } = wrap(<Servicos />);
    const text = container.textContent ?? "";
    for (const f of FAQ) expect(text).toContain(f.a);
    expect(container.querySelectorAll("#perguntas details").length).toBe(FAQ.length);
  });

  it("no id collides with the home ids the seasonal CSS paints", () => {
    const { container } = wrap(<Servicos />);
    for (const id of ["radio", "podcast", "app", "dedicatorias", "inicio", "contacto"]) {
      expect(container.querySelector(`#${id}`)).toBeNull();
    }
  });
});
