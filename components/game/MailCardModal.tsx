import { COLORS } from "@/constants/colors";
import type { MailCard } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface MailCardModalProps {
  mail: MailCard;
  onDismiss: () => void;
}

export default function MailCardModal({ mail, onDismiss }: MailCardModalProps) {
  const isLottery = mail.type === "lottery";

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <View style={[styles.card, isLottery && styles.cardLottery]}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name={isLottery ? "ticket" : "mail"}
            size={20}
            color={isLottery ? "#F9A825" : "#1E88E5"}
          />
          <Text style={[styles.headerText, isLottery && styles.headerTextLottery]}>
            {isLottery ? "LOTTERY TICKET" : "MAIL"}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Title */}
        <Text style={styles.title}>{mail.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{mail.description}</Text>

        {/* Amount */}
        <View style={[styles.amountBox, isLottery ? styles.amountBoxLottery : styles.amountBoxMail]}>
          <Text style={styles.amountLabel}>{isLottery ? "COLLECT" : "AMOUNT"}</Text>
          <Text style={[styles.amountValue, isLottery ? styles.amountValueLottery : styles.amountValueMail]}>
            ${mail.amount}
          </Text>
        </View>

        {/* OK button */}
        <Pressable
          style={[styles.okButton, isLottery ? styles.okButtonLottery : styles.okButtonMail]}
          onPress={onDismiss}
        >
          <Text style={styles.okButtonText}>OK</Text>
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
    minWidth: 260,
    maxWidth: 320,
    borderWidth: 3,
    borderColor: "#1E88E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardLottery: {
    borderColor: "#F9A825",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: "BlueWinter",
    fontSize: 16,
    color: "#1E88E5",
    letterSpacing: 1,
  },
  headerTextLottery: {
    color: "#F9A825",
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
  okButtonText: {
    fontFamily: "BlueWinter",
    fontSize: 16,
    color: COLORS.white,
  },
});
