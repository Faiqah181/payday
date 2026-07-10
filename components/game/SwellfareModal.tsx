import { DieValue } from "@/components/game/dice/DiceCube";
import StaticDie from "@/components/game/dice/StaticDie";
import { EventButton, EventCashRow } from "@/components/game/events/EventFooter";
import EventShell from "@/components/game/events/EventShell";
import Typography from "@/components/ui/Typography";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { SD_EVENT_GRADIENTS } from "@/constants/theme";
import type { Player } from "@/types/game";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const BET_STEP = 10;
const MAX_BET = 100;
const WIN_MULTIPLIER = 10;
const GOLD = "#F4D03F";

interface SwellfareModalProps {
  player: Player;
  pot: number;
  onUse: (bet: number, roll: number) => void;
  onDiscard: () => void;
}

export default function SwellfareModal({
  player,
  pot,
  onUse,
  onDiscard,
}: SwellfareModalProps) {
  const billTotal = player.unpaidBills.reduce((s, b) => s + Math.abs(b.amount), 0);
  const loanInterestDue = Math.floor(
    (player.loanBalance * GAME_CONFIG.interestPercentage) / 100,
  );
  const totalOwed = player.loanBalance + loanInterestDue + billTotal;
  const isInDebt = totalOwed > player.cash;

  const [bet, setBet] = useState(BET_STEP);
  const [rolled, setRolled] = useState<DieValue | null>(null);
  const won = rolled !== null && rolled >= 5;

  const initial = player.name?.trim()?.[0]?.toUpperCase() || "?";

  const title = !isInDebt
    ? "You're not in debt!"
    : rolled === null
      ? "Bet on a 5 or 6"
      : won
        ? "You won!"
        : "Bad luck…";
  const subtitle = !isInDebt
    ? "Swellfare only works when you owe more than you have"
    : rolled === null
      ? `You owe $${totalOwed} with $${player.cash} in hand — gamble your way out`
      : won
        ? `A ${rolled}! The bank pays ${WIN_MULTIPLIER}× your bet`
        : `A ${rolled} — your bet goes into the Pot`;

  return (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.swellfare}
      eyebrow="🎲  SWELLFARE"
      title={title}
      subtitle={subtitle}
      pot={{ label: "THE POT", value: `$${pot}` }}
      footer={
        <>
          <EventCashRow initial={initial} color={player.color} cash={player.cash} />
          {!isInDebt ? (
            <EventButton label="Discard card" onPress={onDiscard} />
          ) : rolled === null ? (
            <EventButton
              label={`Bet $${bet} & roll`}
              color={GOLD}
              textColor="#5E4700"
              onPress={() => setRolled((1 + Math.floor(Math.random() * 6)) as DieValue)}
            />
          ) : (
            <EventButton
              label={won ? `Collect $${bet * WIN_MULTIPLIER}` : `Pay $${bet} into the Pot`}
              onPress={() => onUse(bet, rolled)}
            />
          )}
        </>
      }
    >
      {isInDebt && rolled === null && (
        <View style={styles.betArea}>
          <View style={styles.stepper}>
            <StepButton
              glyph="−"
              disabled={bet <= BET_STEP}
              onPress={() => setBet(bet - BET_STEP)}
            />
            <Typography design="money" style={styles.betValue}>
              ${bet}
            </Typography>
            <StepButton
              glyph="+"
              disabled={bet >= MAX_BET}
              onPress={() => setBet(bet + BET_STEP)}
            />
          </View>
          <View style={styles.oddsRow}>
            <View style={styles.oddsBox}>
              <Typography design="body" weight={800} style={styles.oddsLabel}>
                ROLL 5–6
              </Typography>
              <Typography design="money" style={[styles.oddsValue, { color: GOLD }]}>
                +${bet * WIN_MULTIPLIER}
              </Typography>
            </View>
            <View style={styles.oddsBox}>
              <Typography design="body" weight={800} style={styles.oddsLabel}>
                ROLL 1–4
              </Typography>
              <Typography design="money" style={[styles.oddsValue, { color: "#FF9B8E" }]}>
                -${bet}
              </Typography>
            </View>
          </View>
        </View>
      )}
      {rolled !== null && (
        <View style={styles.dieArea}>
          <StaticDie value={rolled} size={90} />
        </View>
      )}
    </EventShell>
  );
}

function StepButton({
  glyph,
  disabled,
  onPress,
}: {
  glyph: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.stepBtn, disabled && styles.stepBtnDim]}
      disabled={disabled}
      onPress={onPress}
    >
      <Typography design="title" style={styles.stepGlyph}>
        {glyph}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  betArea: {
    flex: 1,
    justifyContent: "center",
    gap: 18,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnDim: {
    opacity: 0.4,
  },
  stepGlyph: {
    fontSize: 26,
    lineHeight: 32,
    color: "#FFFFFF",
  },
  betValue: {
    minWidth: 110,
    textAlign: "center",
    fontSize: 38,
    color: "#FFFFFF",
  },
  oddsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
  },
  oddsBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  oddsLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.6)",
  },
  oddsValue: {
    fontSize: 17,
  },
  dieArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
