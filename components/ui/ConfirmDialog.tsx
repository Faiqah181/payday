import ChunkyButton from "@/components/ui/ChunkyButton";
import Typography from "@/components/ui/Typography";
import { mixHex, SD, SD_LAYER } from "@/constants/theme";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: string;
  glyph?: string;
}

export default function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  tone = SD.debt,
  glyph = "!",
}: ConfirmDialogProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 260,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    });
  }, [progress]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, progress.value),
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, progress.value),
    transform: [{ scale: 0.86 + progress.value * 0.14 }],
  }));

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </Pressable>
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={[styles.iconCircle, { backgroundColor: mixHex(tone, SD.surface, 0.85) }]}>
          <Typography design="title" style={[styles.iconGlyph, { color: tone }]}>
            {glyph}
          </Typography>
        </View>
        <Typography design="title" style={styles.title}>
          {title}
        </Typography>
        <Typography design="body" weight={700} style={styles.body}>
          {body}
        </Typography>
        <View style={styles.buttons}>
          <ChunkyButton
            color={tone}
            depthColor={mixHex(tone, "#000000", 0.3)}
            depth={4}
            borderRadius={14}
            contentStyle={styles.buttonFace}
            onPress={onConfirm}
          >
            <Typography design="title" style={styles.confirmLabel}>
              {confirmLabel}
            </Typography>
          </ChunkyButton>
          <ChunkyButton
            color={SD.surface2}
            depthColor="rgba(0,0,0,0.08)"
            depth={3}
            borderRadius={14}
            contentStyle={styles.buttonFace}
            onPress={onCancel}
          >
            <Typography design="title" style={styles.cancelLabel}>
              {cancelLabel}
            </Typography>
          </ChunkyButton>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: SD_LAYER.dialog,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,14,6,0.55)",
  },
  card: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: SD.surface,
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 50,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlyph: {
    fontSize: 26,
    lineHeight: 32,
  },
  title: {
    fontSize: 21,
    color: SD.ink,
    textAlign: "center",
    marginTop: 13,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: SD.soft,
    textAlign: "center",
    marginTop: 5,
  },
  buttons: {
    gap: 9,
    marginTop: 18,
  },
  buttonFace: {
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmLabel: {
    fontSize: 15,
    color: SD.white,
  },
  cancelLabel: {
    fontSize: 15,
    color: SD.ink,
  },
});
