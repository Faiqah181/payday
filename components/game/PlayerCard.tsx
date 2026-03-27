import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  compact?: boolean;
  children?: React.ReactNode;
}

function InfoRow({
  icon,
  label,
  value,
  compact,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  compact: boolean;
}) {
  return (
    <View style={compact ? styles.infoRowCompact : styles.infoRow}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={compact ? styles.labelCompact : styles.label}>
        {label}
      </Text>
      <Text style={compact ? styles.valueCompact : styles.value}>
        {value}
      </Text>
    </View>
  );
}

export default function PlayerCard({
  player,
  compact = false,
  children,
}: PlayerCardProps) {
  const iconSize = compact ? 12 : 16;
  const mailCount =
    player.lotteryTickets.length +
    player.unpaidBills.length +
    player.insurance.length;

  return (
    <View style={compact ? styles.cardCompact : styles.card}>
      <View style={styles.body}>
        <View style={styles.infoSection}>
          <Text style={compact ? styles.statusTitleCompact : styles.statusTitle}>
            Player Status
          </Text>
          <InfoRow
            label="Current Day:"
            value={`Day ${player.position}`}
            compact={compact}
          />
          <InfoRow
            icon={
              <Ionicons name="briefcase" size={iconSize} color="#7B1FA2" />
            }
            label="Total Deals:"
            value={String(player.deals.length)}
            compact={compact}
          />
          <InfoRow
            icon={<Ionicons name="mail" size={iconSize} color="#1E88E5" />}
            label="Mail Items:"
            value={String(mailCount)}
            compact={compact}
          />
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#b7f4d5",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#C1D6CA",
    padding: 12,
  },
  cardCompact: {
    backgroundColor: "#b7f4d5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C1D6CA",
    padding: 8,
  },
  statusTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#2D3436",
    marginBottom: 4,
  },
  statusTitleCompact: {
    fontWeight: "800",
    fontSize: 13,
    color: "#2D3436",
    marginBottom: 2,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoSection: {
    flex: 1,
    gap: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoRowCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconWrap: {
    width: 18,
    alignItems: "center",
  },
  label: {
    color: "#2D3436",
    fontSize: 13,
    fontWeight: "600",
    width: 90,
  },
  labelCompact: {
    color: "#2D3436",
    fontSize: 11,
    fontWeight: "600",
    width: 72,
  },
  value: {
    color: "#2D3436",
    fontSize: 13,
    fontWeight: "800",
    flex: 1,
  },
  valueCompact: {
    color: "#2D3436",
    fontSize: 11,
    fontWeight: "800",
    flex: 1,
  },
});
