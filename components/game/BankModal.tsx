import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface BankModalProps {
  player: Player;
  onTakeLoan: (amount: number) => void;
  onWithdrawSavings: (amount: number) => void;
  onClose: () => void;
}

export default function BankModal({
  player,
  onTakeLoan,
  onWithdrawSavings,
  onClose,
}: BankModalProps) {
  const isSavings = player.accountType === "Savings";
  const [amount, setAmount] = useState(100);

  const canDecrease = amount > 100;
  const canIncrease = isSavings ? amount < player.savingsBalance : true;

  const fine = isSavings ? (amount / 100) * 50 : 0;
  const netCashGain = amount - fine;
  const newCash = player.cash + netCashGain;
  const newBalance = isSavings
    ? player.savingsBalance - amount
    : player.loanBalance + amount;

  const hasSavings = player.savingsBalance >= 100;

  function handleConfirm() {
    if (isSavings) {
      onWithdrawSavings(amount);
    } else {
      onTakeLoan(amount);
    }
  }

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons
              name={isSavings ? "wallet" : "business"}
              size={22}
              color={isSavings ? "#1565C0" : "#C62828"}
            />
            <Text style={[styles.title, { color: isSavings ? "#1565C0" : "#C62828" }]}>
              {isSavings ? "Savings Withdrawal" : "Take a Loan"}
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#636E72" />
            </Pressable>
          </View>

          {/* Current balance */}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>
              {isSavings ? "Savings Balance" : "Current Loan"}
            </Text>
            <Text style={[styles.balanceValue, { color: isSavings ? "#1565C0" : "#C62828" }]}>
              ${isSavings ? player.savingsBalance : player.loanBalance}
            </Text>
          </View>

          {/* Fine warning for savings */}
          {isSavings && (
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={14} color="#F57C00" />
              <Text style={styles.warningText}>
                Early withdrawal fine: $50 per $100 withdrawn
              </Text>
            </View>
          )}

          {/* No savings available */}
          {isSavings && !hasSavings ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No savings available to withdraw.</Text>
            </View>
          ) : (
            <>
              {/* Amount stepper */}
              <View style={styles.stepperRow}>
                <Text style={styles.stepperLabel}>Amount</Text>
                <View style={styles.stepperButtons}>
                  <Pressable
                    style={[styles.stepBtn, !canDecrease && styles.stepBtnDisabled]}
                    onPress={() => canDecrease && setAmount(amount - 100)}
                  >
                    <Text style={styles.stepBtnText}>-$100</Text>
                  </Pressable>
                  <Text style={styles.stepAmount}>${amount}</Text>
                  <Pressable
                    style={[styles.stepBtn, !canIncrease && styles.stepBtnDisabled]}
                    onPress={() => canIncrease && setAmount(amount + 100)}
                  >
                    <Text style={styles.stepBtnText}>+$100</Text>
                  </Pressable>
                </View>
              </View>

              {/* Preview */}
              <View style={styles.previewBox}>
                {isSavings && fine > 0 && (
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Fine</Text>
                    <Text style={[styles.previewValue, { color: "#C62828" }]}>-${fine}</Text>
                  </View>
                )}
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Cash gain</Text>
                  <Text style={[styles.previewValue, { color: "#2E7D32" }]}>
                    +${netCashGain}
                  </Text>
                </View>
                <View style={[styles.previewRow, styles.previewDivider]}>
                  <Text style={styles.previewLabel}>New cash</Text>
                  <Text style={styles.previewValue}>${newCash}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>
                    {isSavings ? "New savings" : "New loan"}
                  </Text>
                  <Text style={[styles.previewValue, { color: isSavings ? "#1565C0" : "#C62828" }]}>
                    ${newBalance}
                  </Text>
                </View>
              </View>

              {/* Confirm button */}
              <Pressable
                style={[styles.confirmBtn, { backgroundColor: isSavings ? "#1565C0" : "#C62828" }]}
                onPress={handleConfirm}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.confirmBtnText}>
                  {isSavings ? "Withdraw" : "Borrow"}
                </Text>
              </Pressable>
            </>
          )}

          {/* Cancel */}
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
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
    width: "85%",
    maxWidth: 380,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636E72",
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  warningText: {
    fontSize: 12,
    color: "#E65100",
    fontWeight: "600",
    flex: 1,
  },
  emptyBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
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
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  stepBtnDisabled: {
    opacity: 0.35,
  },
  stepBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1565C0",
  },
  stepAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2D3436",
    minWidth: 60,
    textAlign: "center",
  },
  previewBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewDivider: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 6,
    marginTop: 2,
  },
  previewLabel: {
    fontSize: 13,
    color: "#636E72",
    fontWeight: "600",
  },
  previewValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2D3436",
  },
  confirmBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: "rgba(0,0,0,0.2)",
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },
});
