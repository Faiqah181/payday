import { FONTS } from "./fonts";

export const SD = {
  backdrop: "#F24E3E",
  surface: "#FFF6E4",
  surface2: "#FBEBC8",
  ink: "#2A2118",
  soft: "#8C7A5E",
  line: "#E7D3A8",
  primary: "#1FA45C",
  primaryShadow: "#15713E",
  accent: "#F4B400",
  accentShadow: "#C08A00",
  accentInk: "#5E3D00",
  debt: "#E5432E",
  blue: "#2E7BD6",
  purple: "#8B5CD6",
  white: "#FFFFFF",
  semiWhite: "#FFFFFFCF",
} as const;

export const SD_CATEGORY = {
  mail: "#2E7BD6",
  collect: "#1FA45C",
  bill: "#E5432E",
  deal: "#8B5CD6",
  buyer: "#119C8E",
  rest: "#F2B01C",
  event: "#E84C8A",
  election: "#EF7D2E",
  daylight: "#5566C9",
  pay: "#F4B400",
  start: "#1FA45C",
  plain: "#B7A582",
  pot: "#E84C8A",
} as const;

// Z-index layering tokens — every overlay must use these, never raw numbers.
export const SD_LAYER = {
  /** Persistent in-game chrome floating over the board (docked dice). */
  hud: 10,
  /** Full-screen overlays that behave like screens (bank). */
  screenOverlay: 30,
  /** Bottom drawers & sheets. */
  drawer: 44,
  /** Full-screen game events (poker night, election…). */
  event: 45,
  /** The dice while a roll is in progress. */
  diceRoll: 46,
  /** Item detail pop-ups above drawers. */
  itemModal: 47,
  /** Confirm dialogs — always on top. */
  dialog: 50,
} as const;

// Full-screen event gradients (design: 165deg three-stop washes)
export const SD_EVENT_GRADIENTS = {
  election: ["#2A1C52", "#3F2B6B", "#5A3A8C"],
  poker: ["#0F3D2E", "#155741", "#1C7A54"],
  swellfare: ["#4E1621", "#7C2531", "#AE3543"],
  daylight: ["#232B66", "#3A448F", "#5566C9"],
  commission: ["#3A2354", "#523579", "#6D46A3"],
} as const;

export const SD_AVATAR_COLORS = [
  "#E5432E",
  "#2E7BD6",
  "#1FA45C",
  "#F4B400",
  "#8B5CD6",
  "#E07A2E",
  "#E05B8E",
  "#3AAFA9",
] as const;

const isHex = (color: string) => /^#[0-9a-fA-F]{6}$/.test(color);

export function mixHex(hex: string, target: string, amount: number): string {
  // Only #RRGGBB can be mixed — pass anything else (rgba, named) through
  if (!isHex(hex) || !isHex(target)) return hex;
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(target);
  const mix = (a: number, b: number) =>
    Math.round(a + (b - a) * amount)
      .toString(16)
      .padStart(2, "0");
  return `#${mix(r1, r2)}${mix(g1, g2)}${mix(b1, b2)}`;
}

export const SD_TOKEN_COLORS = [
  { color: "#E5432E", shadow: "#96261A" },
  { color: "#2E7BD6", shadow: "#1D5191" },
  { color: "#1FA45C", shadow: "#15713E" },
  { color: "#F4B400", shadow: "#A97C00" },
] as const;

export const SD_FONT = {
  display: FONTS.display,
  heading: FONTS.bold,
  headingHeavy: FONTS.extrabold,
  body: FONTS.bodySemibold,
  bodyBold: FONTS.bodyBold,
  bodyHeavy: FONTS.bodyExtrabold,
} as const;
