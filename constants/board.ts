import type { BoardSpace, EventMessage, SpaceType } from "@/types/game";
import type { ImageStyle, StyleProp } from "react-native";
import { GAME_CONFIG } from "./gameConfig";
import { SD_CATEGORY } from "./theme";

/** Which icon component a tile draws — BoardCell maps these keys to components. */
export type CellIcon =
  | "coin"
  | "bill"
  | "die"
  | "election"
  | "birthday"
  | "daylight";

/** Everything about a board space in one place. Add a cell = add one entry. */
export interface CellInfo {
  /** Design-system category — drives tile color & art. */
  category: keyof typeof SD_CATEGORY;
  /** Text shown at the bottom of the tile (icon cells without an amount pill). */
  label?: string;
  /** Full-bleed tile artwork (takes priority over `icon`). */
  image?: number;
  /** Enlarge the artwork by this factor via layout (stays sharp — unlike a
   *  transform scale, which upscales the already-rasterized bitmap). */
  imageScale?: number;
  /** Per-cell overrides for the artwork (inset, opacity…), merged over the default. */
  imageStyle?: StyleProp<ImageStyle>;
  /** Drawn icon when there's no `image`. */
  icon?: CellIcon;
  /** Amount pill on the tile / instant cash for election & salary. */
  amount?: number;
  /** Instant cash event resolved on landing (birthdays, bonuses, bills). */
  event?: EventMessage;
}

export const CELL_INFO: Record<SpaceType, CellInfo> = {
  start: { category: "start" },
  "post-mail": {
    label: "Mail",
    category: "mail",
    image: require("@/assets/images/board-cells/3.Mail.png"),
    imageScale: 1.2,
  },
  deal: {
    label: "Deal",
    category: "deal",
    image: require("@/assets/images/board-cells/4.Deal.png"),
    imageScale: 1.5,
  },
  "asset-buyer": {
    label: "Buyer",
    category: "buyer",
    image: require("@/assets/images/board-cells/2.buyer.png"),
    imageScale: 1.2,
  },
  "lazy-sunday": {
    label: "Sunday",
    category: "rest",
    image: require("@/assets/images/board-cells/1.lazy sunday.png"),
    imageScale: 1.2,
  },
  "birthday-gift": {
    category: "collect",
    icon: "birthday",
    event: { title: "Happy Birthday!", description: "It's your birthday! 🎂", amount: 400 },
  },
  "performance-bonus": {
    category: "collect",
    icon: "coin",
    event: { title: "Performance Bonus!", description: "Great work this month! 🏆", amount: 100 },
  },
  "visitor-surprise": {
    category: "bill",
    icon: "bill",
    event: { title: "Surprise Visitor!", description: "An unexpected guest drops by 👋", amount: -40 },
  },
  "school-reunion": {
    category: "bill",
    icon: "bill",
    event: { title: "School Reunion!", description: "Dinner with old friends 🎓", amount: -40 },
  },
  "household-essentials": {
    category: "bill",
    icon: "bill",
    event: { title: "Household Bills!", description: "Time to restock supplies 🏠", amount: -75 },
  },
  "home-rent": {
    category: "bill",
    icon: "bill",
    event: { title: "Rent Due!", description: "Monthly rent payment 🔑", amount: -60 },
  },
  "poker-game": { category: "event", label: "Poker", icon: "die" },
  election: { category: "election", label: "Elections", icon: "election", amount: -50 },
  "daylight-saving": { category: "daylight", label: "Daylight Savings", icon: "daylight" },
  "lottery-result": {
    label: "Lottery",
    category: "event",
    image: require("@/assets/images/board-cells/lottery.png"),
    imageScale: 1.7,
  },
  "salary-day": { category: "pay", amount: GAME_CONFIG.salary },
};

// Salary Day board layout as a calendar grid
// 7 columns (Sun-Sat), 5 rows
// Day 0 = START (Sunday of week 1)
// Day 31 = SALARY DAY (Wednesday of week 5)

export const BOARD_SPACES: BoardSpace[] = [
  // Row 0 (Week 1): Sun=START, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  { day: 0, type: "start", row: 0, col: 0 },
  { day: 1, type: "post-mail", row: 0, col: 1 },
  { day: 2, type: "birthday-gift", row: 0, col: 2 },
  { day: 3, type: "post-mail", row: 0, col: 3 },
  { day: 4, type: "deal", row: 0, col: 4 },
  { day: 5, type: "post-mail", row: 0, col: 5 },
  { day: 6, type: "visitor-surprise", row: 0, col: 6 },

  // Row 1 (Week 2)
  { day: 7, type: "lazy-sunday", row: 1, col: 0 },
  { day: 8, type: "performance-bonus", row: 1, col: 1 },
  { day: 9, type: "asset-buyer", row: 1, col: 2 },
  { day: 10, type: "poker-game", row: 1, col: 3 },
  { day: 11, type: "post-mail", row: 1, col: 4 },
  { day: 12, type: "deal", row: 1, col: 5 },
  { day: 13, type: "school-reunion", row: 1, col: 6 },

  // Row 2 (Week 3)
  { day: 14, type: "lazy-sunday", row: 2, col: 0 },
  { day: 15, type: "deal", row: 2, col: 1 },
  { day: 16, type: "post-mail", row: 2, col: 2 },
  { day: 17, type: "asset-buyer", row: 2, col: 3 },
  { day: 18, type: "household-essentials", row: 2, col: 4 },
  { day: 19, type: "post-mail", row: 2, col: 5 },
  { day: 20, type: "asset-buyer", row: 2, col: 6 },

  // Row 3 (Week 4)
  { day: 21, type: "lazy-sunday", row: 3, col: 0 },
  { day: 22, type: "post-mail", row: 3, col: 1 },
  { day: 23, type: "home-rent", row: 3, col: 2 },
  { day: 24, type: "post-mail", row: 3, col: 3 },
  { day: 25, type: "deal", row: 3, col: 4 },
  { day: 26, type: "election", row: 3, col: 5 },
  { day: 27, type: "daylight-saving", row: 3, col: 6 },

  // Row 4 (Week 5): only 4 days, rest empty
  { day: 28, type: "lazy-sunday", row: 4, col: 0 },
  { day: 29, type: "lottery-result", row: 4, col: 1 },
  { day: 30, type: "asset-buyer", row: 4, col: 2 },
  { day: 31, type: "salary-day", row: 4, col: 3 },
];

export const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

export const BOARD_ROWS = 5;
export const BOARD_COLS = 7;
export const BOARD_CELL_GAP = 4;
export const BOARD_FRAME_PADDING = 6;
export const BOARD_FRAME_BORDER = 2;

// Instant cash change shown as the cell's amount pill
export function getCellAmount(type: SpaceType): number {
  const info = CELL_INFO[type];
  return info.amount ?? info.event?.amount ?? 0;
}

export interface SpaceDetail {
  kind: string;
  title: string;
  sub: string;
  amount: number;
  accent: string;
  rule: string;
}

const CATEGORY_RULES: Record<string, string> = {
  start:
    "Every player begins each month here. Roll the die and travel through the days toward Pay Day.",
  mail: "Draw the number of Mail cards shown. Postcards and ads are free and discarded; bills are kept until Pay Day.",
  collect: "Good fortune! Collect the amount shown from the Bank right away.",
  deal: "Draw the top Deal card. You may buy it (a loan is allowed) and hold it until you land on a Buyer space. When bought, every player rolls for the commission.",
  bill: "An expense lands — pay the amount shown to the Bank right away.",
  rest: "Sweet Sunday — a day of rest. Nothing happens. Enjoy the quiet.",
  buyer:
    "Collect the Value shown on any one Deal card you hold, then return that card to the Deal stack.",
  event:
    "A chance to gamble. Pay in, roll the die, and the highest roller (or a winning roll) takes the money.",
  election:
    "All players contribute $50 to the Pot, then take turns rolling the die. The first to roll a 6 wins the whole Pot.",
  daylight:
    "Each player moves back one space and follows the new space they land on.",
  pay: `Collect your $${GAME_CONFIG.salary} salary, pay your bills and loan interest, then start the new month from Day 1.`,
};

const SPACE_TITLES: Record<SpaceType, { title: string; sub: string; rule?: string }> = {
  start: { title: "Start Here", sub: "Begin the month" },
  "post-mail": { title: "Mail", sub: "You've got mail" },
  deal: { title: "Deal", sub: "An offer on the table" },
  "asset-buyer": { title: "Buyer", sub: "Someone wants your deals" },
  "lazy-sunday": { title: "Sweet Sunday", sub: "A day of rest" },
  "birthday-gift": { title: "Happy Birthday", sub: "Your uncle abroad sends money" },
  "performance-bonus": { title: "Surprise Bonus", sub: "Nice surprise!" },
  "visitor-surprise": { title: "Surprise Visitor", sub: "Guests are over" },
  "school-reunion": { title: "School Reunion", sub: "Dinner with old friends" },
  "household-essentials": { title: "Household Bills", sub: "The weekly shop" },
  "home-rent": { title: "Home Rent", sub: "Monthly rent payment" },
  "poker-game": { title: "Poker Game", sub: "$100 to play" },
  election: { title: "Town Election", sub: "Pay into the pot" },
  "daylight-saving": { title: "Daylight Savings", sub: "Move back one space" },
  "lottery-result": {
    title: "Lottery Draw",
    sub: "Cash your tickets",
    rule: "Cash any Lottery Tickets you drew this month at the Bank. Unused tickets expire at the end of the month.",
  },
  "salary-day": { title: "Pay Day", sub: "Collect your salary" },
};

export function getSpaceDetail(type: SpaceType): SpaceDetail {
  const category = CELL_INFO[type].category;
  const { title, sub, rule } = SPACE_TITLES[type];
  return {
    kind: title.toUpperCase(),
    title,
    sub,
    amount: getCellAmount(type),
    accent: SD_CATEGORY[category],
    rule: rule ?? CATEGORY_RULES[category] ?? "",
  };
}

// Get board space by position (day number)
export function getSpaceByDay(day: number): BoardSpace | undefined {
  return BOARD_SPACES.find((s) => s.day === day);
}

// Get board space at a grid position
export function getSpaceAt(row: number, col: number): BoardSpace | undefined {
  return BOARD_SPACES.find((s) => s.row === row && s.col === col);
}
