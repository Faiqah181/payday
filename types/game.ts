export type SpaceType =
  | "start"
  | "mail"
  | "deal"
  | "mail+deal"
  | "buyer"
  | "lottery"
  | "birthday"
  | "radio"
  | "yard-sale"
  | "salary-day";

export interface BoardSpace {
  day: number; // 0 = start, 1-31 = calendar day
  type: SpaceType;
  row: number; // 0-4
  col: number; // 0-6
}

export interface DealCard {
  id: number;
  title: string;
  buyPrice: number;
  sellPrice: number;
}

export interface MailCard {
  id: number;
  title: string;
  description: string;
  type: "bill" | "ad" | "monster-charge" | "good-stuff";
  amount: number;
}

export interface Player {
  name: string;
  cash: number;
  loanBalance: number;
  accountType: "Savings" | "Loan";
  position: number; // 0 = start, 1-31 = day
  currentMonth: number; // 1-based, each player tracks independently
  deals: DealCard[];
  unpaidBills: MailCard[];
  color: string;
}

export interface AnimatingMove {
  playerIndex: number;
  from: number;
  to: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  totalMonths: number;
  phase: "roll" | "event" | "salary-day" | "end-turn" | "game-over";
  diceValue: number | null;
  animatingMove: AnimatingMove | null;
}

export const PLAYER_COLORS = ["#E53935", "#1E88E5", "#43A047", "#FB8C00"];
