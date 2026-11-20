import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Program page «Na rádio» (fase 1, Mente Aberta): pattern, next broadcast, live button.
const row = vi.hoisted(() => ({ value: null as unknown }));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => true,
  getSupabase: () => ({
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: row.value, error: null }) }) }) }),
  }),
}));

import { RadioBox } from "./RadioBox";

const show = (props: Partial<Parameters<typeof RadioBox>[0]> = {}) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <RadioBox eventId="fe2f08cf" accent="#4d6b50" {...props} />
      </MemoryRouter>
    </QueryClientProvider>,
  );

afterEach(() => cleanup());

describe("RadioBox", () => {
  it("Mente Aberta: terça, 11:00 e 17:00 + Ouvir em direto", async () => {
    row.value = { is_active: true, schedule: [{ day_of_week: 2, time: "11:00:00" }, { day_of_week: 2, time: "17:00:00" }], schedule_dates: [] };
    show();
    expect(await screen.findByText("terça, 11:00 e 17:00")).toBeTruthy();
    expect(screen.getByText(/Próxima emissão/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ouvir em direto" }).getAttribute("href")).toBe("/#radio");
    expect(screen.queryByRole("link", { name: "Ir à área Kids" })).toBeNull();
  });

  it("Cantinho gets the Kids link", async () => {
    row.value = { is_active: true, schedule: [{ day_of_week: 1, time: "18:30:00" }], schedule_dates: [] };
    show({ kidsLink: true });
    expect(await screen.findByRole("link", { name: "Ir à área Kids" })).toBeTruthy();
  });

  it("nothing for an inactive event or without event", async () => {
    row.value = { is_active: false, schedule: [{ day_of_week: 2, time: "11:00:00" }], schedule_dates: [] };
    const { container } = show();
    await new Promise((r) => setTimeout(r, 30));
    expect(container.textContent).toBe("");
    cleanup();
    const none = show({ eventId: null });
    expect(none.container.textContent).toBe("");
  });
});
