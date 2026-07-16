import { GAME_CONFIG } from "@/constants/gameConfig";
import type { Player } from "@/types/game";

type Funds = Pick<Player, "cash" | "savingsBalance" | "loanBalance">;

/** Affordable from cash + savings + remaining loan headroom combined. */
export function canFinance(player: Funds, price: number): boolean {
  return (
    player.cash +
      player.savingsBalance +
      (GAME_CONFIG.maxLoan - player.loanBalance) >=
    price
  );
}

export interface ShortfallFunding {
  fromSavings: number;
  fromLoan: number;
}

/**
 * How a spend beyond the player's cash gets funded: savings first, then a
 * loan rounded up to borrowStep. Both zero when cash already covers it.
 */
export function shortfallFunding(player: Funds, price: number): ShortfallFunding {
  const gap = price - player.cash;
  if (gap <= 0) return { fromSavings: 0, fromLoan: 0 };
  const fromSavings = Math.min(player.savingsBalance, gap);
  const rest = gap - fromSavings;
  const fromLoan =
    rest > 0
      ? Math.ceil(rest / GAME_CONFIG.borrowStep) * GAME_CONFIG.borrowStep
      : 0;
  return { fromSavings, fromLoan };
}

/** Funding phrase for a confirm body, e.g. "$320 from your savings". */
export function fundingClause({ fromSavings, fromLoan }: ShortfallFunding): string {
  if (fromSavings > 0 && fromLoan > 0) {
    return `$${fromSavings} from savings and a $${fromLoan} loan`;
  }
  if (fromSavings > 0) return `$${fromSavings} from your savings`;
  if (fromLoan > 0) return `a $${fromLoan} loan`;
  return "";
}

/** Confirm-button label, e.g. "Withdraw & buy" / "Borrow & play". */
export function fundingActionLabel(sf: ShortfallFunding, verb: string): string {
  if (sf.fromSavings > 0 && sf.fromLoan > 0) return `Withdraw, borrow & ${verb}`;
  if (sf.fromSavings > 0) return `Withdraw & ${verb}`;
  return `Borrow & ${verb}`;
}
