import PotDrawer from "@/components/game/bank/PotDrawer";
import PlayerToken from "@/components/ui/PlayerToken";
import ScreenBackground from "@/components/ui/ScreenBackground";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SlideOverlay, { SlideOverlayHandle } from "@/components/ui/SlideOverlay";
import Typography from "@/components/ui/Typography";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { mixHex, SD } from "@/constants/theme";
import type { Player, PotHistoryEntry } from "@/types/game";
import { getAccountStatus } from "@/types/game";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountCard from "./AccountCard";
import AmountSheet from "./AmountSheet";

type SheetKind = "borrow" | "withdraw" | null;

interface BankScreenProps {
  players: Player[];
  currentPlayerIndex: number;
  pot: number;
  potHistory: PotHistoryEntry[];
  onTakeLoan: (amount: number) => void;
  onWithdrawSavings: (amount: number) => void;
  onClose: () => void;
}

const { borrowStep: STEP, maxLoan, interestPercentage, earlySavingWithdrawFine } =
  GAME_CONFIG;
const HAS_WITHDRAW_FINE = earlySavingWithdrawFine > 0;
const withdrawFineFor = (amount: number) =>
  (amount / STEP) * earlySavingWithdrawFine;

export default function BankScreen({
  players,
  currentPlayerIndex,
  pot,
  potHistory,
  onTakeLoan,
  onWithdrawSavings,
  onClose,
}: BankScreenProps) {
  const overlay = useRef<SlideOverlayHandle>(null);
  const [viewingIndex, setViewingIndex] = useState(currentPlayerIndex);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [showPot, setShowPot] = useState(false);

  const viewing = players[viewingIndex];
  const isSelf = viewingIndex === currentPlayerIndex;
  const state = getAccountStatus(viewing);

  const maxBorrow = maxLoan - viewing.loanBalance;
  const canBorrow = state !== "savings" && maxBorrow >= STEP;

  const actionTitle = state === "savings" ? "Withdraw money" : "Borrow money";
  const actionSub =
    state === "savings"
      ? HAS_WITHDRAW_FINE
        ? `Anytime · $${earlySavingWithdrawFine} fine per $${STEP} withdrawn`
        : "Free anytime · withdrawn money stops earning interest"
      : canBorrow
        ? `Pick an amount · ${interestPercentage}% interest each Pay Day`
        : "Loan limit reached.";
  const lockedNote =
    state === "savings"
      ? "You can deposit to savings only on Pay Day."
      : state === "loan"
        ? "You can repay your loan only on Pay Day."
        : "You can open a savings account only on Pay Day.";
  const actionEnabled = state === "savings" || canBorrow;

  return (
    <SlideOverlay ref={overlay} onClose={onClose}>
      <ScreenBackground>
        <SafeAreaView style={styles.screen}>
          <ScreenHeader
            title="The Bank"
            subtitle="SAVINGS · LOAN · THE POT"
            variant="heading"
            onBack={() => overlay.current?.close()}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabs}
            contentContainerStyle={styles.tabsContent}
          >
            {players.map((player, i) => {
              const active = i === viewingIndex;
              return (
                <Pressable
                  key={i}
                  style={[styles.tab, active && styles.tabActive]}
                  onPress={() => setViewingIndex(i)}
                >
                  <PlayerToken
                    initial={player.name?.trim()?.[0]?.toUpperCase() || "?"}
                    color={player.color}
                    size={20}
                  />
                  <Typography
                    design="title"
                    weight={800}
                    style={[styles.tabLabel, { color: active ? SD.white : SD.ink }]}
                  >
                    {player.name}
                  </Typography>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView contentContainerStyle={styles.content}>
            <Pressable onPress={() => setShowPot(true)}>
              <LinearGradient
                colors={["#6A4BB0", "#8659C4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.potRow}
              >
                <View style={styles.potIcon}>
                  <Typography design="title" style={styles.potIconGlyph}>
                    ¢
                  </Typography>
                </View>
                <Typography design="body" weight={800} style={styles.potLabel}>
                  THE POT
                </Typography>
                <View style={styles.potSpacer} />
                <Typography design="money" style={styles.potAmount}>
                  ${pot}
                </Typography>
                <Typography design="body" weight={800} style={styles.potChevron}>
                  ›
                </Typography>
              </LinearGradient>
            </Pressable>

            <AccountCard player={viewing} />

            {isSelf ? (
              <View>
                <Typography design="body" weight={800} style={styles.eyebrow}>
                  ACCOUNT ACTIONS
                </Typography>
                <Pressable
                  style={[styles.actionRow, !actionEnabled && styles.actionRowDim]}
                  disabled={!actionEnabled}
                  onPress={() =>
                    setSheet(state === "savings" ? "withdraw" : "borrow")
                  }
                >
                  <View style={styles.actionTile}>
                    <Typography design="title" style={styles.actionGlyph}>
                      {state === "savings" ? "−" : "+"}
                    </Typography>
                  </View>
                  <View style={styles.actionText}>
                    <Typography design="title" weight={800} style={styles.actionTitle}>
                      {actionTitle}
                    </Typography>
                    <Typography design="body" weight={700} style={styles.actionSub}>
                      {actionSub}
                    </Typography>
                  </View>
                  <Typography design="body" weight={800} style={styles.actionChevron}>
                    ›
                  </Typography>
                </Pressable>
                <Typography design="body" weight={700} style={styles.lockedNote}>
                  🔒 {lockedNote}
                </Typography>
              </View>
            ) : (
              <View style={styles.readOnlyBox}>
                <Typography design="body" weight={700} style={styles.readOnlyText}>
                  You can view {viewing.name}'s account, but only they can manage it.
                </Typography>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </ScreenBackground>

      {sheet === "borrow" && (
        <AmountSheet
          headColor={SD.debt}
          eyebrow="BORROW FROM THE BANK"
          note={`Loans move in $${STEP} steps · ${interestPercentage}% interest every Pay Day`}
          step={STEP}
          max={maxBorrow}
          rows={(amount) => [
            {
              label: "New loan total",
              value: `$${viewing.loanBalance + amount}`,
              color: SD.debt,
            },
            {
              label: `Interest at each Pay Day (${interestPercentage}%)`,
              value: `-$${Math.round(((viewing.loanBalance + amount) * interestPercentage) / 100)}`,
              color: SD.debt,
            },
            {
              label: "Cash in hand after",
              value: `$${viewing.cash + amount}`,
              color: SD.primary,
            },
          ]}
          confirmLabel={(amount) => `Borrow $${amount}`}
          confirmColor={SD.debt}
          confirmDepthColor={mixHex(SD.debt, "#000000", 0.3)}
          onConfirm={onTakeLoan}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "withdraw" && (
        <AmountSheet
          headColor={SD.primary}
          eyebrow="WITHDRAW FROM SAVINGS"
          note={
            HAS_WITHDRAW_FINE
              ? `$${STEP} steps · $${earlySavingWithdrawFine} fine per $${STEP} withdrawn`
              : `$${STEP} steps · free anytime · withdrawn money stops earning interest`
          }
          step={STEP}
          max={viewing.savingsBalance}
          rows={(amount) => [
            {
              label: "Savings after",
              value: `$${viewing.savingsBalance - amount}`,
              color: SD.debt,
            },
            ...(HAS_WITHDRAW_FINE
              ? [
                  {
                    label: "Early withdrawal fine",
                    value: `-$${withdrawFineFor(amount)}`,
                    color: SD.debt,
                  },
                ]
              : []),
            {
              label: "Cash in hand after",
              value: `$${viewing.cash + amount - withdrawFineFor(amount)}`,
              color: SD.primary,
            },
          ]}
          confirmLabel={(amount) => `Withdraw $${amount}`}
          confirmColor={SD.primary}
          confirmDepthColor={SD.primaryShadow}
          onConfirm={onWithdrawSavings}
          onClose={() => setSheet(null)}
        />
      )}
      {showPot && (
        <PotDrawer pot={pot} history={potHistory} onClose={() => setShowPot(false)} />
      )}
    </SlideOverlay>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabs: {
    flexGrow: 0,
  },
  tabsContent: {
    gap: 7,
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 10,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingLeft: 7,
    paddingRight: 13,
    borderRadius: 999,
    backgroundColor: SD.surface2,
  },
  tabActive: {
    backgroundColor: SD.primary,
    elevation: 2,
    shadowColor: SD.primaryShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  tabLabel: {
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 18,
    gap: 14,
  },
  potRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 13,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 0,
  },
  potIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  potIconGlyph: {
    fontSize: 13,
    lineHeight: 17,
    color: SD.white,
  },
  potLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: "rgba(255,255,255,0.85)",
  },
  potSpacer: {
    flex: 1,
  },
  potAmount: {
    fontSize: 16,
    color: SD.white,
  },
  potChevron: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: SD.soft,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SD.surface2,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 13,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
  },
  actionRowDim: {
    opacity: 0.55,
  },
  actionTile: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: SD.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  actionGlyph: {
    fontSize: 19,
    lineHeight: 24,
    color: SD.white,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    color: SD.ink,
  },
  actionSub: {
    fontSize: 11,
    color: SD.soft,
  },
  actionChevron: {
    fontSize: 14,
    color: SD.soft,
  },
  lockedNote: {
    fontSize: 12,
    lineHeight: 18,
    color: SD.soft,
    paddingHorizontal: 6,
    paddingTop: 8,
  },
  readOnlyBox: {
    backgroundColor: SD.surface2,
    borderRadius: 14,
    padding: 15,
  },
  readOnlyText: {
    fontSize: 12,
    lineHeight: 18,
    color: SD.soft,
    textAlign: "center",
  },
});
