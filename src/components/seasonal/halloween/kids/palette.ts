/**
 * Kids Halloween palette. Drawn from kids' Halloween work that stays friendly:
 * Pinkfong, Super Simple, Peppa Pig and the Google Doodles 2023–24 (indigo and
 * violet nights), Doodle 2019/2021, Hey Duggee and CBeebies (pumpkin orange),
 * Nick Jr. and CBeebies (lime). Sources in ~/.claude/knowledge/fontes/README.md.
 * The same values live as CSS vars in kids-halloween.css (--kh-*).
 */
export const KH = {
  night: "#1d1450",
  indigo: "#2e1f7a",
  violet: "#7c3aed",
  lavender: "#efe7ff",
  orange: "#ff7a1a",
  orangeDeep: "#c2410c",
  lime: "#a3e635",
  pink: "#f472b6",
  ink: "#24123f",
  star: "#fff4c2",
  moon: "#fff1b8",
  moonShade: "#fde58a",
  moonGlow: "rgba(255, 230, 150, 0.45)",
  batBody: "#4a2a8a",
  batWing: "#6d43c4",
  hillBack: "#3d2a86",
  hillFront: "#1f4b45",
  skyGradient: "linear-gradient(180deg, #120c3a 0%, #2e1f7a 42%, #5b34b5 78%, #8a4fd0 100%)",
  skyAurora: "radial-gradient(60% 50% at 25% 30%, rgba(244, 114, 182, 0.28), transparent 70%), radial-gradient(50% 45% at 80% 20%, rgba(163, 230, 53, 0.14), transparent 70%)",
} as const;
