import {
  BOARD_COLS,
  BOARD_ROWS,
  DAY_HEADERS,
  getSpaceAt,
  getSpaceByDay,
} from "@/constants/board";
import { COLORS } from "@/constants/colors";
import type { AnimatingMove, Player } from "@/types/game";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import BoardCell from "./BoardCell";

interface BoardProps {
  players: Player[];
  currentPlayerIndex: number;
  cellSize: number;
  cellHeight?: number;
  animatingMove: AnimatingMove | null;
  onAnimationComplete: () => void;
}

const STEP_DURATION = 120; // ms per cell hop

function getCellPosition(day: number, cellSize: number, ch: number) {
  const space = getSpaceByDay(day);
  if (!space) return { x: 0, y: 0 };
  return { x: space.col * cellSize, y: space.row * ch };
}

export default function Board({
  players,
  currentPlayerIndex,
  cellSize,
  cellHeight,
  animatingMove,
  onAnimationComplete,
}: BoardProps) {
  const ch = cellHeight ?? cellSize;
  // Build a map of position -> player colors for token display
  const positionColors = new Map<number, string[]>();
  players.forEach((player, index) => {
    // Hide the animating player's token at their current (source) position
    if (animatingMove && index === animatingMove.playerIndex) return;
    const colors = positionColors.get(player.position) ?? [];
    colors.push(player.color);
    positionColors.set(player.position, colors);
  });

  const currentPlayerPosition = players[currentPlayerIndex]?.position ?? 0;

  // Animated overlay pawn
  const animX = useSharedValue(0);
  const animY = useSharedValue(0);

  useEffect(() => {
    if (!animatingMove) return;

    const { from, to } = animatingMove;
    const startPos = getCellPosition(from, cellSize, ch);
    animX.value = startPos.x;
    animY.value = startPos.y;

    const steps = to - from;
    if (steps <= 0) {
      onAnimationComplete();
      return;
    }

    // Build step-by-step animation sequence
    const stepsX: number[] = [];
    const stepsY: number[] = [];

    for (let day = from + 1; day <= to; day++) {
      const pos = getCellPosition(day, cellSize, ch);
      stepsX.push(pos.x);
      stepsY.push(pos.y);
    }

    const timingsX = stepsX.map((x) =>
      withTiming(x, { duration: STEP_DURATION }),
    );
    const timingsY = stepsY.map((y) =>
      withTiming(y, { duration: STEP_DURATION }),
    );

    animX.value =
      timingsX.length === 1
        ? timingsX[0]
        : withSequence(...(timingsX as [number, ...number[]]));
    animY.value =
      timingsY.length === 1
        ? timingsY[0]
        : withSequence(...(timingsY as [number, ...number[]]));

    // Call completion after total animation duration
    const timeout = setTimeout(onAnimationComplete, steps * STEP_DURATION + 50);
    return () => clearTimeout(timeout);
  }, [animatingMove]);

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animX.value }, { translateY: animY.value }],
  }));

  const animatingColor = animatingMove
    ? (players[animatingMove.playerIndex]?.color ?? "#999")
    : "#999";

  return (
    <View style={styles.calendarWrapper}>
      {/* Day name headers */}
      <View style={styles.headerRow}>
        {DAY_HEADERS.map((name) => (
          <Text key={name} style={[styles.headerText, { width: cellSize }]}>
            {name}
          </Text>
        ))}
      </View>

      {/* Calendar grid with overlay */}
      <View style={{ position: "relative" }}>
        <View style={styles.grid}>
          {Array.from({ length: BOARD_ROWS }, (_, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: BOARD_COLS }, (_, col) => {
                const space = getSpaceAt(row, col);
                if (!space) {
                  return (
                    <View
                      key={col}
                      style={[styles.emptyCell, { width: cellSize, height: ch }]}
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
                    cellHeight={ch}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* Animated overlay pawn */}
        {animatingMove && (
          <Animated.View
            style={[
              styles.overlayPawn,
              { width: cellSize, height: ch },
              overlayStyle,
            ]}
            pointerEvents="none"
          >
            <View style={styles.pawn}>
              <View
                style={[styles.pawnHead, { backgroundColor: animatingColor }]}
              />
              <View
                style={[styles.pawnBody, { backgroundColor: animatingColor }]}
              />
              <View
                style={[styles.pawnBase, { backgroundColor: animatingColor }]}
              />
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarWrapper: {
    backgroundColor: "rgba(190, 183, 170, 0.55)",
    marginHorizontal: 3.5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgb(255, 255, 255)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 183, 170, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(190, 183, 170, 0.5)",
  },
  headerText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.titleGreen,
    borderColor: "rgba(189, 189, 189, 0.3)",
    paddingVertical: 3,
    overflow: "hidden",
  },
  grid: {
    overflow: "hidden",
    gap: 1,
  },
  row: {
    flexDirection: "row",
    gap: 1,
  },
  emptyCell: {
    backgroundColor: "transparent",
  },
  overlayPawn: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 2,
    zIndex: 10,
  },
  pawn: {
    alignItems: "center",
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
