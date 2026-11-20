import { describe, expect, it } from "vitest";
import { visiblePrograms } from "./programRadio";

const now = new Date("2026-11-20T10:00:00Z");
const P = [
  { id: "a", slug: "noticias" },
  { id: "b", slug: "top-10", event_id: "e1" },
  { id: "c", slug: "sem-nada", event_id: "e2" },
  { id: "d", slug: "so-texto-sem-pecas" },
  { id: "f", slug: "data-passada", event_id: "e3" },
];
const E = [
  { id: "e1", is_active: true, schedule: [{ day_of_week: 5, time: "20:00:00", is_active: true }] },
  { id: "e2", is_active: false, schedule: [{ day_of_week: 5, time: "20:00:00", is_active: true }] },
  { id: "e3", is_active: true, schedule: [], schedule_dates: [{ event_date: "2026-11-01", time: "10:30", is_active: true }] },
];

describe("visiblePrograms (hub, sitemap, middleware)", () => {
  it("live pieces or an active radio event; order kept", () => {
    expect(visiblePrograms(P, ["a"], E, now).map((p) => p.slug)).toEqual(["noticias", "top-10"]);
  });
  it("a program without piece and without schedule stays out (404/noindex)", () => {
    expect(visiblePrograms(P, [], [], now).map((p) => p.slug)).toEqual([]);
  });
});
