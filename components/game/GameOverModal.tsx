import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface GameOverModalProps {
  players: Player[];
  onClose: () => void;
}

const GOLD = "#F9A825";
const GOLD_DARK = "#F57F17";
const GOLD_LIGHT = "#FFF8E1";
const SILVER = "#9E9E9E";
const BRONZE = "#BF8650";

const RANK_COLORS = [GOLD, SILVER, BRONZE, "#888"];
const RANK_LABELS = ["1st", "2nd", "3rd", "4th"];

function netWorth(p: Player): number {
  return p.cash + p.savingsBalance - p.loanBalance;
}

export default function GameOverModal({ players, onClose }: GameOverModalProps) {
  const ranked = [...players].sort((a, b) => netWorth(b) - netWorth(a));
  const maxNet = netWorth(ranked[0]);
  const winners = ranked.filter((p) => netWorth(p) === maxNet);
  const isTie = winners.length > 1;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Ionicons name="trophy" size={22} color="#fff" />
              <Text style={styles.headerTitle}>Game Over!</Text>
            </View>
          </View>

          {/* Winner callout */}
          <View style={styles.winnerCallout}>
            <Text style={styles.winnerTrophy}>🏆</Text>
            <View style={{ flex: 1 }}>
              {isTie ? (
                <>
                  <Text style={styles.winnerLabel}>It's a Tie!</Text>
                  <Text style={styles.winnerNames}>
                    {winners.map((w) => w.name).join(" & ")}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.winnerLabel}>{winners[0].name} Wins!</Text>
                  <Text style={styles.winnerNet}>${maxNet.toLocaleString()} net worth</Text>
                </>
              )}
            </View>
          </View>

          {/* Player rankings */}
          <ScrollView style={styles.rankList} showsVerticalScrollIndicator={false}>
            {ranked.map((player, rankIdx) => {
              const net = netWorth(player);
              const isWinner = net === maxNet;
              // Assign rank accounting for ties
              let displayRank = rankIdx;
              for (let i = 0; i < rankIdx; i++) {
                if (netWorth(ranked[i]) === net) { displayRank = i; break; }
              }

              return (
                <View
                  key={player.name}
                  style={[styles.rankRow, isWinner && styles.rankRowWinner]}
                >
                  {/* Rank badge */}
                  <View style={[styles.rankBadge, { backgroundColor: RANK_COLORS[displayRank] ?? "#888" }]}>
                    <Text style={styles.rankBadgeText}>{RANK_LABELS[displayRank] ?? `${displayRank + 1}th`}</Text>
                  </View>

                  {/* Player dot + name */}
                  <View style={[styles.colorDot, { backgroundColor: player.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.playerName, isWinner && styles.playerNameWinner]}>
                      {player.name}
                    </Text>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownItem}>${player.cash.toLocaleString()} cash</Text>
                      {player.savingsBalance > 0 && (
                        <Text style={[styles.breakdownItem, styles.savingsText]}>
                          +${player.savingsBalance.toLocaleString()} savings
                        </Text>
                      )}
                      {player.loanBalance > 0 && (
                        <Text style={[styles.breakdownItem, styles.loanText]}>
                          −${player.loanBalance.toLocaleString()} loan
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Net worth */}
                  <Text style={[styles.netWorth, net < 0 && styles.netWorthNegative]}>
                    {net < 0 ? `−$${Math.abs(net).toLocaleString()}` : `$${net.toLocaleString()}`}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Main Menu button */}
          <Pressable style={styles.menuBtn} onPress={onClose}>
            <Ionicons name="home" size={18} color="#fff" />
            <Text style={styles.menuBtnText}>Main Menu</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "88%",
    maxWidth: 400,
    gap: 14,
  },
  header: {
    alignItems: "center",
  },
  headerBadge: {
    backgroundColor: GOLD_DARK,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  winnerCallout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: GOLD_LIGHT,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: GOLD,
    padding: 14,
  },
  winnerTrophy: {
    fontSize: 32,
  },
  winnerLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: GOLD_DARK,
  },
  winnerNames: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636E72",
    marginTop: 2,
  },
  winnerNet: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636E72",
    marginTop: 2,
  },
  rankList: {
    maxHeight: 240,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  rankRowWinner: {
    backgroundColor: GOLD_LIGHT,
  },
  rankBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 32,
    alignItems: "center",
  },
  rankBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
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
  playerNameWinner: {
    color: GOLD_DARK,
  },
  breakdownRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },
  breakdownItem: {
    fontSize: 10,
    color: "#888",
    fontWeight: "600",
  },
  savingsText: {
    color: "#2E7D32",
  },
  loanText: {
    color: "#C62828",
  },
  netWorth: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2D3436",
    minWidth: 64,
    textAlign: "right",
  },
  netWorthNegative: {
    color: "#C62828",
  },
  menuBtn: {
    backgroundColor: GOLD_DARK,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: "#E65100",
  },
  menuBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
});
