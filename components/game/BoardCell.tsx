import BirthdayIcon from "@/components/game/BirthdayIcon";
import DaylightSavingIcon from "@/components/game/DaylightSavingIcon";
import ElectionIcon from "@/components/game/ElectionIcon";
import Typography from "@/components/ui/Typography";
import { CELL_INFO, getCellAmount, type CellIcon } from "@/constants/board";
import { mixHex, SD, SD_CATEGORY } from "@/constants/theme";
import type { SpaceType } from "@/types/game";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Kept in sync with Board.tsx (getMoverSlot) so static tokens land where the
// flying pawn does. Tokens cluster 2-wide: p1 p2 on top, p3 p4 below.
const TOKEN_SIZE = 24;
const TOKEN_STEP = TOKEN_SIZE - 7;
const TOKEN_COLS = 2;

export interface CellToken {
  color: string;
  initial: string;
  retired: boolean;
  /** Mid-flight placeholder: keeps the stack slot but renders invisible. */
  hidden?: boolean;
}

interface BoardCellProps {
  day: number;
  type: SpaceType;
  playerTokens: CellToken[];
  isCurrentCell: boolean;
  cellSize: number;
  cellHeight?: number;
  onPress?: () => void;
}

function CoinIcon({ color }: { color: string }) {
  return (
    <View style={[styles.coin, { backgroundColor: color }]}>
      <Typography design="title" style={styles.coinText}>
        $
      </Typography>
    </View>
  );
}

function BillIcon({ color }: { color: string }) {
  return (
    <View style={[styles.bill, { backgroundColor: color }]}>
      <View style={styles.billRing}>
        <Typography design="title" style={styles.billText}>
          $
        </Typography>
      </View>
    </View>
  );
}

const DIE_PIPS = [
  { top: 4, left: 4 },
  { top: 4, right: 4 },
  { top: 11.5, left: 11.5 },
  { bottom: 4, left: 4 },
  { bottom: 4, right: 4 },
] as const;

function DieIcon({ color }: { color: string }) {
  return (
    <View style={[styles.die, { backgroundColor: color }]}>
      {DIE_PIPS.map((pos, i) => (
        <View key={i} style={[styles.diePip, pos]} />
      ))}
    </View>
  );
}

function CheckerStrip({ width }: { width: number }) {
  const cols = Math.max(8, Math.ceil(width / 4.5));
  const size = width / cols;
  return (
    <View style={[styles.checkerStrip, { height: size * 2 }]}>
      {Array.from({ length: cols * 2 }, (_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const dark = (row + col) % 2 === 0;
        return (
          <View
            key={i}
            style={{
              width: size,
              height: size,
              backgroundColor: dark ? SD.ink : SD.white,
            }}
          />
        );
      })}
    </View>
  );
}

function AmountPill({ amount }: { amount: number }) {
  const positive = amount > 0;
  const tone = positive ? SD.primary : SD.debt;
  return (
    <View
      style={[styles.amountPill, { backgroundColor: mixHex(tone, SD.surface, 1) }]}
    >
      <Typography design="title" style={[styles.amountPillText, { color: tone }]}>
        {positive ? `+$${amount}` : `-$${Math.abs(amount)}`}
      </Typography>
    </View>
  );
}

function tokenOpacity(token: CellToken): number {
  if (token.hidden) return 0;
  if (token.retired) return 0.35;
  return 1;
}

function TokenStack({ tokens }: { tokens: CellToken[] }) {
  const cols = Math.min(tokens.length, TOKEN_COLS);
  const rows = Math.ceil(tokens.length / TOKEN_COLS);
  const clusterW = TOKEN_SIZE + (cols - 1) * TOKEN_STEP;
  const clusterH = TOKEN_SIZE + (rows - 1) * TOKEN_STEP;
  return (
    <View style={styles.tokenStack}>
      <View style={{ width: clusterW, height: clusterH }}>
        {tokens.map((token, i) => (
          <View
            key={i}
            style={[
              styles.miniToken,
              {
                position: "absolute",
                left: (i % TOKEN_COLS) * TOKEN_STEP,
                top: Math.floor(i / TOKEN_COLS) * TOKEN_STEP,
                backgroundColor: token.color,
                opacity: tokenOpacity(token),
              },
            ]}
          >
            <Typography design="title" style={styles.miniTokenText}>
              {token.initial}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
}

function renderIcon(icon: CellIcon, cellSize: number, color: string) {
  switch (icon) {
    case "coin":
      return <CoinIcon color={color} />;
    case "bill":
      return <BillIcon color={color} />;
    case "die":
      return <DieIcon color={color} />;
    case "birthday":
      return <BirthdayIcon size={Math.max(38, cellSize * 0.6)} />;
    case "election":
      return <ElectionIcon size={Math.max(40, cellSize * 0.9)} />;
    case "daylight":
      return <DaylightSavingIcon size={Math.max(40, cellSize)} />;
  }
}

/** A player-colored ring drawn only on occupied cells. Absolute overlay so
 *  animating its width never shifts contents; fades to 0 when the cell empties. */
function CellRing({ active, color }: { active: boolean; color: string }) {
  const style = useAnimatedStyle(() => ({
    borderWidth: withTiming(active ? 2.75 : 0, { duration: 180 }),
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.ring, { borderColor: color }, style]}
    />
  );
}

export default function BoardCell({
  day,
  type,
  playerTokens,
  cellSize,
  cellHeight,
  onPress,
}: BoardCellProps) {
  const info = CELL_INFO[type];
  const ch = cellHeight ?? cellSize;
  const cat = SD_CATEGORY[info.category];
  // The ring shows only on occupied cells, in the (first) player's color.
  const occupant = playerTokens.find((t) => !t.hidden);
  const tileBg = mixHex(cat, SD.surface, 0.84);
  const cellImage = info.image ?? null;
  const amount = getCellAmount(type);
  const label = info.label;
  // Single word → one line (shrink to fit, never split the word); multi-word wraps.
  const labelLines = label?.includes(" ") ? 2 : 1;

  const frame = [
    styles.tile,
    {
      width: cellSize,
      height: ch,
      backgroundColor: '#fff6e4',
      shadowColor: mixHex(cat, "#000000", 0.12),
    },
  ];

  if (type === "start") {
    return (
      <Pressable style={frame} onPress={onPress}>
        <CheckerStrip width={cellSize} />
        <View style={styles.startBody}>
          <View style={styles.startPlay}>
            <View style={styles.startTriangle} />
          </View>
          <Typography design="money" style={styles.startText}>
            START
          </Typography>
        </View>
        {playerTokens.length > 0 && <TokenStack tokens={playerTokens} />}
        <CellRing active={!!occupant} color={occupant?.color ?? cat} />
      </Pressable>
    );
  }

  if (type === "salary-day") {
    return (
      <Pressable style={frame} onPress={onPress}>
        <View style={styles.payBody}>
          <View style={styles.payCenter}>
            <Typography design="body" weight={700} style={styles.payEyebrow}>
              DAY 31
            </Typography>
            <Typography design="money" style={styles.payTitle}>
              PAY DAY
            </Typography>
          </View>
          <View style={styles.payPill}>
            <Typography design="money" style={styles.payPillText}>
              +${getCellAmount(type)}
            </Typography>
          </View>
        </View>
        {playerTokens.length > 0 && <TokenStack tokens={playerTokens} />}
        <CellRing active={!!occupant} color={occupant?.color ?? cat} />
      </Pressable>
    );
  }

  return (
    <Pressable style={frame} onPress={onPress}>
      <View style={[styles.dayChip, { shadowColor: "#000" }]}>
        <Typography
          design="title"
          style={[styles.dayChipText, { color: mixHex(cat, "#000000", 0.18) }]}
        >
          {String(day)}
        </Typography>
      </View>

      {playerTokens.length > 0 && <TokenStack tokens={playerTokens} />}

      <View style={styles.illo}>
        {cellImage ? (
          <Image
            source={cellImage}
            style={[
              {
                width: cellSize * (info.imageScale ?? 1),
                height: cellSize * (info.imageScale ?? 1),
              },
              info.imageStyle,
            ]}
            resizeMode="contain"
          />
        ) : info.icon ? (
          renderIcon(info.icon, cellSize, cat)
        ) : null}
      </View>

      <View style={styles.bottom}>
        {label ? (
          <Typography
            design="title"
            style={[styles.label, { color: mixHex(cat, "#2A2118", 0.42) }]}
            numberOfLines={labelLines}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {label}
          </Typography>
        ) : amount !== 0 ? (
          <AmountPill amount={amount} />
        ) : null}
      </View>
      <CellRing active={!!occupant} color={occupant?.color ?? cat} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: 12,
    overflow: "hidden",
    padding: 3,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  ring: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  dayChip: {
    position: "absolute",
    top: 4,
    left: 4,
    zIndex: 4,
    width: 18,
    height: 18,
    borderRadius: 6,
    backgroundColor: SD.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  dayChipText: {
    fontSize: 10,
  },
  tokenStack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  miniToken: {
    width: TOKEN_SIZE,
    height: TOKEN_SIZE,
    borderRadius: 12,
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
  miniTokenText: {
    fontSize: 11,
    color: SD.white,
  },
  illo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    minHeight: 0,
    transform: [{ translateY: 6 }],
  },
  cellImage: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    width: "100%",
    height: "100%",
  },
  bottom: {
    alignItems: "center",
    minHeight: 14,
    justifyContent: "flex-end",
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: "center",
  },
  amountPill: {
    paddingVertical: 0,
    paddingHorizontal: 4,
    borderRadius: 999,
  },
  amountPillText: {
    fontSize: 10,
  },
  coin: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  coinText: {
    fontSize: 14,
    lineHeight: 17,
    color: SD.white,
  },
  bill: {
    width: 31,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  billRing: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  billText: {
    fontSize: 7,
    lineHeight: 9,
    color: SD.white,
  },
  die: {
    width: 27,
    height: 27,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  diePip: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: SD.white,
  },
  checkerStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.9,
    zIndex: 2,
  },
  startBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingTop: 7,
  },
  startPlay: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: SD.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
  },
  startTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5.5,
    borderBottomWidth: 5.5,
    borderLeftWidth: 9,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: SD.primary,
    marginLeft: 2,
  },
  startText: {
    fontSize: 8.5,
    letterSpacing: 0.5,
    color: SD.ink,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 0,
  },
  payBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  payCenter: {
    alignItems: "center",
    gap: 2,
  },
  payEyebrow: {
    fontSize: 8,
    letterSpacing: 1,
    color: "#7A4E00",
  },
  payTitle: {
    fontSize: 14,
    lineHeight: 13,
    color: SD.ink,
  },
  payPill: {
    position: "absolute",
    right: 8,
    backgroundColor: SD.primary,
    paddingVertical: 0,
    paddingHorizontal: 11,
    borderRadius: 999,
  },
  payPillText: {
    fontSize: 12,
    color: SD.white,
  },
});
