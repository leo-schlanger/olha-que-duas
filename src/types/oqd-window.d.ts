// «Ouvir a rádio agora» (Hero) -> RadioPlayer: timestamp of a click whose
// player chunk had not loaded yet (consumed by the player on mount).
declare global {
  interface Window {
    __oqdPlayPending?: number;
  }
}

export {};
