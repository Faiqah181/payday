import { COLORS } from "@/constants/colors";
import type { DealCard, HeldLotteryTicket, MailCard } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const MODAL_MAX_HEIGHT = Dimensions.get("window").height * 0.65;

interface DealsViewerProps {
  deals: DealCard[];
  lotteryTickets?: HeldLotteryTicket[];
  unpaidBills?: MailCard[];
  insurance?: MailCard[];
  onClose: () => void;
  mode?: "view" | "sell";
  onSell?: (deal: DealCard) => void;
  defaultTab?: "deals" | "mail";
}

export default function DealsViewer({
  deals,
  lotteryTickets = [],
  unpaidBills = [],
  insurance = [],
  onClose,
  mode = "view",
  onSell,
  defaultTab = "deals",
}: DealsViewerProps) {
  const isSellMode = mode === "sell";
  const [activeTab, setActiveTab] = useState<"deals" | "mail">(defaultTab);
  const mailCount = lotteryTickets.length + unpaidBills.length + insurance.length;

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
            {isSellMode ? "Sell a Deal" : "Your Cards"}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={22} color={COLORS.textDark} />
          </Pressable>
        </View>

        {/* Tabs (hidden in sell mode) */}
        {!isSellMode && (
          <View style={styles.tabBar}>
            <Pressable
              style={[styles.tab, activeTab === "deals" && styles.tabActive]}
              onPress={() => setActiveTab("deals")}
            >
              <Ionicons name="briefcase" size={14} color={activeTab === "deals" ? "#7B1FA2" : "#9E9E9E"} />
              <Text style={[styles.tabText, activeTab === "deals" && styles.tabTextActive]}>
                Deals ({deals.length})
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === "mail" && styles.tabActiveMail]}
              onPress={() => setActiveTab("mail")}
            >
              <Ionicons name="mail" size={14} color={activeTab === "mail" ? "#1E88E5" : "#9E9E9E"} />
              <Text style={[styles.tabText, activeTab === "mail" && styles.tabTextActiveMail]}>
                Mail ({mailCount})
              </Text>
            </Pressable>
          </View>
        )}

        {/* Content */}
        {(isSellMode || activeTab === "deals") ? (
          // Deals tab
          deals.length === 0 ? (
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
          )
        ) : (
          // Mail tab
          mailCount === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-outline" size={48} color="#BDBDBD" />
              <Text style={styles.emptyText}>No mail cards</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {lotteryTickets.map((ticket) => (
                <View key={`lottery-${ticket.card.id}`} style={styles.mailCard}>
                  <View style={styles.mailCardHeader}>
                    <Ionicons name="ticket" size={16} color="#F9A825" />
                    <Text style={styles.mailCardTitle}>{ticket.card.title}</Text>
                    <View style={styles.monthBadge}>
                      <Text style={styles.monthBadgeText}>Month {ticket.monthReceived}</Text>
                    </View>
                  </View>
                  <Text style={styles.mailCardAmount}>Collect ${ticket.card.amount}</Text>
                </View>
              ))}
              {unpaidBills.map((bill, idx) => (
                <View key={`bill-${bill.id}-${idx}`} style={styles.billCard}>
                  <View style={styles.mailCardHeader}>
                    <Ionicons name="receipt" size={16} color="#E53935" />
                    <Text style={styles.mailCardTitle}>{bill.title}</Text>
                  </View>
                  <Text style={styles.billAmount}>${bill.amount}</Text>
                </View>
              ))}
              {insurance.map((ins, idx) => (
                <View key={`ins-${ins.id}-${idx}`} style={styles.insuranceCard}>
                  <View style={styles.mailCardHeader}>
                    <Ionicons name="shield" size={16} color="#43A047" />
                    <Text style={styles.mailCardTitle}>{ins.title}</Text>
                  </View>
                  <Text style={styles.insuranceCoverage}>
                    {ins.cancelsCategories?.includes("auto") ? "Covers: Auto Repair" : "Covers: Doctor & Dentist"}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )
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
  modalSell: {
    borderColor: "#8E24AA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#7B1FA2",
  },
  tabActiveMail: {
    borderBottomColor: "#1E88E5",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9E9E9E",
  },
  tabTextActive: {
    color: "#7B1FA2",
  },
  tabTextActiveMail: {
    color: "#1E88E5",
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
  // Deal cards
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
  // Mail cards
  mailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#F9A825",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  mailCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  mailCardTitle: {
    fontFamily: "BlueWinter",
    fontSize: 16,
    color: COLORS.textDark,
    flex: 1,
  },
  monthBadge: {
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  monthBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#F57F17",
  },
  mailCardAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F57F17",
  },
  billCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#E53935",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  billAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C62828",
  },
  insuranceCard: {
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
  insuranceCoverage: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
  },
});
