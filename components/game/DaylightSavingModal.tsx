import type { Player } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface DaylightSavingModalProps {
  players: Player[];
  onConfirm: () => void;
}

const AMBER = "#E65100";
const AMBER_DARK = "#BF360C";

export default function DaylightSavingModal({ players, onConfirm }: DaylightSavingModalProps) {
  const currentPlayerLandsOnElection = players.some((p) => p.position > 0 && p.position - 1 === 26);

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Ionicons name="sunny" size={20} color="#fff" />
              <Text style={styles.headerTitle}>Daylight Savings!</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Everyone moves back one space.</Text>

          {/* Player list */}
          <ScrollView style={styles.playerList} showsVerticalScrollIndicator={false}>
            {players.map((player) => {
              const onStart = player.position === 0;
              const newPos = onStart ? 0 : player.position - 1;

              return (
                <View key={player.name} style={styles.playerRow}>
                  <View style={[styles.colorDot, { backgroundColor: player.color }]} />
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.moveInfo}>
                    {onStart ? (
                      <Text style={styles.startBonus}>Start → +$325</Text>
                    ) : (
                      <>
                        <Text style={styles.fromDay}>Day {player.position}</Text>
                        <Ionicons name="arrow-forward" size={12} color="#888" />
                        <Text style={styles.toDay}>Day {newPos}</Text>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Election callout */}
          {currentPlayerLandsOnElection && (
            <View style={styles.electionCallout}>
              <Ionicons name="megaphone" size={14} color="#1565C0" />
              <Text style={styles.electionCalloutText}>
                The Election on Day 26 will be triggered — all players contribute $50 to the pot!
              </Text>
            </View>
          )}

          {/* Note about complex spaces */}
          <View style={styles.noteBox}>
            <Ionicons name="information-circle" size={13} color="#888" />
            <Text style={styles.noteText}>
              Cards (deals, mail) are not drawn when moving back during Daylight Savings.
            </Text>
          </View>

          {/* Proceed button */}
          <Pressable style={styles.confirmBtn} onPress={onConfirm}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>Proceed</Text>
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
    backgroundColor: AMBER,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    color: "#636E72",
    textAlign: "center",
  },
  playerList: {
    maxHeight: 200,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  playerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D3436",
    flex: 1,
  },
  moveInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fromDay: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  toDay: {
    fontSize: 12,
    color: AMBER,
    fontWeight: "800",
  },
  startBonus: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "700",
  },
  electionCallout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#1565C0",
    padding: 10,
  },
  electionCalloutText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1565C0",
    flex: 1,
    lineHeight: 17,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 9,
  },
  noteText: {
    fontSize: 11,
    color: "#888",
    flex: 1,
    lineHeight: 16,
  },
  confirmBtn: {
    backgroundColor: AMBER,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: AMBER_DARK,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
});
