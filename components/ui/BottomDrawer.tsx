import { SD, SD_LAYER } from "@/constants/theme";
import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const OPEN_MS = 280;
const OPEN_EASING = Easing.bezier(0.2, 0.8, 0.3, 1);
const CLOSE_MS = 220;

// Drag behavior: pull down past this (or fling) to dismiss; overshoot
// upward is rubber-banded and springs back.
const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 900;
const MAX_OVERSHOOT_UP = 50;
const UP_RESISTANCE = 4;
const SPRING_BACK = { damping: 22, stiffness: 380 };

export interface BottomDrawerHandle {
  /** Play the close animation, then fire onClose. */
  close: () => void;
}

interface BottomDrawerProps {
  onClose: () => void;
  children: ReactNode;
  maxHeightRatio?: number;
}

/**
 * Design-system bottom sheet: dark backdrop, surface sheet with 26px top
 * radius sliding up. Draggable from its header zone — pull down to dismiss,
 * slight pull up springs back. Render conditionally; call `close()` on the
 * ref (or tap the backdrop) to dismiss with the exit animation.
 */
const BottomDrawer = forwardRef<BottomDrawerHandle, BottomDrawerProps>(
  function BottomDrawer({ onClose, children, maxHeightRatio = 0.78 }, ref) {
    const { height: winH } = useWindowDimensions();
    const progress = useSharedValue(0);
    const dragY = useSharedValue(0);
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

    const drag = Gesture.Pan()
      .onChange((e) => {
        dragY.value =
          e.translationY >= 0
            ? e.translationY
            : Math.max(-MAX_OVERSHOOT_UP, e.translationY / UP_RESISTANCE);
      })
      .onEnd((e) => {
        if (dragY.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
          runOnJS(close)();
        } else {
          dragY.value = withSpring(0, SPRING_BACK);
        }
      });

    const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
    const sheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: (1 - progress.value) * winH + dragY.value }],
    }));

    return (
      <Animated.View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </Pressable>
        <Animated.View
          style={[
            styles.sheet,
            { maxHeight: winH * maxHeightRatio + MAX_OVERSHOOT_UP },
            sheetStyle,
          ]}
        >
          {children}
          <GestureDetector gesture={drag}>
            <View style={styles.grabZone} />
          </GestureDetector>
        </Animated.View>
      </Animated.View>
    );
  },
);

export default BottomDrawer;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: SD_LAYER.drawer,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,16,10,0.55)",
  },
  sheet: {
    backgroundColor: SD.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
    // Extend below the screen edge so pulling the sheet up never
    // reveals a gap underneath it.
    marginBottom: -MAX_OVERSHOOT_UP,
    paddingBottom: MAX_OVERSHOOT_UP,
  },
  grabZone: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
  },
});
