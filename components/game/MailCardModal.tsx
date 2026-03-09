import { COLORS } from "@/constants/colors";
import type { MailCard } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface MailCardModalProps {
  mail: MailCard;
  onDismiss: () => void;
  onBuyInsurance?: () => void;
  isCancelledByInsurance?: boolean;
}

export default function MailCardModal({ mail, onDismiss, onBuyInsurance, isCancelledByInsurance }: MailCardModalProps) {
  const isLottery = mail.type === "lottery";
  const isAd = mail.type === "ad";
  const isBill = mail.type === "bill";
  const isInsurance = mail.type === "insurance";

  const borderColor = isAd ? "#B0BEC5" : isLottery ? "#F9A825" : isInsurance ? "#8E24AA" : "#1E88E5";
  const headerColor = isAd ? "#78909C" : isLottery ? "#F9A825" : isInsurance ? "#8E24AA" : "#1E88E5";
  const headerIcon = isAd ? "megaphone" : isLottery ? "ticket" : isInsurance ? "shield" : isBill ? "receipt" : "mail";
  const headerLabel = isAd ? "ADVERTISEMENT" : isLottery ? "LOTTERY TICKET" : isInsurance ? "INSURANCE" : isBill ? "BILL" : "MAIL";

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <View style={[styles.card, { borderColor }]}>
        {/* Close button for ads */}
        {isAd && (
          <Pressable onPress={onDismiss} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#757575" />
          </Pressable>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name={headerIcon as any} size={20} color={headerColor} />
          <Text style={[styles.headerText, { color: headerColor }]}>
            {headerLabel}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Title */}
        <Text style={styles.title}>{isAd ? `Buy ${mail.title}` : mail.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{mail.description}</Text>

        {/* Amount (hidden for ads) */}
        {!isAd && (
          <View style={[
            styles.amountBox,
            isLottery && styles.amountBoxLottery,
            isBill && styles.amountBoxBill,
            isInsurance && styles.amountBoxInsurance,
            !isLottery && !isBill && !isInsurance && styles.amountBoxMail,
          ]}>
            <Text style={styles.amountLabel}>
              {isLottery ? "COLLECT" : isInsurance ? "PREMIUM" : "PAY BILL"}
            </Text>
            <Text style={[
              styles.amountValue,
              isLottery && styles.amountValueLottery,
              isBill && styles.amountValueBill,
              isInsurance && styles.amountValueInsurance,
              !isLottery && !isBill && !isInsurance && styles.amountValueMail,
            ]}>
              ${mail.amount}
            </Text>
          </View>
        )}

        {/* Bill: cancelled by insurance note */}
        {isBill && isCancelledByInsurance && (
          <View style={styles.cancelledNote}>
            <Ionicons name="shield-checkmark" size={16} color="#2E7D32" />
            <Text style={styles.cancelledNoteText}>Cancelled by Insurance!</Text>
          </View>
        )}

        {/* Bill: will be paid on salary day note */}
        {isBill && !isCancelledByInsurance && (
          <View style={styles.billNote}>
            <Ionicons name="time" size={14} color="#78909C" />
            <Text style={styles.billNoteText}>This bill will be paid on Salary Day.</Text>
          </View>
        )}

        {/* Ad dismiss note */}
        {isAd && (
          <View style={styles.adNote}>
            <Ionicons name="information-circle" size={14} color="#90A4AE" />
            <Text style={styles.adNoteText}>No action needed — this card is discarded.</Text>
          </View>
        )}

        {/* Insurance: Buy / Discard buttons */}
        {isInsurance ? (
          <View style={styles.insuranceButtons}>
            <Pressable style={styles.discardButton} onPress={onDismiss}>
              <Text style={styles.discardButtonText}>Discard</Text>
            </Pressable>
            <Pressable style={styles.buyButton} onPress={onBuyInsurance}>
              <Ionicons name="shield" size={16} color={COLORS.white} />
              <Text style={styles.buyButtonText}>Buy ${mail.amount}</Text>
            </Pressable>
          </View>
        ) : !isAd ? (
          /* OK button for lottery, bill, other */
          <Pressable
            style={[
              styles.okButton,
              isLottery && styles.okButtonLottery,
              isBill && styles.okButtonBill,
              !isLottery && !isBill && styles.okButtonMail,
            ]}
            onPress={onDismiss}
          >
            <Text style={styles.okButtonText}>OK</Text>
          </Pressable>
        ) : null}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ECEFF1",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: "BlueWinter",
    fontSize: 16,
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
  amountBox: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  amountBoxLottery: {
    backgroundColor: "#FFF8E1",
  },
  amountBoxMail: {
    backgroundColor: "#E3F2FD",
  },
  amountBoxBill: {
    backgroundColor: "#FFEBEE",
  },
  amountBoxInsurance: {
    backgroundColor: "#F3E5F5",
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9E9E9E",
    letterSpacing: 1,
    marginBottom: 4,
  },
  amountValue: {
    fontFamily: "BlueWinter",
    fontSize: 28,
  },
  amountValueLottery: {
    color: "#F57F17",
  },
  amountValueMail: {
    color: "#1565C0",
  },
  amountValueBill: {
    color: "#C62828",
  },
  amountValueInsurance: {
    color: "#6A1B9A",
  },
  // Notes
  cancelledNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  cancelledNoteText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
  },
  billNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECEFF1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  billNoteText: {
    fontSize: 12,
    color: "#78909C",
    fontWeight: "600",
  },
  adNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECEFF1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  adNoteText: {
    fontSize: 12,
    color: "#78909C",
    fontWeight: "600",
  },
  // Buttons
  okButton: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    borderBottomWidth: 3,
  },
  okButtonMail: {
    backgroundColor: "#1E88E5",
    borderBottomColor: "#1565C0",
  },
  okButtonLottery: {
    backgroundColor: "#F9A825",
    borderBottomColor: "#F57F17",
  },
  okButtonBill: {
    backgroundColor: "#1E88E5",
    borderBottomColor: "#1565C0",
  },
  okButtonText: {
    fontFamily: "BlueWinter",
    fontSize: 16,
    color: COLORS.white,
  },
  insuranceButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  discardButton: {
    flex: 1,
    backgroundColor: "#ECEFF1",
    paddingVertical: 14,
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
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: "#2E7D32",
  },
  buyButtonText: {
    fontFamily: "BlueWinter",
    fontSize: 14,
    color: COLORS.white,
  },
});
