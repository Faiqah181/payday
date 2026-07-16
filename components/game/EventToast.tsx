import ChunkyButton from "@/components/ui/ChunkyButton";
import PopCard from "@/components/ui/PopCard";
import Typography from "@/components/ui/Typography";
import { SD, SD_CATEGORY } from "@/constants/theme";
import type { EventMessage } from "@/types/game";
import { StyleSheet } from "react-native";

interface EventToastProps {
  event: EventMessage;
  /** Settles the event's cash change (and plays the coin sound with it). */
  onDismiss: () => void;
}

export default function EventToast({ event, onDismiss }: EventToastProps) {
  const tone =
    event.amount > 0
      ? SD.primary
      : event.amount < 0
        ? SD.debt
        : SD_CATEGORY.plain;

  return (
    <PopCard tone={tone} eyebrow="EVENT" onBackdropPress={onDismiss}>
      <Typography design="title" style={styles.title}>
        {event.title}
      </Typography>
      <Typography design="body" weight={700} style={styles.sub}>
        {event.description}
      </Typography>
      {event.amount !== 0 && (
        <Typography
          design="money"
          style={[
            styles.amount,
            { color: event.amount > 0 ? SD.primary : SD.debt },
          ]}
        >
          {event.amount > 0 ? "+" : "-"}${Math.abs(event.amount)}
        </Typography>
      )}
      <ChunkyButton
        color={SD.primary}
        depthColor={SD.primaryShadow}
        depth={4}
        borderRadius={13}
        style={styles.action}
        contentStyle={styles.actionFace}
        onPress={onDismiss}
      >
        <Typography design="title" style={styles.actionLabel}>
          Got it
        </Typography>
      </ChunkyButton>
    </PopCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: SD.ink,
  },
  sub: {
    fontSize: 12,
    lineHeight: 18,
    color: SD.soft,
    marginTop: 3,
  },
  amount: {
    fontSize: 28,
    marginTop: 10,
  },
  action: {
    marginTop: 14,
  },
  actionFace: {
    paddingVertical: 14,
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 15,
    color: SD.white,
  },
});
