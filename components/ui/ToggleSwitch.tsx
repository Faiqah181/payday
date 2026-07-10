import { SD } from "@/constants/theme";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ToggleSwitchProps {
  value: boolean;
  onToggle: () => void;
}

export default function ToggleSwitch({ value, onToggle }: ToggleSwitchProps) {
  const color = useSharedValue(value ? 1 : 0);
  const position = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    color.value = withTiming(value ? 1 : 0, { duration: 200 });
    position.value = withTiming(value ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.34, 1.4, 0.64, 1),
    });
  }, [color, position, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(color.value, [0, 1], ["#C6B8A1", SD.primary]),
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * 20 }],
  }));

  return (
    <Pressable onPress={onToggle} hitSlop={8}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 999,
    padding: 3,
    justifyContent: "center",
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: SD.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
