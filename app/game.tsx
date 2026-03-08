import Board from "@/components/game/Board";
import DealCardModal from "@/components/game/DealCardModal";
import DealsViewer from "@/components/game/DealsViewer";
import Dice from "@/components/game/Dice";
import EventToast from "@/components/game/EventToast";
import PlayerCard from "@/components/game/PlayerCard";
import { BOARD_COLS, BOARD_ROWS, SPACE_EVENTS, getSpaceByDay } from "@/constants/board";
import { ALL_DEALS, shuffleDeck } from "@/constants/deals";
import { COLORS, SPACING } from "@/constants/colors";
import { useSound } from "@/contexts/SoundContext";
import type { GameState } from "@/types/game";
import { PLAYER_COLORS } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useReducer, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BOARD_PADDING = 8;
const DAY_HEADER_HEIGHT = 16;
const SIDEBAR_MIN_WIDTH = 200;
const MAX_POSITION = 31;

type GameAction =
  | { type: "ROLL_DICE"; value: number }
  | { type: "ANIMATION_COMPLETE" }
  | { type: "DISMISS_EVENT" }
  | { type: "BUY_DEAL" }
  | { type: "DISCARD_DEAL" }
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
        return {
          ...player,
          position: to,
          ...(event ? { cash: player.cash + event.amount } : {}),
        };
      });

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

      return {
        ...state,
        players: updatedPlayers,
        animatingMove: null,
        phase: event ? "event" : "end-turn",
        eventMessage: event ?? null,
      };
    }
    case "DISMISS_EVENT": {
      return { ...state, eventMessage: null, phase: "end-turn" };
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
      return { ...state, players: updatedPlayers, currentDeal: null, phase: "end-turn" };
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
    case "END_TURN": {
      const currentPlayer = state.players[state.currentPlayerIndex];
      const atSalaryDay = currentPlayer.position === MAX_POSITION;

      const updatedPlayers = atSalaryDay
        ? state.players.map((player, i) => {
            if (i !== state.currentPlayerIndex) return player;
            return { ...player, position: 0, currentMonth: player.currentMonth + 1 };
          })
        : state.players;

      // Check game over: all players have completed all months
      const allDone = updatedPlayers.every((p) => p.currentMonth > state.totalMonths);
      if (allDone) {
        return { ...state, players: updatedPlayers, phase: "game-over", diceValue: null };
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
      accountType: (params.accounts[i] as "Savings" | "Loan") || "Savings",
      position: 0,
      currentMonth: 1,
      deals: [],
      unpaidBills: [],
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
  };
}

export default function Game() {
  const router = useRouter();
  const { playClick } = useSound();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;

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
  const [showDealsViewer, setShowDealsViewer] = useState(false);

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
        (height - insets.top - insets.bottom - DAY_HEADER_HEIGHT - 16) / BOARD_ROWS,
        (width - sidebarWidth - BOARD_PADDING * 2 - insets.left - insets.right) / BOARD_COLS
      )
    : (width - BOARD_PADDING * 2) / BOARD_COLS;

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
      <Pressable onPress={handleExit} style={isLandscape ? styles.exitButtonSmall : styles.exitButton}>
        <Ionicons name="arrow-back" size={isLandscape ? 18 : 22} color={COLORS.white} />
      </Pressable>
      <Text style={[styles.monthText, isLandscape && styles.monthTextLandscape]}>
        Month {currentPlayer.currentMonth} of {gameState.totalMonths}
      </Text>
      <Pressable onPress={() => router.replace("/how-to-play")} style={isLandscape ? styles.exitButtonSmall : styles.exitButton}>
        <Ionicons name="help" size={isLandscape ? 18 : 22} color={COLORS.white} />
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
    <View style={[styles.actionRow, isLandscape && styles.actionRowLandscape]}>
      <Dice
        onRoll={(value) => dispatch({ type: "ROLL_DICE", value })}
        disabled={gameState.phase !== "roll" || gameState.animatingMove !== null}
        size={isLandscape ? 50 : 60}
      />
      <Pressable style={[styles.actionButton, styles.actionLoan]}>
        <Ionicons name="business" size={20} color={COLORS.white} />
        <Text style={styles.actionText}>Loan</Text>
      </Pressable>
      <Pressable
        style={[styles.actionButton, styles.actionDeals]}
        onPress={() => setShowDealsViewer(true)}
      >
        <Ionicons name="briefcase" size={20} color={COLORS.white} />
        <Text style={styles.actionText}>Deals</Text>
      </Pressable>
      <Pressable
        style={[styles.actionButton, styles.actionEnd, gameState.phase !== "end-turn" && styles.actionDisabled]}
        onPress={() => { if (gameState.phase === "end-turn") dispatch({ type: "END_TURN" }); }}
      >
        <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        <Text style={styles.actionText}>End</Text>
      </Pressable>
    </View>
  );

  const playerCards = (
    <ScrollView
      horizontal={!isLandscape}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={isLandscape ? styles.playerColLandscape : styles.playerRow}
    >
      {players.map((player, index) => (
        <PlayerCard
          key={index}
          player={player}
          isCurrentTurn={index === currentPlayerIndex}
          compact={isLandscape}
        />
      ))}
    </ScrollView>
  );

  const eventToast = gameState.eventMessage ? (
    <EventToast
      event={gameState.eventMessage}
      onDismiss={() => dispatch({ type: "DISMISS_EVENT" })}
    />
  ) : null;

  const dealsViewer = showDealsViewer ? (
    <DealsViewer
      deals={currentPlayer.deals}
      onClose={() => setShowDealsViewer(false)}
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
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundDark]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.landscapeContainer}>
          {/* Left: Board */}
          <View style={styles.leftPanel}>
            {board}
          </View>

          {/* Right: Controls */}
          <View style={[styles.rightPanel, { width: sidebarWidth }]}>
            {header}
            <View style={styles.sidebarContent}>
              {actions}
              {playerCards}
            </View>
          </View>
          {eventToast}
          {dealModal}
          {dealsViewer}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {header}
        {board}
        {actions}
        {playerCards}
        {eventToast}
        {dealModal}
        {dealsViewer}
      </SafeAreaView>
    </LinearGradient>
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
    justifyContent: "center",
  },
  rightPanel: {
    flexDirection: "column",
    justifyContent: "center",
  },
  sidebarContent: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
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
    fontFamily: "BlueWinter",
    fontSize: 20,
    color: COLORS.textDark,
  },
  monthTextLandscape: {
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  actionRowLandscape: {
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryBorder,
  },
  actionLoan: {
    backgroundColor: COLORS.secondary,
    borderBottomColor: COLORS.secondaryBorder,
  },
  actionDeals: {
    backgroundColor: "#7B1FA2",
    borderBottomColor: "#6A1B9A",
  },
  actionEnd: {
    backgroundColor: COLORS.iconButton,
    borderBottomColor: COLORS.iconButtonBorder,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontFamily: "BlueWinter",
    fontSize: 14,
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
