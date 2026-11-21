import { siteConfig } from "@/config/site";

/**
 * «Ouvir» clicked before the player chunk mounted (it mounts after load, perf
 * 21/11/2026): iOS/Safari only let audio start inside the click itself, so the
 * click starts the stream on a fresh <audio> here and the player adopts that
 * element when it mounts (useIcecastPlayer). Once the player is mounted it
 * registers itself and handles the click on its own.
 */
let handed: HTMLAudioElement | null = null;
let playerMounted = false;

/** Call inside the click handler of any «Ouvir» button. */
export function startRadioInGesture(streamUrl: string = siteConfig.radio.streamUrl) {
  if (playerMounted || handed || !siteConfig.radio.isLive || typeof Audio === "undefined") return;
  const audio = new Audio();
  audio.preload = "none";
  audio.src = streamUrl;
  handed = audio;
  // Refused or failed: drop it; the player tries again (and reports) on mount.
  const drop = () => {
    if (handed === audio) handed = null;
  };
  try {
    const started = audio.play();
    if (started && typeof started.catch === "function") started.catch(drop);
  } catch {
    drop();
  }
}

/** The player takes the gesture-started element (once), or null. */
export function adoptRadioAudio(): HTMLAudioElement | null {
  const audio = handed;
  handed = null;
  return audio;
}

/** Left the page before the player mounted: stop the orphan stream. */
export function releaseRadioAudio() {
  if (!handed) return;
  handed.pause();
  handed.removeAttribute("src");
  handed.load();
  handed = null;
}

/** The player tells us it is mounted (true) or gone (false). */
export function setRadioPlayerMounted(mounted: boolean) {
  playerMounted = mounted;
}
