import type { BoardSpace, EventMessage, SpaceType } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";


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
  election: { icon: "megaphone", color: "#1565C0", label: "Elect" },
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

export const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const BOARD_ROWS = 5;
export const BOARD_COLS = 7;

// Get board space by position (day number)
export function getSpaceByDay(day: number): BoardSpace | undefined {
  return BOARD_SPACES.find((s) => s.day === day);
}

// Get board space at a grid position
export function getSpaceAt(row: number, col: number): BoardSpace | undefined {
  return BOARD_SPACES.find((s) => s.row === row && s.col === col);
}
