import Typography from "@/components/ui/Typography";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const INK = "#16607C";

function Spinner() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 800, easing: Easing.linear }),
      -1,
    );
  }, [rotation]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return <Animated.View style={[styles.spinner, style]} />;
}

export default function LoadingScreen({
  message = "Setting up the board…",
}: {
  message?: string;
}) {
  return (
    <ImageBackground
      source={require("@/assets/images/loading-screen.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.pill}>
        <Spinner />
        <Typography design="title" style={styles.message}>
          {message}
        </Typography>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#CDEEDE",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 44,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.88)",
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 999,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 0,
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#CFE4EC",
    borderTopColor: INK,
  },
  message: {
    fontSize: 14,
    color: INK,
  },
});
