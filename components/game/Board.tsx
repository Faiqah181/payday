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
  Easing,
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

const STEP_DURATION = 140; // ms per one-cell glide
const GAP = BOARD_CELL_GAP;
// Must match BoardCell's TokenStack: 19px tokens overlapping 7px,
// anchored 4px from the cell's top-right corner
const TOKEN_SIZE = 19;
const TOKEN_INSET = 4;
const TOKEN_OVERLAP_STEP = TOKEN_SIZE - 7;

/**
 * The mover's exact slot within the token stack on this day's cell, so the
 * pawn lifts off and lands precisely where the static token renders — even
 * when other players share the cell.
 * "rest" ranks the stack in player order (how TokenStack renders it);
 * "pass" tucks the mover beside the residents while gliding through.
 */
function getMoverSlot(
  day: number,
  players: Player[],
  moverIndex: number,
  mode: "rest" | "pass",
  cellSize: number,
  ch: number,
) {
  const space = getSpaceByDay(day);
  if (!space) return { x: 0, y: 0 };
  const others = players
    .map((_, i) => i)
    .filter((i) => i !== moverIndex && players[i].position === day);
  const stack =
    mode === "rest"
      ? [...others, moverIndex].sort((a, b) => a - b)
      : [...others, moverIndex];
  const rank = stack.indexOf(moverIndex);
  const stackWidth = TOKEN_SIZE + (stack.length - 1) * TOKEN_OVERLAP_STEP;
  const cellWidth =
    space.type === "salary-day" ? cellSize * 4 + GAP * 3 : cellSize;
  return {
    x:
      space.col * (cellSize + GAP) +
      cellWidth -
      TOKEN_INSET -
      stackWidth +
      rank * TOKEN_OVERLAP_STEP,
    y: space.row * (ch + GAP) + TOKEN_INSET,
  };
}

/**
 * The pawn gliding across the board. Mounted fresh per move (keyed by the
 * move) so the shared values start at the exact lift-off slot — no stale
 * first frame from a previous move.
 */
function MovingPawn({
  move,
  players,
  cellSize,
  cellHeight,
  onComplete,
}: {
  move: AnimatingMove;
  players: Player[];
  cellSize: number;
  cellHeight: number;
  onComplete: () => void;
}) {
  const { playerIndex, from, to } = move;
  const start = getMoverSlot(from, players, playerIndex, "rest", cellSize, cellHeight);
  const animX = useSharedValue(start.x);
  const animY = useSharedValue(start.y);

  useEffect(() => {
    if (to - from <= 0) {
      onComplete();
      return;
    }

    // Constant velocity across the whole path: linear easing per step,
    // durations scaled by distance (row wraps travel further), and a
    // single ease-out on the final step so the pawn settles softly.
    const hopDistance = cellSize + GAP;
    const timingsX: number[] = [];
    const timingsY: number[] = [];
    let prev = start;
    let totalDuration = 0;
    for (let day = from + 1; day <= to; day++) {
      const mode = day === to ? "rest" : "pass";
      const pos = getMoverSlot(day, players, playerIndex, mode, cellSize, cellHeight);
      const distance = Math.hypot(pos.x - prev.x, pos.y - prev.y);
      const duration = Math.round(
        STEP_DURATION * Math.max(0.6, distance / hopDistance),
      );
      const easing = day === to ? Easing.out(Easing.quad) : Easing.linear;
      timingsX.push(withTiming(pos.x, { duration, easing }));
      timingsY.push(withTiming(pos.y, { duration, easing }));
      totalDuration += duration;
      prev = pos;
    }

    animX.value =
      timingsX.length === 1
        ? timingsX[0]
        : withSequence(...(timingsX as [number, ...number[]]));
    animY.value =
      timingsY.length === 1
        ? timingsY[0]
        : withSequence(...(timingsY as [number, ...number[]]));

    const timeout = setTimeout(onComplete, totalDuration + 60);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animX.value }, { translateY: animY.value }],
  }));

  const player = players[playerIndex];

  return (
    <Animated.View style={[styles.overlayPawn, overlayStyle]} pointerEvents="none">
      <View style={[styles.movingToken, { backgroundColor: player.color }]}>
        <Typography design="title" style={styles.movingTokenText}>
          {player.name?.trim()?.[0]?.toUpperCase() || "?"}
        </Typography>
      </View>
    </Animated.View>
  );
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
    const tokens = positionTokens.get(player.position) ?? [];
    tokens.push({
      color: player.color,
      initial: player.name?.trim()?.[0]?.toUpperCase() || "?",
      retired: retiredPlayerIndices?.has(index) ?? false,
      // The mover keeps its stack slot as an invisible placeholder so
      // neighbouring tokens don't shift while it flies
      hidden: animatingMove?.playerIndex === index,
    });
    positionTokens.set(player.position, tokens);
  });

  const currentPlayerPosition = players[currentPlayerIndex]?.position ?? 0;

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

        {animatingMove && (
          <MovingPawn
            key={`${animatingMove.playerIndex}:${animatingMove.from}:${animatingMove.to}`}
            move={animatingMove}
            players={players}
            cellSize={cellSize}
            cellHeight={ch}
            onComplete={onAnimationComplete}
          />
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
    zIndex: 10,
  },
  // Pixel-identical to BoardCell's miniToken so start/landing are seamless
  movingToken: {
    width: TOKEN_SIZE,
    height: TOKEN_SIZE,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SD.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  movingTokenText: {
    fontSize: 9,
    color: SD.white,
  },
});
