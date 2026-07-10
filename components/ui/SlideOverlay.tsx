import { SD_LAYER } from "@/constants/theme";
import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const OPEN_MS = 280;
const OPEN_EASING = Easing.bezier(0.2, 0.8, 0.3, 1);
const CLOSE_MS = 220;

export interface SlideOverlayHandle {
  /** Play the slide-out animation, then fire onClose. */
  close: () => void;
}

interface SlideOverlayProps {
  onClose: () => void;
  children: ReactNode;
  /** Which screen edge the overlay slides in from. */
  from?: "right" | "left";
}

/** Full-screen overlay that slides in from a screen edge, like a pushed screen. */
const SlideOverlay = forwardRef<SlideOverlayHandle, SlideOverlayProps>(
  function SlideOverlay({ onClose, children, from = "right" }, ref) {
    const { width: winW } = useWindowDimensions();
    const progress = useSharedValue(0);
    const closing = useRef(false);

    useEffect(() => {
      progress.value = withTiming(1, { duration: OPEN_MS, easing: OPEN_EASING });
    }, [progress]);

    const close = () => {
      if (closing.current) return;
      closing.current = true;
      progress.value = withTiming(0, { duration: CLOSE_MS });
      setTimeout(onClose, CLOSE_MS + 10);
    };

    useImperativeHandle(ref, () => ({ close }));

    const offscreen = from === "right" ? winW : -winW;
    const slideStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: (1 - progress.value) * offscreen }],
    }));

    return (
      <Animated.View style={[styles.overlay, slideStyle]}>{children}</Animated.View>
    );
  },
);

export default SlideOverlay;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: SD_LAYER.screenOverlay,
  },
});
