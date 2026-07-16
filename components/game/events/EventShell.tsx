import Typography from "@/components/ui/Typography";
import { SD_LAYER } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
  withDelay,
  withTiming,
  type EntryAnimationsValues,
  type ExitAnimationsValues,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

/** How far the wavy caps hang past each screen edge. */
const WAVE_H = 64;
// Flat along the top, an S-wave along the bottom — the liquid's leading edge.
const WAVE_PATH = "M0,0 H100 V8 C85,20 70,20 50,12 C30,4 15,4 0,10 Z";
/** One steady pace for the whole travel — liquid flows, it doesn't drop. */
const FLOW_MS = 550;
/**
 * How much of the travel the fade spans, as a fraction. Travel is linear, so
 * time maps straight to distance: 0.5 puts the panel clear by mid-screen on
 * the way in, and starts the fade at mid-screen on the way out (finishing
 * exactly as it clears the bottom edge). Everything below is derived from
 * FLOW_MS, so retiming the slide retimes the fade with it.
 */
const FADE_RATIO = 0.5;
const FADE_MS = FLOW_MS * FADE_RATIO;
/** Fade holds off until this point on the way out. */
const FADE_OUT_DELAY_MS = FLOW_MS - FADE_MS;

function WaveCap({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <View
      style={[styles.wave, flip ? styles.waveTop : styles.waveBottom]}
      pointerEvents="none"
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
        <Path d={WAVE_PATH} fill={color} />
      </Svg>
    </View>
  );
}

/**
 * Curtain: the panel pours down from above, then keeps flowing out the bottom.
 * Linear throughout — an eased curve reads as gravity (fast launch, hard
 * landing); liquid moves at one pace. The fade rides the first/last half of
 * the travel (see FADE_MS). It runs a wave-cap past the screen edge so the
 * wavy leading edge fully clears.
 */
function curtainIn(values: EntryAnimationsValues) {
  "worklet";
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateY: -(values.windowHeight + WAVE_H) }],
    },
    animations: {
      opacity: withTiming(1, { duration: FADE_MS, easing: Easing.linear }),
      transform: [
        {
          translateY: withTiming(0, {
            duration: FLOW_MS,
            easing: Easing.linear,
          }),
        },
      ],
    },
  };
}

function curtainOut(values: ExitAnimationsValues) {
  "worklet";
  return {
    initialValues: { opacity: 1, transform: [{ translateY: 0 }] },
    animations: {
      // Solid down to mid-screen, then fade out over the rest of the travel
      opacity: withDelay(
        FADE_OUT_DELAY_MS,
        withTiming(0, { duration: FADE_MS, easing: Easing.linear }),
      ),
      transform: [
        {
          translateY: withTiming(values.windowHeight + WAVE_H, {
            duration: FLOW_MS,
            easing: Easing.linear,
          }),
        },
      ],
    },
  };
}

// Reanimated custom animations don't run on web — the web test build falls
// back to the predefined drop-and-fade (same direction, shorter throw).
const shellEnter = Platform.OS === "web" ? FadeInDown.duration(FLOW_MS) : curtainIn;
const shellExit = Platform.OS === "web" ? FadeOutDown.duration(FLOW_MS) : curtainOut;

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
    <Animated.View entering={shellEnter} exiting={shellExit} style={styles.overlay}>
      <WaveCap color={gradient[0]} flip />
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
      <WaveCap color={gradient[2]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Hangs a wave-cap past both screen edges; the caps only come into view
  // while the panel slides. The gradient still covers exactly the screen.
  overlay: {
    position: "absolute",
    top: -WAVE_H,
    bottom: -WAVE_H,
    left: 0,
    right: 0,
    zIndex: SD_LAYER.event,
  },
  gradient: {
    flex: 1,
  },
  wave: {
    height: WAVE_H,
  },
  waveTop: {
    transform: [{ scaleY: -1 }],
  },
  waveBottom: {},
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
