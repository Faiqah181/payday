import "react-native-reanimated";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "@/constants/colors";
import { SoundProvider } from "@/contexts/SoundContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    async function prepare() {
      // Hide native splash to show our JS loading screen
      await SplashScreen.hideAsync();

      // Animate progress bar while loading
      progress.value = withTiming(1, {
        duration: 2000,
        easing: Easing.out(Easing.quad),
      });

      try {
        await Asset.loadAsync(require("@/assets/images/main-menu.png"));
      } finally {
        // Ensure bar reaches 100% before transitioning
        progress.value = withTiming(1, { duration: 300 });
        setTimeout(() => setAppReady(true), 400);
      }
    }
    prepare();
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!appReady) {
    return (
      <ImageBackground
        source={require("@/assets/images/loading-screen.png")}
        style={styles.loadingBackground}
        resizeMode="cover"
      >
        <StatusBar style="dark" />
        <View style={styles.barContainer}>
          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, barStyle]} />
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <SoundProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="game-setup"
          options={{
            headerShown: true,
            title: "Game Setup",
            headerStyle: { backgroundColor: COLORS.backgroundDark },
            headerTintColor: COLORS.white,
          }}
        />
        <Stack.Screen
          name="how-to-play"
          options={{
            headerShown: true,
            title: "How to Play",
            headerStyle: { backgroundColor: COLORS.backgroundDark },
            headerTintColor: COLORS.white,
          }}
        />
        <Stack.Screen name="game" />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            title: "Settings",
            headerStyle: { backgroundColor: COLORS.backgroundDark },
            headerTintColor: COLORS.white,
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </SoundProvider>
  );
}

const styles = StyleSheet.create({
  loadingBackground: {
    flex: 1,
  },
  barContainer: {
    position: "absolute",
    bottom: "28%",
    left: "12%",
    right: "12%",
    alignItems: "center",
  },
  barTrack: {
    width: "100%",
    height: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#FFB300",
    borderRadius: 10,
  },
});
