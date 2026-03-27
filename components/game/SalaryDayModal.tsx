import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const SALARY = 325;

interface SalaryDayModalProps {
  player: Player;
  onConfirm: (loanPayment: number, savingsAdjust: number) => void;
}

/** Compute the mandatory steps (1-3) and return preview numbers. */
function computeMandatory(player: Player) {
  let cash = player.cash + SALARY;
  let savings = player.savingsBalance;
  let loan = player.loanBalance;

  const savingsInterest = Math.floor(savings * 0.1);
  const loanInterestAdded = Math.floor(loan * 0.2);
  savings += savingsInterest;
  loan += loanInterestAdded;

  const billTotal = player.unpaidBills.reduce((s, b) => s + b.amount, 0);
  cash -= billTotal;

  let autoSavingsWithdrawal = 0;
  let autoLoanTaken = 0;

  if (cash < 0 && savings > 0) {
    autoSavingsWithdrawal = Math.min(savings, -cash);
    savings -= autoSavingsWithdrawal;
    cash += autoSavingsWithdrawal;
  }
  if (cash < 0) {
    autoLoanTaken = Math.ceil(-cash / 100) * 100;
    loan += autoLoanTaken;
    cash += autoLoanTaken;
  }

  return { cash, savings, loan, billTotal, savingsInterest, loanInterestAdded, autoSavingsWithdrawal, autoLoanTaken };
}

function SummaryRow({
  icon,
  label,
  value,
  valueColor,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  note?: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>{icon}</View>
      <View style={styles.summaryText}>
        <Text style={styles.summaryLabel}>{label}</Text>
        {note ? <Text style={styles.summaryNote}>{note}</Text> : null}
      </View>
      <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : undefined]}>
        {value}
      </Text>
    </View>
  );
}

export default function SalaryDayModal({ player, onConfirm }: SalaryDayModalProps) {
  const mandatory = computeMandatory(player);
  const isSavings = player.accountType === "Savings";

  const [loanPayment, setLoanPayment] = useState(0);
  const [savingsAdjust, setSavingsAdjust] = useState(0);
  const [billsExpanded, setBillsExpanded] = useState(false);

  // Available cash for optional adjustments (after mandatory steps)
  const availableCash = mandatory.cash - loanPayment - Math.max(0, savingsAdjust);

  const canPayLoan = loanPayment < mandatory.loan && availableCash >= 100;
  const canUnpayLoan = loanPayment > 0;
  const canDepositSavings = isSavings && availableCash >= 100;
  const canWithdrawSavings = isSavings && savingsAdjust > -mandatory.savings;

  const finalCash = mandatory.cash - loanPayment - savingsAdjust;
  const finalLoan = mandatory.loan - loanPayment;
  const finalSavings = mandatory.savings + savingsAdjust;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>💰 Pay Day!</Text>
          <Text style={styles.subtitle}>Month complete — here's your summary</Text>

          {/* Mandatory steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>STEP 1-3: Mandatory</Text>

            <SummaryRow
              icon={<Ionicons name="cash" size={18} color="#2E7D32" />}
              label="Monthly Salary"
              value={`+$${SALARY}`}
              valueColor="#2E7D32"
            />

            {isSavings ? (
              <SummaryRow
                icon={<Ionicons name="trending-up" size={18} color="#1565C0" />}
                label="Savings Interest (10%)"
                value={`+$${mandatory.savingsInterest}`}
                valueColor="#1565C0"
                note={`On $${player.savingsBalance} savings`}
              />
            ) : (
              <SummaryRow
                icon={<Ionicons name="trending-down" size={18} color="#C62828" />}
                label="Loan Interest (20%)"
                value={`+$${mandatory.loanInterestAdded} to loan`}
                valueColor="#C62828"
                note={`On $${player.loanBalance} loan`}
              />
            )}

            {/* Bills Paid — tap to expand */}
            <Pressable
              style={styles.billToggleRow}
              onPress={() => player.unpaidBills.length > 0 && setBillsExpanded(v => !v)}
            >
              <View style={styles.summaryIcon}>
                <Ionicons name="receipt" size={18} color="#EF6C00" />
              </View>
              <View style={styles.summaryText}>
                <Text style={styles.summaryLabel}>Bills Paid</Text>
                <Text style={styles.summaryNote}>
                  {player.unpaidBills.length === 0
                    ? "No bills this month!"
                    : `${player.unpaidBills.length} bill(s) — tap to ${billsExpanded ? "hide" : "view"}`}
                </Text>
              </View>
              <Text style={[styles.summaryValue, { color: "#EF6C00" }]}>
                {`-$${mandatory.billTotal}`}
              </Text>
              {player.unpaidBills.length > 0 && (
                <Ionicons
                  name={billsExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#888"
                />
              )}
            </Pressable>

            {billsExpanded && (
              <View style={styles.billList}>
                {player.unpaidBills.map((bill, i) => {
                  const isLast = i === player.unpaidBills.length - 1;
                  return (
                    <View key={bill.id} style={styles.billItem}>
                      <Text style={styles.billItemPrefix}>{isLast ? "└" : "├"}</Text>
                      <Text style={styles.billItemName}>{bill.title}</Text>
                      <Text style={styles.billItemAmount}>${bill.amount}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {mandatory.autoSavingsWithdrawal > 0 && (
              <SummaryRow
                icon={<Ionicons name="warning" size={18} color="#F57C00" />}
                label="Auto-withdrew from Savings"
                value={`-$${mandatory.autoSavingsWithdrawal}`}
                valueColor="#F57C00"
              />
            )}
            {mandatory.autoLoanTaken > 0 && (
              <SummaryRow
                icon={<Ionicons name="warning" size={18} color="#C62828" />}
                label="Auto-loan taken"
                value={`+$${mandatory.autoLoanTaken} added to loan`}
                valueColor="#C62828"
              />
            )}
          </View>

          {/* Optional adjustments */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>STEP 4: Optional Adjustments</Text>
            <Text style={styles.optionalNote}>Adjust in $100 increments</Text>

            {mandatory.loan > 0 && (
              <View style={styles.adjustRow}>
                <Ionicons name="business" size={16} color="#C62828" />
                <Text style={styles.adjustLabel}>Pay Loan</Text>
                <Text style={styles.adjustBalance}>${mandatory.loan - loanPayment}</Text>
                <View style={styles.adjustButtons}>
                  <Pressable
                    style={[styles.adjBtn, !canUnpayLoan && styles.adjBtnDisabled]}
                    onPress={() => canUnpayLoan && setLoanPayment(loanPayment - 100)}
                  >
                    <Text style={styles.adjBtnText}>-$100</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.adjBtn, !canPayLoan && styles.adjBtnDisabled]}
                    onPress={() => canPayLoan && setLoanPayment(loanPayment + 100)}
                  >
                    <Text style={styles.adjBtnText}>+$100</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {isSavings && (
              <View style={styles.adjustRow}>
                <Ionicons name="wallet" size={16} color="#1565C0" />
                <Text style={styles.adjustLabel}>Savings</Text>
                <Text style={styles.adjustBalance}>${mandatory.savings + savingsAdjust}</Text>
                <View style={styles.adjustButtons}>
                  <Pressable
                    style={[styles.adjBtn, !canWithdrawSavings && styles.adjBtnDisabled]}
                    onPress={() => canWithdrawSavings && setSavingsAdjust(savingsAdjust - 100)}
                  >
                    <Text style={styles.adjBtnText}>-$100</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.adjBtn, !canDepositSavings && styles.adjBtnDisabled]}
                    onPress={() => canDepositSavings && setSavingsAdjust(savingsAdjust + 100)}
                  >
                    <Text style={styles.adjBtnText}>+$100</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          {/* Final balance preview */}
          <View style={styles.finalRow}>
            <View style={styles.finalItem}>
              <Ionicons name="cash" size={16} color="#2E7D32" />
              <Text style={styles.finalLabel}>Cash</Text>
              <Text style={styles.finalValue}>${finalCash}</Text>
            </View>
            {isSavings ? (
              <View style={styles.finalItem}>
                <Ionicons name="wallet" size={16} color="#1565C0" />
                <Text style={styles.finalLabel}>Savings</Text>
                <Text style={styles.finalValue}>${finalSavings}</Text>
              </View>
            ) : (
              <View style={styles.finalItem}>
                <Ionicons name="business" size={16} color="#C62828" />
                <Text style={styles.finalLabel}>Loan</Text>
                <Text style={styles.finalValue}>${finalLoan}</Text>
              </View>
            )}
          </View>

          <Pressable style={styles.collectBtn} onPress={() => onConfirm(loanPayment, savingsAdjust)}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.collectBtnText}>Collect Pay</Text>
          </Pressable>
        </ScrollView>
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
    width: "90%",
    maxWidth: 420,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: "#2E7D32",
  },
  subtitle: {
    fontSize: 13,
    color: "#636E72",
    textAlign: "center",
    marginTop: -6,
  },
  section: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#888",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryIcon: {
    width: 24,
    alignItems: "center",
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D3436",
  },
  summaryNote: {
    fontSize: 11,
    color: "#888",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2D3436",
  },
  optionalNote: {
    fontSize: 11,
    color: "#888",
    marginTop: -4,
  },
  adjustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  adjustLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D3436",
    flex: 1,
  },
  adjustBalance: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2D3436",
    minWidth: 60,
    textAlign: "right",
  },
  adjustButtons: {
    flexDirection: "row",
    gap: 6,
  },
  adjBtn: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  adjBtnDisabled: {
    opacity: 0.35,
  },
  adjBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1565C0",
  },
  finalRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 12,
  },
  finalItem: {
    alignItems: "center",
    gap: 4,
  },
  finalLabel: {
    fontSize: 11,
    color: "#555",
    fontWeight: "600",
  },
  finalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2D3436",
  },
  collectBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: "#1B5E20",
  },
  collectBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 4,
  },
  billToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  billList: {
    marginTop: 2,
    gap: 4,
    paddingLeft: 32,
  },
  billItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  billItemPrefix: {
    fontSize: 11,
    color: "#888",
    width: 14,
  },
  billItemName: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
    color: "#2D3436",
  },
  billItemAmount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EF6C00",
  },
});
