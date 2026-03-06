import { StyleSheet, Text, View } from "react-native";
import { COLORS, BORDER_RADIUS } from "@/constants/colors";

export default function ComingSoonBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: COLORS.badgeBg,
    borderRadius: BORDER_RADIUS.badge,
    paddingHorizontal: 8,
    paddingVertical: 3,
    transform: [{ rotate: "5deg" }],
    zIndex: 1,
  },
  text: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
  },
});
