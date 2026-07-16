export type SpaceType =
  | "start"
  | "post-mail"
  | "deal"
  | "asset-buyer"
  | "lazy-sunday"
  | "birthday-gift"
  | "visitor-surprise"
  | "performance-bonus"
  | "poker-game"
  | "school-reunion"
  | "household-essentials"
  | "home-rent"
  | "election"
  | "daylight-saving"
  | "lottery-result"
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
  description: string;
  buyPrice: number;
  sellPrice: number;
  commission: number;
}

export type MailCardType = "ad" | "bill" | "insurance" | "lottery" | "swellfare";
export type BillCategory = "auto" | "doctor" | "dentist" | "other";

export interface MailCard {
  id: number;
  title: string;
  description: string;
  type: MailCardType;
  amount: number;
  billCategory?: BillCategory;
  cancelsCategories?: BillCategory[];
}

export interface HeldLotteryTicket {
  card: MailCard;
  monthReceived: number;
}

export interface Player {
  name: string;
  cash: number;
  loanBalance: number;
  savingsBalance: number;
  position: number; // 0 = start, 1-31 = day
  currentMonth: number; // 1-based, each player tracks independently
  deals: DealCard[];
  unpaidBills: MailCard[];
  lotteryTickets: HeldLotteryTicket[];
  insurance: MailCard[];
  color: string;
  /** Out of the game: maxed the loan and still couldn't pay on Pay Day. */
  bankrupt: boolean;
}

// An account is never chosen — it's a state you enter through play.
// A player has either a loan or savings, never both at once.
export type AccountStatus = "loan" | "savings" | "neutral";

export function getAccountStatus(
  player: Pick<Player, "loanBalance" | "savingsBalance">,
): AccountStatus {
  if (player.savingsBalance > 0) return "savings";
  if (player.loanBalance > 0) return "loan";
  return "neutral";
}

/** One line in the Pot's ledger (elections, swellfare bets, pot wins). */
export interface PotHistoryEntry {
  label: string;
  sub: string;
  amount: number;
}

/** What happened when a player hit Pay Day, for the Pay Day screen. */
export interface PaydayReport {
  /** Cash carried into Pay Day, before salary is collected. */
  openingCash: number;
  salary: number;
  /** Signed: savings interest earned (+) or loan interest charged (−). */
  interest: number;
  /** Balance the interest was computed on. */
  interestOn: number;
  accountStatus: AccountStatus;
  billsPaid: number;
  billTitles: string[];
  /** Savings automatically pulled to cover bills the cash couldn't. */
  autoWithdrawn: number;
  /** Loan automatically taken to cover the rest. */
  autoBorrowed: number;
  /** Bank buy-back of deals & insurance at cost when the loan maxed out. */
  liquidated: number;
  /** Even liquidation couldn't cover the debt — the player retires. */
  bankrupt: boolean;
}

export interface AnimatingMove {
  playerIndex: number;
  from: number;
  to: number;
}

export interface EventMessage {
  title: string;
  description: string;
  amount: number;
}

/** How this match is played — drives turn-taking vs simultaneous flows. */
export type GameMode = "ONLINE" | "P&P";

export interface GameState {
  gameMode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  totalMonths: number;
  phase: "roll" | "event" | "deal" | "commission" | "asset-buyer" | "mail" | "lottery-result" | "salary-day" | "election" | "daylight-saving" | "poker-game" | "end-turn" | "game-over";
  diceValue: number | null;
  animatingMove: AnimatingMove | null;
  eventMessage: EventMessage | null;
  dealDeck: DealCard[];
  currentDeal: DealCard | null;
  mailDeck: MailCard[];
  currentMail: MailCard | null;
  pot: number;
  potHistory: PotHistoryEntry[];
  payday: PaydayReport | null;
  /** Commission from a just-bought deal, up for grabs by the highest roller. */
  pendingCommission: number | null;
  /**
   * Daylight Savings: players still waiting to resolve the space they were
   * moved back onto, in turn order starting with the lander.
   */
  daylightQueue: number[] | null;
  /** Whose turn to restore once the daylight queue is drained. */
  daylightReturnIndex: number | null;
}

export const PLAYER_COLORS = ["#E5432E", "#2E7BD6", "#1FA45C", "#F4B400"];
