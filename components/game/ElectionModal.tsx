import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface ElectionModalProps {
  players: Player[];
  pot: number;
  onConfirm: () => void;
}

const BLUE = "#1565C0";
const BLUE_DARK = "#0D47A1";

export default function ElectionModal({ players, pot, onConfirm }: ElectionModalProps) {
  const contribution = 50;
  const totalContribution = players.length * contribution;
  const newPot = pot + totalContribution;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Ionicons name="megaphone" size={20} color="#fff" />
              <Text style={styles.headerTitle}>Election!</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            All players must contribute to the town election fund.
          </Text>

          {/* Contribution summary */}
          <View style={styles.section}>
            <View style={styles.summaryRow}>
              <Ionicons name="people" size={16} color={BLUE} />
              <Text style={styles.summaryLabel}>Players</Text>
              <Text style={styles.summaryValue}>{players.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="cash" size={16} color="#C62828" />
              <Text style={styles.summaryLabel}>Per player</Text>
              <Text style={[styles.summaryValue, { color: "#C62828" }]}>-${contribution}</Text>
            </View>
            <View style={[styles.summaryRow, styles.dividerRow]}>
              <Ionicons name="trending-up" size={16} color={BLUE} />
              <Text style={styles.summaryLabel}>Total into pot</Text>
              <Text style={[styles.summaryValue, { color: BLUE }]}>+${totalContribution}</Text>
            </View>
          </View>

          {/* Pot preview */}
          <View style={styles.potBox}>
            <Ionicons name="trophy" size={18} color={BLUE} />
            <View style={{ flex: 1 }}>
              <Text style={styles.potLabel}>New Pot Total</Text>
              {pot > 0 && (
                <Text style={styles.potPrev}>Was ${pot}</Text>
              )}
            </View>
            <Text style={styles.potValue}>${newPot}</Text>
          </View>

          {/* Auto-overdraft note */}
          <View style={styles.noteBox}>
            <Ionicons name="information-circle" size={14} color="#555" />
            <Text style={styles.noteText}>
              If a player can't afford $50, savings will be withdrawn or a loan will be taken automatically.
            </Text>
          </View>

          {/* Win callout */}
          <View style={styles.winCallout}>
            <Ionicons name="dice" size={16} color={BLUE} />
            <Text style={styles.winCalloutText}>
              The next player to roll a 6 wins the entire pot!
            </Text>
          </View>

          {/* Confirm button */}
          <Pressable style={styles.confirmBtn} onPress={onConfirm}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>Confirm</Text>
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
    backgroundColor: BLUE,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 18,
  },
  section: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dividerRow: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 8,
    marginTop: 2,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636E72",
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2D3436",
  },
  potBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 12,
  },
  potLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: BLUE,
  },
  potPrev: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
  },
  potValue: {
    fontSize: 22,
    fontWeight: "800",
    color: BLUE_DARK,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 10,
  },
  noteText: {
    fontSize: 11,
    color: "#555",
    lineHeight: 16,
    flex: 1,
  },
  winCallout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: BLUE,
    padding: 10,
  },
  winCalloutText: {
    fontSize: 13,
    fontWeight: "700",
    color: BLUE_DARK,
    flex: 1,
  },
  confirmBtn: {
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: BLUE_DARK,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
});
