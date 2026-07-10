import BottomDrawer, { BottomDrawerHandle } from "@/components/ui/BottomDrawer";
import ChunkyButton from "@/components/ui/ChunkyButton";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export interface AmountRow {
  label: string;
  value: string;
  color: string;
}

interface AmountSheetProps {
  headColor: string;
  eyebrow: string;
  note: string;
  step: number;
  max: number;
  rows: (amount: number) => AmountRow[];
  confirmLabel: (amount: number) => string;
  confirmColor: string;
  confirmDepthColor: string;
  onConfirm: (amount: number) => void;
  onClose: () => void;
}

/** Bottom sheet with a −/+ stepper — shared by Borrow and Withdraw. */
export default function AmountSheet({
  headColor,
  eyebrow,
  note,
  step,
  max,
  rows,
  confirmLabel,
  confirmColor,
  confirmDepthColor,
  onConfirm,
  onClose,
}: AmountSheetProps) {
  const drawer = useRef<BottomDrawerHandle>(null);
  const [amount, setAmount] = useState(step);

  const canDecrease = amount > step;
  const canIncrease = amount + step <= max;

  return (
    <BottomDrawer ref={drawer} onClose={onClose}>
      <View style={[styles.head, { backgroundColor: headColor }]}>
        <View style={styles.handle} />
        <Typography design="body" weight={800} style={styles.eyebrow}>
          {eyebrow}
        </Typography>
        <Typography design="body" weight={700} style={styles.note}>
          {note}
        </Typography>
      </View>
      <View style={styles.body}>
        <View style={styles.stepper}>
          <StepButton
            glyph="−"
            background={SD.surface2}
            color={SD.ink}
            disabled={!canDecrease}
            onPress={() => setAmount(amount - step)}
          />
          <Typography design="money" style={styles.amount}>
            ${amount}
          </Typography>
          <StepButton
            glyph="+"
            background={SD.primary}
            color={SD.white}
            disabled={!canIncrease}
            onPress={() => setAmount(amount + step)}
          />
        </View>
        <View style={styles.rowsBox}>
          {rows(amount).map((row, i, all) => (
            <View
              key={row.label}
              style={[styles.row, i < all.length - 1 && styles.rowDivider]}
            >
              <Typography design="body" weight={700} style={styles.rowLabel}>
                {row.label}
              </Typography>
              <Typography design="money" style={[styles.rowValue, { color: row.color }]}>
                {row.value}
              </Typography>
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <Pressable style={styles.cancel} onPress={() => drawer.current?.close()}>
            <Typography design="title" weight={800} style={styles.cancelLabel}>
              Cancel
            </Typography>
          </Pressable>
          <ChunkyButton
            color={confirmColor}
            depthColor={confirmDepthColor}
            depth={4}
            borderRadius={15}
            style={styles.confirm}
            contentStyle={styles.confirmFace}
            onPress={() => {
              onConfirm(amount);
              drawer.current?.close();
            }}
          >
            <Typography design="title" style={styles.confirmLabel}>
              {confirmLabel(amount)}
            </Typography>
          </ChunkyButton>
        </View>
      </View>
    </BottomDrawer>
  );
}

function StepButton({
  glyph,
  background,
  color,
  disabled,
  onPress,
}: {
  glyph: string;
  background: string;
  color: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.stepBtn, { backgroundColor: background }, disabled && styles.stepBtnDim]}
      disabled={disabled}
      onPress={onPress}
    >
      <Typography design="title" style={[styles.stepGlyph, { color }]}>
        {glyph}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
    alignSelf: "center",
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.75)",
  },
  note: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginTop: 3,
  },
  body: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
  },
  stepBtnDim: {
    opacity: 0.45,
  },
  stepGlyph: {
    fontSize: 26,
    lineHeight: 32,
  },
  amount: {
    minWidth: 130,
    textAlign: "center",
    fontSize: 38,
    color: SD.ink,
  },
  rowsBox: {
    backgroundColor: SD.surface2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: SD.line,
  },
  rowLabel: {
    fontSize: 12,
    color: SD.soft,
  },
  rowValue: {
    fontSize: 12,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cancel: {
    flex: 1,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: SD.line,
    borderRadius: 15,
    alignItems: "center",
  },
  cancelLabel: {
    fontSize: 15,
    color: SD.ink,
  },
  confirm: {
    flex: 2,
  },
  confirmFace: {
    paddingVertical: 15,
    alignItems: "center",
  },
  confirmLabel: {
    fontSize: 15,
    color: SD.white,
  },
});
