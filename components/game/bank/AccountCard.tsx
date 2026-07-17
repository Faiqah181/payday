import AnimatedCash from "@/components/ui/AnimatedCash";
import Typography from "@/components/ui/Typography";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { mixHex, SD } from "@/constants/theme";
import type { Player } from "@/types/game";
import { getAccountStatus } from "@/types/game";
import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

/** The big colored balance card: green savings, red loan, brown neutral. */
export default function AccountCard({ player }: { player: Player }) {
  const state = getAccountStatus(player);
  const cardColor =
    state === "neutral" ? SD.soft : state === "savings" ? SD.primary : SD.debt;
  const balance = state === "savings" ? player.savingsBalance : player.loanBalance;
  const interestPct =
    state === "savings"
      ? GAME_CONFIG.savingsInterestPercentage
      : GAME_CONFIG.interestPercentage;
  const interest = Math.round((balance * interestPct) / 100);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: cardColor, shadowColor: mixHex(cardColor, "#000000", 0.3) },
      ]}
    >
      <View style={styles.topRow}>
        <Typography design="body" weight={800} style={styles.typeLabel}>
          {state === "neutral"
            ? "ALL SETTLED"
            : state === "savings"
              ? "SAVINGS ACCOUNT"
              : "LOAN ACCOUNT"}
        </Typography>
        <View style={styles.interestChip}>
          <Typography design="body" weight={800} style={styles.interestChipText}>
            {state === "neutral" ? "no interest" : `${interestPct}% interest`}
          </Typography>
        </View>
      </View>
      <AnimatedCash value={balance} style={styles.balance} />
      <Typography design="body" weight={700} style={styles.balanceNote}>
        {state === "neutral"
          ? "No savings, no loan — a clean slate."
          : state === "savings"
            ? "Earning interest every Pay Day."
            : "Costing you interest every Pay Day."}
      </Typography>
      <InfoRow
        label="Cash in pocket"
        value={<AnimatedCash value={player.cash} style={styles.infoValue} />}
      />
      <InfoRow
        label="At next Pay Day"
        value={
          state === "neutral" ? "$0" : `${state === "savings" ? "+" : "-"}$${interest}`
        }
      />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <View style={styles.infoRow}>
      <Typography design="body" weight={700} style={styles.infoLabel}>
        {label}
      </Typography>
      {typeof value === "string" ? (
        <Typography design="money" style={styles.infoValue}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.85)",
  },
  interestChip: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  interestChipText: {
    fontSize: 11,
    color: "#FFFFFF",
  },
  balance: {
    fontSize: 34,
    lineHeight: 38,
    color: "#FFFFFF",
    marginTop: 8,
  },
  balanceNote: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 13,
    paddingVertical: 11,
    paddingHorizontal: 13,
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  infoValue: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});
