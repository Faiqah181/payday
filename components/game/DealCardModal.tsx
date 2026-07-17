import ChunkyButton from "@/components/ui/ChunkyButton";
import PopCard from "@/components/ui/PopCard";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import type { DealCard } from "@/types/game";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

interface DealCardModalProps {
  deal: DealCard;
  /** Affordable from cash + savings + loan combined. */
  canAfford: boolean;
  onBuy: () => void;
  onDiscard: () => void;
}

export default function DealCardModal({
  deal,
  canAfford,
  onBuy,
  onDiscard,
}: DealCardModalProps) {
  const { playDealOffer } = useSound();

  useEffect(() => {
    playDealOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PopCard tone={SD.purple} eyebrow="DEAL CARD">
      <Typography design="title" style={styles.title}>
        {deal.title}
      </Typography>
      <Typography design="body" weight={700} style={styles.sub}>
        {deal.description}
      </Typography>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Typography design="body" weight={800} style={styles.statLabel}>
            COST
          </Typography>
          <Typography design="money" style={[styles.statValue, { color: SD.debt }]}>
            ${deal.buyPrice}
          </Typography>
        </View>
        <View style={styles.statBox}>
          <Typography design="body" weight={800} style={styles.statLabel}>
            VALUE
          </Typography>
          <Typography design="money" style={[styles.statValue, { color: SD.primary }]}>
            ${deal.sellPrice}
          </Typography>
        </View>
      </View>

      <Typography design="body" weight={700} style={styles.note}>
        {canAfford
          ? `Hold it, cash in at a Buyer space. Commission $${deal.commission} — highest roller takes it.`
          : "You can't cover this — not even with savings or a full loan."}
      </Typography>

      <View style={styles.buttonRow}>
        <ChunkyButton
          color={SD.surface2}
          depthColor="rgba(0,0,0,0.1)"
          depth={4}
          borderRadius={14}
          style={styles.rowButton}
          contentStyle={styles.buttonFace}
          onPress={onDiscard}
        >
          <Typography design="title" style={styles.passLabel}>
            Pass
          </Typography>
        </ChunkyButton>
        <ChunkyButton
          color={SD.primary}
          depthColor={SD.primaryShadow}
          depth={4}
          borderRadius={14}
          disabled={!canAfford}
          style={styles.rowButton}
          contentStyle={styles.buttonFace}
          onPress={onBuy}
        >
          <Typography design="title" style={styles.buyLabel}>
            Buy
          </Typography>
        </ChunkyButton>
      </View>
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
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: SD.surface2,
    borderRadius: 13,
    padding: 11,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    color: SD.soft,
  },
  statValue: {
    fontSize: 17,
  },
  note: {
    fontSize: 11,
    lineHeight: 16,
    color: SD.soft,
    marginTop: 12,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 16,
  },
  rowButton: {
    flex: 1,
  },
  buttonFace: {
    paddingVertical: 14,
    alignItems: "center",
  },
  passLabel: {
    fontSize: 15,
    color: SD.ink,
  },
  buyLabel: {
    fontSize: 15,
    color: SD.white,
  },
});
