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
  // Bumped on every individual roll so a repeated value still tumbles
  const [rollSeq, setRollSeq] = useState<number[]>(players.map(() => 0));
  const [activeIndex, setActiveIndex] = useState(0);
  const [tieIndices, setTieIndices] = useState<number[] | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [revealPending, reveal] = useDelayedReveal();

  function handleRoll() {
    const value = Math.floor(Math.random() * 6) + 1;
    const newRolls = [...rolls];
    newRolls[activeIndex] = value;
    setRolls(newRolls);
    setRollSeq((seq) => seq.map((n, i) => (i === activeIndex ? n + 1 : n)));

    const round = tieIndices ?? players.map((_, i) => i);
    const lastInRound = round.indexOf(activeIndex) === round.length - 1;

    if (!lastInRound) {
      const next = round[round.indexOf(activeIndex) + 1];
      reveal(() => setActiveIndex(next), DIE_SETTLE_MS);
      return;
    }

    const maxRoll = Math.max(...round.map((i) => newRolls[i] ?? 0));
    const tied = round.filter((i) => newRolls[i] === maxRoll);

    if (tied.length === 1) {
      reveal(() => setWinnerIndex(tied[0]));
    } else {
      // Draw: dice stay on their rolled faces; tied players reroll in turn
      reveal(() => {
        setTieIndices(tied);
        setActiveIndex(tied[0]);
      });
    }
  }

  const winner = winnerIndex !== null ? players[winnerIndex] : null;
  const tiedNames = tieIndices?.map((i) => players[i].name).join(" & ");

  return (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.commission}
      emblem="🤝"
      eyebrow="DEAL CLOSED"
      title={
        winner
          ? "Commission goes to…"
          : tieIndices
            ? "It's a draw!"
            : `${players[activeIndex].name} rolls…`
      }
      subtitle={
        winner
          ? `${winner.name} rolled the highest`
          : tieIndices
            ? `Draw between ${tiedNames} — they roll again`
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
            disabled={revealPending}
            onPress={handleRoll}
          />
        )
      }
    >
      {winner ? (
        <WinnerCelebration
          initial={initialOf(winner)}
          color={winner.color}
          amount={`🎉 +$${amount}`}
          note={`Rolled a ${rolls[winnerIndex!]} — paid by the Bank`}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {players.map((player, i) => {
            const roll = rolls[i];
            const isActive = i === activeIndex;
            const inDraw = tieIndices?.includes(i) ?? false;
            const statusText = isActive
              ? "Rolling now…"
              : inDraw
                ? `Rolled a ${roll} · rolls again`
                : roll != null
                  ? `Rolled a ${roll}`
                  : "Waiting…";
            return (
              <EventPlayerRow
                key={i}
                name={player.name}
                initial={initialOf(player)}
                color={player.color}
                statusText={statusText}
                statusColor={roll != null && !inDraw ? GOLD : undefined}
                die={roll as DieValue | null}
                dieNonce={rollSeq[i]}
                highlighted={isActive}
              />
            );
          })}
        </ScrollView>
      )}
    </EventShell>
  );
}

