import { SPACE_CONFIG } from "@/constants/board";

import type { SpaceType } from "@/types/game";
import ElectionSvg from "@/assets/svg/election.svg";
import PartyPopperSvg from "@/assets/svg/party-popper.svg";
import PriceTagSvg from "@/assets/svg/price-tag.svg";
import RocketSvg from "@/assets/svg/rocket.svg";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

interface BoardCellProps {
  day: number;
  type: SpaceType;
  playerColors: string[];
  isCurrentCell: boolean;
  cellSize: number;
  cellHeight?: number;
}

const CELL_IMAGES: Partial<Record<SpaceType, ReturnType<typeof require>>> = {
  "lazy-sunday":    require("@/assets/images/board-cells/1.lazy sunday.png"),
  "asset-buyer":    require("@/assets/images/board-cells/2.buyer.png"),
  "post-mail":      require("@/assets/images/board-cells/3.Mail.png"),
  "deal":           require("@/assets/images/board-cells/4.Deal.png"),
  "lottery-result": require("@/assets/images/board-cells/lottery.png"),
};

const EVENT_CONTENT: Partial<Record<SpaceType, { title: string; amount: string }>> = {
  "birthday-gift":        { title: "Your Birthday\nGift", amount: "Collect $400" },
  "performance-bonus":    { title: "Salary Bonus",        amount: "Collect $100" },
  "visitor-surprise":     { title: "Surprise\nVisitor",   amount: "Pay $50" },
  "school-reunion":       { title: "School Reunion",      amount: "Pay $40" },
  "household-essentials": { title: "Household\nBills",    amount: "Pay $75" },
  "home-rent":            { title: "Home Rent",           amount: "Pay $50" },
};

export default function BoardCell({
  day,
  type,
  playerColors,
  isCurrentCell,
  cellSize,
  cellHeight,
}: BoardCellProps) {
  const ch = cellHeight ?? cellSize;
  const config = SPACE_CONFIG[type];
  const isSalaryDay = type === "salary-day";
  const isStart = type === "start";
  const isPartyCell = type === "birthday-gift" || type === "performance-bonus";
  const isPayCell   = type === "visitor-surprise" || type === "school-reunion"
                   || type === "household-essentials" || type === "home-rent";
  const isEventCell = isPartyCell || isPayCell;
  const isElection = type === "election";

  const cellBg = isSalaryDay
    ? "#C8E6C9"
    : isStart
      ? "#E1EEDD"
      : "#F7F3E7";

  const cellImage = CELL_IMAGES[type] ?? null;
  const iconSize = Math.min(cellSize, ch) * 0.32;

  return (
    <View style={[styles.shadowWrapper, { width: cellSize, height: ch }]}>
    <View
      style={[
        styles.cell,
        { backgroundColor: cellBg },
        isCurrentCell && styles.currentCell,
      ]}
    >
      {/* Header strip: day number + label (label hidden for event cells) */}
      <View style={styles.header}>
        <Text style={[styles.dayNumber, isSalaryDay && styles.salaryDayText]}>
          {isStart ? "S" : day}
        </Text>
        {!isEventCell && (
          <Text style={styles.label} numberOfLines={1}>
            {config.label}
          </Text>
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>
        {isEventCell ? (
          <View style={styles.eventBody}>
            {isPartyCell
              ? <PartyPopperSvg width={iconSize * 1.2} height={iconSize * 1.2} />
              : <PriceTagSvg    width={iconSize * 1.2} height={iconSize * 1.2} />
            }
            <Text style={styles.eventTitle}>{EVENT_CONTENT[type]!.title}</Text>
            <Text style={styles.eventCollect}>{EVENT_CONTENT[type]!.amount}</Text>
          </View>
        ) : cellImage ? (
          <View style={styles.imageWrapper}>
            <Image source={cellImage} style={styles.cellImage} resizeMode="cover" />
          </View>
        ) : isElection ? (
          <ElectionSvg width={cellSize * 0.7} height={cellSize * 0.7} />
        ) : isStart ? (
          <RocketSvg width={cellSize * 0.7} height={cellSize * 0.7} />
        ) : (
          <Ionicons name={config.icon} size={iconSize} color={config.color} />
        )}

        {playerColors.length > 0 && (
          <View style={styles.tokenRow}>
            {playerColors.map((color, i) => (
              <View key={i} style={styles.pawn}>
                <View style={[styles.pawnHead, { backgroundColor: color }]} />
                <View style={[styles.pawnBody, { backgroundColor: color }]} />
                <View style={[styles.pawnBase, { backgroundColor: color }]} />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: "#b8a49e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 4,
  },
  cell: {
    flex: 1,
    alignItems: "stretch",
    borderWidth: 0.5,
    borderColor: "rgba(189, 189, 189, 0.3)",
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: "#F7F3E7",
  },
  currentCell: {
    borderWidth: 2,
    borderColor: "#FFA726",
    backgroundColor: "#FFF8E1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingTop: 3,
    paddingBottom: 3,
    gap: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dayNumber: {
    fontSize: 10,
    fontWeight: "700",
    color: "#212121",
  },
  salaryDayText: {
    color: "#2E7D32",
    fontWeight: "800",
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    color: "#212121",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  imageWrapper: {
    width: "100%",
    flex: 1,
    paddingVertical: 2,
  },
  cellImage: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
  },
  eventBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
    gap: 2,
  },
  eventTitle: {
    fontSize: 8,
    fontWeight: "700",
    color: "#2D3436",
    textAlign: "center",
  },
  eventCollect: {
    fontSize: 7,
    fontWeight: "500",
    color: "#636E72",
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
