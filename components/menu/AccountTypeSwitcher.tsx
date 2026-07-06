import Bank from "@/assets/svg/bank.svg";
import CoinSvg from "@/assets/svg/coin.svg";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const ACCOUNT_TYPES = ["Savings", "Loan"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

const UNSELECTED_BG = "#B0BEC5";
const SELECTED_BG = "#B1E9FA";

interface AccountTypeSwitcherProps {
  value: AccountType;
  onChange: (type: AccountType) => void;
}

export default function AccountTypeSwitcher({
  value,
  onChange,
}: AccountTypeSwitcherProps) {
  return (
    <View style={styles.accountButtons}>
      <AccountButton
        label="SAVING"
        selected={value === "Savings"}
        onPress={() => onChange("Savings")}
        Icon={CoinSvg}
      />
      <AccountButton
        label="LOAN"
        selected={value === "Loan"}
        onPress={() => onChange("Loan")}
        Icon={Bank}
      />
    </View>
  );
}

interface AccountButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  Icon: React.FC<{ width: number; height: number }>;
}

function AccountButton({ label, selected, onPress, Icon }: AccountButtonProps) {
  const pressed = useSharedValue(0);
  const active = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    active.value = withTiming(selected ? 1 : 0, { duration: 180 });
  }, [active, selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * 0.08) }],
    backgroundColor: interpolateColor(
      active.value,
      [0, 1],
      [UNSELECTED_BG, SELECTED_BG],
    ),
    borderColor: interpolateColor(
      active.value,
      [0, 1],
      ["rgba(255,255,255,0)", "rgba(255,255,255,1)"],
    ),
  }));

  return (
    <Pressable
      style={styles.pressable}
      onPress={onPress}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
    >
      <Animated.View style={[styles.accountBtn, animatedStyle]}>
        <Icon width={20} height={20} />
        <Text style={styles.accountBtnText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  accountButtons: {
    flexDirection: "row",
    width: 116,
    gap: 4,
  },
  pressable: {
    flex: 1,
  },
  accountBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 2,
    borderWidth: 3,
  },
  accountBtnText: {
    fontWeight: "600",
    fontSize: 10,
    color: "#000",
    letterSpacing: 0.5,
  },
});
