import { afterEach, describe, expect, it, vi } from "vitest";
import { adoptRadioAudio, releaseRadioAudio, setRadioPlayerMounted, startRadioInGesture } from "./radioGesture";

// qa 21/11: «Ouvir» before the player mounts must call play() inside the click (iOS).
class FakeAudio {
  static made: FakeAudio[] = [];
  src = "";
  preload = "";
  paused = true;
  play = vi.fn(() => {
    this.paused = false;
    return Promise.resolve();
  });
  pause = vi.fn(() => {
    this.paused = true;
  });
  load = vi.fn();
  removeAttribute = vi.fn((name: string) => {
    if (name === "src") this.src = "";
  });
  constructor() {
    FakeAudio.made.push(this);
  }
}
vi.stubGlobal("Audio", FakeAudio);

afterEach(() => {
  releaseRadioAudio();
  adoptRadioAudio();
  setRadioPlayerMounted(false);
  FakeAudio.made = [];
});

describe("radioGesture", () => {
  it("plays the stream synchronously in the click and hands that element to the player once", () => {
    startRadioInGesture("https://radio.example/stream.mp3");
    expect(FakeAudio.made).toHaveLength(1);
    const audio = FakeAudio.made[0];
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(audio.src).toBe("https://radio.example/stream.mp3");
    startRadioInGesture("https://radio.example/stream.mp3");
    expect(FakeAudio.made).toHaveLength(1);
    expect(adoptRadioAudio()).toBe(audio);
    expect(adoptRadioAudio()).toBeNull();
  });

  it("does nothing once the player is mounted (it handles the click itself)", () => {
    setRadioPlayerMounted(true);
    startRadioInGesture("https://radio.example/stream.mp3");
    expect(FakeAudio.made).toHaveLength(0);
  });

  it("stops an orphan stream when the page is left before the player mounted", () => {
    startRadioInGesture("https://radio.example/stream.mp3");
    const audio = FakeAudio.made[0];
    releaseRadioAudio();
    expect(audio.pause).toHaveBeenCalled();
    expect(audio.src).toBe("");
    expect(adoptRadioAudio()).toBeNull();
  });
});
