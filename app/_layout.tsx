import "react-native-reanimated";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { COLORS } from "@/constants/colors";
import { SoundProvider } from "@/contexts/SoundContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BlueWinter: require("@/assets/fonts/Blue Winter.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
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
