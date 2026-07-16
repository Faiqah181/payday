import { DieValue } from "@/components/game/dice/DiceCube";
import RollingDie from "@/components/game/dice/RollingDie";
import PlayerToken from "@/components/ui/PlayerToken";
import Typography from "@/components/ui/Typography";
import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface EventPlayerRowProps {
  name: string;
  initial: string;
  color: string;
  statusText: string;
  statusColor?: string;
  /** Right slot: a rolled die, an OUT badge, or an empty dashed box. */
  die?: DieValue | null;
  /** Bump to make the die tumble again (rerolls can repeat a value). */
  dieNonce?: number;
  out?: boolean;
  highlighted?: boolean;
  right?: ReactNode;
  onPress?: () => void;
}

export default function EventPlayerRow({
  name,
  initial,
  color,
  statusText,
  statusColor = "rgba(255,255,255,0.6)",
  die,
  dieNonce = 0,
  out = false,
  highlighted = false,
  right,
  onPress,
}: EventPlayerRowProps) {
  return (
    <Pressable
      style={[styles.row, highlighted && styles.rowHighlighted]}
      onPress={onPress}
      disabled={!onPress}
    >
      <PlayerToken initial={initial} color={color} size={34} />
      <View style={styles.text}>
        <Typography design="title" weight={800} style={styles.name} numberOfLines={1}>
          {name}
        </Typography>
        <Typography
          design="body"
          weight={700}
          style={[styles.status, { color: statusColor }]}
          numberOfLines={1}
        >
          {statusText}
        </Typography>
      </View>
      {right ?? (
        <View style={styles.slot}>
          {die != null ? (
            <RollingDie value={die} nonce={dieNonce} size={40} />
          ) : (
            <View style={styles.emptyBox}>
              {out && (
                <Typography design="body" weight={800} style={styles.outText}>
                  OUT
                </Typography>
              )}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  rowHighlighted: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    color: "#FFFFFF",
  },
  status: {
    fontSize: 11,
  },
  slot: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  outText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
  },
});
