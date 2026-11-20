import { describe, expect, it } from "vitest";
import type { DailyPeriod } from "@/hooks/useDailySchedule";
import { radioUpNext, slotMinutes } from "./radioUpNext";

const day: DailyPeriod[] = [
  { period: "madrugada", label: "Madrugada", range: "00h-07h", slots: [{ time: "00h", endTime: "07h", name: "Madrugada Duas" }] },
  { period: "manha", label: "Manhã", range: "07h-12h", slots: [
    { time: "07h", endTime: "10h", name: "Acordar" },
    { time: "10h", endTime: "12h", name: "Manhã com Atitude", subPrograms: [{ time: "10h30", name: "Céu de Cada Mês", isSpecial: true }] },
  ] },
  { period: "tarde", label: "Tarde", range: "12h-20h", slots: [
    { time: "12h", endTime: "14h", name: "Almoço com Duas" },
    { time: "14h", endTime: "20h", name: "Tarde em Movimento" },
  ] },
  { period: "noite", label: "Noite", range: "20h-00h", slots: [
    { time: "20h", endTime: "00h", name: "Noite das Bruxas", isSpecial: true },
    { time: "Dia inteiro", name: "Especial", isAllDay: true },
  ] },
];
const at = (h: number, m = 0) => new Date(2026, 10, 20, h, m);
const names = (r: ReturnType<typeof radioUpNext>) => [r.current?.name, ...r.next.map((s) => s.name)];

describe("radioUpNext", () => {
  it("reads slot times", () => {
    expect(slotMinutes("10h30")).toBe(630);
    expect(slotMinutes("00h")).toBe(0);
    expect(slotMinutes("Dia inteiro")).toBeNull();
  });

  it("now and the next three", () => {
    expect(names(radioUpNext(day, at(10, 5)))).toEqual(["Manhã com Atitude", "Céu de Cada Mês", "Almoço com Duas", "Tarde em Movimento"]);
  });

  it("a nested special is what is on during its slot", () => {
    expect(radioUpNext(day, at(10, 40)).current?.name).toBe("Céu de Cada Mês");
  });

  it("an evening block ending at 00h covers 23:59 and wraps past midnight", () => {
    expect(names(radioUpNext(day, at(23, 59)))).toEqual(["Noite das Bruxas", "Madrugada Duas", "Acordar", "Manhã com Atitude"]);
  });

  it("just after midnight", () => {
    expect(radioUpNext(day, at(0, 1)).current?.name).toBe("Madrugada Duas");
  });

  it("empty schedule", () => {
    expect(radioUpNext(undefined)).toEqual({ current: null, next: [] });
  });
});
