import BankScreen from "@/components/game/bank/BankScreen";
import Board from "@/components/game/Board";
import CommissionModal from "@/components/game/CommissionModal";
import DaylightSavingModal from "@/components/game/DaylightSavingModal";
import DealCardModal from "@/components/game/DealCardModal";
import DiceRoller, { AnchorRect } from "@/components/game/dice/DiceRoller";
import RollButton from "@/components/game/dice/RollButton";
import CellDetailDrawer from "@/components/game/drawers/CellDetailDrawer";
import DealsDrawer from "@/components/game/drawers/DealsDrawer";
import MailDrawer from "@/components/game/drawers/MailDrawer";
import PauseOverlay from "@/components/game/PauseOverlay";
import ElectionModal from "@/components/game/ElectionModal";
import EventToast from "@/components/game/EventToast";
import GameOverModal from "@/components/game/GameOverModal";
import LotteryRedeemModal from "@/components/game/LotteryRedeemModal";
import MailCardModal from "@/components/game/MailCardModal";
import PokerGameModal from "@/components/game/PokerGameModal";
import PaydayOverlay from "@/components/game/payday/PaydayOverlay";
import SwellfareModal from "@/components/game/SwellfareModal";
import ChunkyButton from "@/components/ui/ChunkyButton";
import PlayerToken from "@/components/ui/PlayerToken";
import ScreenBackground from "@/components/ui/ScreenBackground";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import {
  BOARD_CELL_GAP,
  BOARD_COLS,
  BOARD_FRAME_BORDER,
  BOARD_FRAME_PADDING,
  BOARD_ROWS,
  SPACE_EVENTS,
  getSpaceByDay,
  getSpaceDetail,
  type SpaceDetail,
} from "@/constants/board";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { ALL_DEALS, shuffleDeck } from "@/constants/deals";
import { ALL_MAIL, shuffleMailDeck } from "@/constants/mail";
import type { GameState, PaydayReport, Player, PotHistoryEntry } from "@/types/game";
import { getAccountStatus, PLAYER_COLORS } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useReducer, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const DAY_HEADER_HEIGHT = 23;
const SIDEBAR_MIN_WIDTH = 200;
// Board frame chrome: padding+border on both sides, plus inter-cell gaps
const BOARD_CHROME_H =
  2 * (BOARD_FRAME_PADDING + BOARD_FRAME_BORDER) + (BOARD_COLS - 1) * BOARD_CELL_GAP;
const BOARD_CHROME_V =
  2 * (BOARD_FRAME_PADDING + BOARD_FRAME_BORDER) +
  DAY_HEADER_HEIGHT +
  (BOARD_ROWS - 1) * BOARD_CELL_GAP;
const MAX_POSITION = 31;

type GameAction =
  | { type: "ROLL_DICE"; value: number }
  | { type: "ANIMATION_COMPLETE" }
  | { type: "DISMISS_EVENT" }
  | { type: "BUY_DEAL" }
  | { type: "CONFIRM_COMMISSION"; winnerIndex: number }
  | { type: "DISCARD_DEAL" }
  | { type: "SELL_DEAL"; dealId: number }
  | { type: "SKIP_ASSET_BUYER" }
  | { type: "DISMISS_MAIL" }
  | { type: "BUY_INSURANCE" }
  | { type: "REDEEM_LOTTERY"; ticketIds: number[] }
  | { type: "REPAY_LOAN"; amount: number }
  | { type: "DEPOSIT_SAVINGS"; amount: number }
  | { type: "START_NEW_MONTH" }
  | { type: "TAKE_LOAN"; amount: number }
  | { type: "WITHDRAW_SAVINGS"; amount: number }
  | { type: "USE_SWELLFARE"; bet: number; roll: number }
  | { type: "DISCARD_SWELLFARE" }
  | { type: "CONFIRM_ELECTION" }
  | { type: "CONFIRM_DAYLIGHT_SAVING" }
  | {
      type: "CONFIRM_POKER_GAME";
      participantIndices: number[];
      winnerIndex: number;
    }
  | { type: "SKIP_POKER_GAME" }
  | { type: "END_TURN" };

/**
 * Pay Day settlement, in rule order: collect wages, apply interest,
 * pay all bills. If cash runs short, savings are pulled first (free),
 * then a loan is taken automatically in borrowStep increments. If the
 * loan maxes out, the Bank buys back deals & insurance at cost — and if
 * that still isn't enough, the player goes bankrupt.
 */
function settlePayday(player: Player): { player: Player; report: PaydayReport } {
  const status = getAccountStatus(player);
  let cash = player.cash + GAME_CONFIG.salary;
  let savingsBalance = player.savingsBalance;
  let loanBalance = player.loanBalance;
  let deals = player.deals;
  let insurance = player.insurance;

  const interestOn = status === "savings" ? savingsBalance : loanBalance;
  let interest = 0;
  if (status === "savings") {
    interest = Math.floor((savingsBalance * GAME_CONFIG.savingsInterestPercentage) / 100);
    savingsBalance += interest;
  } else if (status === "loan") {
    interest = -Math.floor((loanBalance * GAME_CONFIG.interestPercentage) / 100);
    cash += interest;
  }

  const billsPaid = player.unpaidBills.reduce((sum, bill) => sum + Math.abs(bill.amount), 0);
  cash -= billsPaid;

  let autoWithdrawn = 0;
  if (cash < 0 && savingsBalance > 0) {
    autoWithdrawn = Math.min(savingsBalance, -cash);
    savingsBalance -= autoWithdrawn;
    cash += autoWithdrawn;
  }
  let autoBorrowed = 0;
  if (cash < 0) {
    const needed = Math.ceil(-cash / GAME_CONFIG.borrowStep) * GAME_CONFIG.borrowStep;
    autoBorrowed = Math.min(needed, GAME_CONFIG.maxLoan - loanBalance);
    loanBalance += autoBorrowed;
    cash += autoBorrowed;
  }

  // Loan is maxed and the debt remains: liquidate cards to the Bank at cost
  let liquidated = 0;
  if (cash < 0 && (deals.length > 0 || insurance.length > 0)) {
    liquidated =
      deals.reduce((sum, deal) => sum + deal.buyPrice, 0) +
      insurance.reduce((sum, card) => sum + card.amount, 0);
    cash += liquidated;
    deals = [];
    insurance = [];
  }

  const bankrupt = cash < 0;

  return {
    player: {
      ...player,
      cash,
      savingsBalance,
      loanBalance,
      deals,
      insurance,
      unpaidBills: [],
    },
    report: {
      salary: GAME_CONFIG.salary,
      interest,
      interestOn,
      accountStatus: status,
      billsPaid,
      billTitles: player.unpaidBills.map((bill) => bill.title),
      autoWithdrawn,
      autoBorrowed,
      liquidated,
      bankrupt,
    },
  };
}

function potEntry(state: GameState, label: string, amount: number): PotHistoryEntry {
  const player = state.players[state.currentPlayerIndex];
  return {
    label,
    sub: `Month ${player.currentMonth} · Day ${player.position}`,
    amount,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ROLL_DICE": {
      const player = state.players[state.currentPlayerIndex];
      const from = player.position;
      const to = Math.min(from + action.value, MAX_POSITION);
      return {
        ...state,
        diceValue: action.value,
        animatingMove: { playerIndex: state.currentPlayerIndex, from, to },
      };
    }
    case "ANIMATION_COMPLETE": {
      if (!state.animatingMove) return state;
      const { playerIndex, to } = state.animatingMove;
      const space = getSpaceByDay(to);
      const event = space ? SPACE_EVENTS[space.type] : undefined;
      const isDeal = space?.type === "deal";

      const updatedPlayers = state.players.map((player, i) => {
        if (i !== playerIndex) return player;
        return { ...player, position: to };
      });

      // Election win: rolled a 6 while election is active
      if (state.electionActive && state.diceValue === 6) {
        const potAmount = state.pot;
        const winnerName = state.players[state.currentPlayerIndex].name;
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          electionActive: false,
          pot: 0,
          potHistory: [
            ...state.potHistory,
            potEntry(state, `${winnerName} rolled a 6 — won the Pot`, -potAmount),
          ],
          phase: "event",
          eventMessage: {
            title: "Election Won!",
            description: "You rolled a 6 and won the Election Pot!",
            amount: potAmount,
          },
        };
      }

      // Deal space: draw a card from the deck
      if (isDeal) {
        let deck = [...state.dealDeck];
        if (deck.length === 0) deck = shuffleDeck([...ALL_DEALS]);
        const [drawnCard, ...remainingDeck] = deck;
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          phase: "deal",
          dealDeck: remainingDeck,
          currentDeal: drawnCard,
        };
      }

      // Post-mail space: draw a mail card
      if (space?.type === "post-mail") {
        let mailDeck = [...state.mailDeck];
        if (mailDeck.length === 0) mailDeck = shuffleMailDeck([...ALL_MAIL]);
        const [drawnMail, ...remainingMail] = mailDeck;
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          phase: "mail",
          mailDeck: remainingMail,
          currentMail: drawnMail,
        };
      }

      // Lottery-result space: redeem lottery tickets
      if (space?.type === "lottery-result") {
        const player = updatedPlayers[playerIndex];
        const validTickets = player.lotteryTickets.filter(
          (t) => t.monthReceived === player.currentMonth,
        );
        if (validTickets.length > 0) {
          return {
            ...state,
            players: updatedPlayers,
            animatingMove: null,
            phase: "lottery-result",
          };
        }
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          phase: "event",
          eventMessage: {
            title: "Lottery Result",
            description: "You have no lottery tickets!",
            amount: 0,
          },
        };
      }

      // Asset-buyer space: sell a deal
      if (space?.type === "asset-buyer") {
        const hasDeals = updatedPlayers[playerIndex].deals.length > 0;
        if (hasDeals) {
          return {
            ...state,
            players: updatedPlayers,
            animatingMove: null,
            phase: "asset-buyer",
          };
        }
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          phase: "event",
          eventMessage: {
            title: "Asset Buyer",
            description: "You have no deals to sell!",
            amount: 0,
          },
        };
      }

      // Poker game space: optional $100 wager, highest roller wins
      if (space?.type === "poker-game") {
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          phase: "poker-game",
        };
      }

      // Daylight Saving space: all players move back 1
      if (space?.type === "daylight-saving") {
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          phase: "daylight-saving",
        };
      }

      // Election space: all players contribute to pot
      if (space?.type === "election") {
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          phase: "election",
        };
      }

      // Salary day: settle wages, interest and bills immediately, then
      // show the Pay Day screen for optional repay/deposit.
      if (space?.type === "salary-day") {
        const settled = settlePayday(updatedPlayers[state.currentPlayerIndex]);
        return {
          ...state,
          players: updatedPlayers.map((p, i) =>
            i === state.currentPlayerIndex ? settled.player : p,
          ),
          animatingMove: null,
          phase: "salary-day",
          payday: settled.report,
        };
      }

      return {
        ...state,
        players: updatedPlayers,
        animatingMove: null,
        phase: event ? "event" : "end-turn",
        eventMessage: event ?? null,
      };
    }
    case "DISMISS_EVENT": {
      const amount = state.eventMessage?.amount ?? 0;
      const updatedPlayers =
        amount !== 0
          ? state.players.map((player, i) => {
              if (i !== state.currentPlayerIndex) return player;
              return { ...player, cash: player.cash + amount };
            })
          : state.players;
      return {
        ...state,
        players: updatedPlayers,
        eventMessage: null,
        phase: "end-turn",
      };
    }
    case "BUY_DEAL": {
      if (!state.currentDeal) return state;
      const deal = state.currentDeal;
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        return {
          ...player,
          cash: player.cash - deal.buyPrice,
          deals: [...player.deals, deal],
        };
      });
      // Rule: when a deal is bought, every player rolls for its commission
      const hasCommission = deal.commission > 0;
      return {
        ...state,
        players: updatedPlayers,
        currentDeal: null,
        pendingCommission: hasCommission ? deal.commission : null,
        phase: hasCommission ? "commission" : "end-turn",
      };
    }
    case "CONFIRM_COMMISSION": {
      const amount = state.pendingCommission ?? 0;
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== action.winnerIndex) return player;
        return { ...player, cash: player.cash + amount };
      });
      return {
        ...state,
        players: updatedPlayers,
        pendingCommission: null,
        phase: "end-turn",
      };
    }
    case "DISCARD_DEAL": {
      if (!state.currentDeal) return state;
      return {
        ...state,
        dealDeck: [...state.dealDeck, state.currentDeal],
        currentDeal: null,
        phase: "end-turn",
      };
    }
    case "SELL_DEAL": {
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        const deal = player.deals.find((d) => d.id === action.dealId);
        if (!deal) return player;
        return {
          ...player,
          cash: player.cash + deal.sellPrice,
          deals: player.deals.filter((d) => d.id !== action.dealId),
        };
      });
      return { ...state, players: updatedPlayers, phase: "end-turn" };
    }
    case "SKIP_ASSET_BUYER": {
      return { ...state, phase: "end-turn" };
    }
    case "DISMISS_MAIL": {
      if (!state.currentMail) return state;
      const mail = state.currentMail;
      if (mail.type === "lottery") {
        const updatedPlayers = state.players.map((player, i) => {
          if (i !== state.currentPlayerIndex) return player;
          return {
            ...player,
            lotteryTickets: [
              ...player.lotteryTickets,
              { card: mail, monthReceived: player.currentMonth },
            ],
          };
        });
        return {
          ...state,
          players: updatedPlayers,
          currentMail: null,
          phase: "end-turn",
        };
      }
      if (mail.type === "bill") {
        const currentPlayer = state.players[state.currentPlayerIndex];
        const isCancelled =
          mail.billCategory &&
          mail.billCategory !== "other" &&
          currentPlayer.insurance.some((ins) =>
            ins.cancelsCategories?.includes(mail.billCategory!),
          );
        if (isCancelled) {
          return { ...state, currentMail: null, phase: "end-turn" };
        }
        const updatedPlayers = state.players.map((player, i) => {
          if (i !== state.currentPlayerIndex) return player;
          return { ...player, unpaidBills: [...player.unpaidBills, mail] };
        });
        return {
          ...state,
          players: updatedPlayers,
          currentMail: null,
          phase: "end-turn",
        };
      }
      // Insurance discard (chose not to buy) / ad / other: just dismiss
      return { ...state, currentMail: null, phase: "end-turn" };
    }
    case "BUY_INSURANCE": {
      if (!state.currentMail || state.currentMail.type !== "insurance")
        return state;
      const insuranceCard = state.currentMail;
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        return {
          ...player,
          cash: player.cash - insuranceCard.amount,
          insurance: [...player.insurance, insuranceCard],
        };
      });
      return {
        ...state,
        players: updatedPlayers,
        currentMail: null,
        phase: "end-turn",
      };
    }
    case "REDEEM_LOTTERY": {
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        const ticketIds = new Set(action.ticketIds);
        const redeemed = player.lotteryTickets.filter((t) =>
          ticketIds.has(t.card.id),
        );
        const totalAmount = redeemed.reduce((sum, t) => sum + t.card.amount, 0);
        return {
          ...player,
          cash: player.cash + totalAmount,
          lotteryTickets: player.lotteryTickets.filter(
            (t) => !ticketIds.has(t.card.id),
          ),
        };
      });
      return { ...state, players: updatedPlayers, phase: "end-turn" };
    }
    case "REPAY_LOAN": {
      // Loans may only be repaid on Pay Day
      if (state.phase !== "salary-day") return state;
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        const amount = Math.max(
          0,
          Math.min(action.amount, player.loanBalance, player.cash),
        );
        return {
          ...player,
          cash: player.cash - amount,
          loanBalance: player.loanBalance - amount,
        };
      });
      return { ...state, players: updatedPlayers };
    }
    case "DEPOSIT_SAVINGS": {
      // Deposits are Pay-Day-only, and never while a loan is open
      if (state.phase !== "salary-day") return state;
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        if (player.loanBalance > 0) return player;
        const amount = Math.max(0, Math.min(action.amount, player.cash));
        return {
          ...player,
          cash: player.cash - amount,
          savingsBalance: player.savingsBalance + amount,
        };
      });
      return { ...state, players: updatedPlayers };
    }
    case "START_NEW_MONTH": {
      // Bankrupt on this Pay Day: the player leaves the game instead
      // of starting a new month.
      if (state.payday?.bankrupt) {
        const bankruptName = state.players[state.currentPlayerIndex].name;
        return {
          ...state,
          players: state.players.map((p, i) =>
            i === state.currentPlayerIndex ? { ...p, bankrupt: true } : p,
          ),
          diceValue: null,
          payday: null,
          phase: "event",
          eventMessage: {
            title: `${bankruptName} Is Bankrupt!`,
            description:
              "The loan is maxed out and the bills can't be paid. They retire from the game.",
            amount: 0,
          },
        };
      }

      const updatedPlayers = state.players.map((p, i) => {
        if (i !== state.currentPlayerIndex) return p;
        const newMonth = p.currentMonth + 1;
        return {
          ...p,
          position: 0,
          currentMonth: newMonth,
          deals: newMonth > state.totalMonths ? [] : p.deals,
          lotteryTickets: p.lotteryTickets.filter(
            (t) => t.monthReceived !== p.currentMonth,
          ),
        };
      });

      const isRetiring =
        updatedPlayers[state.currentPlayerIndex].currentMonth >
        state.totalMonths;
      return {
        ...state,
        players: updatedPlayers,
        diceValue: null,
        payday: null,
        phase: isRetiring ? "event" : "end-turn",
        eventMessage: isRetiring
          ? {
              title: `${state.players[state.currentPlayerIndex].name} Has Retired!`,
              description:
                "All months completed. Waiting for other players to finish.",
              amount: 0,
            }
          : null,
      };
    }
    case "TAKE_LOAN": {
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        // Never a loan and savings at once
        if (getAccountStatus(player) === "savings") return player;
        const amount = Math.min(
          action.amount,
          GAME_CONFIG.maxLoan - player.loanBalance,
        );
        if (amount <= 0) return player;
        return {
          ...player,
          cash: player.cash + amount,
          loanBalance: player.loanBalance + amount,
        };
      });
      return { ...state, players: updatedPlayers };
    }
    case "WITHDRAW_SAVINGS": {
      // Withdrawals are allowed anytime; a fine applies only when
      // GAME_CONFIG.earlySavingWithdrawFine is non-zero.
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        const amount = Math.max(0, Math.min(action.amount, player.savingsBalance));
        const fine =
          (amount / GAME_CONFIG.borrowStep) * GAME_CONFIG.earlySavingWithdrawFine;
        return {
          ...player,
          cash: player.cash + amount - fine,
          savingsBalance: player.savingsBalance - amount,
        };
      });
      return { ...state, players: updatedPlayers };
    }
    case "USE_SWELLFARE": {
      const { bet, roll } = action;
      const won = roll >= 5;
      const cashDelta = won ? bet * 10 : -bet;
      const newPot = won ? state.pot : state.pot + bet;
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        return { ...player, cash: player.cash + cashDelta };
      });
      return {
        ...state,
        players: updatedPlayers,
        currentMail: null,
        pot: newPot,
        potHistory: won
          ? state.potHistory
          : [
              ...state.potHistory,
              potEntry(
                state,
                `Swellfare — ${state.players[state.currentPlayerIndex].name} lost the bet`,
                bet,
              ),
            ],
        phase: "end-turn",
      };
    }
    case "DISCARD_SWELLFARE": {
      return { ...state, currentMail: null, phase: "end-turn" };
    }
    case "CONFIRM_POKER_GAME": {
      const { participantIndices, winnerIndex } = action;
      const prize = participantIndices.length * 100;
      const updatedPlayers = state.players.map((player, i) => {
        if (!participantIndices.includes(i)) return player;
        const delta = i === winnerIndex ? prize - 100 : -100;
        return { ...player, cash: player.cash + delta };
      });
      return { ...state, players: updatedPlayers, phase: "end-turn" };
    }
    case "SKIP_POKER_GAME": {
      return { ...state, phase: "end-turn" };
    }
    case "CONFIRM_DAYLIGHT_SAVING": {
      const playerCount = state.players.length;

      // Move all players back 1; Start players collect wages again and stay
      const movedPlayers = state.players.map((player, i) => {
        if (player.position === 0) {
          return { ...player, cash: player.cash + GAME_CONFIG.salary };
        }
        const newPos = player.position - 1;
        if (i !== state.currentPlayerIndex) {
          // Auto-apply instant event for non-current players; skip complex spaces
          const sp = getSpaceByDay(newPos);
          const ev = sp ? SPACE_EVENTS[sp.type] : undefined;
          return {
            ...player,
            position: newPos,
            cash: player.cash + (ev?.amount ?? 0),
          };
        }
        return { ...player, position: newPos };
      });

      // Resolve current player's new space
      const currentPlayer = movedPlayers[state.currentPlayerIndex];
      const currentSpace = getSpaceByDay(currentPlayer.position);

      if (currentSpace?.type === "election") {
        // Inline election: all players contribute $50, electionActive = true
        const contribution = 50;
        const withElection = movedPlayers.map((player) => {
          let cash = player.cash - contribution;
          let savings = player.savingsBalance;
          let loan = player.loanBalance;
          if (cash < 0 && savings > 0) {
            const withdrawal = Math.min(savings, -cash);
            savings -= withdrawal;
            cash += withdrawal;
          }
          if (cash < 0) {
            const loanNeeded = Math.ceil(-cash / 100) * 100;
            loan += loanNeeded;
            cash += loanNeeded;
          }
          return {
            ...player,
            cash,
            savingsBalance: savings,
            loanBalance: loan,
          };
        });
        const newPot = state.pot + playerCount * contribution;
        return {
          ...state,
          players: withElection,
          pot: newPot,
          potHistory: [
            ...state.potHistory,
            potEntry(state, "Town Election — all paid in", playerCount * contribution),
          ],
          electionActive: true,
          phase: "end-turn",
        };
      }

      // Generic fallback: apply instant event for current player if any
      const ev = currentSpace ? SPACE_EVENTS[currentSpace.type] : undefined;
      const finalPlayers = ev
        ? movedPlayers.map((player, i) => {
            if (i !== state.currentPlayerIndex) return player;
            return { ...player, cash: player.cash + ev.amount };
          })
        : movedPlayers;
      return {
        ...state,
        players: finalPlayers,
        phase: ev ? "event" : "end-turn",
        eventMessage: ev ?? null,
      };
    }
    case "CONFIRM_ELECTION": {
      const contribution = 50;
      const updatedPlayers = state.players.map((player) => {
        let cash = player.cash - contribution;
        let savings = player.savingsBalance;
        let loan = player.loanBalance;
        if (cash < 0 && savings > 0) {
          const withdrawal = Math.min(savings, -cash);
          savings -= withdrawal;
          cash += withdrawal;
        }
        if (cash < 0) {
          const loanNeeded = Math.ceil(-cash / 100) * 100;
          loan += loanNeeded;
          cash += loanNeeded;
        }
        return { ...player, cash, savingsBalance: savings, loanBalance: loan };
      });
      const newPot = state.pot + state.players.length * contribution;
      return {
        ...state,
        players: updatedPlayers,
        pot: newPot,
        potHistory: [
          ...state.potHistory,
          potEntry(
            state,
            "Town Election — all paid in",
            state.players.length * contribution,
          ),
        ],
        electionActive: true,
        phase: "end-turn",
      };
    }
    case "END_TURN": {
      const updatedPlayers = state.players;
      const isOut = (p: Player) =>
        p.bankrupt || p.currentMonth > state.totalMonths;

      // Check game over: everyone has finished their months or gone bankrupt
      if (updatedPlayers.every(isOut)) {
        return {
          ...state,
          players: updatedPlayers,
          phase: "game-over",
          diceValue: null,
        };
      }

      // Skip players who are out of the game
      let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      while (isOut(updatedPlayers[nextIndex])) {
        nextIndex = (nextIndex + 1) % state.players.length;
      }

      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        phase: "roll",
      };
    }
    default:
      return state;
  }
}

function createInitialState(params: {
  playerCount: number;
  monthCount: number;
  names: string[];
}): GameState {
  return {
    gameMode: "P&P",
    players: Array.from({ length: params.playerCount }, (_, i) => ({
      name: params.names[i] || `Player ${i + 1}`,
      cash: GAME_CONFIG.initialCash,
      loanBalance: 0,
      savingsBalance: 0,
      position: 0,
      currentMonth: 1,
      deals: [],
      unpaidBills: [],
      lotteryTickets: [],
      insurance: [],
      color: PLAYER_COLORS[i],
      bankrupt: false,
    })),
    currentPlayerIndex: 0,
    totalMonths: params.monthCount,
    phase: "roll",
    diceValue: null,
    animatingMove: null,
    eventMessage: null,
    dealDeck: shuffleDeck([...ALL_DEALS]),
    currentDeal: null,
    mailDeck: shuffleMailDeck([...ALL_MAIL]),
    currentMail: null,
    pot: 0,
    potHistory: [],
    electionActive: false,
    payday: null,
    pendingCommission: null,
  };
}

export default function Game() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;
  const [boardContainerHeight, setBoardContainerHeight] = useState(0);
  const [boardLoading, setBoardLoading] = useState(true);

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 900));
    const preload = Asset.loadAsync([
      require("@/assets/images/board-cells/1.lazy sunday.png"),
      require("@/assets/images/board-cells/2.buyer.png"),
      require("@/assets/images/board-cells/3.Mail.png"),
      require("@/assets/images/board-cells/4.Deal.png"),
      require("@/assets/images/board-cells/lottery.png"),
    ]).catch(() => {});
    Promise.all([preload, minDelay]).then(() => setBoardLoading(false));
  }, []);

  const routeParams = useLocalSearchParams<{
    playerNames: string;
    playerCount: string;
    monthCount: string;
  }>();

  const playerCount = Number(routeParams.playerCount) || 2;
  const monthCount = Number(routeParams.monthCount) || 3;
  const names = routeParams.playerNames?.split(",") ?? [];

  const [gameState, dispatch] = useReducer(
    gameReducer,
    { playerCount, monthCount, names },
    createInitialState,
  );

  const { players, currentPlayerIndex } = gameState;
  const currentPlayer = players[currentPlayerIndex];
  const [showCardsViewer, setShowCardsViewer] = useState<
    "deals" | "mail" | null
  >(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [rollAnchor, setRollAnchor] = useState<AnchorRect | null>(null);
  const [rolling, setRolling] = useState(false);
  const [cellDetail, setCellDetail] = useState<SpaceDetail | null>(null);
  const canBank = gameState.phase === "roll" || gameState.phase === "end-turn";

  // Compute cellSize based on orientation
  const sidebarWidth = isLandscape
    ? Math.max(width * 0.3, SIDEBAR_MIN_WIDTH)
    : 0;

  const cellSize = isLandscape
    ? Math.min(
        (height - insets.top - insets.bottom - BOARD_CHROME_V - 16) / BOARD_ROWS,
        (width - sidebarWidth - 12 - BOARD_CHROME_H - insets.left - insets.right) /
          BOARD_COLS,
      )
    : (width - 16 - BOARD_CHROME_H) / BOARD_COLS;

  // Portrait: cells grow taller to fill available vertical space
  const portraitCellHeight =
    boardContainerHeight > 0
      ? (boardContainerHeight - BOARD_CHROME_V) / BOARD_ROWS
      : cellSize;

  const pauseOverlay = showPause ? (
    <PauseOverlay
      month={currentPlayer.currentMonth}
      totalMonths={gameState.totalMonths}
      playerCount={players.length}
      onResume={() => setShowPause(false)}
      onLeave={() => router.dismissAll()}
    />
  ) : null;

  const topBar = (
    <View style={styles.topBar}>
      <ChunkyButton
        color={SD.surface2}
        depthColor="rgba(0,0,0,0.1)"
        depth={3}
        borderRadius={13}
        contentStyle={styles.topBtnFace}
        onPress={() => setShowPause(true)}
      >
        <Ionicons name="settings-sharp" size={20} color={SD.ink} />
      </ChunkyButton>
      <View style={styles.topCenter}>
        <Typography design="title" style={styles.monthLabel}>
          Month {currentPlayer.currentMonth} of {gameState.totalMonths}
        </Typography>
        <Typography design="body" weight={800} style={styles.turnLabel}>
          {currentPlayer.name.toUpperCase()}'S TURN
        </Typography>
      </View>
      <ChunkyButton
        color={SD.accent}
        depthColor={SD.accentShadow}
        depth={3}
        borderRadius={13}
        disabled={!canBank}
        contentStyle={styles.topBtnFace}
        onPress={() => setShowBankModal(true)}
      >
        <Typography design="money" style={styles.bankGlyph}>
          $
        </Typography>
      </ChunkyButton>
    </View>
  );

  const retiredIndices = new Set(
    players.flatMap((p, i) =>
      p.bankrupt || p.currentMonth > gameState.totalMonths ? [i] : [],
    ),
  );

  const board = (
    <Board
      players={players}
      currentPlayerIndex={currentPlayerIndex}
      cellSize={cellSize}
      animatingMove={gameState.animatingMove}
      retiredPlayerIndices={retiredIndices}
      onAnimationComplete={() => dispatch({ type: "ANIMATION_COMPLETE" })}
      onCellPress={(type) => setCellDetail(getSpaceDetail(type))}
    />
  );

  const mailCount =
    currentPlayer.unpaidBills.length +
    currentPlayer.lotteryTickets.length +
    currentPlayer.insurance.length;
  const dealCount = currentPlayer.deals.length;

  const quickAccess = (
    <View style={styles.quickRow}>
      <ChunkyButton
        color={SD.blue}
        depthColor="rgba(0,0,0,0.14)"
        depth={3}
        borderRadius={13}
        style={styles.quickBtn}
        contentStyle={styles.quickFace}
        onPress={() => setShowCardsViewer("mail")}
      >
        <View style={styles.quickIcon}>
          <Ionicons name="mail" size={15} color={SD.white} />
        </View>
        <Typography design="body" weight={800} style={styles.quickLabel}>
          MAIL
        </Typography>
        <View style={styles.quickSpacer} />
        <View style={styles.quickCount}>
          <Typography design="title" style={styles.quickCountText}>
            {String(mailCount)}
          </Typography>
        </View>
      </ChunkyButton>
      <ChunkyButton
        color={SD.purple}
        depthColor="rgba(0,0,0,0.14)"
        depth={3}
        borderRadius={13}
        style={styles.quickBtn}
        contentStyle={styles.quickFace}
        onPress={() => setShowCardsViewer("deals")}
      >
        <View style={styles.quickIcon}>
          <Ionicons name="pricetags" size={14} color={SD.white} />
        </View>
        <Typography design="body" weight={800} style={styles.quickLabel}>
          DEALS
        </Typography>
        <View style={styles.quickSpacer} />
        <View style={styles.quickCount}>
          <Typography design="title" style={styles.quickCountText}>
            {String(dealCount)}
          </Typography>
        </View>
      </ChunkyButton>
    </View>
  );

  const savings = currentPlayer.savingsBalance;
  const loan = currentPlayer.loanBalance;
  const bankLabel = savings > 0 ? "SAVINGS" : loan > 0 ? "LOAN" : "BANK";
  const bankValue = savings > 0 ? `+$${savings}` : loan > 0 ? `-$${loan}` : "$0";
  const bankColor = savings > 0 ? SD.primary : loan > 0 ? SD.debt : SD.soft;
  const cashText =
    currentPlayer.cash < 0
      ? `-$${Math.abs(currentPlayer.cash).toLocaleString("en-US")}`
      : `$${currentPlayer.cash.toLocaleString("en-US")}`;

  const hud = (
    <View style={styles.hud}>
      <PlayerToken
        initial={currentPlayer.name?.trim()?.[0]?.toUpperCase() || "?"}
        color={currentPlayer.color}
        size={38}
      />
      <View style={styles.hudText}>
        <Typography design="title" style={styles.hudName} numberOfLines={1}>
          {currentPlayer.name}
        </Typography>
        <Typography design="body" weight={800} style={styles.hudDay}>
          {currentPlayer.position === 0
            ? "At Start"
            : `On Day ${currentPlayer.position}`}{" "}
          · your turn
        </Typography>
      </View>
      <View style={styles.hudCol}>
        <Typography design="body" weight={800} style={styles.hudColLabel}>
          CASH
        </Typography>
        <Typography
          design="money"
          style={[
            styles.hudColValue,
            { color: currentPlayer.cash < 0 ? SD.debt : SD.primary },
          ]}
        >
          {cashText}
        </Typography>
      </View>
      <View style={styles.hudDivider} />
      <View style={styles.hudCol}>
        <Typography design="body" weight={800} style={styles.hudColLabel}>
          {bankLabel}
        </Typography>
        <Typography design="money" style={[styles.hudColValue, { color: bankColor }]}>
          {bankValue}
        </Typography>
      </View>
    </View>
  );

  const actionBar = (
    <View style={styles.actionBar}>
      <RollButton
        disabled={gameState.phase !== "roll" || gameState.animatingMove !== null}
        onPress={() => setRolling(true)}
        onAnchorChange={setRollAnchor}
      />
      <ChunkyButton
        color={SD.primary}
        depthColor={SD.primaryShadow}
        depth={4}
        borderRadius={15}
        disabled={gameState.phase !== "end-turn"}
        style={styles.endBtn}
        contentStyle={styles.endFace}
        onPress={() => dispatch({ type: "END_TURN" })}
      >
        <Typography design="title" style={styles.endLabel}>
          End Turn
        </Typography>
      </ChunkyButton>
    </View>
  );

  const eventToast = gameState.eventMessage ? (
    <EventToast
      event={gameState.eventMessage}
      onDismiss={() => dispatch({ type: "DISMISS_EVENT" })}
    />
  ) : null;

  const cardsViewer =
    showCardsViewer === "mail" ? (
      <MailDrawer
        bills={currentPlayer.unpaidBills}
        lotteryTickets={currentPlayer.lotteryTickets}
        insurance={currentPlayer.insurance}
        onClose={() => setShowCardsViewer(null)}
      />
    ) : showCardsViewer === "deals" ? (
      <DealsDrawer
        deals={currentPlayer.deals}
        onClose={() => setShowCardsViewer(null)}
      />
    ) : null;

  const mailModal =
    gameState.currentMail && gameState.currentMail.type !== "swellfare" ? (
      <MailCardModal
        mail={gameState.currentMail}
        onDismiss={() => dispatch({ type: "DISMISS_MAIL" })}
        onBuyInsurance={() => dispatch({ type: "BUY_INSURANCE" })}
        isCancelledByInsurance={
          gameState.currentMail.type === "bill" &&
          gameState.currentMail.billCategory !== "other" &&
          !!gameState.currentMail.billCategory &&
          currentPlayer.insurance.some((ins) =>
            ins.cancelsCategories?.includes(
              gameState.currentMail!.billCategory!,
            ),
          )
        }
      />
    ) : null;

  const gameOverModal =
    gameState.phase === "game-over" ? (
      <GameOverModal
        players={gameState.players}
        totalMonths={gameState.totalMonths}
        onRematch={() => router.replace("/game-setup")}
        onClose={() => router.dismissAll()}
      />
    ) : null;

  const pokerGameModal =
    gameState.phase === "poker-game" ? (
      <PokerGameModal
        players={gameState.players}
        currentPlayerIndex={currentPlayerIndex}
        gameMode={gameState.gameMode}
        onConfirm={(participantIndices, winnerIndex) =>
          dispatch({
            type: "CONFIRM_POKER_GAME",
            participantIndices,
            winnerIndex,
          })
        }
        onSkip={() => dispatch({ type: "SKIP_POKER_GAME" })}
      />
    ) : null;

  const daylightSavingModal =
    gameState.phase === "daylight-saving" ? (
      <DaylightSavingModal
        players={gameState.players}
        onConfirm={() => dispatch({ type: "CONFIRM_DAYLIGHT_SAVING" })}
      />
    ) : null;

  const electionModal =
    gameState.phase === "election" ? (
      <ElectionModal
        players={gameState.players}
        pot={gameState.pot}
        currentPlayerIndex={currentPlayerIndex}
        onConfirm={() => dispatch({ type: "CONFIRM_ELECTION" })}
      />
    ) : null;

  const swellfareModal =
    gameState.phase === "mail" &&
    gameState.currentMail?.type === "swellfare" ? (
      <SwellfareModal
        player={currentPlayer}
        pot={gameState.pot}
        onUse={(bet: number, roll: number) =>
          dispatch({ type: "USE_SWELLFARE", bet, roll })
        }
        onDiscard={() => dispatch({ type: "DISCARD_SWELLFARE" })}
      />
    ) : null;

  const lotteryModal =
    gameState.phase === "lottery-result" ? (
      <LotteryRedeemModal
        tickets={currentPlayer.lotteryTickets.filter(
          (t) => t.monthReceived === currentPlayer.currentMonth,
        )}
        onRedeem={(ticketIds) =>
          dispatch({ type: "REDEEM_LOTTERY", ticketIds })
        }
      />
    ) : null;

  const assetBuyerViewer =
    gameState.phase === "asset-buyer" ? (
      <DealsDrawer
        deals={currentPlayer.deals}
        mode="sell"
        onSell={(deal) => dispatch({ type: "SELL_DEAL", dealId: deal.id })}
        onClose={() => dispatch({ type: "SKIP_ASSET_BUYER" })}
      />
    ) : null;

  const salaryDayModal =
    gameState.phase === "salary-day" && gameState.payday ? (
      <PaydayOverlay
        player={currentPlayer}
        report={gameState.payday}
        month={currentPlayer.currentMonth}
        totalMonths={gameState.totalMonths}
        onRepay={(amount) => dispatch({ type: "REPAY_LOAN", amount })}
        onDeposit={(amount) => dispatch({ type: "DEPOSIT_SAVINGS", amount })}
        onDone={() => dispatch({ type: "START_NEW_MONTH" })}
      />
    ) : null;

  const bankModal = showBankModal ? (
    <BankScreen
      players={players}
      currentPlayerIndex={currentPlayerIndex}
      pot={gameState.pot}
      potHistory={gameState.potHistory}
      onTakeLoan={(amount) => dispatch({ type: "TAKE_LOAN", amount })}
      onWithdrawSavings={(amount) => dispatch({ type: "WITHDRAW_SAVINGS", amount })}
      onClose={() => setShowBankModal(false)}
    />
  ) : null;

  const dealModal = gameState.currentDeal ? (
    <DealCardModal
      deal={gameState.currentDeal}
      onBuy={() => dispatch({ type: "BUY_DEAL" })}
      onDiscard={() => dispatch({ type: "DISCARD_DEAL" })}
    />
  ) : null;

  const cellDetailDrawer = cellDetail ? (
    <CellDetailDrawer detail={cellDetail} onClose={() => setCellDetail(null)} />
  ) : null;

  const commissionModal =
    gameState.phase === "commission" && gameState.pendingCommission != null ? (
      <CommissionModal
        players={gameState.players}
        amount={gameState.pendingCommission}
        onConfirm={(winnerIndex) =>
          dispatch({ type: "CONFIRM_COMMISSION", winnerIndex })
        }
      />
    ) : null;

  const diceRoller = (
    <DiceRoller
      anchor={rollAnchor}
      rolling={rolling}
      dimmed={gameState.phase !== "roll" || gameState.animatingMove !== null}
      onComplete={(value) => {
        setRolling(false);
        dispatch({ type: "ROLL_DICE", value });
      }}
    />
  );

  if (boardLoading) {
    return <LoadingScreen />;
  }

  if (isLandscape) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.landscapeContainer}>
          {/* Left: Board */}
          <View style={styles.leftPanel}>{board}</View>

          {/* Right: Controls */}
          <View style={[styles.rightPanel, { width: sidebarWidth }]}>
            {topBar}
            <View style={styles.sidebarContent}>
              {quickAccess}
              {hud}
              {actionBar}
            </View>
          </View>
          {gameOverModal}
          {eventToast}
          {bankModal}
          {pokerGameModal}
          {daylightSavingModal}
          {electionModal}
          {salaryDayModal}
          {dealModal}
          {cardsViewer}
          {mailModal}
          {swellfareModal}
          {lotteryModal}
          {assetBuyerViewer}
          {commissionModal}
          {cellDetailDrawer}
          {diceRoller}
          {pauseOverlay}
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container}>
        {topBar}
        <View
          style={styles.boardArea}
          onLayout={(e) => setBoardContainerHeight(e.nativeEvent.layout.height)}
        >
          <Board
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            cellSize={cellSize}
            cellHeight={portraitCellHeight}
            animatingMove={gameState.animatingMove}
            retiredPlayerIndices={retiredIndices}
            onAnimationComplete={() => dispatch({ type: "ANIMATION_COMPLETE" })}
            onCellPress={(type) => setCellDetail(getSpaceDetail(type))}
          />
        </View>
        {quickAccess}
        {hud}
        {actionBar}
        {gameOverModal}
        {eventToast}
        {bankModal}
        {pokerGameModal}
        {daylightSavingModal}
        {electionModal}
        {salaryDayModal}
        {dealModal}
        {cardsViewer}
        {mailModal}
        {swellfareModal}
        {lotteryModal}
        {assetBuyerViewer}
        {commissionModal}
        {cellDetailDrawer}
        {diceRoller}
        {pauseOverlay}
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  landscapeContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  leftPanel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightPanel: {
    flexDirection: "column",
    justifyContent: "center",
    flexShrink: 0,
  },
  sidebarContent: {
    flex: 1,
    justifyContent: "center",
    gap: 10,
    overflow: "hidden",
  },
  boardArea: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topBtnFace: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bankGlyph: {
    fontSize: 18,
    color: "#7A4E00",
  },
  topCenter: {
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 17,
    color: SD.ink,
  },
  turnLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: SD.soft,
  },
  quickRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 14,
  },
  quickBtn: {
    flex: 1,
  },
  quickFace: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  quickIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: SD.white,
  },
  quickSpacer: {
    flex: 1,
  },
  quickCount: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickCountText: {
    fontSize: 13,
    color: SD.white,
  },
  hud: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: SD.surface2,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
  },
  hudText: {
    flex: 1,
    minWidth: 0,
  },
  hudName: {
    fontSize: 15,
    color: SD.ink,
  },
  hudDay: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: SD.soft,
  },
  hudCol: {
    alignItems: "flex-end",
  },
  hudColLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: SD.soft,
  },
  hudColValue: {
    fontSize: 15,
  },
  hudDivider: {
    width: 2,
    height: 32,
    borderRadius: 2,
    backgroundColor: SD.line,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 14,
    marginTop: 9,
    borderTopWidth: 2,
    borderTopColor: SD.line,
  },
  endBtn: {
    flex: 1,
  },
  endFace: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  endLabel: {
    fontSize: 17,
    color: SD.white,
  },
});
