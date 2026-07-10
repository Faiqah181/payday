import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function ScreenBackground({ children }: { children: ReactNode }) {
  return (
    <ImageBackground
      source={require("@/assets/images/generic-background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(255,247,231,0.65)", "rgba(255,247,231,0.72)"]}
        style={styles.fade}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  fade: {
    flex: 1,
  },
});
