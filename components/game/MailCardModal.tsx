import ChunkyButton from "@/components/ui/ChunkyButton";
import PopCard from "@/components/ui/PopCard";
import Typography from "@/components/ui/Typography";
import { mixHex, SD, SD_CATEGORY } from "@/constants/theme";
import type { MailCard, MailCardType } from "@/types/game";
import { StyleSheet, View } from "react-native";

interface MailCardModalProps {
  mail: MailCard;
  onDismiss: () => void;
  onBuyInsurance?: () => void;
  isCancelledByInsurance?: boolean;
}

const TONES: Record<Exclude<MailCardType, "swellfare">, string> = {
  bill: SD.blue,
  ad: SD_CATEGORY.plain,
  lottery: SD.accent,
  insurance: SD.purple,
};

function EnvelopeGlyph() {
  return (
    <View style={styles.envelope}>
      <View style={styles.envelopeFlap} />
    </View>
  );
}

export default function MailCardModal({
  mail,
  onDismiss,
  onBuyInsurance,
  isCancelledByInsurance = false,
}: MailCardModalProps) {
  const type = mail.type as Exclude<MailCardType, "swellfare">;
  const tone = TONES[type] ?? SD.blue;

  const eyebrow =
    type === "bill"
      ? "MAIL · BILL"
      : type === "ad"
        ? "MAIL · AD"
        : type === "lottery"
          ? "MAIL · LOTTERY TICKET"
          : "MAIL · INSURANCE";

  const note =
    type === "bill"
      ? isCancelledByInsurance
        ? "Your insurance covers this bill — it's cancelled, free of charge."
        : "Keep it until Pay Day, then pay."
      : type === "ad"
        ? "Junk mail — nothing happens. Straight to the bin."
        : type === "lottery"
          ? "Cash it in if you land on Lottery Draw this month. Expires when the month ends."
          : "Held for the rest of the game. New bills of the covered type get cancelled for free.";

  return (
    <PopCard tone={tone} eyebrow={eyebrow} headerRight={<EnvelopeGlyph />}>
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
            style={styles.rowButton}
            contentStyle={styles.buttonFace}
            onPress={onBuyInsurance ?? onDismiss}
          >
            <Typography design="title" style={styles.primaryLabel}>
              Buy ${mail.amount}
            </Typography>
          </ChunkyButton>
        </View>
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
  envelope: {
    width: 26,
    height: 19,
    borderRadius: 3,
    backgroundColor: SD.white,
    overflow: "hidden",
  },
  envelopeFlap: {
    position: "absolute",
    top: -6,
    alignSelf: "center",
    width: 22,
    height: 22,
    backgroundColor: "rgba(0,0,0,0.2)",
    transform: [{ rotate: "45deg" }],
  },
});
