import { COLORS } from "@/constants/colors";
import type { EventMessage } from "@/types/game";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface EventToastProps {
  event: EventMessage;
  onDismiss: () => void;
}

export default function EventToast({ event, onDismiss }: EventToastProps) {
  const isGain = event.amount >= 0;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <View style={[styles.card, isGain ? styles.cardGain : styles.cardLoss]}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={[styles.amount, isGain ? styles.amountGain : styles.amountLoss]}>
          {isGain ? "+" : "-"}${Math.abs(event.amount)}
        </Text>
        <Pressable style={styles.button} onPress={onDismiss}>
          <Text style={styles.buttonText}>OK</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    minWidth: 240,
    maxWidth: 300,
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGain: {
    borderColor: "#43A047",
  },
  cardLoss: {
    borderColor: "#E53935",
  },
  title: {
    fontFamily: "BlueWinter",
    fontSize: 22,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#616161",
    textAlign: "center",
    marginBottom: 12,
  },
  amount: {
    fontFamily: "BlueWinter",
    fontSize: 32,
    marginBottom: 16,
  },
  amountGain: {
    color: "#2E7D32",
  },
  amountLoss: {
    color: "#C62828",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryBorder,
  },
  buttonText: {
    fontFamily: "BlueWinter",
    fontSize: 16,
    color: COLORS.white,
  },
});
