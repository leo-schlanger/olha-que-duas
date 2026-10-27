import { describe, it, expect } from "vitest";
import { isHalloweenActive, getHalloweenPhase } from "./isHalloweenActive";
import { siteConfig } from "@/config/site";

const cfg = {
  enabled: true,
  start: "2026-10-27T00:00:00+00:00",
  end: "2026-11-02T00:00:00+00:00",
  paoPorDeus: "2026-11-01T00:00:00+00:00",
};

describe("isHalloweenActive", () => {
  it("is off before the window", () => {
    expect(isHalloweenActive(new Date("2026-10-26T23:59:59Z"), cfg)).toBe(false);
  });

  it("is on inside the window", () => {
    expect(isHalloweenActive(new Date("2026-10-27T00:00:00Z"), cfg)).toBe(true);
    expect(isHalloweenActive(new Date("2026-10-31T21:00:00Z"), cfg)).toBe(true);
    expect(isHalloweenActive(new Date("2026-11-01T23:59:59Z"), cfg)).toBe(true);
  });

  it("is off from 2 Nov 00:00 Lisbon (WET = UTC) onwards", () => {
    expect(isHalloweenActive(new Date("2026-11-02T00:00:00Z"), cfg)).toBe(false);
    expect(isHalloweenActive(new Date("2027-10-30T12:00:00Z"), cfg)).toBe(false);
  });

  it("is off when disabled, even inside the window", () => {
    expect(isHalloweenActive(new Date("2026-10-31T12:00:00Z"), { ...cfg, enabled: false })).toBe(false);
  });

  it("is off with an invalid date in the config", () => {
    expect(isHalloweenActive(new Date("2026-10-31T12:00:00Z"), { ...cfg, end: "nope" })).toBe(false);
  });

  it("site config ends at 2026-11-02T00:00 Lisbon", () => {
    expect(Date.parse(siteConfig.halloween.end)).toBe(Date.parse("2026-11-02T00:00:00Z"));
    expect(isHalloweenActive(new Date("2026-11-02T00:00:00Z"))).toBe(false);
  });
});

describe("getHalloweenPhase", () => {
  it("switches to Pão-por-Deus on 1 Nov, Lisbon", () => {
    expect(getHalloweenPhase(new Date("2026-10-31T23:59:59Z"), cfg)).toBe("halloween");
    expect(getHalloweenPhase(new Date("2026-11-01T00:00:00Z"), cfg)).toBe("paoPorDeus");
  });
});
