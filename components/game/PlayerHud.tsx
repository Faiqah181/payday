import AnimatedCash from "@/components/ui/AnimatedCash";
import PlayerToken from "@/components/ui/PlayerToken";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import type { Player } from "@/types/game";
import { getAccountStatus } from "@/types/game";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut, Keyframe } from "react-native-reanimated";

const ROLL_DISTANCE = 46;

// Cylinder roll: outgoing content rolls up and away, the next player's
// content rolls in from below.
const RollOut = new Keyframe({
  from: { opacity: 1, transform: [{ translateY: 0 }] },
  to: { opacity: 0, transform: [{ translateY: -ROLL_DISTANCE }] },
}).duration(180);

const RollIn = new Keyframe({
  from: { opacity: 0, transform: [{ translateY: ROLL_DISTANCE }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
}).duration(220);

// Custom Keyframes never start on web (element stays visibility:hidden) —
// fall back to predefined animations there
const rollIn = Platform.OS === "web" ? FadeIn.duration(220) : RollIn;
const rollOut = Platform.OS === "web" ? FadeOut.duration(180) : RollOut;

interface PlayerHudProps {
  player: Player;
  /** Keys the roll animation — changing it rolls the cylinder. */
  playerIndex: number;
}

export default function PlayerHud({ player, playerIndex }: PlayerHudProps) {
  const status = getAccountStatus(player);
  const bankLabel =
    status === "savings" ? "SAVINGS" : status === "loan" ? "LOAN" : "BANK";
  // Savings shows +$X, loan shows -$X (negative value), neutral shows $0
  const bankValue =
    status === "loan" ? -player.loanBalance : player.savingsBalance;
  const bankColor =
    status === "savings" ? SD.primary : status === "loan" ? SD.debt : SD.soft;

  return (
    <View style={styles.hud}>
      <Animated.View
        key={playerIndex}
        entering={rollIn}
        exiting={rollOut}
        style={styles.content}
      >
        <PlayerToken
          initial={player.name?.trim()?.[0]?.toUpperCase() || "?"}
          color={player.color}
          size={38}
        />
        <View style={styles.text}>
          <Typography design="title" style={styles.name} numberOfLines={1}>
            {player.name}
          </Typography>
          <Typography design="body" weight={800} style={styles.day}>
            {player.position === 0 ? "At Start" : `On Day ${player.position}`} · your
            turn
          </Typography>
        </View>
        <View style={styles.col}>
          <Typography design="body" weight={800} style={styles.colLabel}>
            CASH
          </Typography>
          <AnimatedCash
            value={player.cash}
            style={[styles.colValue, { color: player.cash < 0 ? SD.debt : SD.primary }]}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.col}>
          <Typography design="body" weight={800} style={styles.colLabel}>
            {bankLabel}
          </Typography>
          <AnimatedCash
            value={bankValue}
            signed={status === "savings"}
            style={[styles.colValue, { color: bankColor }]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: SD.surface2,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    color: SD.ink,
  },
  day: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: SD.soft,
  },
  col: {
    alignItems: "flex-end",
  },
  colLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: SD.soft,
  },
  colValue: {
    fontSize: 15,
  },
  divider: {
    width: 2,
    height: 32,
    borderRadius: 2,
    backgroundColor: SD.line,
  },
});
