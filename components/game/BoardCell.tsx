import Typography from "@/components/ui/Typography";
import {
  getCellAmount,
  SPACE_CATEGORY,
  SPACE_CELL_LABELS,
} from "@/constants/board";
import { mixHex, SD, SD_CATEGORY } from "@/constants/theme";
import type { SpaceType } from "@/types/game";
import { Image, Pressable, StyleSheet, View } from "react-native";

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

const CELL_IMAGES: Partial<Record<SpaceType, ReturnType<typeof require>>> = {
  "lazy-sunday": require("@/assets/images/board-cells/1.lazy sunday.png"),
  "asset-buyer": require("@/assets/images/board-cells/2.buyer.png"),
  "post-mail": require("@/assets/images/board-cells/3.Mail.png"),
  deal: require("@/assets/images/board-cells/4.Deal.png"),
  "lottery-result": require("@/assets/images/board-cells/lottery.png"),
};

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

function ClockIcon({ color }: { color: string }) {
  return (
    <View style={[styles.clock, { borderColor: color }]}>
      <View style={[styles.clockHandV, { backgroundColor: color }]} />
      <View style={[styles.clockHandH, { backgroundColor: color }]} />
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
      style={[styles.amountPill, { backgroundColor: mixHex(tone, SD.surface, 0.78) }]}
    >
      <Typography design="money" style={[styles.amountPillText, { color: tone }]}>
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
  return (
    <View style={styles.tokenStack}>
      {tokens.map((token, i) => (
        <View
          key={i}
          style={[
            styles.miniToken,
            {
              backgroundColor: token.color,
              marginLeft: i > 0 ? -7 : 0,
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
  );
}

export default function BoardCell({
  day,
  type,
  playerTokens,
  isCurrentCell,
  cellSize,
  cellHeight,
  onPress,
}: BoardCellProps) {
  const ch = cellHeight ?? cellSize;
  const cat = SD_CATEGORY[SPACE_CATEGORY[type]];
  const tileBg = mixHex(cat, SD.surface, 0.84);
  const cellImage = CELL_IMAGES[type] ?? null;
  const amount = getCellAmount(type);
  const label = SPACE_CELL_LABELS[type];

  const frame = [
    styles.tile,
    {
      width: cellSize,
      height: ch,
      backgroundColor: tileBg,
      borderColor: cat,
      borderWidth: isCurrentCell ? 2.5 : 1.5,
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
      </Pressable>
    );
  }

  return (
    <Pressable style={frame} onPress={onPress}>
      <View style={[styles.dayChip, { shadowColor: "#000" }]}>
        <Typography
          design="money"
          style={[styles.dayChipText, { color: mixHex(cat, "#000000", 0.18) }]}
        >
          {String(day)}
        </Typography>
      </View>

      {playerTokens.length > 0 && <TokenStack tokens={playerTokens} />}

      <View style={styles.illo}>
        {cellImage ? (
          <Image source={cellImage} style={styles.cellImage} resizeMode="contain" />
        ) : type === "birthday-gift" || type === "performance-bonus" ? (
          <CoinIcon color={cat} />
        ) : type === "election" ? (
          <CoinIcon color={cat} />
        ) : type === "poker-game" ? (
          <DieIcon color={cat} />
        ) : type === "daylight-saving" ? (
          <ClockIcon color={cat} />
        ) : (
          <BillIcon color={cat} />
        )}
      </View>

      <View style={styles.bottom}>
        {amount !== 0 ? (
          <AmountPill amount={amount} />
        ) : label ? (
          <Typography
            design="title"
            style={[styles.label, { color: mixHex(cat, "#2A2118", 0.42) }]}
            numberOfLines={1}
          >
            {label}
          </Typography>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: 11,
    overflow: "hidden",
    padding: 3,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
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
    fontSize: 8,
  },
  tokenStack: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 5,
    flexDirection: "row",
  },
  miniToken: {
    width: 19,
    height: 19,
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
  miniTokenText: {
    fontSize: 9,
    color: SD.white,
  },
  illo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    minHeight: 0,
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
  },
  amountPill: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 999,
  },
  amountPillText: {
    fontSize: 8,
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
  clock: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 3,
  },
  clockHandV: {
    position: "absolute",
    left: 9.5,
    top: 3,
    width: 2.5,
    height: 8,
    borderRadius: 2,
  },
  clockHandH: {
    position: "absolute",
    left: 10,
    top: 9.5,
    width: 8,
    height: 2.5,
    borderRadius: 2,
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
    color: SD.white,
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
    fontSize: 7,
    letterSpacing: 1,
    color: "#7A4E00",
  },
  payTitle: {
    fontSize: 11,
    lineHeight: 13,
    color: SD.ink,
  },
  payPill: {
    position: "absolute",
    right: 8,
    backgroundColor: SD.primary,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 999,
  },
  payPillText: {
    fontSize: 8,
    color: SD.white,
  },
});
