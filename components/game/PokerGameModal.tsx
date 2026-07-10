import { DieValue } from "@/components/game/dice/DiceCube";
import { EventButton, EventCashRow } from "@/components/game/events/EventFooter";
import EventPlayerRow from "@/components/game/events/EventPlayerRow";
import EventShell from "@/components/game/events/EventShell";
import PlayerToken from "@/components/ui/PlayerToken";
import Typography from "@/components/ui/Typography";
import { SD, SD_EVENT_GRADIENTS } from "@/constants/theme";
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
  const [phase, setPhase] = useState<PokerPhase>("join");
  // null = hasn't decided yet
  const [decisions, setDecisions] = useState<(boolean | null)[]>(
    players.map(() => null),
  );

  const [participantIndices, setParticipantIndices] = useState<number[]>([]);
  const [rolls, setRolls] = useState<(number | null)[]>([]);
  const [activeRollSlot, setActiveRollSlot] = useState(0);
  const [tieSlots, setTieSlots] = useState<number[] | null>(null);
  const [winnerSlot, setWinnerSlot] = useState<number | null>(null);

  const me = players[currentPlayerIndex];
  // P&P asks every player in seat order; online only asks you
  const askIndex = isOnline ? currentPlayerIndex : decisions.indexOf(null);
  const joinedIndices = players
    .map((_, i) => i)
    .filter((i) => decisions[i] === true);
  const prize =
    (phase === "join" || phase === "confirm"
      ? joinedIndices.length
      : participantIndices.length) * ENTRY_FEE;

  function decide(joins: boolean) {
    const next = [...decisions];
    next[askIndex] = joins;
    setDecisions(next);
    if (!isOnline && !next.includes(null)) setPhase("confirm");
    // ONLINE: remote players' decisions would arrive over the network here
  }

  function startGame() {
    setParticipantIndices(joinedIndices);
    setRolls(joinedIndices.map(() => null));
    setActiveRollSlot(0);
    setTieSlots(null);
    setPhase("roll");
  }

  function handleRoll() {
    const value = Math.floor(Math.random() * 6) + 1;
    const newRolls = [...rolls];
    newRolls[activeRollSlot] = value;
    setRolls(newRolls);

    const slotsThisRound = tieSlots ?? participantIndices.map((_, i) => i);
    const lastInRound =
      slotsThisRound.indexOf(activeRollSlot) === slotsThisRound.length - 1;

    if (!lastInRound) {
      const currentRoundIdx = slotsThisRound.indexOf(activeRollSlot);
      setActiveRollSlot(slotsThisRound[currentRoundIdx + 1]);
      return;
    }

    const maxRoll = Math.max(...slotsThisRound.map((s) => newRolls[s] ?? 0));
    const tied = slotsThisRound.filter((s) => newRolls[s] === maxRoll);

    if (tied.length === 1) {
      setWinnerSlot(tied[0]);
      setPhase("result");
    } else {
      const resetRolls = [...newRolls];
      tied.forEach((s) => {
        resetRolls[s] = null;
      });
      setRolls(resetRolls);
      setTieSlots(tied);
      setActiveRollSlot(tied[0]);
    }
  }

  const winner = winnerSlot !== null ? players[participantIndices[winnerSlot]] : null;
  const activePlayer =
    phase === "roll" ? players[participantIndices[activeRollSlot]] : null;
  const enoughPlayers = joinedIndices.length >= 2;
  const iDecided = decisions[currentPlayerIndex] !== null;

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
        if (!enoughPlayers) {
          return {
            title: "Not enough players",
            subtitle: "Poker needs at least two players",
          };
        }
        return {
          title: "Table is set",
          subtitle: `${joinedIndices.length} players · $${prize} on the table`,
        };
      case "roll":
        return {
          title: `${activePlayer?.name} rolls…`,
          subtitle: tieSlots
            ? "It's a tie — tied players roll again!"
            : "Highest roll takes the whole pot",
        };
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

  return (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.poker}
      eyebrow="♠  POKER NIGHT"
      title={title}
      subtitle={subtitle}
      pot={{ label: "POT", value: `$${prize}` }}
      footer={
        <>
          <EventCashRow initial={initialOf(me)} color={me.color} cash={me.cash} />
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
                  style={styles.rowButton}
                  onPress={() => decide(true)}
                />
              </View>
            ))}
          {phase === "confirm" &&
            (enoughPlayers ? (
              <EventButton
                label="Deal — roll the dice →"
                color={GOLD}
                textColor="#5E4700"
                onPress={startGame}
              />
            ) : (
              <EventButton label="Back to the board →" onPress={onSkip} />
            ))}
          {phase === "roll" && (
            <EventButton
              label={
                isOnline
                  ? "🎲 Roll your hand"
                  : `🎲 Roll ${activePlayer?.name}'s hand`
              }
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
        <View style={styles.winnerBlock}>
          <View style={styles.winnerRing}>
            <PlayerToken initial={initialOf(winner)} color={winner.color} size={72} />
          </View>
          <Typography design="money" style={styles.winnerAmount}>
            🎉 +${prize}
          </Typography>
          <Typography design="body" weight={700} style={styles.winnerNote}>
            Rolled a {rolls[winnerSlot!]} — takes it all
          </Typography>
        </View>
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
                return (
                  <EventPlayerRow
                    key={playerIndex}
                    name={player.name}
                    initial={initialOf(player)}
                    color={player.color}
                    statusText={
                      roll != null
                        ? `Rolled a ${roll}`
                        : isActive
                          ? "Rolling now…"
                          : isOnline
                            ? "Is rolling…"
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
