import { useSound } from "@/contexts/SoundContext";
import { ReactNode } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ChunkyButtonProps {
  color: string;
  depthColor: string;
  onPress: () => void;
  children: ReactNode;
  depth?: number;
  borderRadius?: number;
  disabled?: boolean;
  silent?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function ChunkyButton({
  color,
  depthColor,
  onPress,
  children,
  depth = 5,
  borderRadius = 20,
  disabled = false,
  silent = false,
  style,
  contentStyle,
}: ChunkyButtonProps) {
  const { playClick } = useSound();
  const pressed = useSharedValue(0);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.value * depth }],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (!silent) playClick();
        onPress();
      }}
      onPressIn={() => (pressed.value = withSpring(1, { damping: 20, stiffness: 400 }))}
      onPressOut={() => (pressed.value = withSpring(0, { damping: 20, stiffness: 400 }))}
      style={[{ paddingBottom: depth }, style]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { top: depth, backgroundColor: depthColor, borderRadius },
        ]}
      />
      <Animated.View
        style={[{ backgroundColor: color, borderRadius }, contentStyle, faceStyle]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
