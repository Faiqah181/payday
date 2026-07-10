import { mixHex, SD } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
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
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
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

  // Disabled buttons keep solid layers, just washed toward the surface tone
  const faceColor = disabled ? mixHex(color, SD.surface2, 0.6) : color;
  const lipColor = disabled ? mixHex(depthColor, SD.surface2, 0.6) : depthColor;

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
          { top: depth, backgroundColor: lipColor, borderRadius },
        ]}
      />
      <Animated.View
        style={[
          { backgroundColor: faceColor, borderRadius },
          contentStyle,
          faceStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
