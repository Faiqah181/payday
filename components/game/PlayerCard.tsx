import CoinSvg from "@/assets/svg/coin.svg";
import BankSvg from "@/assets/svg/bank.svg";
import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  compact?: boolean;
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
      <Text style={[compact ? styles.labelCompact : styles.label]}>{label}</Text>
      <Text style={[compact ? styles.valueCompact : styles.value]}>{value}</Text>
    </View>
  );
}

export default function PlayerCard({ player, compact = false }: PlayerCardProps) {
  const isSavings = player.accountType === "Savings";
  const iconSize = compact ? 12 : 16;
  const mailCount = player.lotteryTickets.length + player.unpaidBills.length + player.insurance.length;

  const avatar = (
    <View style={[compact ? styles.avatarCompact : styles.avatar, { backgroundColor: player.color }]}>
      <Text style={compact ? styles.avatarInitialCompact : styles.avatarInitial}>
        {player.name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );

  const infoRows = (
    <View style={styles.infoSection}>
      <InfoRow label="Player:" value={player.name} compact={compact} />
      <InfoRow
        icon={<CoinSvg width={iconSize} height={iconSize} />}
        label="Cash:"
        value={`$${player.cash.toLocaleString()}`}
        compact={compact}
      />
      <InfoRow
        icon={<BankSvg width={iconSize} height={iconSize} />}
        label={isSavings ? "Savings:" : "Loan:"}
        value={`$${player.loanBalance.toLocaleString()}`}
        compact={compact}
      />
      <InfoRow
        icon={<Ionicons name="briefcase" size={iconSize} color="#7B1FA2" />}
        label="Deals:"
        value={String(player.deals.length)}
        compact={compact}
      />
      <InfoRow
        icon={<Ionicons name="mail" size={iconSize} color="#1E88E5" />}
        label="Mail:"
        value={String(mailCount)}
        compact={compact}
      />
    </View>
  );

  return (
    <View style={compact ? styles.cardCompact : styles.card}>
      {/* Body */}
      <View style={styles.body}>
        {avatar}
        {infoRows}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    padding: 12,
  },
  cardCompact: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    padding: 8,
  },
  title: {
    color: "#0984E3",
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  titleCompact: {
    color: "#0984E3",
    fontWeight: "800",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 6,
  },
  divider: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginBottom: 10,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatarCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatarInitial: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
  },
  avatarInitialCompact: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
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
    width: 68,
  },
  labelCompact: {
    color: "#2D3436",
    fontSize: 11,
    fontWeight: "600",
    width: 56,
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
