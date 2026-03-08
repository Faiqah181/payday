import { SPACE_CONFIG } from "@/constants/board";
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

export default function BoardCell({
  day,
  type,
  playerColors,
  isCurrentCell,
  cellSize,
}: BoardCellProps) {
  const config = SPACE_CONFIG[type];
  const isSalaryDay = type === "salary-day";
  const isStart = type === "start";
  const isLazySunday = type === "lazy-sunday";

  const cellBg = isSalaryDay
    ? "#C8E6C9"
    : isStart
      ? "#E8F5E9"
      : isLazySunday
        ? "#ECEFF1"
        : COLORS.white;

  return (
    <View
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: cellBg,
        },
        isCurrentCell && styles.currentCell,
      ]}
    >
      <Text style={[styles.dayNumber, isSalaryDay && styles.salaryDayText]}>
        {isStart ? "S" : day}
      </Text>

      <Ionicons
        name={config.icon}
        size={cellSize * 0.22}
        color={config.color}
      />
      <Text style={[styles.label, { color: config.color }]} numberOfLines={1}>
        {config.label}
      </Text>

      {playerColors.length > 0 && (
        <View style={styles.tokenRow}>
          {playerColors.map((color, i) => (
            <View key={i} style={styles.pawn}>
              {/* Head */}
              <View
                style={[styles.pawnHead, { backgroundColor: color }]}
              />
              {/* Body */}
              <View
                style={[styles.pawnBody, { backgroundColor: color }]}
              />
              {/* Base */}
              <View
                style={[styles.pawnBase, { backgroundColor: color }]}
              />
            </View>
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
    fontWeight: "700",
    color: COLORS.textDark,
    position: "absolute",
    top: 1,
    left: 3,
  },
  salaryDayText: {
    color: "#2E7D32",
    fontWeight: "800",
  },
  label: {
    fontSize: 7,
    fontWeight: "700",
    textAlign: "center",
  },
  tokenRow: {
    flexDirection: "row",
    gap: 2,
    position: "absolute",
    bottom: 2,
  },
  pawn: {
    alignItems: "center",
    marginHorizontal: 1,
  },
  pawnHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.25)",
  },
  pawnBody: {
    width: 4,
    height: 4,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
    marginTop: -0.5,
  },
  pawnBase: {
    width: 8,
    height: 2.5,
    borderRadius: 1,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.25)",
    marginTop: -0.5,
  },
});
