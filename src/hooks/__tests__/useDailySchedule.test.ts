import { describe, it, expect } from "vitest";
import {
  parsePeriodRange,
  getCurrentPeriodFromSchedule,
  getPeriodBoundaries,
  parseSlotTime,
  formatDuration,
  addDurations,
  type DailyPeriod,
} from "@/hooks/useDailySchedule";

const SAMPLE_SCHEDULE: DailyPeriod[] = [
  {
    period: "manha",
    label: "Manhã",
    range: "07H - 12H",
    slots: [
      { time: "07h", name: "Wake Up Mix" },
      { time: "09h", name: "Hits da Manhã" },
      { time: "10h30", name: "Mini Break" },
    ],
  },
  {
    period: "tarde",
    label: "Tarde",
    range: "12H - 18H",
    slots: [
      { time: "12h", name: "Lunch Beats" },
      { time: "14h", name: "Chill" },
      { time: "16h", name: "Power Hour" },
    ],
  },
  {
    period: "noite",
    label: "Noite",
    range: "18H - 00H",
    slots: [
      { time: "18h", name: "Sunset Mix" },
      { time: "22h", name: "Night Flow" },
    ],
  },
  {
    period: "madrugada",
    label: "Madrugada",
    range: "00H - 07H",
    slots: [
      { time: "00h", name: "Midnight Session" },
      { time: "03h", name: "Relax Mode" },
    ],
  },
];

describe("parsePeriodRange", () => {
  it("parseia ranges normais", () => {
    expect(parsePeriodRange("07H - 12H")).toEqual({ start: 420, end: 720 });
    expect(parsePeriodRange("12H - 18H")).toEqual({ start: 720, end: 1080 });
  });

  it("trata 00H final como fim do dia (1440)", () => {
    expect(parsePeriodRange("18H - 00H")).toEqual({ start: 1080, end: 1440 });
  });

  it("aceita lowercase e espaços extra", () => {
    expect(parsePeriodRange(" 7h-12h ")).toEqual({ start: 420, end: 720 });
  });

  it("devolve null para formato inválido", () => {
    expect(parsePeriodRange("invalid")).toBeNull();
    expect(parsePeriodRange("12-18")).toBeNull();
    expect(parsePeriodRange("")).toBeNull();
  });
});

describe("getCurrentPeriodFromSchedule", () => {
  const at = (h: number, m = 0) => new Date(2026, 3, 16, h, m);

  it("manhã às 09:00", () => {
    expect(getCurrentPeriodFromSchedule(SAMPLE_SCHEDULE, at(9))).toBe("manha");
  });

  it("tarde às 12:00 (boundary inclusivo no início)", () => {
    expect(getCurrentPeriodFromSchedule(SAMPLE_SCHEDULE, at(12))).toBe("tarde");
  });

  it("tarde às 17:59", () => {
    expect(getCurrentPeriodFromSchedule(SAMPLE_SCHEDULE, at(17, 59))).toBe("tarde");
  });

  it("noite às 23:30", () => {
    expect(getCurrentPeriodFromSchedule(SAMPLE_SCHEDULE, at(23, 30))).toBe("noite");
  });

  it("madrugada às 03:15", () => {
    expect(getCurrentPeriodFromSchedule(SAMPLE_SCHEDULE, at(3, 15))).toBe("madrugada");
  });

  it("madrugada exactamente às 00:00", () => {
    expect(getCurrentPeriodFromSchedule(SAMPLE_SCHEDULE, at(0))).toBe("madrugada");
  });

  it("manhã exactamente às 07:00 (boundary com madrugada)", () => {
    expect(getCurrentPeriodFromSchedule(SAMPLE_SCHEDULE, at(7))).toBe("manha");
  });

  it("devolve fallback quando schedule vazio", () => {
    expect(getCurrentPeriodFromSchedule([], at(10))).toBe("manha");
    expect(getCurrentPeriodFromSchedule(undefined, at(10))).toBe("manha");
  });

  it("devolve primeiro período quando nenhum match (gap)", () => {
    const broken: DailyPeriod[] = [{ period: "x", label: "X", range: "invalid", slots: [] }];
    expect(getCurrentPeriodFromSchedule(broken, at(10))).toBe("x");
  });
});

describe("getPeriodBoundaries", () => {
  it("devolve as horas de início de cada período", () => {
    expect(getPeriodBoundaries(SAMPLE_SCHEDULE).sort((a, b) => a - b))
      .toEqual([0, 420, 720, 1080]);
  });

  it("devolve [] quando schedule vazio/undefined", () => {
    expect(getPeriodBoundaries(undefined)).toEqual([]);
    expect(getPeriodBoundaries([])).toEqual([]);
  });

  it("ignora ranges inválidos", () => {
    const mixed: DailyPeriod[] = [
      { period: "ok", label: "ok", range: "07H - 12H", slots: [] },
      { period: "bad", label: "bad", range: "broken", slots: [] },
    ];
    expect(getPeriodBoundaries(mixed)).toEqual([420]);
  });
});

describe("parseSlotTime", () => {
  it("parseia horas inteiras", () => {
    expect(parseSlotTime("07h")).toBe(420);
    expect(parseSlotTime("00h")).toBe(0);
    expect(parseSlotTime("23h")).toBe(1380);
  });

  it("parseia horas com minutos", () => {
    expect(parseSlotTime("10h30")).toBe(630);
    expect(parseSlotTime("14h45")).toBe(885);
  });

  it("devolve 0 para formato inválido", () => {
    expect(parseSlotTime("invalid")).toBe(0);
    expect(parseSlotTime("")).toBe(0);
    expect(parseSlotTime("10:30")).toBe(0);
  });
});

describe("formatDuration", () => {
  it("formata horas inteiras", () => {
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(120)).toBe("2h");
  });

  it("formata horas+minutos", () => {
    expect(formatDuration(90)).toBe("1h30");
    expect(formatDuration(135)).toBe("2h15");
  });

  it("formata só minutos", () => {
    expect(formatDuration(30)).toBe("30min");
    expect(formatDuration(45)).toBe("45min");
  });

  it("devolve string vazia para zero ou negativo", () => {
    expect(formatDuration(0)).toBe("");
    expect(formatDuration(-10)).toBe("");
  });

  it("padding de minutos quando menores que 10", () => {
    expect(formatDuration(65)).toBe("1h05");
  });
});

describe("addDurations", () => {
  it("calcula durações sequenciais dentro de um período", () => {
    const result = addDurations([SAMPLE_SCHEDULE[0]]);
    expect(result[0].slots[0].duration).toBe("2h");      // 07h-09h
    expect(result[0].slots[1].duration).toBe("1h30");    // 09h-10h30
    expect(result[0].slots[2].duration).toBe("1h30");    // 10h30-12h
  });

  it("calcula duração até fim do período para o último slot", () => {
    const result = addDurations([SAMPLE_SCHEDULE[2]]);
    // noite: 18h, 22h → range 18-24h
    expect(result[0].slots[0].duration).toBe("4h");      // 18h-22h
    expect(result[0].slots[1].duration).toBe("2h");      // 22h-24h
  });

  it("trata wrap-around: madrugada último slot até 07h", () => {
    const result = addDurations([SAMPLE_SCHEDULE[3]]);
    expect(result[0].slots[0].duration).toBe("3h");      // 00h-03h
    expect(result[0].slots[1].duration).toBe("4h");      // 03h-07h
  });

  it("não muta input", () => {
    const original = JSON.parse(JSON.stringify(SAMPLE_SCHEDULE));
    addDurations(SAMPLE_SCHEDULE);
    expect(SAMPLE_SCHEDULE).toEqual(original);
  });
});
