import { COLORS } from "@/constants/colors";
import type { SpaceType } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface BoardCellProps {
  day: number;
  type: SpaceType;
  playerColors: string[]; // colors of players on this cell
  isCurrentCell: boolean;
  cellSize: number;
}

const SPACE_CONFIG: Record<
  SpaceType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }
> = {
  start: { icon: "flag", color: "#43A047", label: "GO" },
  mail: { icon: "mail", color: "#1E88E5", label: "" },
  deal: { icon: "briefcase", color: "#43A047", label: "" },
  "mail+deal": { icon: "layers", color: "#7B1FA2", label: "" },
  buyer: { icon: "cart", color: "#8E24AA", label: "" },
  lottery: { icon: "ticket", color: "#F9A825", label: "" },
  birthday: { icon: "gift", color: "#E91E63", label: "" },
  radio: { icon: "radio", color: "#00897B", label: "" },
  "yard-sale": { icon: "pricetag", color: "#EF6C00", label: "" },
  "pay-day": { icon: "cash", color: "#2E7D32", label: "$" },
};

export default function BoardCell({
  day,
  type,
  playerColors,
  isCurrentCell,
  cellSize,
}: BoardCellProps) {
  const config = SPACE_CONFIG[type];
  const isPayDay = type === "pay-day";
  const isStart = type === "start";

  return (
    <View
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: isPayDay
            ? "#C8E6C9"
            : isStart
              ? "#E8F5E9"
              : COLORS.white,
        },
        isCurrentCell && styles.currentCell,
      ]}
    >
      <Text style={[styles.dayNumber, isPayDay && styles.payDayText]}>
        {isStart ? "S" : day}
      </Text>

      <Ionicons
        name={config.icon}
        size={cellSize * 0.28}
        color={config.color}
      />

      {playerColors.length > 0 && (
        <View style={styles.tokenRow}>
          {playerColors.map((color, i) => (
            <View
              key={i}
              style={[
                styles.token,
                { backgroundColor: color, width: 6, height: 6, borderRadius: 3 },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    padding: 1,
  },
  currentCell: {
    borderWidth: 2,
    borderColor: "#FFA726",
    backgroundColor: "#FFF8E1",
  },
  dayNumber: {
    fontSize: 9,
    fontFamily: "BlueWinter",
    color: COLORS.textDark,
    position: "absolute",
    top: 1,
    left: 3,
  },
  payDayText: {
    color: "#2E7D32",
    fontWeight: "800",
  },
  tokenRow: {
    flexDirection: "row",
    gap: 2,
    position: "absolute",
    bottom: 2,
  },
  token: {
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.2)",
  },
});
