import ChunkyButton from "@/components/ui/ChunkyButton";
import PlayerToken from "@/components/ui/PlayerToken";
import Typography from "@/components/ui/Typography";
import { mixHex, SD } from "@/constants/theme";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export function EventCashRow({
  initial,
  color,
  cash,
}: {
  initial: string;
  color: string;
  cash: number;
}) {
  return (
    <View style={styles.cashRow}>
      <View style={styles.cashLeft}>
        <PlayerToken initial={initial} color={color} size={24} />
        <Typography design="body" weight={800} style={styles.cashLabel}>
          YOUR CASH
        </Typography>
      </View>
      <Typography design="money" style={styles.cashValue}>
        {cash < 0 ? "-" : ""}${Math.abs(cash).toLocaleString("en-US")}
      </Typography>
    </View>
  );
}

export function EventButton({
  label,
  onPress,
  color = SD.primary,
  textColor = SD.white,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <ChunkyButton
      color={color}
      depthColor={
        color.startsWith("#") ? mixHex(color, "#000000", 0.35) : "rgba(0,0,0,0.25)"
      }
      depth={4}
      borderRadius={16}
      disabled={disabled}
      style={style}
      contentStyle={styles.buttonFace}
      onPress={onPress}
    >
      <Typography design="title" style={[styles.buttonLabel, { color: textColor }]}>
        {label}
      </Typography>
    </ChunkyButton>
  );
}

const styles = StyleSheet.create({
  cashRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 11,
  },
  cashLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  cashLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  cashValue: {
    fontSize: 19,
    color: "#FFFFFF",
  },
  buttonFace: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonLabel: {
    fontSize: 16,
  },
});
