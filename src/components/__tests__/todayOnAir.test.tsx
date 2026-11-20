import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// «Hoje na rádio»: program icon next to each name, OQD medallion when there is none.
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

vi.mock("@/hooks/useDailySchedule", async (orig) => ({
  ...(await orig<typeof import("@/hooks/useDailySchedule")>()),
  useDailySchedule: () => ({
    data: [
      { period: "dia", label: "Dia", range: "00h-24h", slots: [
        { time: "00h", endTime: "12h", name: "Vidioteca", iconUrl: "https://x.pt/vidioteca.png" },
        { time: "12h", endTime: "24h", name: "Sem ícone" },
      ] },
    ],
  }),
}));

import RadioPlayer from "../RadioPlayer";

describe("Hoje na rádio: icons", () => {
  it("shows the program icon (empty alt, fixed size, lazy) and the medallion when missing", () => {
    const { container } = render(
      <QueryClientProvider client={new QueryClient()}>
        <RadioPlayer />
      </QueryClientProvider>,
    );
    const rows = [...container.querySelectorAll("ol li")];
    expect(rows.length).toBe(2);
    const icons = rows.map((li) => li.querySelector("img")!);
    // order follows the clock (what is on now comes first)
    expect(icons.map((i) => i.getAttribute("src")).sort()).toEqual([expect.stringContaining("logo-olha-que-duas"), "https://x.pt/vidioteca.png"]);
    for (const i of icons) {
      expect(i.getAttribute("alt")).toBe("");
      expect(i.getAttribute("width")).toBeTruthy();
      expect(i.getAttribute("height")).toBeTruthy();
      expect(i.getAttribute("loading")).toBe("lazy");
    }
  });
});
