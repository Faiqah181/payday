import ChunkyButton from "@/components/ui/ChunkyButton";
import PopCard from "@/components/ui/PopCard";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export interface CardItemStat {
  label: string;
  value: string;
  color: string;
}

interface CardItemModalProps {
  tone: string;
  eyebrow: string;
  title: string;
  sub: string;
  amount?: { text: string; color: string };
  stats?: CardItemStat[];
  note?: string;
  onClose: () => void;
}

/** Centered pop-up card showing one held item (bill, deal, ticket…). */
export default function CardItemModal({
  tone,
  eyebrow,
  title,
  sub,
  amount,
  stats,
  note,
  onClose,
}: CardItemModalProps) {
  return (
    <PopCard tone={tone} eyebrow={eyebrow} onBackdropPress={onClose}>
      <Typography design="title" style={styles.title}>
        {title}
      </Typography>
      <Typography design="body" weight={700} style={styles.sub}>
        {sub}
      </Typography>
      {amount && (
        <Typography design="money" style={[styles.amount, { color: amount.color }]}>
          {amount.text}
        </Typography>
      )}
      {stats && (
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statBox}>
              <Typography design="body" weight={800} style={styles.statLabel}>
                {stat.label}
              </Typography>
              <Typography
                design="money"
                style={[styles.statValue, { color: stat.color }]}
              >
                {stat.value}
              </Typography>
            </View>
          ))}
        </View>
      )}
      {note && (
        <View style={styles.noteBox}>
          <Typography design="body" weight={700} style={styles.noteText}>
            {note}
          </Typography>
        </View>
      )}
      <ChunkyButton
        color={SD.primary}
        depthColor={SD.primaryShadow}
        depth={4}
        borderRadius={13}
        style={styles.action}
        contentStyle={styles.actionFace}
        onPress={onClose}
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
    color: SD.soft,
    marginTop: 3,
  },
  amount: {
    fontSize: 26,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 13,
  },
  statBox: {
    flex: 1,
    backgroundColor: SD.surface2,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    color: SD.soft,
  },
  statValue: {
    fontSize: 15,
  },
  noteBox: {
    backgroundColor: SD.surface2,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 13,
    marginTop: 12,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
    color: SD.ink,
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
