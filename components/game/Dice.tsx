import { useSound } from "@/contexts/SoundContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DiceProps {
  onRoll: (value: number) => void;
  disabled?: boolean;
  size?: number;
}

// Dot positions for each face value (3x3 grid: tl, tc, tr, ml, mc, mr, bl, bc, br)
const FACE_DOTS: Record<number, boolean[]> = {
  1: [false, false, false, false, true, false, false, false, false],
  2: [false, false, true, false, false, false, true, false, false],
  3: [false, false, true, false, true, false, true, false, false],
  4: [true, false, true, false, false, false, true, false, true],
  5: [true, false, true, false, true, false, true, false, true],
  6: [true, false, true, true, false, true, true, false, true],
};

function DiceFace({ value, size }: { value: number; size: number }) {
  const dots = FACE_DOTS[value];
  const dotSize = size * 0.16;
  const padding = size * 0.15;
  const innerSize = size - padding * 2;
  const gap = (innerSize - dotSize * 3) / 2;

  return (
    <View style={[styles.face, { width: size, height: size, borderRadius: size * 0.15 }]}>
      <View
        style={[
          styles.dotGrid,
          { width: innerSize, height: innerSize, padding: 0 },
        ]}
      >
        {dots.map((visible, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          return (
            <View
              key={i}
              style={[
                styles.dotSlot,
                {
                  width: dotSize,
                  height: dotSize,
                  position: "absolute",
                  top: row * (dotSize + gap),
                  left: col * (dotSize + gap),
                },
              ]}
            >
              {visible && (
                <View
                  style={[
                    styles.dot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function Dice({ onRoll, disabled = false, size = 60 }: DiceProps) {
  const { playClick } = useSound();
  const [faceValue, setFaceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const roll = () => {
    if (rolling || disabled) return;
    playClick();
    setRolling(true);

    // Shake animation
    rotation.value = withSequence(
      withTiming(-15, { duration: 50 }),
      withRepeat(withTiming(15, { duration: 100 }), 6, true),
      withTiming(0, { duration: 50 })
    );
    scale.value = withSequence(
      withTiming(1.15, { duration: 100 }),
      withTiming(1, { duration: 600 })
    );

    // Rapidly cycle faces
    let count = 0;
    const maxCycles = 10;
    intervalRef.current = setInterval(() => {
      setFaceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= maxCycles) {
        cleanup();
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setFaceValue(finalValue);
        setRolling(false);
        onRoll(finalValue);
      }
    }, 80);
  };

  return (
    <AnimatedPressable
      onPress={roll}
      style={[animatedStyle, (rolling || disabled) && styles.disabled]}
    >
      <DiceFace value={faceValue} size={size} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  face: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dotGrid: {
    position: "relative",
  },
  dotSlot: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    backgroundColor: "#212121",
  },
  disabled: {
    opacity: 0.7,
  },
});
