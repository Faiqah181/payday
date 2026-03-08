import { COLORS } from "@/constants/colors";
import type { DealCard } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const MODAL_MAX_HEIGHT = Dimensions.get("window").height * 0.65;

interface DealsViewerProps {
  deals: DealCard[];
  onClose: () => void;
  mode?: "view" | "sell";
  onSell?: (deal: DealCard) => void;
}

export default function DealsViewer({ deals, onClose, mode = "view", onSell }: DealsViewerProps) {
  const isSellMode = mode === "sell";
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <View style={[styles.modal, isSellMode && styles.modalSell]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isSellMode ? "Sell a Deal" : `Your Deals (${deals.length})`}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={22} color={COLORS.textDark} />
          </Pressable>
        </View>

        {deals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>No deals yet</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {deals.map((deal) => (
              <View key={deal.id} style={styles.dealCard}>
                <View style={styles.dealHeader}>
                  <Ionicons name="briefcase" size={16} color="#43A047" />
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                </View>
                <Text style={styles.dealDescription}>{deal.description}</Text>
                <View style={styles.dealPrices}>
                  <Text style={styles.costText}>Cost: ${deal.buyPrice}</Text>
                  <Text style={styles.valueText}>Value: ${deal.sellPrice}</Text>
                </View>
                <Text style={styles.commissionText}>Commission: ${deal.commission}</Text>
                {isSellMode && onSell && (
                  <Pressable style={styles.sellButton} onPress={() => onSell(deal)}>
                    <Ionicons name="cart" size={16} color={COLORS.white} />
                    <Text style={styles.sellButtonText}>Sell ${deal.sellPrice}</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </ScrollView>
        )}
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
  modal: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    width: "90%",
    maxHeight: MODAL_MAX_HEIGHT,
    borderWidth: 3,
    borderColor: "#7B1FA2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  headerTitle: {
    fontFamily: "BlueWinter",
    fontSize: 20,
    color: COLORS.textDark,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ECEFF1",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#9E9E9E",
    fontWeight: "600",
  },
  scrollContent: {
    padding: 12,
    gap: 10,
    paddingBottom: 20,
  },
  dealCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#43A047",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  dealHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  dealTitle: {
    fontFamily: "BlueWinter",
    fontSize: 16,
    color: COLORS.textDark,
    flex: 1,
  },
  dealDescription: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#757575",
    marginBottom: 8,
    lineHeight: 18,
  },
  dealPrices: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 4,
  },
  costText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#C62828",
  },
  valueText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
  },
  commissionText: {
    fontSize: 11,
    color: "#9E9E9E",
  },
  modalSell: {
    borderColor: "#8E24AA",
  },
  sellButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#43A047",
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#2E7D32",
  },
  sellButtonText: {
    fontFamily: "BlueWinter",
    fontSize: 14,
    color: COLORS.white,
  },
});
