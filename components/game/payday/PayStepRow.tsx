import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export interface PayStep {
  title: string;
  sub: string;
  /** Signed amount; drives the +/− text and color. */
  amount: number;
  /** Overrides the formatted amount (e.g. "—" or "-$200 · +$100"). */
  amountText?: string;
  /** Overrides the sign-derived color (e.g. a neutral running balance). */
  amountColor?: string;
}

export default function PayStepRow({ step, index }: { step: PayStep; index: number }) {
  const text =
    step.amountText ??
    (step.amount === 0
      ? "$0"
      : `${step.amount > 0 ? "+" : "-"}$${Math.abs(step.amount)}`);
  const color =
    step.amountColor ??
    (step.amount > 0 ? SD.primary : step.amount < 0 ? SD.debt : SD.soft);

  return (
    <View style={[styles.row, index > 0 && styles.rowDivider]}>
      <View style={styles.numChip}>
        <Typography design="money" style={styles.numText}>
          {String(index + 1)}
        </Typography>
      </View>
      <View style={styles.text}>
        <Typography design="title" weight={800} style={styles.title}>
          {step.title}
        </Typography>
        <Typography design="body" weight={700} style={styles.sub} numberOfLines={1}>
          {step.sub}
        </Typography>
      </View>
      <Typography design="money" style={[styles.amount, { color }]}>
        {text}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: SD.line,
  },
  numChip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: SD.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: {
    fontSize: 10,
    color: "#7A4E00",
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    color: SD.ink,
  },
  sub: {
    fontSize: 11,
    color: SD.soft,
  },
  amount: {
    fontSize: 13,
  },
});
