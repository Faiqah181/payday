import { useEffect } from "react";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import DiceCube, { DieValue, FACE_ANGLES } from "./DiceCube";

// Same idle transition the design gives non-overlay cubes
const SPIN = { duration: 950, easing: Easing.bezier(0.2, 0.75, 0.3, 1.05) };

/** A non-interactive die that eases to show `value`. */
export default function StaticDie({
  value,
  size = 34,
}: {
  value: DieValue;
  size?: number;
}) {
  const rotationX = useSharedValue(FACE_ANGLES[value].x);
  const rotationY = useSharedValue(FACE_ANGLES[value].y);

  useEffect(() => {
    const target = FACE_ANGLES[value];
    rotationX.value = withTiming(target.x, SPIN);
    rotationY.value = withTiming(target.y, SPIN);
  }, [rotationX, rotationY, value]);

  return <DiceCube rotationX={rotationX} rotationY={rotationY} size={size} />;
}
