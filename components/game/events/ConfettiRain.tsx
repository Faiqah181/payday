import { memo, useEffect, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const COLORS = [
  "#F4D03F",
  "#FF9B8E",
  "#7EC8E3",
  "#A5E6B0",
  "#FFFFFF",
  "#C9A0FF",
];
const PIECE_COUNT = 40;
/** A fresh shower falls this often, forever. */
const SHOT_INTERVAL_MS = 2000;
/** How long a wave's pieces stay mounted before removal (max fall + fade). */
const WAVE_LIFETIME_MS = 3200;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Full-screen celebratory confetti that keeps raining in 1s bursts. */
export default function ConfettiRain() {
  const { width, height } = useWindowDimensions();
  const [waves, setWaves] = useState<number[]>([]);

  useEffect(() => {
    let id = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const fire = () => {
      const waveId = id++;
      setWaves((w) => [...w, waveId]);
      timeouts.push(
        setTimeout(
          () => setWaves((w) => w.filter((x) => x !== waveId)),
          WAVE_LIFETIME_MS,
        ),
      );
    };
    fire();
    const interval = setInterval(fire, SHOT_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {waves.flatMap((waveId) =>
        Array.from({ length: PIECE_COUNT }, (_, i) => (
          <FallingPiece
            key={`${waveId}-${i}`}
            index={i}
            width={width}
            height={height}
          />
        )),
      )}
    </View>
  );
}

const FallingPiece = memo(function FallingPiece({
  index,
  width,
  height,
}: {
  index: number;
  width: number;
  height: number;
}) {
  const cfg = useMemo(() => {
    const startX = rand(0, width);
    return {
      startX,
      endX: startX + rand(-60, 60),
      startY: -rand(20, 120),
      endY: height + 40,
      delay: rand(0, 400),
      duration: rand(1800, 2800),
      spin: rand(-720, 720),
      size: rand(7, 13),
      color: COLORS[index % COLORS.length],
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
      withTiming(cfg.endX, { ...timing, easing: Easing.inOut(Easing.quad) }),
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
      cfg.delay + cfg.duration - 400,
      withTiming(0, { duration: 400 }),
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
});

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 2,
  },
});
