import IconButton from "@/components/menu/IconButton";
import MenuButton from "@/components/menu/MenuButton";
import { COLORS, SPACING } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const titleScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    titleScale.value = withSpring(1, { damping: 8, stiffness: 120 });
    titleOpacity.value = withTiming(1, { duration: 400 });
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>SALARY DAY</Text>
        </View>

        <View style={styles.buttonContainer}>
          <MenuButton
            title="Pass & Play"
            variant="primary"
            icon="game-controller"
            size="large"
            enterDelay={0}
            onPress={() => router.push("/game-setup")}
          />
          <MenuButton
            title="Online"
            variant="disabled"
            icon="globe"
            badge="Coming Soon"
            size="normal"
            enterDelay={100}
            onPress={() => {}}
          />
        </View>

        <View style={styles.bottomRow}>
          <IconButton
            icon="settings-sharp"
            enterDelay={200}
            onPress={() => router.push("/settings")}
          />
          <IconButton
            icon="help-circle"
            enterDelay={300}
            onPress={() => router.push("/how-to-play")}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  titleText: {
    fontFamily: "BlueWinter",
    fontSize: 72,
    color: COLORS.titleGreen,
    textShadowColor: COLORS.titleOutline,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    letterSpacing: 8,
  },
  buttonContainer: {
    flex: 1,
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
    gap: 14,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
});
