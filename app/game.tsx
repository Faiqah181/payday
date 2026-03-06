import { COLORS, SPACING } from "@/constants/colors";
import Board from "@/components/game/Board";
import PlayerCard from "@/components/game/PlayerCard";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Game() {
  const router = useRouter();
  const { playClick } = useSound();
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

  // Placeholder game state for Phase 1
  const players: Player[] = useMemo(
    () =>
      Array.from({ length: playerCount }, (_, i) => ({
        name: names[i] || `Player ${i + 1}`,
        cash: 3500,
        loanBalance: 0,
        accountType: (accounts[i] as "Savings" | "Loan") || "Savings",
        position: 0, // all start at START
        deals: [],
        unpaidBills: [],
        color: PLAYER_COLORS[i],
      })),
    []
  );

  const currentPlayerIndex = 0;

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

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleExit} style={styles.exitButton}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </Pressable>
          <Text style={styles.monthText}>Month 1 of {monthCount}</Text>
          <View style={styles.exitButton} />
        </View>

        {/* Board */}
        <Board players={players} currentPlayerIndex={currentPlayerIndex} />

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="dice" size={20} color={COLORS.white} />
            <Text style={styles.actionText}>Roll</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionLoan]}>
            <Ionicons name="business" size={20} color={COLORS.white} />
            <Text style={styles.actionText}>Loan</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionEnd]}>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            <Text style={styles.actionText}>End</Text>
          </Pressable>
        </View>

        {/* Player cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.playerRow}
        >
          {players.map((player, index) => (
            <PlayerCard
              key={index}
              player={player}
              isCurrentTurn={index === currentPlayerIndex}
            />
          ))}
        </ScrollView>
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
  monthText: {
    fontFamily: "BlueWinter",
    fontSize: 20,
    color: COLORS.textDark,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
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
});
