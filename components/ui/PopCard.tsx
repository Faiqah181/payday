import Typography from "@/components/ui/Typography";
import { SD, SD_LAYER } from "@/constants/theme";
import { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, FadeIn, FadeOut, Keyframe, ZoomIn } from "react-native-reanimated";

// The spring-like overshoot comes from the bezier easing pushing past 1
const PopIn = new Keyframe({
  from: { opacity: 0, transform: [{ scale: 0.86 }] },
  to: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  },
}).duration(260);

const PopOut = new Keyframe({
  from: { opacity: 1, transform: [{ scale: 1 }] },
  to: { opacity: 0, transform: [{ scale: 0.86 }], easing: Easing.ease },
}).duration(180);

// Custom Keyframes never start on web (element stays visibility:hidden) —
// fall back to predefined animations there
const cardIn = Platform.OS === "web" ? ZoomIn.duration(260) : PopIn;
const cardOut = Platform.OS === "web" ? FadeOut.duration(180) : PopOut;

interface PopCardProps {
  tone: string;
  eyebrow: string;
  headerRight?: ReactNode;
  onBackdropPress?: () => void;
  children: ReactNode;
}

/**
 * Centered pop-in card with a colored eyebrow header — the base of every
 * draw/detail card modal (mail, deal, held items). Enter/exit animations
 * are automatic: just mount and unmount it.
 */
export default function PopCard({
  tone,
  eyebrow,
  headerRight,
  onBackdropPress,
  children,
}: PopCardProps) {
  return (
    <View style={styles.overlay}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onBackdropPress}
        disabled={!onBackdropPress}
      >
        <Animated.View
          entering={FadeIn.duration(260)}
          exiting={FadeOut.duration(180)}
          style={styles.backdrop}
        />
      </Pressable>
      <Animated.View entering={cardIn} exiting={cardOut} style={styles.card}>
        <View style={[styles.header, { backgroundColor: tone }]}>
          <Typography design="body" weight={800} style={styles.eyebrow}>
            {eyebrow}
          </Typography>
          {headerRight}
        </View>
        <View style={styles.body}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: SD_LAYER.itemModal,
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,16,10,0.6)",
  },
  card: {
    width: "100%",
    maxWidth: 290,
    backgroundColor: SD.surface,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: SD.white,
    opacity: 0.9,
  },
  body: {
    padding: 18,
  },
});
