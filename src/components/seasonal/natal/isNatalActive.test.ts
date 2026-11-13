import { describe, it, expect } from "vitest";
import { isNatalActive, getNatalPhase, daysToChristmas } from "./isNatalActive";
import { siteConfig } from "@/config/site";

const cfg = {
  enabled: true,
  start: "2026-11-13T00:00:00+00:00",
  end: "2026-12-27T00:00:00+00:00",
  christmas: "2026-12-25T00:00:00+00:00",
};

describe("isNatalActive", () => {
  it("is off before the window", () => {
    expect(isNatalActive(new Date("2026-11-12T23:59:59Z"), cfg)).toBe(false);
  });

  it("is on inside the window, the whole of 26 Dec included", () => {
    expect(isNatalActive(new Date("2026-11-13T00:00:00Z"), cfg)).toBe(true);
    expect(isNatalActive(new Date("2026-12-24T21:00:00Z"), cfg)).toBe(true);
    expect(isNatalActive(new Date("2026-12-26T23:59:59Z"), cfg)).toBe(true);
  });

  it("is off from 27 Dec 00:00 Lisbon (WET = UTC) onwards", () => {
    expect(isNatalActive(new Date("2026-12-27T00:00:00Z"), cfg)).toBe(false);
    expect(isNatalActive(new Date("2027-12-20T12:00:00Z"), cfg)).toBe(false);
  });

  it("is off when disabled, even inside the window", () => {
    expect(isNatalActive(new Date("2026-12-01T12:00:00Z"), { ...cfg, enabled: false })).toBe(false);
  });

  it("is off with an invalid date in the config", () => {
    expect(isNatalActive(new Date("2026-12-01T12:00:00Z"), { ...cfg, start: "nope" })).toBe(false);
  });

  it("site config runs from 13 Nov to the end of 26 Dec, Lisbon", () => {
    expect(Date.parse(siteConfig.natal.start)).toBe(Date.parse("2026-11-13T00:00:00Z"));
    expect(Date.parse(siteConfig.natal.end)).toBe(Date.parse("2026-12-27T00:00:00Z"));
    expect(isNatalActive(new Date("2026-12-26T23:59:59Z"))).toBe(true);
    expect(isNatalActive(new Date("2026-12-27T00:00:00Z"))).toBe(false);
  });
});

describe("getNatalPhase", () => {
  it("counts down until 23 Dec, then Consoada, Natal and Boas Festas", () => {
    expect(getNatalPhase(new Date("2026-12-23T23:59:59Z"), cfg)).toBe("countdown");
    expect(getNatalPhase(new Date("2026-12-24T00:00:00Z"), cfg)).toBe("consoada");
    expect(getNatalPhase(new Date("2026-12-25T00:00:00Z"), cfg)).toBe("natal");
    expect(getNatalPhase(new Date("2026-12-26T00:00:00Z"), cfg)).toBe("boasFestas");
    expect(getNatalPhase(new Date("2026-12-26T23:59:59Z"), cfg)).toBe("boasFestas");
  });
});

describe("daysToChristmas", () => {
  it("counts whole Lisbon days to 25 Dec", () => {
    expect(daysToChristmas(new Date("2026-11-13T00:00:00Z"), cfg)).toBe(42);
    expect(daysToChristmas(new Date("2026-11-13T18:00:00Z"), cfg)).toBe(42);
    expect(daysToChristmas(new Date("2026-12-23T09:00:00Z"), cfg)).toBe(2);
    expect(daysToChristmas(new Date("2026-12-26T09:00:00Z"), cfg)).toBe(0);
  });
});
