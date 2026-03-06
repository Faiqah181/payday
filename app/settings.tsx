import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/colors";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  text: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
});
