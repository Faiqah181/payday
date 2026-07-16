import { useEffect, useRef } from "react";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import DiceCube, { DieValue, FACE_ANGLES } from "./DiceCube";

// Same tumble as the main roll: full extra turns onto the current
// orientation, settling on the target face.
const SPIN = { duration: 2100, easing: Easing.bezier(0.2, 0.8, 0.3, 1.1) };

interface RollingDieProps {
  value: DieValue;
  /** Increment to trigger a fresh tumble — value alone can repeat (4 → 4). */
  nonce: number;
  size?: number;
}

/** A die that tumbles to `value` every time `nonce` changes. */
export default function RollingDie({ value, nonce, size = 40 }: RollingDieProps) {
  const rotationX = useSharedValue(0);
  const rotationY = useSharedValue(0);
  const totals = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const target = FACE_ANGLES[value];
    totals.current = {
      x: Math.ceil(totals.current.x / 360) * 360 + 720 + target.x,
      y: Math.ceil(totals.current.y / 360) * 360 + 720 + target.y,
    };
    rotationX.value = withTiming(totals.current.x, SPIN);
    rotationY.value = withTiming(totals.current.y, SPIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  return <DiceCube rotationX={rotationX} rotationY={rotationY} size={size} />;
}
