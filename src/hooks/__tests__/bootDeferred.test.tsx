import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { usePWA } from "../usePWA";
import { HASH_SEEK_TRIES, useHashScroll } from "../useHashScroll";

afterEach(() => {
  cleanup();
  window.__oqdInstallPrompt = undefined;
  vi.useRealTimers();
});

describe("usePWA", () => {
  it("uses a beforeinstallprompt caught at boot, before the hook mounted", () => {
    window.__oqdInstallPrompt = Object.assign(new Event("beforeinstallprompt"), {
      prompt: async () => {},
      userChoice: Promise.resolve({ outcome: "dismissed" as const }),
    });
    const { result } = renderHook(() => usePWA());
    expect(result.current.isInstallable).toBe(true);
  });

  it("is not installable without the event", () => {
    const { result } = renderHook(() => usePWA());
    expect(result.current.isInstallable).toBe(false);
  });
});

describe("useHashScroll", () => {
  const Probe = () => {
    useHashScroll();
    return null;
  };

  for (const delay of [0, 900, 2500]) {
    it(`reaches a section that appears ${delay} ms late`, () => {
      vi.useFakeTimers();
      const scroll = vi.fn();
      render(
        <MemoryRouter initialEntries={["/#app"]}>
          <Probe />
        </MemoryRouter>,
      );
      act(() => vi.advanceTimersByTime(delay));
      const el = document.createElement("div");
      el.id = "app";
      el.scrollIntoView = scroll;
      document.body.appendChild(el);
      act(() => vi.advanceTimersByTime(HASH_SEEK_TRIES * 100 + 100 - delay));
      expect(scroll).toHaveBeenCalledTimes(1);
      el.remove();
    });
  }

  it("gives up after ~3 s", () => {
    vi.useFakeTimers();
    const timeouts = vi.spyOn(window, "setTimeout");
    render(
      <MemoryRouter initialEntries={["/#nada"]}>
        <Probe />
      </MemoryRouter>,
    );
    act(() => vi.advanceTimersByTime(10_000));
    expect(timeouts.mock.calls.filter(([, ms]) => ms === 100).length).toBe(HASH_SEEK_TRIES);
  });
});
