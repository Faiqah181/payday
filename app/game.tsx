import BankModal from "@/components/game/BankModal";
import DaylightSavingModal from "@/components/game/DaylightSavingModal";
import ElectionModal from "@/components/game/ElectionModal";
import PokerGameModal from "@/components/game/PokerGameModal";
import SwellfareModal from "@/components/game/SwellfareModal";
import Board from "@/components/game/Board";
import DealCardModal from "@/components/game/DealCardModal";
import DealsViewer from "@/components/game/DealsViewer";
import Dice from "@/components/game/Dice";
import EventToast from "@/components/game/EventToast";
import LotteryRedeemModal from "@/components/game/LotteryRedeemModal";
import MailCardModal from "@/components/game/MailCardModal";
import SalaryDayModal from "@/components/game/SalaryDayModal";
import PlayerCard from "@/components/game/PlayerCard";
import {
  BOARD_COLS,
  BOARD_ROWS,
  SPACE_EVENTS,
  getSpaceByDay,
} from "@/constants/board";
import { COLORS, SPACING } from "@/constants/colors";
import { ALL_DEALS, shuffleDeck } from "@/constants/deals";
import { ALL_MAIL, shuffleMailDeck } from "@/constants/mail";
import { useSound } from "@/contexts/SoundContext";
import type { GameState } from "@/types/game";
import { PLAYER_COLORS } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useReducer, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const DAY_HEADER_HEIGHT = 16;
const SIDEBAR_MIN_WIDTH = 200;
const MAX_POSITION = 31;

type GameAction =
  | { type: "ROLL_DICE"; value: number }
  | { type: "ANIMATION_COMPLETE" }
  | { type: "DISMISS_EVENT" }
  | { type: "BUY_DEAL" }
  | { type: "DISCARD_DEAL" }
  | { type: "SELL_DEAL"; dealId: number }
  | { type: "SKIP_ASSET_BUYER" }
  | { type: "DISMISS_MAIL" }
  | { type: "BUY_INSURANCE" }
  | { type: "REDEEM_LOTTERY"; ticketIds: number[] }
  | { type: "SKIP_LOTTERY" }
  | { type: "FINISH_SALARY_DAY"; loanPayment: number; savingsAdjust: number }
  | { type: "TAKE_LOAN"; amount: number }
  | { type: "WITHDRAW_SAVINGS"; amount: number }
  | { type: "USE_SWELLFARE"; bet: number; roll: number }
  | { type: "DISCARD_SWELLFARE" }
  | { type: "CONFIRM_ELECTION" }
  | { type: "CONFIRM_DAYLIGHT_SAVING" }
  | { type: "CONFIRM_POKER_GAME"; participantIndices: number[]; winnerIndex: number }
  | { type: "SKIP_POKER_GAME" }
  | { type: "END_TURN" };

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
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          electionActive: false,
          pot: 0,
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
        return { ...state, players: updatedPlayers, animatingMove: null, phase: "poker-game" };
      }

      // Daylight Saving space: all players move back 1
      if (space?.type === "daylight-saving") {
        return { ...state, players: updatedPlayers, animatingMove: null, phase: "daylight-saving" };
      }

      // Election space: all players contribute to pot
      if (space?.type === "election") {
        return { ...state, players: updatedPlayers, animatingMove: null, phase: "election" };
      }

      // Salary day: trigger dedicated modal phase
      if (space?.type === "salary-day") {
        return {
          ...state,
          players: updatedPlayers,
          animatingMove: null,
          phase: "salary-day",
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
      const updatedPlayers = amount !== 0
        ? state.players.map((player, i) => {
            if (i !== state.currentPlayerIndex) return player;
            return { ...player, cash: player.cash + amount };
          })
        : state.players;
      return { ...state, players: updatedPlayers, eventMessage: null, phase: "end-turn" };
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
      return {
        ...state,
        players: updatedPlayers,
        currentDeal: null,
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
    case "SKIP_LOTTERY": {
      return { ...state, phase: "end-turn" };
    }
    case "FINISH_SALARY_DAY": {
      const player = state.players[state.currentPlayerIndex];

      // Step 1: Collect salary
      let cash = player.cash + 325;
      let savingsBalance = player.savingsBalance;
      let loanBalance = player.loanBalance;

      // Step 2: Interest
      savingsBalance += Math.floor(savingsBalance * 0.10);
      loanBalance   += Math.floor(loanBalance   * 0.20);

      // Step 3: Auto-pay all bills
      const billTotal = player.unpaidBills.reduce((sum, b) => sum + b.amount, 0);
      cash -= billTotal;
      if (cash < 0 && savingsBalance > 0) {
        const withdrawal = Math.min(savingsBalance, -cash);
        savingsBalance -= withdrawal;
        cash += withdrawal;
      }
      if (cash < 0) {
        const loanNeeded = Math.ceil(-cash / 100) * 100;
        loanBalance += loanNeeded;
        cash += loanNeeded;
      }

      // Step 4: Optional player adjustments
      const safePayment = Math.max(0, Math.min(action.loanPayment, loanBalance, cash));
      cash -= safePayment;
      loanBalance -= safePayment;

      const safeAdjust = action.savingsAdjust > 0
        ? Math.min(action.savingsAdjust, cash)
        : Math.max(action.savingsAdjust, -savingsBalance);
      cash -= safeAdjust;
      savingsBalance += safeAdjust;

      // Step 5: Month-end reset
      const updatedPlayers = state.players.map((p, i) => {
        if (i !== state.currentPlayerIndex) return p;
        return {
          ...p,
          cash,
          loanBalance,
          savingsBalance,
          position: 0,
          currentMonth: p.currentMonth + 1,
          unpaidBills: [],
          lotteryTickets: p.lotteryTickets.filter(
            (t) => t.monthReceived !== p.currentMonth,
          ),
        };
      });

      return { ...state, players: updatedPlayers, diceValue: null, phase: "end-turn" };
    }
    case "TAKE_LOAN": {
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        return {
          ...player,
          cash: player.cash + action.amount,
          loanBalance: player.loanBalance + action.amount,
        };
      });
      return { ...state, players: updatedPlayers };
    }
    case "WITHDRAW_SAVINGS": {
      const fineCount = action.amount / 100;
      const fine = fineCount * 50;
      const updatedPlayers = state.players.map((player, i) => {
        if (i !== state.currentPlayerIndex) return player;
        return {
          ...player,
          cash: player.cash + action.amount - fine,
          savingsBalance: player.savingsBalance - action.amount,
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
      return { ...state, players: updatedPlayers, currentMail: null, pot: newPot, phase: "end-turn" };
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

      // Move all players back 1; Start players collect $325 and stay
      const movedPlayers = state.players.map((player, i) => {
        if (player.position === 0) {
          return { ...player, cash: player.cash + 325 };
        }
        const newPos = player.position - 1;
        if (i !== state.currentPlayerIndex) {
          // Auto-apply instant event for non-current players; skip complex spaces
          const sp = getSpaceByDay(newPos);
          const ev = sp ? SPACE_EVENTS[sp.type] : undefined;
          return { ...player, position: newPos, cash: player.cash + (ev?.amount ?? 0) };
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
          return { ...player, cash, savingsBalance: savings, loanBalance: loan };
        });
        const newPot = state.pot + playerCount * contribution;
        return { ...state, players: withElection, pot: newPot, electionActive: true, phase: "end-turn" };
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
      return { ...state, players: updatedPlayers, pot: newPot, electionActive: true, phase: "end-turn" };
    }
    case "END_TURN": {
      const updatedPlayers = state.players;

      // Check game over: all players have completed all months
      const allDone = updatedPlayers.every(
        (p) => p.currentMonth > state.totalMonths,
      );
      if (allDone) {
        return {
          ...state,
          players: updatedPlayers,
          phase: "game-over",
          diceValue: null,
        };
      }

      // Skip players who have already finished all months
      let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      while (updatedPlayers[nextIndex].currentMonth > state.totalMonths) {
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
  accounts: string[];
}): GameState {
  return {
    players: Array.from({ length: params.playerCount }, (_, i) => ({
      name: params.names[i] || `Player ${i + 1}`,
      cash: 500,
      loanBalance: 0,
      savingsBalance: 0,
      accountType: (params.accounts[i] as "Savings" | "Loan") || "Savings",
      position: 0,
      currentMonth: 1,
      deals: [],
      unpaidBills: [],
      lotteryTickets: [],
      insurance: [],
      color: PLAYER_COLORS[i],
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
    electionActive: false,
  };
}

export default function Game() {
  const router = useRouter();
  const { playClick } = useSound();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;
  const [boardContainerHeight, setBoardContainerHeight] = useState(0);

  const routeParams = useLocalSearchParams<{
    playerNames: string;
    accountTypes: string;
    playerCount: string;
    monthCount: string;
  }>();

  const playerCount = Number(routeParams.playerCount) || 2;
  const monthCount = Number(routeParams.monthCount) || 3;
  const names = routeParams.playerNames?.split(",") ?? [];
  const accounts = routeParams.accountTypes?.split(",") ?? [];

  const [gameState, dispatch] = useReducer(
    gameReducer,
    { playerCount, monthCount, names, accounts },
    createInitialState,
  );

  const { players, currentPlayerIndex } = gameState;
  const currentPlayer = players[currentPlayerIndex];
  const [showCardsViewer, setShowCardsViewer] = useState<
    "deals" | "mail" | null
  >(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const canBank = gameState.phase === "roll" || gameState.phase === "end-turn";

  useEffect(() => {
    if (gameState.phase === "game-over") {
      Alert.alert("Game Over", "All players have completed all months!", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    }
  }, [gameState.phase]);

  // Compute cellSize based on orientation
  const sidebarWidth = isLandscape
    ? Math.max(width * 0.3, SIDEBAR_MIN_WIDTH)
    : 0;

  const cellSize = isLandscape
    ? Math.min(
        (height - insets.top - insets.bottom - DAY_HEADER_HEIGHT - 16) /
          BOARD_ROWS,
        (width -
          sidebarWidth -
          12 - 7 - 2 - 6 -
          insets.left -
          insets.right) /
          BOARD_COLS,
      )
    : (width - 7 - 2 - 6) / BOARD_COLS;

  // Portrait: cells grow taller to fill available vertical space
  const portraitCellHeight =
    boardContainerHeight > 0
      ? (boardContainerHeight - DAY_HEADER_HEIGHT) / BOARD_ROWS
      : cellSize;

  const handleExit = () => {
    playClick();
    Alert.alert("Exit Game", "Are you sure you want to quit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Quit",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  const header = (
    <View style={styles.header}>
      <Pressable
        onPress={handleExit}
        style={isLandscape ? styles.exitButtonSmall : styles.exitButton}
      >
        <Ionicons
          name="arrow-back"
          size={isLandscape ? 18 : 22}
          color={COLORS.white}
        />
      </Pressable>
      <Text
        style={[styles.monthText, isLandscape && styles.monthTextLandscape]}
      >
        Month {currentPlayer.currentMonth} of {gameState.totalMonths}
      </Text>
      <Pressable
        onPress={() => router.replace("/how-to-play")}
        style={isLandscape ? styles.exitButtonSmall : styles.exitButton}
      >
        <Ionicons
          name="help"
          size={isLandscape ? 18 : 22}
          color={COLORS.white}
        />
      </Pressable>
    </View>
  );

  const board = (
    <Board
      players={players}
      currentPlayerIndex={currentPlayerIndex}
      cellSize={cellSize}
      animatingMove={gameState.animatingMove}
      onAnimationComplete={() => dispatch({ type: "ANIMATION_COMPLETE" })}
    />
  );

  const actions = (
    <View
      style={[
        styles.actionsContainer,
        isLandscape && styles.actionsContainerLandscape,
      ]}
    >
      <View
        style={[styles.actionRow, isLandscape && styles.actionRowLandscape]}
      >
        <View style={styles.actionButtonWrapper}>
          <Pressable
            style={[styles.actionButton, styles.actionLoan, !canBank && styles.actionDisabled]}
            onPress={() => { if (canBank) { playClick(); setShowBankModal(true); } }}
          >
            <Ionicons name={currentPlayer.accountType === "Savings" ? "wallet" : "business"} size={18} color={COLORS.white} />
            <Text style={styles.actionText}>{currentPlayer.accountType === "Savings" ? "Savings" : "Loan"}</Text>
          </Pressable>
        </View>
        <View style={styles.actionButtonWrapper}>
          <Pressable
            style={[styles.actionButton, styles.actionDeals]}
            onPress={() => setShowCardsViewer("deals")}
          >
            <Ionicons name="briefcase" size={18} color={COLORS.white} />
            <Text style={styles.actionText}>Deals</Text>
          </Pressable>
        </View>
        <View style={styles.actionButtonWrapper}>
          <Pressable
            style={[styles.actionButton, styles.actionMail]}
            onPress={() => setShowCardsViewer("mail")}
          >
            <Ionicons name="mail" size={18} color={COLORS.white} />
            <Text style={styles.actionText}>Mail</Text>
          </Pressable>
        </View>
        <View style={styles.actionButtonWrapper}>
          <Pressable
            style={[
              styles.actionButton,
              styles.actionEnd,
              gameState.phase !== "end-turn" && styles.actionDisabled,
            ]}
            onPress={() => {
              if (gameState.phase === "end-turn")
                dispatch({ type: "END_TURN" });
            }}
          >
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            <Text style={styles.actionText}>End</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const playerSection = (
    <PlayerCard
      player={players[currentPlayerIndex]}
      isCurrentTurn={true}
      compact={isLandscape}
    >
      <Dice
        onRoll={(value) => dispatch({ type: "ROLL_DICE", value })}
        disabled={
          gameState.phase !== "roll" || gameState.animatingMove !== null
        }
        size={isLandscape ? 50 : 56}
      />
    </PlayerCard>
  );

  const eventToast = gameState.eventMessage ? (
    <EventToast
      event={gameState.eventMessage}
      onDismiss={() => dispatch({ type: "DISMISS_EVENT" })}
    />
  ) : null;

  const cardsViewer = showCardsViewer ? (
    <DealsViewer
      deals={currentPlayer.deals}
      lotteryTickets={currentPlayer.lotteryTickets}
      unpaidBills={currentPlayer.unpaidBills}
      insurance={currentPlayer.insurance}
      onClose={() => setShowCardsViewer(null)}
      defaultTab={showCardsViewer}
    />
  ) : null;

  const mailModal = gameState.currentMail && gameState.currentMail.type !== "swellfare" ? (
    <MailCardModal
      mail={gameState.currentMail}
      onDismiss={() => dispatch({ type: "DISMISS_MAIL" })}
      onBuyInsurance={() => dispatch({ type: "BUY_INSURANCE" })}
      isCancelledByInsurance={
        gameState.currentMail.type === "bill" &&
        gameState.currentMail.billCategory !== "other" &&
        !!gameState.currentMail.billCategory &&
        currentPlayer.insurance.some((ins) =>
          ins.cancelsCategories?.includes(gameState.currentMail!.billCategory!),
        )
      }
    />
  ) : null;

  const pokerGameModal = gameState.phase === "poker-game" ? (
    <PokerGameModal
      players={gameState.players}
      onConfirm={(participantIndices, winnerIndex) =>
        dispatch({ type: "CONFIRM_POKER_GAME", participantIndices, winnerIndex })
      }
      onSkip={() => dispatch({ type: "SKIP_POKER_GAME" })}
    />
  ) : null;

  const daylightSavingModal = gameState.phase === "daylight-saving" ? (
    <DaylightSavingModal
      players={gameState.players}
      onConfirm={() => dispatch({ type: "CONFIRM_DAYLIGHT_SAVING" })}
    />
  ) : null;

  const electionModal = gameState.phase === "election" ? (
    <ElectionModal
      players={gameState.players}
      pot={gameState.pot}
      onConfirm={() => dispatch({ type: "CONFIRM_ELECTION" })}
    />
  ) : null;

  const swellfareModal =
    gameState.phase === "mail" && gameState.currentMail?.type === "swellfare" ? (
      <SwellfareModal
        player={currentPlayer}
        pot={gameState.pot}
        onUse={(bet: number, roll: number) => dispatch({ type: "USE_SWELLFARE", bet, roll })}
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
        onSkip={() => dispatch({ type: "SKIP_LOTTERY" })}
      />
    ) : null;

  const assetBuyerViewer =
    gameState.phase === "asset-buyer" ? (
      <DealsViewer
        deals={currentPlayer.deals}
        onClose={() => dispatch({ type: "SKIP_ASSET_BUYER" })}
        mode="sell"
        onSell={(deal) => dispatch({ type: "SELL_DEAL", dealId: deal.id })}
      />
    ) : null;

  const salaryDayModal =
    gameState.phase === "salary-day" ? (
      <SalaryDayModal
        player={currentPlayer}
        onConfirm={(loanPayment, savingsAdjust) =>
          dispatch({ type: "FINISH_SALARY_DAY", loanPayment, savingsAdjust })
        }
      />
    ) : null;

  const bankModal = showBankModal ? (
    <BankModal
      player={currentPlayer}
      onTakeLoan={(amount) => {
        dispatch({ type: "TAKE_LOAN", amount });
        setShowBankModal(false);
      }}
      onWithdrawSavings={(amount) => {
        dispatch({ type: "WITHDRAW_SAVINGS", amount });
        setShowBankModal(false);
      }}
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

  if (isLandscape) {
    return (
      <ImageBackground
        source={require("@/assets/images/generic-background.png")}
        style={styles.gradient}
        resizeMode="cover"
        imageStyle={{ opacity: 0.8 }}
      >
        <SafeAreaView style={styles.landscapeContainer}>
          {/* Left: Board */}
          <View style={styles.leftPanel}>{board}</View>

          {/* Right: Controls */}
          <View style={[styles.rightPanel, { width: sidebarWidth }]}>
            {header}
            <View style={styles.sidebarContent}>
              {actions}
              {playerSection}
            </View>
          </View>
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
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/generic-background.png")}
      style={styles.gradient}
      resizeMode="cover"
      imageStyle={{ opacity: 0.8 }}
    >
      <SafeAreaView style={styles.container}>
        {header}
        <View
          style={{ flex: 1 }}
          onLayout={(e) => setBoardContainerHeight(e.nativeEvent.layout.height)}
        >
          <Board
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            cellSize={cellSize}
            cellHeight={portraitCellHeight}
            animatingMove={gameState.animatingMove}
            onAnimationComplete={() => dispatch({ type: "ANIMATION_COMPLETE" })}
          />
        </View>
        <View style={styles.bottomPanel}>
          {actions}
          {playerSection}
        </View>
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
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
    gap: 12,
    overflow: "hidden",
  },
  bottomPanel: {
    marginTop: 60,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  exitButtonSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  monthText: {
    fontWeight: "800" as const,
    fontSize: 20,
    color: COLORS.textDark,
  },
  monthTextLandscape: {
    fontSize: 16,
  },
  actionsContainer: {
    alignItems: "center",
    gap: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  actionsContainerLandscape: {
    gap: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionRowLandscape: {
    flexWrap: "wrap",
    gap: 8,
  },
  actionButtonWrapper: {
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9,
    borderBottomWidth: 4, // 3D effect
  },
  actionLoan: {
    backgroundColor: "#FDCF07",
    borderBottomColor: "#D4AF37",
  },
  actionDeals: {
    backgroundColor: "#00BFA5",
    borderBottomColor: "#00897B",
  },
  actionMail: {
    backgroundColor: "#9C27B0",
    borderBottomColor: "#7B1FA2",
  },
  actionEnd: {
    backgroundColor: "#FF5252",
    borderBottomColor: "#D32F2F",
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  playerRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  playerColLandscape: {
    paddingHorizontal: SPACING.sm,
    gap: 8,
  },
});
