import Board from "@/components/game/Board";
import Dice from "@/components/game/Dice";
import PlayerCard from "@/components/game/PlayerCard";
import { BOARD_COLS, BOARD_ROWS } from "@/constants/board";
import { COLORS, SPACING } from "@/constants/colors";
import { useSound } from "@/contexts/SoundContext";
import type { Player } from "@/types/game";
import { PLAYER_COLORS } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
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

export default function Game() {
  const router = useRouter();
  const { playClick } = useSound();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;

  const params = useLocalSearchParams<{
    playerNames: string;
    accountTypes: string;
    playerCount: string;
    monthCount: string;
  }>();

  const playerCount = Number(params.playerCount) || 2;
  const monthCount = Number(params.monthCount) || 3;
  const names = params.playerNames?.split(",") ?? [];
  const accounts = params.accountTypes?.split(",") ?? [];

  const players: Player[] = useMemo(
    () =>
      Array.from({ length: playerCount }, (_, i) => ({
        name: names[i] || `Player ${i + 1}`,
        cash: 3500,
        loanBalance: 0,
        accountType: (accounts[i] as "Savings" | "Loan") || "Savings",
        position: 0,
        deals: [],
        unpaidBills: [],
        color: PLAYER_COLORS[i],
      })),
    []
  );

  const currentPlayerIndex = 0;

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
        Month 1 of {monthCount}
      </Text>
      <Pressable onPress={() => router.replace("/how-to-play")} style={isLandscape ? styles.exitButtonSmall : styles.exitButton}>
        <Ionicons name="help" size={isLandscape ? 18 : 22} color={COLORS.white} />
      </Pressable>
    </View>
  );

  const board = (
    <Board players={players} currentPlayerIndex={currentPlayerIndex} cellSize={cellSize} />
  );

  const actions = (
    <View style={[styles.actionRow, isLandscape && styles.actionRowLandscape]}>
      <Dice onRoll={() => { /* TODO: move player */ }} size={isLandscape ? 50 : 60} />
      <Pressable style={[styles.actionButton, styles.actionLoan]}>
        <Ionicons name="business" size={20} color={COLORS.white} />
        <Text style={styles.actionText}>Loan</Text>
      </Pressable>
      <Pressable style={[styles.actionButton, styles.actionEnd]}>
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
  actionEnd: {
    backgroundColor: COLORS.iconButton,
    borderBottomColor: COLORS.iconButtonBorder,
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
