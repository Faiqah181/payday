import ConfettiRain from "@/components/game/events/ConfettiRain";
import ChunkyButton from "@/components/ui/ChunkyButton";
import PlayerToken from "@/components/ui/PlayerToken";
import ScreenBackground from "@/components/ui/ScreenBackground";
import Typography from "@/components/ui/Typography";
import { SD, SD_LAYER } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import type { Player } from "@/types/game";
import { getAccountStatus } from "@/types/game";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GameOverModalProps {
  players: Player[];
  totalMonths: number;
  onRematch: () => void;
  onClose: () => void;
}

function netWorth(player: Player): number {
  return player.cash + player.savingsBalance - player.loanBalance;
}

function money(n: number) {
  return `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US")}`;
}

function noteFor(player: Player): string {
  if (player.bankrupt) return "Went bankrupt";
  const status = getAccountStatus(player);
  if (status === "savings") return `Savings $${player.savingsBalance} · debt-free`;
  if (status === "loan") return `Still owes $${player.loanBalance}`;
  return "Debt-free";
}

function unsoldDealsNote(player: Player): string | null {
  if (!player.deals.length) return null;
  const worth = player.deals.reduce((sum, deal) => sum + deal.sellPrice, 0);
  return `$${worth.toLocaleString("en-US")} worth of deals not sold`;
}

const initialOf = (player: Player) =>
  player.name?.trim()?.[0]?.toUpperCase() || "?";

export default function GameOverModal({
  players,
  totalMonths,
  onRematch,
  onClose,
}: GameOverModalProps) {
  const { playResult } = useSound();

  useEffect(() => {
    playResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bankrupt players always rank below solvent ones
  const ranked = [...players].sort((a, b) => {
    if (a.bankrupt !== b.bankrupt) return a.bankrupt ? 1 : -1;
    return netWorth(b) - netWorth(a);
  });
  const winner = ranked[0];
  const isTie =
    ranked.length > 1 &&
    !ranked[1].bankrupt &&
    netWorth(ranked[1]) === netWorth(winner);

  return (
    <View style={styles.overlay}>
      <ScreenBackground>
        <SafeAreaView style={styles.screen}>
          <View style={styles.header}>
            <Typography design="body" weight={800} style={styles.headerEyebrow}>
              {totalMonths} {totalMonths === 1 ? "MONTH" : "MONTHS"} · FINAL STANDINGS
            </Typography>
            <Typography design="money" style={styles.headerTitle}>
              GAME OVER
            </Typography>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.winnerCard}>
              <View style={styles.placeChip}>
                <Typography design="title" weight={800} style={styles.placeChipText}>
                  ★ 1ST PLACE{isTie ? " · TIE" : ""}
                </Typography>
              </View>
              <View style={styles.winnerToken}>
                <PlayerToken
                  initial={initialOf(winner)}
                  color={winner.color}
                  size={62}
                />
              </View>
              <Typography design="title" style={styles.winnerName}>
                {winner.name} wins!
              </Typography>
              <Typography design="body" weight={700} style={styles.winnerNote}>
                {noteFor(winner)}
              </Typography>
              {unsoldDealsNote(winner) && (
                <Typography design="body" weight={700} style={styles.winnerNote}>
                  {unsoldDealsNote(winner)}
                </Typography>
              )}
              <Typography design="money" style={styles.winnerTotal}>
                {money(netWorth(winner))}
              </Typography>
            </View>

            <View style={styles.standings}>
              {ranked.slice(1).map((player, i) => (
                <View key={player.name} style={styles.standingRow}>
                  <Typography design="title" weight={800} style={styles.rank}>
                    #{i + 2}
                  </Typography>
                  <PlayerToken
                    initial={initialOf(player)}
                    color={player.color}
                    size={34}
                  />
                  <View style={styles.standingText}>
                    <Typography design="title" weight={800} style={styles.standingName}>
                      {player.name}
                    </Typography>
                    <Typography design="body" weight={700} style={styles.standingNote}>
                      {noteFor(player)}
                    </Typography>
                    {unsoldDealsNote(player) && (
                      <Typography design="body" weight={700} style={styles.standingNote}>
                        {unsoldDealsNote(player)}
                      </Typography>
                    )}
                  </View>
                  <Typography design="money" style={styles.standingTotal}>
                    {money(netWorth(player))}
                  </Typography>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ChunkyButton
              color={SD.surface2}
              depthColor="rgba(0,0,0,0.12)"
              depth={4}
              borderRadius={18}
              style={styles.footerButton}
              contentStyle={styles.footerFace}
              onPress={onRematch}
            >
              <Typography design="title" style={styles.rematchLabel}>
                Rematch
              </Typography>
            </ChunkyButton>
            <ChunkyButton
              color={SD.primary}
              depthColor={SD.primaryShadow}
              depth={4}
              borderRadius={18}
              style={styles.footerButton}
              contentStyle={styles.footerFace}
              onPress={onClose}
            >
              <Typography design="title" style={styles.homeLabel}>
                Home
              </Typography>
            </ChunkyButton>
          </View>
        </SafeAreaView>
      </ScreenBackground>
      <ConfettiRain />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: SD_LAYER.screenOverlay,
  },
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 12,
    alignItems: "center",
    overflow: "hidden",
  },
  headerEyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    color: SD.soft,
  },
  headerTitle: {
    fontSize: 24,
    color: SD.ink,
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 16,
  },
  winnerCard: {
    backgroundColor: SD.accent,
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#C08A00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  placeChip: {
    backgroundColor: "rgba(0,0,0,0.12)",
    paddingVertical: 3,
    paddingHorizontal: 11,
    borderRadius: 999,
  },
  placeChipText: {
    fontSize: 11,
    color: "#5E3D00",
  },
  winnerToken: {
    marginTop: 10,
  },
  winnerName: {
    fontSize: 24,
    color: SD.ink,
    marginTop: 9,
  },
  winnerNote: {
    fontSize: 12,
    color: "#7A4E00",
  },
  winnerTotal: {
    fontSize: 28,
    color: SD.primary,
    marginTop: 6,
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  standings: {
    gap: 9,
    marginTop: 14,
  },
  standingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SD.surface2,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rank: {
    fontSize: 18,
    color: SD.soft,
    width: 26,
  },
  standingText: {
    flex: 1,
    minWidth: 0,
  },
  standingName: {
    fontSize: 15,
    color: SD.ink,
  },
  standingNote: {
    fontSize: 11,
    color: SD.soft,
  },
  standingTotal: {
    fontSize: 15,
    color: SD.ink,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 2,
    borderTopColor: SD.line,
  },
  footerButton: {
    flex: 1,
  },
  footerFace: {
    paddingVertical: 16,
    alignItems: "center",
  },
  rematchLabel: {
    fontSize: 16,
    color: SD.ink,
  },
  homeLabel: {
    fontSize: 16,
    color: SD.white,
  },
});
