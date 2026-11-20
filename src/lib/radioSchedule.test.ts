import { describe, expect, it } from "vitest";
import { formatBroadcast, isProgramVisible, nextBroadcast, weeklyPattern } from "./radioSchedule";

// Mente Aberta: terça 11:00 e 17:00 (Lisbon wall time).
const MENTE = [
  { day_of_week: 2, time: "11:00:00", is_active: true },
  { day_of_week: 2, time: "17:00:00", is_active: true },
];

describe("radio schedule (Europe/Lisbon)", () => {
  it("weekly pattern, long and short", () => {
    expect(weeklyPattern(MENTE)).toBe("terça, 11:00 e 17:00");
    expect(weeklyPattern(MENTE, true)).toBe("Ter, 11h e 17h");
    expect(weeklyPattern([{ day_of_week: 6, time: "18:30:00" }], true)).toBe("Sáb, 18h30");
    // Cantinho (qa r8): grouped, not day by day
    const CANTINHO = [1, 2, 3, 4, 5, 6].map((d) => ({ day_of_week: d, time: "18:30:00" })).concat([{ day_of_week: 6, time: "11:00:00" }]);
    expect(weeklyPattern(CANTINHO, true)).toBe("Seg a sáb, 18h30 · sáb, 11h");
    expect(weeklyPattern(CANTINHO)).toBe("segunda a sábado, 18:30; sábado, 11:00");
    // Vidioteca: sábado 13 e 17, domingo 11 e 17
    expect(weeklyPattern([{ day_of_week: 6, time: "13:00" }, { day_of_week: 6, time: "17:00" }, { day_of_week: 0, time: "11:00" }, { day_of_week: 0, time: "17:00" }], true)).toBe("Sáb, 13h e 17h · dom, 11h e 17h");
  });

  it("next Tuesday from a Friday", () => {
    const b = nextBroadcast(MENTE, [], new Date("2026-11-20T15:00:00Z")); // sex 20 nov, 15:00 Lisbon
    expect(b && formatBroadcast(b)).toBe("terça, 24 nov, 11:00");
  });

  it("same Tuesday after 11:00 Lisbon -> 17:00", () => {
    const b = nextBroadcast(MENTE, [], new Date("2026-11-24T12:00:00Z"));
    expect(b && formatBroadcast(b)).toBe("terça, 24 nov, 17:00");
  });

  it("summer time: 10:30 UTC is 11:30 in Lisbon (WEST), so the 11:00 slot has passed", () => {
    const b = nextBroadcast(MENTE, [], new Date("2026-07-07T10:30:00Z")); // terça
    expect(b && formatBroadcast(b)).toBe("terça, 7 jul, 17:00");
  });

  it("DST change week (last Sunday of March): Tuesday stays 11:00 Lisbon", () => {
    const b = nextBroadcast(MENTE, [], new Date("2027-03-27T12:00:00Z")); // sábado antes da mudança
    expect(b && formatBroadcast(b)).toBe("terça, 30 mar, 11:00");
  });

  it("dated slots and inactive ones", () => {
    const b = nextBroadcast([{ day_of_week: 1, time: "10:30:00", is_active: false }], [{ event_date: "2026-12-16", time: "10:30:00", is_active: true }], new Date("2026-11-20T10:00:00Z"));
    expect(b && formatBroadcast(b)).toBe("quarta, 16 dez, 10:30");
    expect(nextBroadcast([], [], new Date())).toBeNull();
  });

  it("visibility rule", () => {
    const now = new Date("2026-11-20T10:00:00Z");
    expect(isProgramVisible({ livePieces: 3 })).toBe(true);
    expect(isProgramVisible({ livePieces: 0, eventActive: true, weekly: MENTE, now })).toBe(true);
    expect(isProgramVisible({ livePieces: 0, eventActive: false, weekly: MENTE, now })).toBe(false);
    expect(isProgramVisible({ livePieces: 0, eventActive: true, weekly: [{ day_of_week: 1, time: "10:00", is_active: false }], dated: [{ event_date: "2026-11-01" }], now })).toBe(false);
    expect(isProgramVisible({ livePieces: 0, eventActive: true, dated: [{ event_date: "2026-12-16" }], now })).toBe(true);
  });
});
