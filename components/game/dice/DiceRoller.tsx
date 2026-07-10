import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SD_LAYER } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import DiceCube, { DieValue, FACE_ANGLES } from "./DiceCube";

// Timings and curves lifted verbatim from the design prototype
const FLY_IN_MS = 460;
const FLY_IN_EASING = Easing.bezier(0.34, 1.45, 0.5, 1);
const SPIN_MS = 2100;
const SPIN_EASING = Easing.bezier(0.2, 0.8, 0.3, 1.1);
const FLY_BACK_MS = 380;
const FLY_BACK_EASING = Easing.bezier(0.5, 0, 0.75, 0.4);
const RESULT_PAUSE_MS = 650;
const CUBE_SIZE = 100;

export interface AnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DiceRollerProps {
  /** Where the cube docks when idle (the Roll button's slot). */
  anchor: AnchorRect | null;
  rolling: boolean;
  /** Wash the docked cube out while rolling isn't available. */
  dimmed: boolean;
  onComplete: (value: DieValue) => void;
}

/**
 * The single dice cube of the game. Docked over the Roll button between
 * turns; on roll it flies to screen center, tumbles to the result and
 * flies back — one cube, one rotation state, nothing to sync.
 */
export default function DiceRoller({
  anchor,
  rolling,
  dimmed,
  onComplete,
}: DiceRollerProps) {
  const { impactHaptic } = useSound();
  const layerRef = useRef<View>(null);
  const [layer, setLayer] = useState<AnchorRect | null>(null);

  // Both anchor and layer are measured in window coordinates, so the
  // dock offset stays correct regardless of insets or edge-to-edge.
  const measureLayer = () => {
    layerRef.current?.measureInWindow((x, y, width, height) => {
      setLayer({ x, y, width, height });
    });
  };

  const home =
    anchor && layer
      ? {
          x: anchor.x + anchor.width / 2 - (layer.x + layer.width / 2),
          y: anchor.y + anchor.height / 2 - (layer.y + layer.height / 2),
          scale: anchor.width / CUBE_SIZE,
        }
      : null;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.34);
  const backdrop = useSharedValue(0);
  const rotationX = useSharedValue(0);
  const rotationY = useSharedValue(0);

  const [canDismiss, setCanDismiss] = useState(false);
  const closing = useRef(false);
  const result = useRef<DieValue>(1);
  // Accumulated rotation, as in the design source: every roll adds
  // full turns on top of the current orientation.
  const totals = useRef({ x: 0, y: 0 });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Keep the idle cube docked to the (re-measured) anchor.
  useEffect(() => {
    if (!home || rolling) return;
    translateX.value = home.x;
    translateY.value = home.y;
    scale.value = home.scale;
  }, [home?.x, home?.y, home?.scale, rolling]);

  useEffect(() => {
    if (!rolling) return;
    closing.current = false;
    setCanDismiss(false);

    result.current = (1 + Math.floor(Math.random() * 6)) as DieValue;
    const target = FACE_ANGLES[result.current];
    totals.current = {
      x: Math.ceil(totals.current.x / 360) * 360 + 720 + target.x,
      y: Math.ceil(totals.current.y / 360) * 360 + 720 + target.y,
    };

    const flyIn = { duration: FLY_IN_MS, easing: FLY_IN_EASING };
    const spin = { duration: SPIN_MS, easing: SPIN_EASING };

    backdrop.value = withTiming(1, { duration: 250 });
    translateX.value = withTiming(0, flyIn);
    translateY.value = withTiming(0, flyIn);
    scale.value = withTiming(1, flyIn);
    rotationX.value = withDelay(FLY_IN_MS, withTiming(totals.current.x, spin));
    rotationY.value = withDelay(FLY_IN_MS, withTiming(totals.current.y, spin));

    timers.current = [
      setTimeout(() => {
        setCanDismiss(true);
        impactHaptic();
      }, FLY_IN_MS + SPIN_MS + 50),
      setTimeout(dismiss, FLY_IN_MS + SPIN_MS + 50 + RESULT_PAUSE_MS),
    ];
    return () => timers.current.forEach(clearTimeout);
  }, [rolling]);

  const dismiss = () => {
    if (closing.current) return;
    closing.current = true;

    const flyBack = { duration: FLY_BACK_MS, easing: FLY_BACK_EASING };
    backdrop.value = withTiming(0, { duration: FLY_BACK_MS });
    if (home) {
      translateX.value = withTiming(home.x, flyBack);
      translateY.value = withTiming(home.y, flyBack);
      scale.value = withTiming(home.scale, flyBack);
    }
    setTimeout(() => onComplete(result.current), FLY_BACK_MS + 30);
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const cubeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      ref={layerRef}
      onLayout={measureLayer}
      style={[
        styles.layer,
        { zIndex: rolling ? SD_LAYER.diceRoll : SD_LAYER.hud },
        !home && styles.hidden,
      ]}
      pointerEvents={rolling ? "auto" : "none"}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => canDismiss && dismiss()}
      >
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </Pressable>
      <Animated.View
        style={[cubeStyle, !rolling && dimmed && styles.dimmed]}
        pointerEvents="none"
      >
        <DiceCube rotationX={rotationX} rotationY={rotationY} size={CUBE_SIZE} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,12,16,0.86)",
  },
  dimmed: {
    opacity: 0.55,
  },
  hidden: {
    opacity: 0,
  },
});
