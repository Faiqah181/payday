import { COLORS } from "@/constants/colors";
import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
}

export default function PlayerCard({ player, isCurrentTurn }: PlayerCardProps) {
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
});
