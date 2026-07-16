import { DieValue } from "@/components/game/dice/DiceCube";
import { EventButton } from "@/components/game/events/EventFooter";
import EventPlayerRow from "@/components/game/events/EventPlayerRow";
import EventShell from "@/components/game/events/EventShell";
import {
  DIE_SETTLE_MS,
  useDelayedReveal,
} from "@/components/game/events/useDelayedReveal";
import WinnerCelebration from "@/components/game/events/WinnerCelebration";
import { SD_EVENT_GRADIENTS } from "@/constants/theme";
import type { Player } from "@/types/game";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const CONTRIBUTION = 50;
const PAY_TICK_MS = 450;
const GOLD = "#F4D03F";

type ElectionPhase = "paying" | "race" | "won";

interface ElectionModalProps {
  players: Player[];
  /** Absolute indices of players still in the game. */
  eligibleIndices: number[];
  pot: number;
  currentPlayerIndex: number;
  onFinish: (winnerIndex: number) => void;
}

const initialOf = (player: Player) =>
  player.name?.trim()?.[0]?.toUpperCase() || "?";

export default function ElectionModal({
  players,
  eligibleIndices,
  pot,
  currentPlayerIndex,
  onFinish,
}: ElectionModalProps) {
  const [phase, setPhase] = useState<ElectionPhase>("paying");
  const [paidCount, setPaidCount] = useState(0);
  // Lander rolls first, then turn order
  const [rollOrder] = useState<number[]>(() => {
    const start = Math.max(0, eligibleIndices.indexOf(currentPlayerIndex));
    return eligibleIndices.map(
      (_, k) => eligibleIndices[(start + k) % eligibleIndices.length],
    );
  });
  const [activePos, setActivePos] = useState(0);
  const [rolls, setRolls] = useState<Record<number, number>>({});
  const [rollSeq, setRollSeq] = useState<Record<number, number>>({});
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [revealPending, reveal] = useDelayedReveal();

  // Stage the pay-in: one player ticks "Paid $50" at a time
  useEffect(() => {
    if (phase !== "paying") return;
    if (paidCount >= eligibleIndices.length) {
      const timer = setTimeout(() => setPhase("race"), 600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setPaidCount((n) => n + 1), PAY_TICK_MS);
    return () => clearTimeout(timer);
  }, [phase, paidCount, eligibleIndices.length]);

  const activeIndex = rollOrder[activePos];
  const potShown = pot + paidCount * CONTRIBUTION;
  const me = players[currentPlayerIndex];
  const winner = winnerIndex !== null ? players[winnerIndex] : null;

  function handleRoll() {
    const value = Math.floor(Math.random() * 6) + 1;
    setRolls((r) => ({ ...r, [activeIndex]: value }));
    setRollSeq((s) => ({ ...s, [activeIndex]: (s[activeIndex] ?? 0) + 1 }));
    if (value === 6) {
      reveal(() => {
        setWinnerIndex(activeIndex);
        setPhase("won");
      });
    } else {
      reveal(
        () => setActivePos((pos) => (pos + 1) % rollOrder.length),
        DIE_SETTLE_MS,
      );
    }
  }

  const title =
    phase === "paying"
      ? `${me.name} is holding town elections`
      : phase === "race"
        ? "First to roll a 6!"
        : `${winner?.name} takes the Pot!`;
  const subtitle =
    phase === "paying"
      ? `Every player pays $${CONTRIBUTION} into the Pot.`
      : phase === "race"
        ? "Take turns rolling — a 6 takes it all."
        : "The whole Pot is theirs.";

  return (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.election}
      emblem="🗳️"
      eyebrow="TOWN ELECTION"
      title={title}
      subtitle={subtitle}
      pot={{ label: "THE POT", value: `$${potShown}` }}
      footer={
        <>
          {phase === "race" && (
            <EventButton
              label={`🎲 ${players[activeIndex].name} rolls for the Pot`}
              disabled={revealPending}
              onPress={handleRoll}
            />
          )}
          {phase === "won" && (
            <EventButton
              label="Back to the board →"
              color={GOLD}
              textColor="#5E4700"
              onPress={() => onFinish(winnerIndex!)}
            />
          )}
        </>
      }
    >
      {phase === "won" && winner ? (
        <WinnerCelebration
          initial={initialOf(winner)}
          color={winner.color}
          amount={`🎉 +$${potShown}`}
          note="Rolled a 6 — added to their cash"
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {eligibleIndices.map((playerIndex, k) => {
            const player = players[playerIndex];
            if (phase === "paying") {
              const paid = k < paidCount;
              return (
                <EventPlayerRow
                  key={playerIndex}
                  name={player.name}
                  initial={initialOf(player)}
                  color={player.color}
                  statusText={paid ? `Paid $${CONTRIBUTION}` : "…"}
                  statusColor={paid ? "#FF9B8E" : undefined}
                  highlighted={k === paidCount}
                  right={<View style={styles.noSlot} />}
                />
              );
            }
            const roll = rolls[playerIndex];
            const isActive = playerIndex === activeIndex;
            return (
              <EventPlayerRow
                key={playerIndex}
                name={player.name}
                initial={initialOf(player)}
                color={player.color}
                statusText={
                  isActive
                    ? "Rolling now…"
                    : roll != null
                      ? `Rolled a ${roll}`
                      : "Waiting…"
                }
                statusColor={roll != null && !isActive ? GOLD : undefined}
                die={(roll ?? null) as DieValue | null}
                dieNonce={rollSeq[playerIndex] ?? 0}
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
  noSlot: {
    width: 0,
    height: 40,
  },
});
