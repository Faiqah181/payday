import { DieValue } from "@/components/game/dice/DiceCube";
import { EventButton, EventCashRow } from "@/components/game/events/EventFooter";
import EventPlayerRow from "@/components/game/events/EventPlayerRow";
import EventShell from "@/components/game/events/EventShell";
import {
  DIE_SETTLE_MS,
  useDelayedReveal,
} from "@/components/game/events/useDelayedReveal";
import WinnerCelebration from "@/components/game/events/WinnerCelebration";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Typography from "@/components/ui/Typography";
import { useSound } from "@/contexts/SoundContext";
import { SD, SD_EVENT_GRADIENTS } from "@/constants/theme";
import {
  canFinance,
  fundingActionLabel,
  fundingClause,
  shortfallFunding,
} from "@/lib/financing";
import type { GameMode, Player } from "@/types/game";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const ENTRY_FEE = 100;
const GOLD = "#F4D03F";

interface PokerGameModalProps {
  players: Player[];
  currentPlayerIndex: number;
  gameMode: GameMode;
  onConfirm: (participantIndices: number[], winnerIndex: number) => void;
  onSkip: () => void;
}

type PokerPhase = "join" | "confirm" | "roll" | "result";

const initialOf = (player: Player) =>
  player.name?.trim()?.[0]?.toUpperCase() || "?";

export default function PokerGameModal({
  players,
  currentPlayerIndex,
  gameMode,
  onConfirm,
  onSkip,
}: PokerGameModalProps) {
  const isOnline = gameMode === "ONLINE";
  const { playDiceRoll } = useSound();
  const [phase, setPhase] = useState<PokerPhase>("join");
  // null = hasn't decided yet
  const [decisions, setDecisions] = useState<(boolean | null)[]>(
    players.map(() => null),
  );

  const [participantIndices, setParticipantIndices] = useState<number[]>([]);
  const [rolls, setRolls] = useState<(number | null)[]>([]);
  // Bumped on every individual roll so a repeated value still tumbles
  const [rollSeq, setRollSeq] = useState<number[]>([]);
  const [activeRollSlot, setActiveRollSlot] = useState(0);
  const [tieSlots, setTieSlots] = useState<number[] | null>(null);
  const [winnerSlot, setWinnerSlot] = useState<number | null>(null);
  const [confirmJoin, setConfirmJoin] = useState(false);
  const [revealPending, reveal] = useDelayedReveal();

  const me = players[currentPlayerIndex];
  // P&P asks every player in seat order; online only asks you
  const askIndex = isOnline ? currentPlayerIndex : decisions.indexOf(null);
  // In P&P the footer follows whoever's acting — the player being asked while
  // joining, the one rolling during the race. Online (and elsewhere) it's you.
  const cashPlayer = (() => {
    if (isOnline) return me;
    if (phase === "join" && askIndex >= 0) return players[askIndex];
    if (phase === "roll") return players[participantIndices[activeRollSlot]] ?? me;
    return me;
  })();
  const joinedIndices = players
    .map((_, i) => i)
    .filter((i) => decisions[i] === true);
  const prize =
    (phase === "join" || phase === "confirm"
      ? joinedIndices.length
      : participantIndices.length) * ENTRY_FEE;

  function commitDecision(joins: boolean) {
    const next = [...decisions];
    next[askIndex] = joins;
    setDecisions(next);
    // ONLINE: remote players' decisions would arrive over the network here
    if (isOnline || next.includes(null)) return;
    const joined = players.map((_, i) => i).filter((i) => next[i] === true);
    if (joined.length >= 2) {
      startGame(joined);
    } else {
      setPhase("confirm");
    }
  }

  function decide(joins: boolean) {
    // Joining short on cash pulls from savings/loan — get consent first
    if (joins && asked && asked.cash < ENTRY_FEE) {
      setConfirmJoin(true);
      return;
    }
    commitDecision(joins);
  }

  function startGame(joined: number[]) {
    setParticipantIndices(joined);
    setRolls(joined.map(() => null));
    setRollSeq(joined.map(() => 0));
    setActiveRollSlot(0);
    setTieSlots(null);
    setPhase("roll");
  }

  function handleRoll() {
    playDiceRoll();
    const value = Math.floor(Math.random() * 6) + 1;
    const newRolls = [...rolls];
    newRolls[activeRollSlot] = value;
    setRolls(newRolls);
    setRollSeq((seq) => seq.map((n, i) => (i === activeRollSlot ? n + 1 : n)));

    const slotsThisRound = tieSlots ?? participantIndices.map((_, i) => i);
    const lastInRound =
      slotsThisRound.indexOf(activeRollSlot) === slotsThisRound.length - 1;

    if (!lastInRound) {
      const currentRoundIdx = slotsThisRound.indexOf(activeRollSlot);
      const next = slotsThisRound[currentRoundIdx + 1];
      reveal(() => setActiveRollSlot(next), DIE_SETTLE_MS);
      return;
    }

    const maxRoll = Math.max(...slotsThisRound.map((s) => newRolls[s] ?? 0));
    const tied = slotsThisRound.filter((s) => newRolls[s] === maxRoll);

    if (tied.length === 1) {
      reveal(() => {
        setWinnerSlot(tied[0]);
        setPhase("result");
      });
    } else {
      // Draw: dice stay on their rolled faces; tied players reroll in turn
      reveal(() => {
        setTieSlots(tied);
        setActiveRollSlot(tied[0]);
      });
    }
  }

  const winner = winnerSlot !== null ? players[participantIndices[winnerSlot]] : null;
  const activePlayer =
    phase === "roll" ? players[participantIndices[activeRollSlot]] : null;
  const iDecided = decisions[currentPlayerIndex] !== null;
  const asked = players[askIndex];
  // Affordable from cash + savings + loan; a shortfall is gated by a confirm
  const askedCanPay = !!asked && canFinance(asked, ENTRY_FEE);

  function headerCopy(): { title: string; subtitle: string } {
    switch (phase) {
      case "join": {
        const title = isOnline
          ? iDecided
            ? "Waiting for the table…"
            : "Are you in?"
          : `${players[askIndex]?.name}, are you in?`;
        return {
          title,
          subtitle: `$${ENTRY_FEE} to play · highest roll takes the pot`,
        };
      }
      case "confirm":
        return {
          title: "Not enough players",
          subtitle: "Poker needs at least two players",
        };
      case "roll": {
        const tiedNames = tieSlots
          ?.map((slot) => players[participantIndices[slot]].name)
          .join(" & ");
        return {
          title: tieSlots ? "It's a draw!" : `${activePlayer?.name} rolls…`,
          subtitle: tieSlots
            ? `Draw between ${tiedNames} — they roll again`
            : "Highest roll takes the whole pot",
        };
      }
      case "result":
        return {
          title: "We have a winner!",
          subtitle: `${winner?.name}'s roll was the highest`,
        };
    }
  }

  const { title, subtitle } = headerCopy();

  const joinStatus = (i: number) => {
    if (decisions[i] === true) return { text: `In — $${ENTRY_FEE}`, color: GOLD };
    if (decisions[i] === false)
      return { text: "Sitting out", color: "rgba(255,255,255,0.4)" };
    if (i === askIndex) return { text: "Deciding…", color: "#FFFFFF" };
    return { text: "Waiting…", color: undefined };
  };

  const shell = (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.poker}
      emblem="♠️"
      eyebrow="POKER NIGHT"
      title={title}
      subtitle={subtitle}
      pot={{ label: "POT", value: `$${prize}` }}
      footer={
        <>
          {phase !== "result" && (
            <EventCashRow
              initial={initialOf(cashPlayer)}
              color={cashPlayer.color}
              cash={cashPlayer.cash}
            />
          )}
          {phase === "join" &&
            (isOnline && iDecided ? (
              <View style={styles.waitingBox}>
                <Typography design="title" weight={800} style={styles.waitingText}>
                  Waiting for other players…
                </Typography>
              </View>
            ) : (
              <View style={styles.buttonRow}>
                <EventButton
                  label="I'm out"
                  color="rgba(255,255,255,0.14)"
                  style={styles.rowButton}
                  onPress={() => decide(false)}
                />
                <EventButton
                  label={`$${ENTRY_FEE} to play`}
                  color={GOLD}
                  textColor="#5E4700"
                  disabled={!askedCanPay}
                  style={styles.rowButton}
                  onPress={() => decide(true)}
                />
              </View>
            ))}
          {phase === "confirm" && (
            <EventButton label="Back to the board →" onPress={onSkip} />
          )}
          {phase === "roll" && (
            <EventButton
              label={
                isOnline
                  ? "🎲 Roll your hand"
                  : `🎲 Roll ${activePlayer?.name}'s hand`
              }
              disabled={revealPending}
              onPress={handleRoll}
            />
          )}
          {phase === "result" && winner && (
            <EventButton
              label={`${winner.name} collects $${prize}`}
              color={GOLD}
              textColor="#5E4700"
              onPress={() =>
                onConfirm(participantIndices, participantIndices[winnerSlot!])
              }
            />
          )}
        </>
      }
    >
      {phase === "result" && winner ? (
        <WinnerCelebration
          initial={initialOf(winner)}
          color={winner.color}
          amount={`🎉 +$${prize}`}
          note={`Rolled a ${rolls[winnerSlot!]} — takes it all`}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {phase === "join" || phase === "confirm"
            ? players.map((player, i) => {
                const status = joinStatus(i);
                return (
                  <EventPlayerRow
                    key={i}
                    name={player.name}
                    initial={initialOf(player)}
                    color={player.color}
                    statusText={status.text}
                    statusColor={status.color}
                    highlighted={phase === "join" && i === askIndex}
                    right={<View style={styles.noSlot} />}
                  />
                );
              })
            : participantIndices.map((playerIndex, slot) => {
                const player = players[playerIndex];
                const roll = rolls[slot];
                const isActive = slot === activeRollSlot;
                const inDraw = tieSlots?.includes(slot) ?? false;
                const statusText = isActive
                  ? "Rolling now…"
                  : inDraw
                    ? `Rolled a ${roll} · rolls again`
                    : roll != null
                      ? `Rolled a ${roll}`
                      : isOnline
                        ? "Is rolling…"
                        : "Waiting…";
                return (
                  <EventPlayerRow
                    key={playerIndex}
                    name={player.name}
                    initial={initialOf(player)}
                    color={player.color}
                    statusText={statusText}
                    statusColor={roll != null && !inDraw ? GOLD : undefined}
                    die={roll as DieValue | null}
                    dieNonce={rollSeq[slot]}
                    highlighted={isActive}
                  />
                );
              })}
        </ScrollView>
      )}
    </EventShell>
  );

  if (!confirmJoin || !asked) return shell;

  const funding = shortfallFunding(asked, ENTRY_FEE);
  return (
    <>
      {shell}
      <ConfirmDialog
        title="Join on credit?"
        body={`${asked.name} is $${ENTRY_FEE - asked.cash} short on the $${ENTRY_FEE} buy-in. Cover it with ${fundingClause(funding)}?`}
        confirmLabel={fundingActionLabel(funding, "play")}
        cancelLabel="Sit out"
        tone={funding.fromLoan > 0 ? SD.debt : SD.primary}
        glyph="$"
        onConfirm={() => {
          setConfirmJoin(false);
          commitDecision(true);
        }}
        onCancel={() => setConfirmJoin(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  rowButton: {
    flex: 1,
  },
  noSlot: {
    width: 0,
    height: 40,
  },
  waitingBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  waitingText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
});
