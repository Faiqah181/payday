import Typography from "@/components/ui/Typography";
import { StyleSheet, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { faceTransform } from "./diceMath";

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

/** Cube rotation that brings each value to the front. */
export const FACE_ANGLES: Record<DieValue, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 0, y: 180 },
};

/** Static orientation of each face on the cube. */
const FACES: { value: DieValue; x: number; y: number }[] = [
  { value: 1, x: 0, y: 0 },
  { value: 6, x: 0, y: 180 },
  { value: 3, x: 0, y: 90 },
  { value: 4, x: 0, y: -90 },
  { value: 5, x: 90, y: 0 },
  { value: 2, x: -90, y: 0 },
];

interface DiceCubeProps {
  rotationX: SharedValue<number>;
  rotationY: SharedValue<number>;
  size?: number;
}

interface FaceProps extends Required<DiceCubeProps> {
  value: DieValue;
  faceX: number;
  faceY: number;
}

function Face({ value, faceX, faceY, rotationX, rotationY, size }: FaceProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        matrix: faceTransform(
          rotationX.value,
          rotationY.value,
          faceX,
          faceY,
          size / 2,
          size * 6,
        ),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.face,
        {
          width: size,
          height: size,
          borderRadius: size * 0.12,
          borderWidth: Math.max(1, size * 0.01),
        },
        animatedStyle,
      ]}
    >
      <Typography design="title" style={[styles.number, { fontSize: size * 0.48 }]}>
        {String(value)}
      </Typography>
    </Animated.View>
  );
}

export default function DiceCube({ rotationX, rotationY, size = 100 }: DiceCubeProps) {
  return (
    <View style={{ width: size, height: size }}>
      {FACES.map((face) => (
        <Face
          key={face.value}
          value={face.value}
          faceX={face.x}
          faceY={face.y}
          rotationX={rotationX}
          rotationY={rotationY}
          size={size}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    overflow: "hidden",
    borderColor: "rgba(0,0,0,0.16)",
  },
  number: {
    color: "#000000",
  },
});
