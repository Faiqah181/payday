import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface PokerGameModalProps {
  players: Player[];
  onConfirm: (participantIndices: number[], winnerIndex: number) => void;
  onSkip: () => void;
}

const TEAL = "#00897B";
const TEAL_DARK = "#00695C";
const TEAL_LIGHT = "#E0F2F1";

type PokerPhase = "join" | "roll" | "result";

const DIE_FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function PokerGameModal({ players, onConfirm, onSkip }: PokerGameModalProps) {
  const [phase, setPhase] = useState<PokerPhase>("join");
  const [joined, setJoined] = useState<boolean[]>(players.map(() => false));

  // Roll phase state
  const [participantIndices, setParticipantIndices] = useState<number[]>([]);
  const [rolls, setRolls] = useState<(number | null)[]>([]);
  const [activeRollSlot, setActiveRollSlot] = useState(0); // index into participantIndices

  // Tie-break: which participant slots are still competing
  const [tieSlots, setTieSlots] = useState<number[] | null>(null);

  // Result phase state
  const [winnerParticipantSlot, setWinnerParticipantSlot] = useState<number | null>(null);

  const joinedCount = joined.filter(Boolean).length;

  function startGame() {
    const indices = players.map((_, i) => i).filter((i) => joined[i]);
    setParticipantIndices(indices);
    setRolls(indices.map(() => null));
    setActiveRollSlot(0);
    setTieSlots(null);
    setPhase("roll");
  }

  function handleRoll() {
    const value = Math.floor(Math.random() * 6) + 1;
    const newRolls = [...rolls];
    newRolls[activeRollSlot] = value;
    setRolls(newRolls);

    const nextSlot = activeRollSlot + 1;

    // Determine if this is the last roll (of current round)
    const slotsThisRound = tieSlots ?? participantIndices.map((_, i) => i);
    const lastInRound = slotsThisRound.indexOf(activeRollSlot) === slotsThisRound.length - 1;

    if (!lastInRound) {
      // Find next slot that needs to roll
      const currentRoundIdx = slotsThisRound.indexOf(activeRollSlot);
      setActiveRollSlot(slotsThisRound[currentRoundIdx + 1]);
      return;
    }

    // All in this round have rolled — find winner or ties
    const maxRoll = Math.max(...slotsThisRound.map((s) => newRolls[s] ?? 0));
    const tied = slotsThisRound.filter((s) => newRolls[s] === maxRoll);

    if (tied.length === 1) {
      setWinnerParticipantSlot(tied[0]);
      setPhase("result");
    } else {
      // Tie-break: reset tied slots and re-roll
      const resetRolls = [...newRolls];
      tied.forEach((s) => { resetRolls[s] = null; });
      setRolls(resetRolls);
      setTieSlots(tied);
      setActiveRollSlot(tied[0]);
    }
  }

  function handleCollect() {
    if (winnerParticipantSlot === null) return;
    onConfirm(participantIndices, participantIndices[winnerParticipantSlot]);
  }

  const prize = participantIndices.length * 100;

  // ─── JOIN PHASE ───────────────────────────────────────────────────────────
  if (phase === "join") {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerBadge}>
                <Ionicons name="game-controller" size={20} color="#fff" />
                <Text style={styles.headerTitle}>Poker Game!</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Place $100 to play. Highest roll wins the pot.</Text>

            <ScrollView style={styles.playerList} showsVerticalScrollIndicator={false}>
              {players.map((player, i) => (
                <Pressable
                  key={player.name}
                  style={[styles.playerRow, joined[i] && styles.playerRowJoined]}
                  onPress={() => {
                    const next = [...joined];
                    next[i] = !next[i];
                    setJoined(next);
                  }}
                >
                  <View style={[styles.colorDot, { backgroundColor: player.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerCash}>${player.cash.toLocaleString()}</Text>
                  </View>
                  <View style={[styles.joinBadge, joined[i] && styles.joinBadgeActive]}>
                    <Ionicons
                      name={joined[i] ? "checkmark-circle" : "add-circle-outline"}
                      size={16}
                      color={joined[i] ? "#fff" : TEAL}
                    />
                    <Text style={[styles.joinBadgeText, joined[i] && styles.joinBadgeTextActive]}>
                      {joined[i] ? "In — $100" : "Join $100"}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {joinedCount === 1 && (
              <View style={styles.noteBox}>
                <Ionicons name="information-circle" size={13} color="#888" />
                <Text style={styles.noteText}>Need at least 2 players to play.</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <Pressable style={styles.skipBtn} onPress={onSkip}>
                <Text style={styles.skipBtnText}>Skip</Text>
              </Pressable>
              <Pressable
                style={[styles.playBtn, joinedCount < 2 && styles.playBtnDisabled]}
                onPress={() => { if (joinedCount >= 2) startGame(); }}
              >
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={styles.playBtnText}>Play (${joinedCount * 100} pot)</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // ─── ROLL PHASE ───────────────────────────────────────────────────────────
  if (phase === "roll") {
    const activeSlotsThisRound = tieSlots ?? participantIndices.map((_, i) => i);
    const isTieBreak = tieSlots !== null;

    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerBadge}>
                <Ionicons name="game-controller" size={20} color="#fff" />
                <Text style={styles.headerTitle}>{isTieBreak ? "Tie! Re-roll" : "Roll the Die"}</Text>
              </View>
            </View>

            {isTieBreak && (
              <View style={styles.tieCallout}>
                <Ionicons name="refresh" size={14} color="#E65100" />
                <Text style={styles.tieCalloutText}>
                  It's a tie! Tied players roll again.
                </Text>
              </View>
            )}

            <View style={styles.rollList}>
              {participantIndices.map((playerIdx, slot) => {
                const player = players[playerIdx];
                const rollValue = rolls[slot];
                const isActive = slot === activeRollSlot && activeSlotsThisRound.includes(slot);
                const isInTieRound = activeSlotsThisRound.includes(slot);
                const isDimmed = isTieBreak && !isInTieRound;

                return (
                  <View
                    key={player.name}
                    style={[
                      styles.rollRow,
                      isActive && styles.rollRowActive,
                      isDimmed && styles.rollRowDimmed,
                    ]}
                  >
                    <View style={[styles.colorDot, { backgroundColor: player.color }]} />
                    <Text style={styles.rollPlayerName}>{player.name}</Text>
                    <View style={styles.dieSlot}>
                      {rollValue !== null ? (
                        <Text style={styles.dieFace}>{DIE_FACES[rollValue]}</Text>
                      ) : isActive ? (
                        <Pressable style={styles.rollBtn} onPress={handleRoll}>
                          <Ionicons name="dice" size={14} color="#fff" />
                          <Text style={styles.rollBtnText}>Roll</Text>
                        </Pressable>
                      ) : (
                        <View style={styles.dieEmpty} />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.potPreview}>
              <Ionicons name="trophy" size={14} color={TEAL} />
              <Text style={styles.potPreviewText}>Pot: <Text style={styles.potPreviewAmt}>${prize}</Text></Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // ─── RESULT PHASE ─────────────────────────────────────────────────────────
  const winnerPlayerIdx = winnerParticipantSlot !== null ? participantIndices[winnerParticipantSlot] : -1;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Ionicons name="trophy" size={20} color="#fff" />
              <Text style={styles.headerTitle}>We Have a Winner!</Text>
            </View>
          </View>

          <View style={styles.rollList}>
            {participantIndices.map((playerIdx, slot) => {
              const player = players[playerIdx];
              const rollValue = rolls[slot];
              const isWinner = playerIdx === winnerPlayerIdx;
              const delta = isWinner ? prize - 100 : -100;

              return (
                <View
                  key={player.name}
                  style={[styles.rollRow, isWinner && styles.rollRowWinner]}
                >
                  <View style={[styles.colorDot, { backgroundColor: player.color }]} />
                  <Text style={[styles.rollPlayerName, isWinner && styles.rollPlayerNameWinner]}>
                    {player.name}
                  </Text>
                  {isWinner && <Ionicons name="trophy" size={14} color={TEAL} style={{ marginRight: 4 }} />}
                  <Text style={[styles.dieFace, { marginRight: 8 }]}>{rollValue !== null ? DIE_FACES[rollValue] : ""}</Text>
                  <Text style={[styles.resultDelta, { color: delta > 0 ? "#2E7D32" : "#C62828" }]}>
                    {delta > 0 ? `+$${delta}` : `-$${Math.abs(delta)}`}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.winnerBox}>
            <Ionicons name="trophy" size={18} color={TEAL} />
            <View style={{ flex: 1 }}>
              <Text style={styles.winnerLabel}>{players[winnerPlayerIdx]?.name} wins!</Text>
            </View>
            <Text style={styles.winnerPrize}>+${prize - 100}</Text>
          </View>

          <Pressable style={styles.confirmBtn} onPress={handleCollect}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>Collect</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "88%",
    maxWidth: 380,
    gap: 12,
  },
  header: {
    alignItems: "center",
  },
  headerBadge: {
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    color: "#636E72",
    textAlign: "center",
  },
  playerList: {
    maxHeight: 220,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    borderRadius: 8,
  },
  playerRowJoined: {
    backgroundColor: TEAL_LIGHT,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  playerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D3436",
  },
  playerCash: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
  },
  joinBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: TEAL,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  joinBadgeActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  joinBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: TEAL,
  },
  joinBadgeTextActive: {
    color: "#fff",
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 9,
  },
  noteText: {
    fontSize: 11,
    color: "#888",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  skipBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#888",
  },
  playBtn: {
    flex: 2,
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 4,
    borderBottomColor: TEAL_DARK,
  },
  playBtnDisabled: {
    opacity: 0.4,
  },
  playBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  tieCallout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF3E0",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#E65100",
    padding: 10,
  },
  tieCalloutText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E65100",
    flex: 1,
  },
  rollList: {
    gap: 6,
  },
  rollRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#F8F9FA",
  },
  rollRowActive: {
    backgroundColor: TEAL_LIGHT,
    borderWidth: 1.5,
    borderColor: TEAL,
  },
  rollRowDimmed: {
    opacity: 0.4,
  },
  rollRowWinner: {
    backgroundColor: TEAL_LIGHT,
    borderWidth: 1.5,
    borderColor: TEAL,
  },
  rollPlayerName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#2D3436",
  },
  rollPlayerNameWinner: {
    color: TEAL_DARK,
  },
  dieSlot: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  dieFace: {
    fontSize: 28,
    lineHeight: 32,
  },
  dieEmpty: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderStyle: "dashed",
  },
  rollBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: TEAL_DARK,
  },
  rollBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
  },
  potPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
  },
  potPreviewText: {
    fontSize: 13,
    fontWeight: "600",
    color: TEAL_DARK,
  },
  potPreviewAmt: {
    fontWeight: "800",
    fontSize: 14,
  },
  winnerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 12,
    padding: 12,
  },
  winnerLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: TEAL_DARK,
  },
  winnerPrize: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E7D32",
  },
  resultDelta: {
    fontSize: 13,
    fontWeight: "800",
    minWidth: 50,
    textAlign: "right",
  },
  confirmBtn: {
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: TEAL_DARK,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
});
