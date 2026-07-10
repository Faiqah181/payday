import Typography from "@/components/ui/Typography";
import { SD_LAYER } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface EventShellProps {
  gradient: readonly [string, string, string];
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Large emoji rendered above the eyebrow (eyebrow text stays small). */
  emblem?: string;
  pot?: { label: string; value: string };
  children?: ReactNode;
  footer?: ReactNode;
}

/**
 * Full-screen gradient shell for game events (poker night, town election…):
 * eyebrow + big title, optional pot box, scrollable body, pinned footer.
 */
export default function EventShell({
  gradient,
  eyebrow,
  title,
  subtitle,
  emblem,
  pot,
  children,
  footer,
}: EventShellProps) {
  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.overlay}>
      <LinearGradient
        colors={[...gradient]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.screen}>
          <View style={styles.header}>
            {emblem && (
              <Typography design="body" style={styles.emblem}>
                {emblem}
              </Typography>
            )}
            <Typography design="body" weight={800} style={styles.eyebrow}>
              {eyebrow}
            </Typography>
            <Typography design="money" style={styles.title}>
              {title}
            </Typography>
            <Typography design="body" weight={700} style={styles.subtitle}>
              {subtitle}
            </Typography>
          </View>

          {pot && (
            <View style={styles.potBox}>
              <Typography design="body" weight={800} style={styles.potLabel}>
                {pot.label}
              </Typography>
              <Typography design="money" style={styles.potValue}>
                {pot.value}
              </Typography>
            </View>
          )}

          <View style={styles.body}>{children}</View>

          {footer && <View style={styles.footer}>{footer}</View>}
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: SD_LAYER.event,
  },
  gradient: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 8,
    alignItems: "center",
  },
  emblem: {
    fontSize: 34,
    lineHeight: 42,
    marginBottom: 6,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.55)",
  },
  title: {
    fontSize: 25,
    lineHeight: 30,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 5,
  },
  potBox: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 26,
    marginTop: 14,
    marginBottom: 4,
  },
  potLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.6)",
  },
  potValue: {
    fontSize: 36,
    lineHeight: 42,
    color: "#F4D03F",
  },
  body: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
  },
});
