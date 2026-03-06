import type { BoardSpace } from "@/types/game";

// Original 1975 PayDay board layout as a calendar grid
// 7 columns (Sun-Sat), 5 rows
// Day 0 = START (Sunday of week 1)
// Day 31 = PAY DAY (Wednesday of week 5)

export const BOARD_SPACES: BoardSpace[] = [
  // Row 0 (Week 1): Sun=START, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  { day: 0, type: "start", row: 0, col: 0 },
  { day: 1, type: "mail", row: 0, col: 1 },
  { day: 2, type: "deal", row: 0, col: 2 },
  { day: 3, type: "mail", row: 0, col: 3 },
  { day: 4, type: "mail+deal", row: 0, col: 4 },
  { day: 5, type: "mail", row: 0, col: 5 },
  { day: 6, type: "yard-sale", row: 0, col: 6 },

  // Row 1 (Week 2)
  { day: 7, type: "deal", row: 1, col: 0 },
  { day: 8, type: "mail", row: 1, col: 1 },
  { day: 9, type: "buyer", row: 1, col: 2 },
  { day: 10, type: "deal", row: 1, col: 3 },
  { day: 11, type: "mail", row: 1, col: 4 },
  { day: 12, type: "birthday", row: 1, col: 5 },
  { day: 13, type: "deal", row: 1, col: 6 },

  // Row 2 (Week 3)
  { day: 14, type: "mail", row: 2, col: 0 },
  { day: 15, type: "mail+deal", row: 2, col: 1 },
  { day: 16, type: "buyer", row: 2, col: 2 },
  { day: 17, type: "mail", row: 2, col: 3 },
  { day: 18, type: "deal", row: 2, col: 4 },
  { day: 19, type: "radio", row: 2, col: 5 },
  { day: 20, type: "mail+deal", row: 2, col: 6 },

  // Row 3 (Week 4)
  { day: 21, type: "lottery", row: 3, col: 0 },
  { day: 22, type: "mail", row: 3, col: 1 },
  { day: 23, type: "deal", row: 3, col: 2 },
  { day: 24, type: "buyer", row: 3, col: 3 },
  { day: 25, type: "mail", row: 3, col: 4 },
  { day: 26, type: "deal", row: 3, col: 5 },
  { day: 27, type: "mail+deal", row: 3, col: 6 },

  // Row 4 (Week 5): only 4 days, rest empty
  { day: 28, type: "mail", row: 4, col: 0 },
  { day: 29, type: "deal", row: 4, col: 1 },
  { day: 30, type: "mail", row: 4, col: 2 },
  { day: 31, type: "pay-day", row: 4, col: 3 },
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
