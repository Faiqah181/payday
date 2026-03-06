import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, BORDER_RADIUS } from "@/constants/colors";
import { useSound } from "@/contexts/SoundContext";
import ComingSoonBadge from "./ComingSoonBadge";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MenuButtonProps {
  title: string;
  onPress: () => void;
  variant: "primary" | "secondary" | "disabled";
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: string;
  enterDelay?: number;
  size?: "large" | "normal";
}

export default function MenuButton({
  title,
  onPress,
  variant,
  icon,
  badge,
  enterDelay = 0,
  size = "normal",
}: MenuButtonProps) {
  const { playClick } = useSound();
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(enterDelay, withTiming(0, { duration: 400 }));
    opacity.value = withDelay(enterDelay, withTiming(1, { duration: 400 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const isDisabled = variant === "disabled";

  const bgColor =
    variant === "primary"
      ? COLORS.primary
      : variant === "secondary"
        ? COLORS.secondary
        : COLORS.disabled;

  const borderBottomColor =
    variant === "primary"
      ? COLORS.primaryBorder
      : variant === "secondary"
        ? COLORS.secondaryBorder
        : COLORS.disabledBorder;

  const textColor =
    variant === "disabled" ? COLORS.disabledText : COLORS.white;

  const isLarge = size === "large";

  return (
    <AnimatedPressable
      style={[
        styles.button,
        isLarge ? styles.buttonLarge : styles.buttonNormal,
        { backgroundColor: bgColor, borderBottomColor },
        animatedStyle,
      ]}
      onPress={isDisabled ? undefined : () => { playClick(); onPress(); }}
      onPressIn={() => {
        if (!isDisabled) scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        if (!isDisabled) scale.value = withSpring(1);
      }}
    >
      {badge && <ComingSoonBadge />}
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={isLarge ? 28 : 22}
            color={textColor}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.text,
            isLarge ? styles.textLarge : styles.textNormal,
            { color: textColor },
          ]}
        >
          {title}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.button,
    borderWidth: 0,
    borderBottomWidth: 5,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonLarge: {
    paddingVertical: 22,
  },
  buttonNormal: {
    paddingVertical: 14,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontFamily: "BlueWinter",
    letterSpacing: 1,
  },
  textLarge: {
    fontSize: 28,
  },
  textNormal: {
    fontSize: 18,
  },
});
