import { COLORS } from "@/constants/colors";
import type { DealCard } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface DealCardModalProps {
  deal: DealCard;
  onBuy: () => void;
  onDiscard: () => void;
}

export default function DealCardModal({ deal, onBuy, onDiscard }: DealCardModalProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="briefcase" size={20} color="#43A047" />
          <Text style={styles.headerText}>DEAL CARD</Text>
        </View>

        <View style={styles.divider} />

        {/* Title */}
        <Text style={styles.title}>{deal.title}</Text>

        {/* Flavor text */}
        <Text style={styles.description}>{deal.description}</Text>

        {/* Price boxes */}
        <View style={styles.priceRow}>
          <View style={[styles.priceBox, styles.costBox]}>
            <Text style={styles.priceLabel}>COST</Text>
            <Text style={[styles.priceValue, styles.costValue]}>${deal.buyPrice}</Text>
          </View>
          <View style={[styles.priceBox, styles.valueBox]}>
            <Text style={styles.priceLabel}>VALUE</Text>
            <Text style={[styles.priceValue, styles.valueValue]}>${deal.sellPrice}</Text>
          </View>
        </View>

        {/* Commission */}
        <Text style={styles.commission}>Commission: ${deal.commission}</Text>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.discardButton} onPress={onDiscard}>
            <Text style={styles.discardButtonText}>Discard</Text>
          </Pressable>
          <Pressable style={styles.buyButton} onPress={onBuy}>
            <Ionicons name="cart" size={18} color={COLORS.white} style={styles.buyIcon} />
            <Text style={styles.buyButtonText}>Buy Deal</Text>
          </Pressable>
        </View>
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
    minWidth: 260,
    maxWidth: 320,
    borderWidth: 3,
    borderColor: "#43A047",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: "BlueWinter",
    fontSize: 16,
    color: "#43A047",
    letterSpacing: 1,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  title: {
    fontFamily: "BlueWinter",
    fontSize: 24,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#616161",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  priceBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  costBox: {
    backgroundColor: "#FFEBEE",
  },
  valueBox: {
    backgroundColor: "#E8F5E9",
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9E9E9E",
    letterSpacing: 1,
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: "BlueWinter",
    fontSize: 22,
  },
  costValue: {
    color: "#C62828",
  },
  valueValue: {
    color: "#2E7D32",
  },
  commission: {
    fontSize: 12,
    color: "#9E9E9E",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  discardButton: {
    flex: 1,
    backgroundColor: "#ECEFF1",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#B0BEC5",
  },
  discardButtonText: {
    fontFamily: "BlueWinter",
    fontSize: 14,
    color: "#546E7A",
  },
  buyButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#43A047",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#2E7D32",
  },
  buyIcon: {
    marginRight: 6,
  },
  buyButtonText: {
    fontFamily: "BlueWinter",
    fontSize: 14,
    color: COLORS.white,
  },
});
