import Typography from "@/components/ui/Typography";
import { APP_FONTS } from "@/constants/fonts";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { SoundProvider } from "@/contexts/SoundContext";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  AppState,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

function TapToStart() {
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 550, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 550, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [bob]);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  return (
    <Animated.View style={bobStyle}>
      <Typography design="title" style={styles.tapPrompt}>
        Tap anywhere to start
      </Typography>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [fontsLoaded] = useFonts(APP_FONTS);

  useEffect(() => {
    const hideSystemBars = () => {
      StatusBar.setHidden(true);
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    };
    hideSystemBars();
    // Android resets system-bar visibility when the activity loses focus,
    // so re-apply whenever the app returns to the foreground.
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") hideSystemBars();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    async function prepare() {
      // Hide native splash to show the JS splash (same art, full-bleed)
      await SplashScreen.hideAsync();
      try {
        await Asset.loadAsync([
          require("@/assets/images/main-menu.png"),
          require("@/assets/images/generic-background.png"),
        ]);
      } finally {
        setAssetsReady(true);
      }
    }
    prepare();
  }, []);

  const ready = assetsReady && fontsLoaded;

  if (!started) {
    return (
      <Pressable
        style={styles.splashRoot}
        disabled={!ready}
        onPress={() => setStarted(true)}
      >
        <ImageBackground
          source={require("@/assets/images/splash-9x19.png")}
          style={styles.splash}
          resizeMode="cover"
        >
          {ready && <TapToStart />}
        </ImageBackground>
      </Pressable>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SoundProvider>
        <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="game-setup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="how-to-play"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="game" />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar barStyle="light-content" />
        </ProfileProvider>
      </SoundProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  splashRoot: {
    flex: 1,
    backgroundColor: "#1A627D",
  },
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 60,
  },
  tapPrompt: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
