import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NatalFooterScene from "./NatalFooterScene";
import NatalHeroScene from "./NatalHeroScene";

// Team request (20/11): no string of lights, no holly, no cartoon star on the trees.
describe("Natal scenes (adult look)", () => {
  it.each([
    ["footer", NatalFooterScene],
    ["hero", NatalHeroScene],
  ])("%s has no string of lights", (_name, Scene) => {
    const { container } = render(<Scene />);
    expect(container.querySelector(".nt-lights")).toBeNull();
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("footer has no holly berries and draws gifts in the corner", () => {
    const { container } = render(<NatalFooterScene />);
    // holly berries were r=4 circles in red
    expect(container.querySelectorAll("circle")).toHaveLength(0);
    expect(container.querySelectorAll("svg[viewBox=\"0 0 48 48\"]").length).toBeGreaterThanOrEqual(4);
  });
});
