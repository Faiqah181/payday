import { DieValue } from "@/components/game/dice/DiceCube";
import { EventButton } from "@/components/game/events/EventFooter";
import EventPlayerRow from "@/components/game/events/EventPlayerRow";
import EventShell from "@/components/game/events/EventShell";
import PlayerToken from "@/components/ui/PlayerToken";
import Typography from "@/components/ui/Typography";
import { SD, SD_EVENT_GRADIENTS } from "@/constants/theme";
import type { Player } from "@/types/game";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const GOLD = "#F4D03F";

interface CommissionModalProps {
  players: Player[];
  amount: number;
  onConfirm: (winnerIndex: number) => void;
}

const initialOf = (player: Player) =>
  player.name?.trim()?.[0]?.toUpperCase() || "?";

/**
 * Rule: whenever a Deal is bought, every player rolls the die and the
 * highest roller collects the deal's commission from the Bank.
 */
export default function CommissionModal({
  players,
  amount,
  onConfirm,
}: CommissionModalProps) {
  const [rolls, setRolls] = useState<(number | null)[]>(players.map(() => null));
  const [activeIndex, setActiveIndex] = useState(0);
  const [tieIndices, setTieIndices] = useState<number[] | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  function handleRoll() {
    const value = Math.floor(Math.random() * 6) + 1;
    const newRolls = [...rolls];
    newRolls[activeIndex] = value;
    setRolls(newRolls);

    const round = tieIndices ?? players.map((_, i) => i);
    const lastInRound = round.indexOf(activeIndex) === round.length - 1;

    if (!lastInRound) {
      setActiveIndex(round[round.indexOf(activeIndex) + 1]);
      return;
    }

    const maxRoll = Math.max(...round.map((i) => newRolls[i] ?? 0));
    const tied = round.filter((i) => newRolls[i] === maxRoll);

    if (tied.length === 1) {
      setWinnerIndex(tied[0]);
    } else {
      const resetRolls = [...newRolls];
      tied.forEach((i) => {
        resetRolls[i] = null;
      });
      setRolls(resetRolls);
      setTieIndices(tied);
      setActiveIndex(tied[0]);
    }
  }

  const winner = winnerIndex !== null ? players[winnerIndex] : null;

  return (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.commission}
      emblem="🤝"
      eyebrow="DEAL CLOSED"
      title={winner ? "Commission goes to…" : `${players[activeIndex].name} rolls…`}
      subtitle={
        winner
          ? `${winner.name} rolled the highest`
          : tieIndices
            ? "It's a tie — tied players roll again!"
            : "Everyone rolls · highest takes the commission"
      }
      pot={{ label: "COMMISSION", value: `$${amount}` }}
      footer={
        winner ? (
          <EventButton
            label={`${winner.name} collects $${amount}`}
            color={GOLD}
            textColor="#5E4700"
            onPress={() => onConfirm(winnerIndex!)}
          />
        ) : (
          <EventButton
            label={`Roll for ${players[activeIndex].name}`}
            onPress={handleRoll}
          />
        )
      }
    >
      {winner ? (
        <View style={styles.winnerBlock}>
          <View style={styles.winnerRing}>
            <PlayerToken initial={initialOf(winner)} color={winner.color} size={72} />
          </View>
          <Typography design="money" style={styles.winnerAmount}>
            🎉 +${amount}
          </Typography>
          <Typography design="body" weight={700} style={styles.winnerNote}>
            Rolled a {rolls[winnerIndex!]} — paid by the Bank
          </Typography>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {players.map((player, i) => {
            const roll = rolls[i];
            const isActive = i === activeIndex;
            return (
              <EventPlayerRow
                key={i}
                name={player.name}
                initial={initialOf(player)}
                color={player.color}
                statusText={
                  roll != null
                    ? `Rolled a ${roll}`
                    : isActive
                      ? "Rolling now…"
                      : "Waiting…"
                }
                statusColor={roll != null ? GOLD : undefined}
                die={roll as DieValue | null}
                highlighted={isActive}
              />
            );
          })}
        </ScrollView>
      )}
    </EventShell>
  );
}

const styles = StyleSheet.create({
  winnerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  winnerRing: {
    borderWidth: 4,
    borderColor: GOLD,
    borderRadius: 44,
    padding: 2,
  },
  winnerAmount: {
    fontSize: 22,
    color: SD.white,
    marginTop: 16,
  },
  winnerNote: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
});
