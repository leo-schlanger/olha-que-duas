import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { HubProgram } from "@/hooks/useExclusivePrograms";
import { filterPrograms, ProgramBadges, TodayOnRadio } from "./hubBits";

const base = { title: "", author: "", tagline: "", description: "", portrait_url: "", portrait_focus: "", cover_url: "", sort_order: 0, is_published: true, created_at: "", updated_at: "" };
const P: HubProgram[] = [
  { ...base, id: "1", slug: "noticias", title: "Notícias", livePieces: 12 },
  { ...base, id: "2", slug: "mente-aberta", title: "Mente Aberta", livePieces: 3, event_id: "e", radio: { id: "e", is_active: true, schedule: [{ day_of_week: 2, time: "11:00:00" }, { day_of_week: 2, time: "17:00:00" }] } },
  { ...base, id: "3", slug: "top-10", title: "Top 10", livePieces: 0, event_id: "t", radio: { id: "t", is_active: true, schedule: [{ day_of_week: 5, time: "20:00:00" }] } },
];
afterEach(() => cleanup());

describe("hub", () => {
  it("chips filter: para ler / na rádio", () => {
    expect(filterPrograms(P, "ler").map((p) => p.slug)).toEqual(["noticias", "mente-aberta"]);
    expect(filterPrograms(P, "radio").map((p) => p.slug)).toEqual(["mente-aberta", "top-10"]);
    expect(filterPrograms(P, "todos")).toHaveLength(3);
  });

  it("badges: pieces and short radio pattern", () => {
    render(<ProgramBadges program={P[1]} />);
    expect(screen.getByText("Ler · 3 peças")).toBeTruthy();
    expect(screen.getByText("Rádio · Ter 11h e 17h")).toBeTruthy();
  });

  it("today on radio: only programs with a broadcast today (Friday 20/11: Top 10 at 20:00)", () => {
    render(
      <MemoryRouter>
        <TodayOnRadio programs={P} now={new Date("2026-11-20T10:00:00Z")} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /20:00 · Top 10/ })).toBeTruthy();
    expect(screen.queryByText(/Mente Aberta/)).toBeNull();
  });
});
