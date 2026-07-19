import ChunkyButton from "@/components/ui/ChunkyButton";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AnchorRect } from "./DiceRoller";

interface RollButtonProps {
  disabled: boolean;
  onPress: () => void;
  /** Reports where the dice cube should dock, in window coordinates. */
  onAnchorChange: (rect: AnchorRect) => void;
}

export default function RollButton({
  disabled,
  onPress,
  onAnchorChange,
}: RollButtonProps) {
  const slotRef = useRef<View>(null);

  // measureInWindow right after mount (post-LoadingScreen) can return 0 on
  // Android — defer past the frame and retry until it reports a real size.
  const measureSlot = () => {
    const run = (retries: number) => {
      slotRef.current?.measureInWindow((x, y, width, height) => {
        if (width > 0) onAnchorChange({ x, y, width, height });
        else if (retries > 0) requestAnimationFrame(() => run(retries - 1));
      });
    };
    requestAnimationFrame(() => run(5));
  };

  return (
    <ChunkyButton
      color={SD.primary}
      depthColor={SD.primaryShadow}
      depth={4}
      borderRadius={15}
      disabled={disabled}
      style={styles.button}
      contentStyle={styles.face}
      onPress={onPress}
    >
      {/* Empty slot — the DiceRoller's cube docks over this spot */}
      <View
        ref={slotRef}
        collapsable={false}
        onLayout={measureSlot}
        style={styles.cubeSlot}
      />
      <Typography design="title" style={styles.label}>
        Roll Dice
      </Typography>
    </ChunkyButton>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  face: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  cubeSlot: {
    width: 34,
    height: 34,
    marginRight: 8,
  },
  label: {
    fontSize: 17,
    color: SD.white,
  },
});
