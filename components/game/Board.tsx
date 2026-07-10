import BoardCell, { CellToken } from "@/components/game/BoardCell";
import Typography from "@/components/ui/Typography";
import {
  BOARD_CELL_GAP,
  BOARD_COLS,
  BOARD_FRAME_BORDER,
  BOARD_FRAME_PADDING,
  BOARD_ROWS,
  DAY_HEADERS,
  getSpaceAt,
  getSpaceByDay,
} from "@/constants/board";
import { SD } from "@/constants/theme";
import type { AnimatingMove, Player, SpaceType } from "@/types/game";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface BoardProps {
  players: Player[];
  currentPlayerIndex: number;
  cellSize: number;
  cellHeight?: number;
  animatingMove: AnimatingMove | null;
  retiredPlayerIndices?: Set<number>;
  onAnimationComplete: () => void;
  onCellPress?: (type: SpaceType) => void;
}

const STEP_DURATION = 120; // ms per cell hop
const GAP = BOARD_CELL_GAP;

function getCellPosition(day: number, cellSize: number, ch: number) {
  const space = getSpaceByDay(day);
  if (!space) return { x: 0, y: 0 };
  return { x: space.col * (cellSize + GAP), y: space.row * (ch + GAP) };
}

export default function Board({
  players,
  currentPlayerIndex,
  cellSize,
  cellHeight,
  animatingMove,
  retiredPlayerIndices,
  onAnimationComplete,
  onCellPress,
}: BoardProps) {
  const ch = cellHeight ?? cellSize;

  const positionTokens = new Map<number, CellToken[]>();
  players.forEach((player, index) => {
    // Hide the animating player's token at their current (source) position
    if (animatingMove && index === animatingMove.playerIndex) return;
    const tokens = positionTokens.get(player.position) ?? [];
    tokens.push({
      color: player.color,
      initial: player.name?.trim()?.[0]?.toUpperCase() || "?",
      retired: retiredPlayerIndices?.has(index) ?? false,
    });
    positionTokens.set(player.position, tokens);
  });

  const currentPlayerPosition = players[currentPlayerIndex]?.position ?? 0;

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

    const stepsX: number[] = [];
    const stepsY: number[] = [];
    for (let day = from + 1; day <= to; day++) {
      const pos = getCellPosition(day, cellSize, ch);
      stepsX.push(pos.x);
      stepsY.push(pos.y);
    }

    const timingsX = stepsX.map((x) => withTiming(x, { duration: STEP_DURATION }));
    const timingsY = stepsY.map((y) => withTiming(y, { duration: STEP_DURATION }));

    animX.value =
      timingsX.length === 1
        ? timingsX[0]
        : withSequence(...(timingsX as [number, ...number[]]));
    animY.value =
      timingsY.length === 1
        ? timingsY[0]
        : withSequence(...(timingsY as [number, ...number[]]));

    const timeout = setTimeout(onAnimationComplete, steps * STEP_DURATION + 50);
    return () => clearTimeout(timeout);
  }, [animatingMove]);

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animX.value }, { translateY: animY.value }],
  }));

  const animatingPlayer = animatingMove ? players[animatingMove.playerIndex] : null;

  return (
    <View style={styles.panel}>
      {/* Day-of-week letters */}
      <View style={styles.dowRow}>
        {DAY_HEADERS.map((letter, i) => (
          <Typography
            key={i}
            design="body"
            weight={800}
            style={[styles.dowText, { width: cellSize }]}
          >
            {letter}
          </Typography>
        ))}
      </View>

      {/* Grid + animated pawn overlay */}
      <View style={{ position: "relative" }}>
        <View style={styles.grid}>
          {Array.from({ length: BOARD_ROWS }, (_, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: BOARD_COLS }, (_, col) => {
                const space = getSpaceAt(row, col);
                if (!space) return null;
                const isPay = space.type === "salary-day";
                const width = isPay
                  ? cellSize * 4 + GAP * 3 // PAY DAY fills the rest of the final row
                  : cellSize;
                return (
                  <BoardCell
                    key={col}
                    day={space.day}
                    type={space.type}
                    playerTokens={positionTokens.get(space.day) ?? []}
                    isCurrentCell={space.day === currentPlayerPosition}
                    cellSize={width}
                    cellHeight={ch}
                    onPress={onCellPress && (() => onCellPress(space.type))}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {animatingMove && animatingPlayer && (
          <Animated.View
            style={[
              styles.overlayPawn,
              { width: cellSize, height: ch },
              overlayStyle,
            ]}
            pointerEvents="none"
          >
            <View
              style={[styles.movingToken, { backgroundColor: animatingPlayer.color }]}
            >
              <Typography design="title" style={styles.movingTokenText}>
                {animatingPlayer.name?.trim()?.[0]?.toUpperCase() || "?"}
              </Typography>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: SD.surface2,
    borderWidth: BOARD_FRAME_BORDER,
    borderColor: SD.line,
    borderRadius: 18,
    padding: BOARD_FRAME_PADDING,
    alignSelf: "center",
  },
  dowRow: {
    flexDirection: "row",
    gap: GAP,
    marginBottom: 6,
  },
  dowText: {
    textAlign: "center",
    fontSize: 11,
    color: SD.soft,
  },
  grid: {
    gap: GAP,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
  overlayPawn: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  movingToken: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: SD.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  movingTokenText: {
    fontSize: 10,
    color: SD.white,
  },
});
