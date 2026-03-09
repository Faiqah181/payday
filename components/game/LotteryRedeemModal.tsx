import { COLORS } from "@/constants/colors";
import type { HeldLotteryTicket } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface LotteryRedeemModalProps {
  tickets: HeldLotteryTicket[];
  onRedeem: (ticketIds: number[]) => void;
  onSkip: () => void;
}

export default function LotteryRedeemModal({ tickets, onRedeem, onSkip }: LotteryRedeemModalProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleTicket = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalRedeem = tickets
    .filter((t) => selected.has(t.card.id))
    .reduce((sum, t) => sum + t.card.amount, 0);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="ticket" size={20} color="#F9A825" />
          <Text style={styles.headerText}>LOTTERY RESULT</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subtitle}>Select tickets to redeem:</Text>

        {/* Ticket list */}
        <ScrollView
          style={styles.ticketList}
          contentContainerStyle={styles.ticketListContent}
          showsVerticalScrollIndicator={false}
        >
          {tickets.map((ticket) => {
            const isSelected = selected.has(ticket.card.id);
            return (
              <Pressable
                key={ticket.card.id}
                style={[styles.ticketRow, isSelected && styles.ticketRowSelected]}
                onPress={() => toggleTicket(ticket.card.id)}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                </View>
                <Ionicons name="ticket" size={18} color="#F9A825" />
                <Text style={styles.ticketText}>Lottery Ticket</Text>
                <Text style={styles.ticketAmount}>${ticket.card.amount}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Total */}
        {selected.size > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${totalRedeem}</Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
          <Pressable
            style={[styles.redeemButton, selected.size === 0 && styles.redeemButtonDisabled]}
            onPress={() => {
              if (selected.size > 0) onRedeem(Array.from(selected));
            }}
          >
            <Ionicons name="cash" size={18} color={COLORS.white} />
            <Text style={styles.redeemButtonText}>
              Redeem{totalRedeem > 0 ? ` $${totalRedeem}` : ""}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    minWidth: 280,
    maxWidth: 340,
    borderWidth: 3,
    borderColor: "#F9A825",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontWeight: "800" as const,
    fontSize: 16,
    color: "#F9A825",
    letterSpacing: 1,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 12,
  },
  ticketList: {
    width: "100%",
    maxHeight: 200,
  },
  ticketListContent: {
    gap: 8,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  ticketRowSelected: {
    borderColor: "#F9A825",
    backgroundColor: "#FFF8E1",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#F9A825",
    borderColor: "#F9A825",
  },
  ticketText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  ticketAmount: {
    fontWeight: "800" as const,
    fontSize: 16,
    color: "#F57F17",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#616161",
  },
  totalValue: {
    fontWeight: "800" as const,
    fontSize: 20,
    color: "#F57F17",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 16,
  },
  skipButton: {
    flex: 1,
    backgroundColor: "#ECEFF1",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#B0BEC5",
  },
  skipButtonText: {
    fontWeight: "800" as const,
    fontSize: 14,
    color: "#546E7A",
  },
  redeemButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F9A825",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: "#F57F17",
  },
  redeemButtonDisabled: {
    opacity: 0.5,
  },
  redeemButtonText: {
    fontWeight: "800" as const,
    fontSize: 14,
    color: COLORS.white,
  },
});
