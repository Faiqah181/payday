import DrawerHeader from "@/components/game/drawers/DrawerHeader";
import { DrawerEmpty } from "@/components/game/drawers/DrawerRow";
import BottomDrawer from "@/components/ui/BottomDrawer";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import type { PotHistoryEntry } from "@/types/game";
import { ScrollView, StyleSheet, View } from "react-native";

interface PotDrawerProps {
  pot: number;
  history?: PotHistoryEntry[];
  onClose: () => void;
}

export default function PotDrawer({ pot, history = [], onClose }: PotDrawerProps) {
  return (
    <BottomDrawer onClose={onClose}>
      <DrawerHeader
        gradient={["#6A4BB0", "#8659C4"]}
        eyebrow="THE POT"
        headline={`$${pot}`}
        note="Filled by Town Elections & lost Swellfare bets. First to roll a 6 wins it all."
      />
      <ScrollView contentContainerStyle={styles.list}>
        <Typography design="body" weight={800} style={styles.eyebrow}>
          HISTORY
        </Typography>
        {history.length === 0 && (
          <DrawerEmpty text="Nothing in the books yet. Town Elections and Swellfare bets will show up here." />
        )}
        {history.map((entry, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.rowText}>
              <Typography design="title" weight={800} style={styles.rowLabel}>
                {entry.label}
              </Typography>
              <Typography design="body" weight={700} style={styles.rowSub}>
                {entry.sub}
              </Typography>
            </View>
            <Typography
              design="money"
              style={[
                styles.rowAmount,
                { color: entry.amount >= 0 ? SD.primary : SD.debt },
              ]}
            >
              {entry.amount >= 0 ? "+" : "-"}${Math.abs(entry.amount)}
            </Typography>
          </View>
        ))}
      </ScrollView>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 22,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: SD.soft,
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#EADFBF",
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 13,
    color: SD.ink,
  },
  rowSub: {
    fontSize: 11,
    color: SD.soft,
  },
  rowAmount: {
    fontSize: 12,
  },
});
