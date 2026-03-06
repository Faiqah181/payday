import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useSound } from "@/contexts/SoundContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  enterDelay?: number;
}

export default function IconButton({
  icon,
  onPress,
  enterDelay = 0,
}: IconButtonProps) {
  const { playClick } = useSound();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(enterDelay, withTiming(1, { duration: 400 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle]}
      onPress={() => { playClick(); onPress(); }}
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Ionicons name={icon} size={26} color={COLORS.white} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.iconButton,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.iconButtonBorder,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
});
