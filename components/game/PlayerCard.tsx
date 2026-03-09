import { COLORS } from "@/constants/colors";
import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  compact?: boolean;
}

export default function PlayerCard({ player, isCurrentTurn, compact = false }: PlayerCardProps) {
  const isSavings = player.accountType === "Savings";
  const mailCount = player.lotteryTickets.length + player.unpaidBills.length;

  if (compact) {
    return (
      <View
        style={[
          styles.compactCard,
          { borderColor: isCurrentTurn ? player.color : "transparent" },
          isCurrentTurn && styles.activeCard,
        ]}
      >
        <View style={[styles.colorDot, { backgroundColor: player.color }]} />
        <Text style={styles.compactName} numberOfLines={1}>
          {player.name}
        </Text>
        <View style={[styles.accountBadge, { backgroundColor: isSavings ? "#43A047" : "#E53935" }]}>
          <Text style={styles.accountBadgeText}>{isSavings ? "S" : "L"}</Text>
        </View>
        <Ionicons name="cash" size={12} color="#43A047" />
        <Text style={styles.compactText}>${player.cash.toLocaleString()}</Text>
        <Ionicons name="card" size={12} color="#E53935" />
        <Text style={styles.compactText}>${player.loanBalance.toLocaleString()}</Text>
        <Ionicons name="briefcase" size={12} color="#7B1FA2" />
        <Text style={styles.compactText}>{player.deals.length}</Text>
        <Ionicons name="mail" size={12} color="#1E88E5" />
        <Text style={styles.compactText}>{mailCount}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { borderColor: isCurrentTurn ? player.color : "transparent" },
        isCurrentTurn && styles.activeCard,
      ]}
    >
      {/* Color dot + name */}
      <View style={styles.nameRow}>
        <View
          style={[styles.colorDot, { backgroundColor: player.color }]}
        />
        <Text style={styles.name} numberOfLines={1}>
          {player.name}
        </Text>
      </View>

      {/* Account type */}
      <View style={styles.infoRow}>
        <Ionicons name={isSavings ? "wallet" : "card"} size={14} color={isSavings ? "#43A047" : "#E53935"} />
        <Text style={[styles.infoText, { color: isSavings ? "#43A047" : "#E53935" }]}>
          {player.accountType}
        </Text>
      </View>

      {/* Cash */}
      <View style={styles.infoRow}>
        <Ionicons name="cash" size={14} color="#43A047" />
        <Text style={styles.infoText}>
          ${player.cash.toLocaleString()}
        </Text>
      </View>

      {/* Loan */}
      <View style={styles.infoRow}>
        <Ionicons name="card" size={14} color="#E53935" />
        <Text style={styles.infoText}>
          ${player.loanBalance.toLocaleString()}
        </Text>
      </View>

      {/* Deals */}
      <View style={styles.infoRow}>
        <Ionicons name="briefcase" size={14} color="#7B1FA2" />
        <Text style={styles.infoText}>{player.deals.length}</Text>
      </View>

      {/* Mail */}
      <View style={styles.infoRow}>
        <Ionicons name="mail" size={14} color="#1E88E5" />
        <Text style={styles.infoText}>{mailCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    minWidth: 120,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeCard: {
    shadowOpacity: 0.25,
    elevation: 5,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  compactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactName: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
    minWidth: 36,
    flex: 1,
  },
  compactText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  accountBadge: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  accountBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.white,
  },
});
