import { describe, it, expect } from "vitest";
import { activeSeason } from "./activeSeason";
import { siteConfig } from "@/config/site";

describe("activeSeason", () => {
  it("resolves each window and the gaps between them", () => {
    expect(activeSeason(new Date("2026-10-26T12:00:00Z"))).toBeNull();
    expect(activeSeason(new Date("2026-10-31T12:00:00Z"))).toBe("halloween");
    expect(activeSeason(new Date("2026-11-05T12:00:00Z"))).toBeNull();
    expect(activeSeason(new Date("2026-11-13T00:00:00Z"))).toBe("natal");
    expect(activeSeason(new Date("2026-12-26T23:59:59Z"))).toBe("natal");
    expect(activeSeason(new Date("2026-12-27T00:00:00Z"))).toBeNull();
  });

  it("windows do not overlap", () => {
    expect(Date.parse(siteConfig.halloween.end)).toBeLessThanOrEqual(Date.parse(siteConfig.natal.start));
  });
});
