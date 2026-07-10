import type { BoardSpace, EventMessage, SpaceType } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { GAME_CONFIG } from "./gameConfig";
import { SD_CATEGORY } from "./theme";


export const SPACE_CONFIG: Record<
  SpaceType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }
> = {
  start: { icon: "flag", color: "#43A047", label: "START" },
  "post-mail": { icon: "mail", color: "#1E88E5", label: "Mail" },
  deal: { icon: "briefcase", color: "#43A047", label: "Deal" },
  "asset-buyer": { icon: "cart", color: "#8E24AA", label: "Buyer" },
  "lazy-sunday": { icon: "bed", color: "#78909C", label: "Rest" },
  "birthday-gift": { icon: "gift", color: "#E91E63", label: "B-Day" },
  "visitor-surprise": { icon: "people", color: "#EF6C00", label: "Visit" },
  "performance-bonus": { icon: "trophy", color: "#F9A825", label: "Bonus" },
  "poker-game": { icon: "game-controller", color: "#00897B", label: "Poker" },
  "school-reunion": { icon: "shirt", color: "#AD1457", label: "Reun." },
  "household-essentials": { icon: "home", color: "#EF6C00", label: "Bills" },
  "home-rent": { icon: "key", color: "#6D4C41", label: "Rent" },
  election: { icon: "megaphone", color: "#1565C0", label: "Election" },
  "daylight-saving": { icon: "sunny", color: "#FFA000", label: "DST" },
  "lottery-result": { icon: "ticket", color: "#F9A825", label: "Lotto" },
  "salary-day": { icon: "cash", color: "#2E7D32", label: "PAY" },
};

export const SPACE_EVENTS: Partial<Record<SpaceType, EventMessage>> = {
  "birthday-gift": { title: "Happy Birthday!", description: "It's your birthday! 🎂", amount: 400 },
  "performance-bonus": { title: "Performance Bonus!", description: "Great work this month! 🏆", amount: 100 },
  "visitor-surprise": { title: "Surprise Visitor!", description: "An unexpected guest drops by 👋", amount: -50 },
  "school-reunion": { title: "School Reunion!", description: "Dinner with old friends 🎓", amount: -40 },
  "household-essentials": { title: "Household Bills!", description: "Time to restock supplies 🏠", amount: -75 },
  "home-rent": { title: "Rent Due!", description: "Monthly rent payment 🔑", amount: -50 },
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
export const BOARD_CELL_GAP = 6;
export const BOARD_FRAME_PADDING = 9;
export const BOARD_FRAME_BORDER = 3;

// Design-system category per space type (drives tile color, icon, art)
export const SPACE_CATEGORY: Record<SpaceType, keyof typeof SD_CATEGORY> = {
  start: "start",
  "post-mail": "mail",
  deal: "deal",
  "asset-buyer": "buyer",
  "lazy-sunday": "rest",
  "birthday-gift": "collect",
  "performance-bonus": "collect",
  "visitor-surprise": "bill",
  "school-reunion": "bill",
  "household-essentials": "bill",
  "home-rent": "bill",
  "poker-game": "event",
  election: "election",
  "daylight-saving": "daylight",
  "lottery-result": "event",
  "salary-day": "pay",
};

// Labels shown on icon cells that carry no amount pill
export const SPACE_CELL_LABELS: Partial<Record<SpaceType, string>> = {
  "poker-game": "Poker",
  "daylight-saving": "Daylight",
};

// Instant cash change shown as the cell's amount pill
export function getCellAmount(type: SpaceType): number {
  if (type === "election") return -50;
  if (type === "salary-day") return GAME_CONFIG.salary;
  return SPACE_EVENTS[type]?.amount ?? 0;
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
  bill: "An expense lands. Keep the bill and pay it on your next Pay Day.",
  rest: "Sweet Sunday — a day of rest. Nothing happens. Enjoy the quiet.",
  buyer:
    "Collect the Value shown on any one Deal card you hold, then return that card to the Deal stack.",
  event:
    "A chance to gamble. Pay in, roll the die, and the highest roller (or a winning roll) takes the money.",
  election:
    "All players contribute $50 to the Pot. The next player to roll a 6 on their turn wins the whole Pot.",
  daylight:
    "Each player moves back one space and follows the new space they land on.",
  pay: `Collect your $${GAME_CONFIG.salary} wages, pay your bills and loan interest, then start the new month from Day 1.`,
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
  "salary-day": { title: "Pay Day", sub: "Collect your wages" },
};

export function getSpaceDetail(type: SpaceType): SpaceDetail {
  const category = SPACE_CATEGORY[type];
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
