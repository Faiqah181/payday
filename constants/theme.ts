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
  plain: "#B7A582",
} as const;

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
