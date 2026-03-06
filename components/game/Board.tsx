import {
  BOARD_COLS,
  BOARD_ROWS,
  DAY_HEADERS,
  getSpaceAt,
} from "@/constants/board";
import { COLORS } from "@/constants/colors";
import type { Player } from "@/types/game";
import { StyleSheet, Text, View } from "react-native";
import BoardCell from "./BoardCell";

interface BoardProps {
  players: Player[];
  currentPlayerIndex: number;
  cellSize: number;
}

const BOARD_PADDING = 2;

export default function Board({ players, currentPlayerIndex, cellSize }: BoardProps) {
  // Build a map of position -> player colors for token display
  const positionColors = new Map<number, string[]>();
  players.forEach((player) => {
    const colors = positionColors.get(player.position) ?? [];
    colors.push(player.color);
    positionColors.set(player.position, colors);
  });

  const currentPlayerPosition = players[currentPlayerIndex]?.position ?? 0;

  return (
    <View style={styles.container}>
      {/* Day name headers */}
      <View style={styles.headerRow}>
        {DAY_HEADERS.map((name) => (
          <Text
            key={name}
            style={[styles.headerText, { width: cellSize }]}
          >
            {name}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {Array.from({ length: BOARD_ROWS }, (_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: BOARD_COLS }, (_, col) => {
              const space = getSpaceAt(row, col);
              if (!space) {
                return (
                  <View
                    key={col}
                    style={[
                      styles.emptyCell,
                      { width: cellSize, height: cellSize },
                    ]}
                  />
                );
              }
              return (
                <BoardCell
                  key={col}
                  day={space.day}
                  type={space.type}
                  playerColors={positionColors.get(space.day) ?? []}
                  isCurrentCell={space.day === currentPlayerPosition}
                  cellSize={cellSize}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: BOARD_PADDING,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  headerText: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.titleGreen,
  },
  grid: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: COLORS.white,
  },
  row: {
    flexDirection: "row",
  },
  emptyCell: {
    backgroundColor: "#F5F5F5",
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
  },
});
