import { Ionicons } from "@expo/vector-icons";
import ChunkyButton from "@/components/ui/ChunkyButton";
import PopCard from "@/components/ui/PopCard";
import Typography from "@/components/ui/Typography";
import { mixHex, SD, SD_CATEGORY } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import type { MailCard, MailCardType } from "@/types/game";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

interface MailCardModalProps {
  mail: MailCard;
  onDismiss: () => void;
  onBuyInsurance?: () => void;
  isCancelledByInsurance?: boolean;
  /** Insurance only: premium affordable from cash + savings + loan combined. */
  canAffordInsurance?: boolean;
  /** Insurance only: the player already holds this coverage. */
  alreadyOwned?: boolean;
}

const TONES: Record<Exclude<MailCardType, "swellfare">, string> = {
  bill: SD.blue,
  ad: SD_CATEGORY.plain,
  lottery: SD.accent,
  insurance: SD.purple,
};

export default function MailCardModal({
  mail,
  onDismiss,
  onBuyInsurance,
  isCancelledByInsurance = false,
  canAffordInsurance = true,
  alreadyOwned = false,
}: MailCardModalProps) {
  const type = mail.type as Exclude<MailCardType, "swellfare">;
  const tone = TONES[type] ?? SD.blue;
  const { playMail } = useSound();

  useEffect(() => {
    playMail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eyebrow =
    type === "bill"
      ? "MAIL · BILL"
      : type === "ad"
        ? "MAIL · AD"
        : type === "lottery"
          ? "MAIL · LOTTERY TICKET"
          : "MAIL · INSURANCE";

  const insuranceNote = alreadyOwned
    ? "You already hold this coverage — one policy is all you need."
    : canAffordInsurance
      ? "Held for the rest of the game. New bills of the covered type get cancelled for free."
      : "You can't cover this premium — not even with savings or a full loan.";

  const note =
    type === "bill"
      ? isCancelledByInsurance
        ? "Your insurance covers this bill — it's cancelled, free of charge."
        : "Keep it until Pay Day, then pay."
      : type === "ad"
        ? "Junk mail — nothing happens. Straight to the bin."
        : type === "lottery"
          ? "Cash it in if you land on Lottery Draw this month. Expires when the month ends."
          : insuranceNote;

  return (
    <PopCard
      tone={tone}
      eyebrow={eyebrow}
      headerRight={<Ionicons name="mail" size={20} color={SD.white} />}
    >
      <Typography design="title" style={styles.title}>
        {mail.title}
      </Typography>
      <Typography design="body" weight={700} style={styles.sub}>
        {mail.description}
      </Typography>

      {type === "bill" && (
        <Typography
          design="money"
          style={[
            styles.amount,
            isCancelledByInsurance ? styles.amountCancelled : { color: SD.debt },
          ]}
        >
          -${Math.abs(mail.amount)}
        </Typography>
      )}
      {type === "lottery" && (
        <Typography design="money" style={[styles.amount, { color: SD.primary }]}>
          +${mail.amount}
        </Typography>
      )}
      {type === "insurance" && (
        <Typography design="money" style={[styles.amount, { color: SD.purple }]}>
          ${mail.amount} premium
        </Typography>
      )}

      <View
        style={[
          styles.noteBox,
          isCancelledByInsurance && type === "bill" && styles.noteBoxCancelled,
        ]}
      >
        <Typography
          design="body"
          weight={700}
          style={[
            styles.noteText,
            isCancelledByInsurance && type === "bill" && styles.noteTextCancelled,
          ]}
        >
          {note}
        </Typography>
      </View>

      {type === "insurance" ? (
        alreadyOwned ? (
          <ChunkyButton
            color={SD.surface2}
            depthColor="rgba(0,0,0,0.1)"
            depth={4}
            borderRadius={14}
            style={styles.singleButton}
            contentStyle={styles.buttonFace}
            onPress={onDismiss}
          >
            <Typography design="title" style={styles.neutralLabel}>
              I already have it
            </Typography>
          </ChunkyButton>
        ) : (
          <View style={styles.buttonRow}>
            <ChunkyButton
              color={SD.surface2}
              depthColor="rgba(0,0,0,0.1)"
              depth={4}
              borderRadius={14}
              style={styles.rowButton}
              contentStyle={styles.buttonFace}
              onPress={onDismiss}
            >
              <Typography design="title" style={styles.neutralLabel}>
                Discard
              </Typography>
            </ChunkyButton>
            <ChunkyButton
              color={SD.primary}
              depthColor={SD.primaryShadow}
              depth={4}
              borderRadius={14}
              disabled={!canAffordInsurance}
              style={styles.rowButton}
              contentStyle={styles.buttonFace}
              onPress={onBuyInsurance ?? onDismiss}
            >
              <Typography design="title" style={styles.primaryLabel}>
                Buy ${mail.amount}
              </Typography>
            </ChunkyButton>
          </View>
        )
      ) : (
        <ChunkyButton
          color={SD.primary}
          depthColor={SD.primaryShadow}
          depth={4}
          borderRadius={14}
          style={styles.singleButton}
          contentStyle={styles.buttonFace}
          onPress={onDismiss}
        >
          <Typography design="title" style={styles.primaryLabel}>
            {type === "bill"
              ? isCancelledByInsurance
                ? "Nice!"
                : "Add to my bills"
              : type === "ad"
                ? "Toss it"
                : "Keep the ticket"}
          </Typography>
        </ChunkyButton>
      )}
    </PopCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: SD.ink,
  },
  sub: {
    fontSize: 12,
    color: SD.soft,
    marginTop: 3,
  },
  amount: {
    fontSize: 28,
    marginTop: 12,
  },
  amountCancelled: {
    color: SD.soft,
    textDecorationLine: "line-through",
  },
  noteBox: {
    backgroundColor: SD.surface2,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 13,
    marginTop: 12,
  },
  noteBoxCancelled: {
    backgroundColor: mixHex(SD.primary, SD.surface, 0.85),
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
    color: SD.ink,
  },
  noteTextCancelled: {
    color: SD.primaryShadow,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 16,
  },
  rowButton: {
    flex: 1,
  },
  singleButton: {
    marginTop: 16,
  },
  buttonFace: {
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryLabel: {
    fontSize: 15,
    color: SD.white,
  },
  neutralLabel: {
    fontSize: 15,
    color: SD.ink,
  },
});
