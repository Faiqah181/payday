import { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/colors";
import MenuButton from "@/components/menu/MenuButton";
import IconButton from "@/components/menu/IconButton";

export default function Index() {
  const router = useRouter();

  const titleScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    titleScale.value = withSpring(1, { damping: 8, stiffness: 120 });
    titleOpacity.value = withTiming(1, { duration: 400 });
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Image
            source={require("@/assets/images/logo.jpeg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <MenuButton
            title="Pass & Play"
            variant="primary"
            icon="game-controller"
            size="large"
            enterDelay={0}
            onPress={() => {}}
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
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 120,
  },
  titleText: {
    fontSize: 68,
    fontWeight: "900",
    color: COLORS.titleGreen,
    textShadowColor: COLORS.titleOutline,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    letterSpacing: 6,
    lineHeight: 76,
  },
  buttonContainer: {
    width: "85%",
    alignSelf: "center",
    gap: 14,
    marginBottom: SPACING.lg,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
});
