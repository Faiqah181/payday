import PlayerToken from "@/components/ui/PlayerToken";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

const GOLD = "#F4D03F";
const CONFETTI_COLORS = [
  GOLD,
  "#FF9B8E",
  "#7EC8E3",
  "#A5E6B0",
  "#FFFFFF",
  "#C9A0FF",
];
const PIECE_COUNT = 46;
/** Launch point beyond each screen edge, as a fraction of the screen width. */
const LAUNCH_RATIO = 0.3;
/** Just enough scatter to avoid a lockstep wall — the burst still reads instant. */
const MAX_STAGGER_MS = 110;
/**
 * A mount animation, not a JS effect: Reanimated applies it natively before
 * the first paint, so the token can never sit there small waiting on the JS
 * thread (which is busy mounting the confetti). Web can't do spring entering
 * animations, so it takes a timed zoom instead.
 */
const TOKEN_POP =
  Platform.OS === "web"
    ? ZoomIn.duration(260)
    : ZoomIn.springify().damping(14).stiffness(320);

const rand = (min: number, max: number) => min + Math.random() * (max - min);

interface WinnerCelebrationProps {
  initial: string;
  color: string;
  amount: string;
  note: string;
}

/** Winner block for event screens: confetti showers in from both sides
 *  while the winner's token springs up from small to full size. */
export default function WinnerCelebration({
  initial,
  color,
  amount,
  note,
}: WinnerCelebrationProps) {
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const { width: screenW } = useWindowDimensions();

  return (
    <View
      style={styles.block}
      onLayout={(e) =>
        setBox({
          w: e.nativeEvent.layout.width,
          h: e.nativeEvent.layout.height,
        })
      }
    >
      {box &&
        Array.from({ length: PIECE_COUNT }, (_, i) => (
          <ConfettiPiece
            key={i}
            index={i}
            width={box.w}
            height={box.h}
            launch={screenW * LAUNCH_RATIO}
          />
        ))}
      <Animated.View entering={TOKEN_POP} style={styles.ring}>
        <PlayerToken initial={initial} color={color} size={72} />
      </Animated.View>
      <Typography design="money" style={styles.amount}>
        {amount}
      </Typography>
      <Typography design="body" weight={700} style={styles.note}>
        {note}
      </Typography>
    </View>
  );
}

function ConfettiPiece({
  index,
  width,
  height,
  launch,
}: {
  index: number;
  width: number;
  height: number;
  /** How far past the block's edge to start — puts the piece off-screen. */
  launch: number;
}) {
  const cfg = useMemo(() => {
    const fromLeft = index % 2 === 0;
    return {
      startX: fromLeft ? -launch : width + launch,
      startY: rand(-height * 0.1, height * 0.45),
      endX: width / 2 + rand(-95, 95),
      endY: height / 2 + rand(-30, 110),
      delay: rand(0, MAX_STAGGER_MS),
      duration: rand(900, 1500),
      spin: rand(-720, 720),
      size: rand(7, 13),
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const x = useSharedValue(cfg.startX);
  const y = useSharedValue(cfg.startY);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const timing = { duration: cfg.duration };
    x.value = withDelay(
      cfg.delay,
      withTiming(cfg.endX, { ...timing, easing: Easing.out(Easing.cubic) }),
    );
    y.value = withDelay(
      cfg.delay,
      withTiming(cfg.endY, { ...timing, easing: Easing.in(Easing.quad) }),
    );
    rotate.value = withDelay(
      cfg.delay,
      withTiming(cfg.spin, { ...timing, easing: Easing.linear }),
    );
    opacity.value = withDelay(
      cfg.delay + cfg.duration - 300,
      withTiming(0, { duration: 300 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        { width: cfg.size * 0.7, height: cfg.size, backgroundColor: cfg.color },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // Not clipped: the confetti launches from off-screen and flies in past the
  // block's edges. The pieces are pointer-transparent and fade out on arrival.
  block: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    borderWidth: 4,
    borderColor: GOLD,
    borderRadius: 44,
    padding: 2,
  },
  piece: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 2,
  },
  amount: {
    fontSize: 22,
    color: SD.white,
    marginTop: 16,
  },
  note: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
});
