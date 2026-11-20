import { afterEach, describe, expect, it, vi } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// «Ouvir a rádio agora» (hero) -> oqd:play -> RadioPlayer.play(), never a toggle off.
const radio = vi.hoisted(() => ({ play: vi.fn(async () => {}), stop: vi.fn(), isPlaying: false }));

vi.mock("@/hooks/useRadioSync", () => ({
  useRadioSync: () => ({
    song: null, isMusic: false, isLiveShow: false, liveShowName: "", isPodcast: false, podcastName: "",
    podcastArt: null, isAnnouncement: false, announcementName: "", announcementArt: null,
    play: radio.play, stop: radio.stop, isPlaying: radio.isPlaying, isBuffering: false, isReconnecting: false,
    volume: 80, setVolume: vi.fn(), isMuted: false, toggleMute: vi.fn(), debugRef: { current: null },
  }),
}));
// Radix Slider measures itself; jsdom has no ResizeObserver.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

vi.mock("@/hooks/useSchedule", () => ({ useSchedule: () => ({ schedule: [], error: null }) }));

import { listenNow } from "../Hero";
import RadioPlayer from "../RadioPlayer";

const renderPlayer = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RadioPlayer />
    </QueryClientProvider>,
  );

afterEach(() => {
  cleanup();
  radio.play.mockClear();
  radio.stop.mockClear();
  radio.isPlaying = false;
});

describe("listenNow + oqd:play", () => {
  it("scrolls to #radio and asks the player to play", () => {
    const scroll = vi.fn();
    const el = document.createElement("section");
    el.id = "radio";
    el.scrollIntoView = scroll;
    document.body.appendChild(el);
    const heard = vi.fn();
    window.addEventListener("oqd:play", heard);
    const prevent = vi.fn();
    listenNow({ preventDefault: prevent });
    expect(prevent).toHaveBeenCalled();
    expect(scroll).toHaveBeenCalled();
    expect(heard).toHaveBeenCalledTimes(1);
    expect(typeof window.__oqdPlayPending).toBe("number");
    window.__oqdPlayPending = undefined;
    window.removeEventListener("oqd:play", heard);
    el.remove();
  });

  it("the player starts on oqd:play", () => {
    renderPlayer();
    act(() => {
      window.dispatchEvent(new CustomEvent("oqd:play"));
    });
    expect(radio.play).toHaveBeenCalledTimes(1);
    expect(radio.stop).not.toHaveBeenCalled();
  });

  it("a click before the player chunk loaded still starts it on mount (pending request)", () => {
    window.__oqdPlayPending = Date.now() - 3000; // chunk arrived 3 s after the click
    renderPlayer();
    expect(radio.play).toHaveBeenCalledTimes(1);
    expect(window.__oqdPlayPending).toBeUndefined();
  });

  it("an old pending request (> 30 s) is ignored", () => {
    window.__oqdPlayPending = Date.now() - 60_000;
    renderPlayer();
    expect(radio.play).not.toHaveBeenCalled();
    window.__oqdPlayPending = undefined;
  });

  it("does not stop the radio if it is already playing", () => {
    radio.isPlaying = true;
    renderPlayer();
    act(() => {
      window.dispatchEvent(new CustomEvent("oqd:play"));
    });
    expect(radio.play).not.toHaveBeenCalled();
    expect(radio.stop).not.toHaveBeenCalled();
  });

  it("the app line keeps the #app anchor", () => {
    const { container } = renderPlayer();
    expect(container.querySelector("#app a[href*='play.google.com']")).not.toBeNull();
  });
});
