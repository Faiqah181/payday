import "react-native-reanimated";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "@/constants/colors";
import { SoundProvider } from "@/contexts/SoundContext";

export default function RootLayout() {
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
