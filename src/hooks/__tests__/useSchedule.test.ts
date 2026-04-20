import { describe, it, expect } from "vitest";
import { groupScheduleRows } from "@/hooks/useSchedule";

describe("groupScheduleRows", () => {
  it("agrupa exibições do mesmo programa no mesmo dia", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 1, time: "12:00:00", end_time: null, is_all_day: false,
        event: { id: "e1", name: "Nutrição", description: null, icon_url: "" },
      },
      {
        id: "2", event_id: "e1", day_of_week: 1, time: "19:00:00", end_time: null, is_all_day: false,
        event: { id: "e1", name: "Nutrição", description: null, icon_url: "" },
      },
    ];
    const result = groupScheduleRows(rows);
    expect(result).toHaveLength(1);
    expect(result[0].day).toBe("Segunda");
    expect(result[0].show).toBe("Nutrição");
    expect(result[0].times).toEqual(["12:00", "19:00"]);
    expect(result[0].isAllDay).toBe(false);
  });

  it("ordena por dia da semana", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 5, time: "12:00:00", end_time: null, is_all_day: false,
        event: { id: "e1", name: "Sexta Show", description: null, icon_url: "" },
      },
      {
        id: "2", event_id: "e2", day_of_week: 1, time: "12:00:00", end_time: null, is_all_day: false,
        event: { id: "e2", name: "Segunda Show", description: null, icon_url: "" },
      },
    ];
    const result = groupScheduleRows(rows);
    expect(result.map((r) => r.day)).toEqual(["Segunda", "Sexta"]);
  });

  it("trata `event` como array (resposta Supabase às vezes envolve)", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 2, time: "12:00:00", end_time: null, is_all_day: false,
        event: [{ id: "e1", name: "Motivar", description: null, icon_url: "icon.png" }],
      },
    ];
    const result = groupScheduleRows(rows);
    expect(result[0].show).toBe("Motivar");
    expect(result[0].iconUrl).toBe("icon.png");
  });

  it("ignora linhas sem event", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 1, time: "12:00:00", end_time: null, is_all_day: false,
        event: null,
      },
    ];
    expect(groupScheduleRows(rows)).toEqual([]);
  });

  it("trunca tempo para HH:mm", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 1, time: "12:30:45", end_time: null, is_all_day: false,
        event: { id: "e1", name: "X", description: null, icon_url: "" },
      },
    ];
    expect(groupScheduleRows(rows)[0].times).toEqual(["12:30"]);
  });

  it("separa programas diferentes no mesmo dia", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 3, time: "12:00:00", end_time: null, is_all_day: false,
        event: { id: "e1", name: "A", description: null, icon_url: "" },
      },
      {
        id: "2", event_id: "e2", day_of_week: 3, time: "19:00:00", end_time: null, is_all_day: false,
        event: { id: "e2", name: "B", description: null, icon_url: "" },
      },
    ];
    const result = groupScheduleRows(rows);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.show).sort()).toEqual(["A", "B"]);
  });

  it("marca eventos de dia inteiro corretamente", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 6, time: "00:00:00", end_time: null, is_all_day: true,
        event: { id: "e1", name: "Festival", description: null, icon_url: "fest.png" },
      },
    ];
    const result = groupScheduleRows(rows);
    expect(result).toHaveLength(1);
    expect(result[0].isAllDay).toBe(true);
    expect(result[0].times).toEqual([]);
    expect(result[0].endTimes).toEqual([]);
  });

  it("preserva end_time quando disponível", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 1, time: "14:00:00", end_time: "16:00:00", is_all_day: false,
        event: { id: "e1", name: "Workshop", description: null, icon_url: "" },
      },
    ];
    const result = groupScheduleRows(rows);
    expect(result[0].times).toEqual(["14:00"]);
    expect(result[0].endTimes).toEqual(["16:00"]);
    expect(result[0].isAllDay).toBe(false);
  });

  it("agrupa end_times corretamente com múltiplos horários", () => {
    const rows = [
      {
        id: "1", event_id: "e1", day_of_week: 1, time: "10:00:00", end_time: "11:30:00", is_all_day: false,
        event: { id: "e1", name: "Show", description: null, icon_url: "" },
      },
      {
        id: "2", event_id: "e1", day_of_week: 1, time: "19:00:00", end_time: null, is_all_day: false,
        event: { id: "e1", name: "Show", description: null, icon_url: "" },
      },
    ];
    const result = groupScheduleRows(rows);
    expect(result).toHaveLength(1);
    expect(result[0].times).toEqual(["10:00", "19:00"]);
    expect(result[0].endTimes).toEqual(["11:30", null]);
  });
});
