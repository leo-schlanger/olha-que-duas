import { describe, it, expect } from "vitest";
import { mergeTodayPrograms } from "@/lib/mergeTodayPrograms";
import { groupScheduleRows, datedRowsToWeekly } from "@/hooks/useSchedule";
import type { DailyPeriod } from "@/hooks/useDailySchedule";

// Saturday 31/10/2026, local time
const SAT = new Date(2026, 9, 31, 19, 40);

const periods = (): DailyPeriod[] => [
  {
    period: "tarde", label: "Tarde", range: "12H - 18H",
    slots: [
      { time: "12h", endTime: "14h", name: "Almoço com Duas" },
      { time: "14h", endTime: "17h", name: "Tarde em Movimento" },
      { time: "17h", endTime: "19h", name: "Ritmo da Cidade" },
    ],
  },
  {
    period: "noite", label: "Noite", range: "18H - 00H",
    slots: [
      { time: "19h", endTime: "21h", name: "Golden Time" },
      { time: "21h", endTime: "23h", name: "Noite Duas" },
      { time: "23h", endTime: "00h", name: "Love Sessions" },
    ],
  },
];

const ev = (name: string) => ({ id: name, name, description: null, icon_url: `${name}.png` });
const weeklyRow = (name: string, time: string, end: string | null) => ({
  id: `${name}-${time}`, event_id: name, day_of_week: 6, time, end_time: end, is_all_day: false, event: ev(name),
});
const datedRow = (name: string, time: string, end: string | null) => ({
  id: `${name}-${time}`, event_id: name, event_date: "2026-10-31", time, end_time: end, is_all_day: false, event: ev(name),
});

// Production data of 31/10/2026
function schedule31Oct(dated = [
  datedRow("Halloween da Pequenada", "18:30:00", "19:30:00"),
  datedRow("Noite das Bruxas", "20:00:00", "00:00:00"),
]) {
  return groupScheduleRows([
    weeklyRow("Cantinho da Pequenada", "18:30:00", "19:30:00"),
    weeklyRow("Divas & Reis", "20:00:00", "21:00:00"),
    ...datedRowsToWeekly(dated, "2026-10-31"),
  ]);
}

const noite = (p: DailyPeriod[]) => p.find((x) => x.period === "noite")!;

describe("mergeTodayPrograms — evento datado até à meia-noite", () => {
  it("aninha o Divas, a Noite Duas e as Love Sessions dentro da Noite das Bruxas", () => {
    const slots = noite(mergeTodayPrograms(periods(), schedule31Oct(), SAT)).slots;
    expect(slots.map((s) => s.name)).toEqual([
      "Cantinho da Pequenada", "Golden Time", "Noite das Bruxas",
    ]);
    const bruxas = slots[2];
    expect(bruxas).toMatchObject({ time: "20h", endTime: "00h", duration: "4h", isSpecial: true });
    expect(bruxas.subPrograms!.map((s) => [s.name, s.time, s.endTime, s.duration])).toEqual([
      ["Divas & Reis", "20h", "21h", "1h"],
      ["Noite Duas", "21h", "23h", "2h"],
      ["Love Sessions", "23h", "00h", "1h"],
    ]);
  });

  it("mantém o Halloween da Pequenada aninhado no Cantinho, com faixa horária", () => {
    const slots = noite(mergeTodayPrograms(periods(), schedule31Oct(), SAT)).slots;
    expect(slots[0]).toMatchObject({ name: "Cantinho da Pequenada", time: "18h30", endTime: "19h30", duration: "1h" });
    expect(slots[0].subPrograms!.map((s) => s.name)).toEqual(["Halloween da Pequenada"]);
    expect(slots[1]).toMatchObject({ name: "Golden Time", time: "19h30", duration: "30min" });
  });

  it("não cria retoma às 00h dentro da Noite", () => {
    const slots = noite(mergeTodayPrograms(periods(), schedule31Oct(), SAT)).slots;
    expect(slots.some((s) => s.time === "00h")).toBe(false);
  });

  it("especial semanal até à meia-noite esconde a rotina que cobre (takeover)", () => {
    const weekly = groupScheduleRows([weeklyRow("Especial", "21:00:00", "00:00:00")]);
    const slots = noite(mergeTodayPrograms(periods(), weekly, SAT)).slots;
    expect(slots.map((s) => s.name)).toEqual(["Golden Time", "Especial"]);
    expect(slots[1]).toMatchObject({ endTime: "00h", duration: "3h" });
    expect(slots[1].subPrograms).toBeUndefined();
  });

  it("evento datado que começa à hora de um programa de rotina aninha-o em vez de o apagar", () => {
    const sched = groupScheduleRows(datedRowsToWeekly([datedRow("Especial Datado", "21:00:00", "23:00:00")], "2026-10-31"));
    const slots = noite(mergeTodayPrograms(periods(), sched, SAT)).slots;
    expect(slots.map((s) => s.name)).toEqual(["Golden Time", "Especial Datado", "Love Sessions"]);
    expect(slots[1].subPrograms!.map((s) => s.name)).toEqual(["Noite Duas"]);
  });

  it("noutro dia da semana não mexe na grelha", () => {
    const sunday = new Date(2026, 10, 1, 12, 0);
    const result = mergeTodayPrograms(periods(), schedule31Oct(), sunday);
    expect(noite(result).slots.map((s) => s.name)).toEqual(["Golden Time", "Noite Duas", "Love Sessions"]);
  });
});
