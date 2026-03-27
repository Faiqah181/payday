import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface SwellfareModalProps {
  player: Player;
  pot: number;
  onUse: (bet: number, roll: number) => void;
  onDiscard: () => void;
}

const ACCENT = "#7B1FA2";
const ACCENT_DARK = "#4A0072";

export default function SwellfareModal({
  player,
  pot,
  onUse,
  onDiscard,
}: SwellfareModalProps) {
  const billTotal = player.unpaidBills.reduce((s, b) => s + b.amount, 0);
  const loanInterestDue = Math.floor(player.loanBalance * 0.2);
  const totalOwed = player.loanBalance + loanInterestDue + billTotal;
  const isInDebt = totalOwed > player.cash;

  const [bet, setBet] = useState(10);
  const [rolled, setRolled] = useState<number | null>(null);

  const canDecrease = bet > 10;
  const canIncrease = bet < 100;
  const won = rolled !== null && rolled >= 5;

  function handleRoll() {
    const roll = Math.floor(Math.random() * 6) + 1;
    setRolled(roll);
  }

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>SWELLFARE</Text>
            </View>
          </View>

          {!isInDebt ? (
            /* Not in debt — must discard */
            <>
              <View style={styles.noDebtBox}>
                <Ionicons name="checkmark-circle" size={32} color="#2E7D32" />
                <Text style={styles.noDebtTitle}>You're Not in Debt!</Text>
                <Text style={styles.noDebtSub}>
                  Swellfare can only be used when your loan + interest + bills exceed your cash.
                  This card must be discarded.
                </Text>
              </View>
              <Pressable style={styles.discardBtn} onPress={onDiscard}>
                <Text style={styles.discardBtnText}>Discard Card</Text>
              </Pressable>
            </>
          ) : rolled === null ? (
            /* Bet selection screen */
            <>
              <View style={styles.debtBox}>
                <Ionicons name="warning" size={16} color="#C62828" />
                <Text style={styles.debtText}>
                  You owe ${totalOwed} but only have ${player.cash} — you're in debt!
                </Text>
              </View>

              <View style={styles.potRow}>
                <Ionicons name="trophy" size={15} color={ACCENT} />
                <Text style={styles.potLabel}>Community Pot</Text>
                <Text style={styles.potValue}>${pot}</Text>
              </View>

              <Text style={styles.ruleText}>
                Bet up to $100. Roll a 5 or 6: collect 10× your bet from the bank.
                Roll 1–4: your bet goes into the pot.
              </Text>

              {/* Bet stepper */}
              <View style={styles.stepperRow}>
                <Text style={styles.stepperLabel}>Your Bet</Text>
                <View style={styles.stepperButtons}>
                  <Pressable
                    style={[styles.stepBtn, !canDecrease && styles.stepBtnDisabled]}
                    onPress={() => canDecrease && setBet(bet - 10)}
                  >
                    <Text style={styles.stepBtnText}>-$10</Text>
                  </Pressable>
                  <Text style={styles.stepAmount}>${bet}</Text>
                  <Pressable
                    style={[styles.stepBtn, !canIncrease && styles.stepBtnDisabled]}
                    onPress={() => canIncrease && setBet(bet + 10)}
                  >
                    <Text style={styles.stepBtnText}>+$10</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Win (5 or 6)</Text>
                <Text style={[styles.previewValue, { color: "#2E7D32" }]}>+${bet * 10}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Lose (1–4)</Text>
                <Text style={[styles.previewValue, { color: "#C62828" }]}>-${bet} to pot</Text>
              </View>

              <Pressable style={styles.rollBtn} onPress={handleRoll}>
                <Ionicons name="dice" size={20} color="#fff" />
                <Text style={styles.rollBtnText}>Roll the Dice</Text>
              </Pressable>

              <Pressable style={styles.discardLink} onPress={onDiscard}>
                <Text style={styles.discardLinkText}>Discard without using</Text>
              </Pressable>
            </>
          ) : (
            /* Result screen */
            <>
              <View style={[styles.dieBox, won ? styles.dieBoxWin : styles.dieBoxLose]}>
                <Text style={styles.dieNumber}>{rolled}</Text>
                <Text style={styles.dieFace}>
                  {["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][rolled - 1]}
                </Text>
              </View>

              {won ? (
                <View style={styles.resultBox}>
                  <Text style={styles.resultTitle}>🎉 You Win!</Text>
                  <Text style={styles.resultSub}>
                    Collect <Text style={{ fontWeight: "800" }}>${bet * 10}</Text> from the bank
                  </Text>
                </View>
              ) : (
                <View style={styles.resultBox}>
                  <Text style={[styles.resultTitle, { color: "#C62828" }]}>No Luck</Text>
                  <Text style={styles.resultSub}>
                    <Text style={{ fontWeight: "800" }}>${bet}</Text> goes into the pot
                  </Text>
                </View>
              )}

              <Pressable
                style={[styles.rollBtn, won ? styles.rollBtnWin : styles.rollBtnLose]}
                onPress={() => onUse(bet, rolled)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.rollBtnText}>{won ? "Collect!" : "OK"}</Text>
              </Pressable>
            </>
          )}
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
    backgroundColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  headerBadgeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1.5,
  },
  noDebtBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  noDebtTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2E7D32",
  },
  noDebtSub: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    lineHeight: 18,
  },
  debtBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 10,
  },
  debtText: {
    fontSize: 12,
    color: "#C62828",
    fontWeight: "600",
    flex: 1,
    lineHeight: 18,
  },
  potRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3E5F5",
    borderRadius: 10,
    padding: 10,
  },
  potLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: ACCENT,
    flex: 1,
  },
  potValue: {
    fontSize: 16,
    fontWeight: "800",
    color: ACCENT_DARK,
  },
  ruleText: {
    fontSize: 12,
    color: "#636E72",
    lineHeight: 18,
    textAlign: "center",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3436",
  },
  stepperButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepBtn: {
    backgroundColor: "#EDE7F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  stepBtnDisabled: {
    opacity: 0.35,
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: ACCENT,
  },
  stepAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3436",
    minWidth: 52,
    textAlign: "center",
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  previewLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  previewValue: {
    fontSize: 13,
    fontWeight: "800",
  },
  rollBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: ACCENT_DARK,
  },
  rollBtnWin: {
    backgroundColor: "#2E7D32",
    borderBottomColor: "#1B5E20",
  },
  rollBtnLose: {
    backgroundColor: "#757575",
    borderBottomColor: "#424242",
  },
  rollBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
  discardLink: {
    alignItems: "center",
    paddingVertical: 2,
  },
  discardLinkText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  discardBtn: {
    backgroundColor: "#ECEFF1",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#B0BEC5",
  },
  discardBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#546E7A",
  },
  dieBox: {
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  dieBoxWin: {
    backgroundColor: "#E8F5E9",
  },
  dieBoxLose: {
    backgroundColor: "#FFEBEE",
  },
  dieNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#888",
  },
  dieFace: {
    fontSize: 64,
  },
  resultBox: {
    alignItems: "center",
    gap: 4,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E7D32",
  },
  resultSub: {
    fontSize: 14,
    color: "#555",
  },
});
