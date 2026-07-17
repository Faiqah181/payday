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
import { useState } from "react";
import { ScrollView } from "react-native";

const CONTRIBUTION = 50;
const GOLD = "#F4D03F";

type ElectionPhase = "race" | "won";

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
  const [phase, setPhase] = useState<ElectionPhase>("race");
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

  const activeIndex = rollOrder[activePos];
  const potShown = pot + eligibleIndices.length * CONTRIBUTION;
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
    phase === "race"
      ? `${me.name} is holding town elections`
      : `${winner?.name} takes the Pot!`;
  const subtitle =
    phase === "race"
      ? `Everyone paid $${CONTRIBUTION} to the Pot · first to roll a 6 takes it all`
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
          {players.map((player, playerIndex) => {
            const rank = eligibleIndices.indexOf(playerIndex);
            if (rank === -1) {
              return (
                <EventPlayerRow
                  key={playerIndex}
                  name={player.name}
                  initial={initialOf(player)}
                  color={player.color}
                  statusText="Retired · sits out"
                  out
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
