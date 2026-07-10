import AmountSheet from "@/components/game/bank/AmountSheet";
import ChunkyButton from "@/components/ui/ChunkyButton";
import ScreenBackground from "@/components/ui/ScreenBackground";
import SlideOverlay, { SlideOverlayHandle } from "@/components/ui/SlideOverlay";
import Typography from "@/components/ui/Typography";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { mixHex, SD } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import type { PaydayReport, Player } from "@/types/game";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PayStepRow, { PayStep } from "./PayStepRow";

const STEP = GAME_CONFIG.borrowStep;

interface PaydayOverlayProps {
  player: Player;
  report: PaydayReport;
  month: number;
  totalMonths: number;
  onRepay: (amount: number) => void;
  onDeposit: (amount: number) => void;
  onDone: () => void;
}

function money(n: number) {
  return `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US")}`;
}

function buildSteps(
  report: PaydayReport,
  repaid: number,
  deposited: number,
): PayStep[] {
  const interestStep: PayStep =
    report.accountStatus === "loan"
      ? {
          title: `Loan interest ${GAME_CONFIG.interestPercentage}%`,
          sub: `On your $${report.interestOn} loan`,
          amount: report.interest,
        }
      : report.accountStatus === "savings"
        ? {
            title: `Savings interest ${GAME_CONFIG.savingsInterestPercentage}%`,
            sub: `On your $${report.interestOn} savings`,
            amount: report.interest,
          }
        : { title: "No interest", sub: "No savings, no loan", amount: 0 };

  const adjustments =
    [repaid > 0 && `-$${repaid}`, deposited > 0 && `+$${deposited}`]
      .filter(Boolean)
      .join(" · ") || "—";

  return [
    { title: "Collect wages", sub: "Every Pay Day", amount: report.salary },
    interestStep,
    {
      title: "Pay your bills",
      sub: report.billTitles.slice(0, 3).join(" · ") || "No bills this month",
      amount: -report.billsPaid,
    },
    {
      title: "Repay loan / savings",
      sub: `Optional · $${STEP} steps · today only`,
      amountText: adjustments,
      amount: deposited - repaid,
    },
  ];
}

export default function PaydayOverlay({
  player,
  report,
  month,
  totalMonths,
  onRepay,
  onDeposit,
  onDone,
}: PaydayOverlayProps) {
  const overlay = useRef<SlideOverlayHandle>(null);
  const { successHaptic } = useSound();
  const [sheet, setSheet] = useState<"repay" | "deposit" | null>(null);
  const [repaid, setRepaid] = useState(0);
  const [deposited, setDeposited] = useState(0);

  useEffect(() => {
    successHaptic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasLoan = player.loanBalance > 0;
  const repayMax = Math.min(player.loanBalance, Math.floor(player.cash / STEP) * STEP);
  const depositMax = Math.floor(player.cash / STEP) * STEP;
  const actionEnabled =
    !report.bankrupt && (hasLoan ? repayMax >= STEP : depositMax >= STEP);
  const wasShort =
    report.autoWithdrawn > 0 || report.autoBorrowed > 0 || report.liquidated > 0;

  return (
    <SlideOverlay ref={overlay} onClose={onDone}>
      <ScreenBackground>
        <SafeAreaView style={styles.screen}>
          <View style={styles.header}>
            <Typography design="body" weight={800} style={styles.headerEyebrow}>
              MONTH {month} OF {totalMonths}
            </Typography>
            <Typography design="money" style={styles.headerTitle}>
              PAY DAY
            </Typography>
            <Typography design="body" weight={700} style={styles.headerSub}>
              Settle up, then start a fresh month.
            </Typography>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.stepsCard}>
              {buildSteps(report, repaid, deposited).map((step, i) => (
                <PayStepRow key={step.title} step={step} index={i} />
              ))}
            </View>

            {wasShort && (
              <Typography design="body" weight={700} style={styles.shortNote}>
                Cash ran short — covered with
                {report.autoWithdrawn > 0 && ` $${report.autoWithdrawn} from savings`}
                {report.autoWithdrawn > 0 && report.autoBorrowed > 0 && ","}
                {report.autoBorrowed > 0 && ` a $${report.autoBorrowed} loan`}
                {report.liquidated > 0 &&
                  ` and the Bank buying back your cards for $${report.liquidated}`}
                .
              </Typography>
            )}

            {report.bankrupt && (
              <View style={styles.bankruptBox}>
                <Typography design="title" weight={800} style={styles.bankruptTitle}>
                  Bankrupt
                </Typography>
                <Typography design="body" weight={700} style={styles.bankruptText}>
                  The loan is maxed out and even selling everything couldn't cover
                  the bills. {player.name} retires from the game.
                </Typography>
              </View>
            )}

            {report.bankrupt ? null : (
            <Pressable
              style={[styles.actionRow, !actionEnabled && styles.actionRowDim]}
              disabled={!actionEnabled}
              onPress={() => setSheet(hasLoan ? "repay" : "deposit")}
            >
              <View
                style={[
                  styles.actionTile,
                  { backgroundColor: hasLoan ? SD.debt : SD.primary },
                ]}
              >
                <Typography design="title" style={styles.actionGlyph}>
                  {hasLoan ? "−" : "+"}
                </Typography>
              </View>
              <View style={styles.actionText}>
                <Typography design="title" weight={800} style={styles.actionTitle}>
                  {hasLoan ? "Repay loan" : "Deposit to savings"}
                </Typography>
                <Typography design="body" weight={700} style={styles.actionSub}>
                  {hasLoan
                    ? `$${player.loanBalance} outstanding · only allowed on Pay Day`
                    : `Grow it ${GAME_CONFIG.savingsInterestPercentage}% every Pay Day · today only`}
                </Typography>
              </View>
              <Typography design="body" weight={800} style={styles.actionChevron}>
                ›
              </Typography>
            </Pressable>
            )}

            <View
              style={[styles.balanceCard, report.bankrupt && styles.balanceCardBroke]}
            >
              <View>
                <Typography design="body" weight={800} style={styles.balanceLabel}>
                  NEW BALANCE
                </Typography>
                <Typography design="body" weight={700} style={styles.balanceSub}>
                  {player.name} · after bills
                </Typography>
              </View>
              <Typography design="money" style={styles.balanceValue}>
                {money(player.cash)}
              </Typography>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ChunkyButton
              color={report.bankrupt ? SD.debt : SD.primary}
              depthColor={report.bankrupt ? "#A82D20" : SD.primaryShadow}
              depth={5}
              borderRadius={18}
              contentStyle={styles.doneFace}
              onPress={() => overlay.current?.close()}
            >
              <Typography design="title" style={styles.doneLabel}>
                {report.bankrupt ? "Retire from the game" : "Start next month →"}
              </Typography>
            </ChunkyButton>
          </View>
        </SafeAreaView>
      </ScreenBackground>

      {sheet === "repay" && (
        <AmountSheet
          headColor={SD.debt}
          eyebrow="REPAY YOUR LOAN"
          note={`Allowed only on Pay Day · $${STEP} steps · less loan, less interest`}
          step={STEP}
          max={repayMax}
          rows={(amount) => [
            {
              label: "Loan remaining after",
              value: money(Math.max(0, player.loanBalance - amount)),
              color: SD.debt,
            },
            {
              label: `Interest at each Pay Day (${GAME_CONFIG.interestPercentage}%)`,
              value: `-$${Math.round(((player.loanBalance - amount) * GAME_CONFIG.interestPercentage) / 100)}`,
              color: SD.debt,
            },
            {
              label: "Cash in hand after",
              value: money(player.cash - amount),
              color: SD.primary,
            },
          ]}
          confirmLabel={(amount) => `Repay $${amount}`}
          confirmColor={SD.primary}
          confirmDepthColor={SD.primaryShadow}
          onConfirm={(amount) => {
            setRepaid((total) => total + amount);
            onRepay(amount);
          }}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "deposit" && (
        <AmountSheet
          headColor={SD.primary}
          eyebrow="DEPOSIT TO SAVINGS"
          note={`Allowed only on Pay Day · $${STEP} steps · earns ${GAME_CONFIG.savingsInterestPercentage}% every Pay Day`}
          step={STEP}
          max={depositMax}
          rows={(amount) => [
            {
              label: "Savings after",
              value: money(player.savingsBalance + amount),
              color: SD.primary,
            },
            {
              label: `Interest at each Pay Day (${GAME_CONFIG.savingsInterestPercentage}%)`,
              value: `+$${Math.round(((player.savingsBalance + amount) * GAME_CONFIG.savingsInterestPercentage) / 100)}`,
              color: SD.primary,
            },
            {
              label: "Cash in hand after",
              value: money(player.cash - amount),
              color: SD.debt,
            },
          ]}
          confirmLabel={(amount) => `Deposit $${amount}`}
          confirmColor={SD.primary}
          confirmDepthColor={SD.primaryShadow}
          onConfirm={(amount) => {
            setDeposited((total) => total + amount);
            onDeposit(amount);
          }}
          onClose={() => setSheet(null)}
        />
      )}
    </SlideOverlay>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    backgroundColor: SD.accent,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  headerEyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#7A4E00",
  },
  headerTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: SD.ink,
    marginTop: 10,
  },
  headerSub: {
    fontSize: 13,
    color: "#7A4E00",
    marginTop: 6,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 14,
  },
  stepsCard: {
    backgroundColor: SD.surface2,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  shortNote: {
    fontSize: 12,
    lineHeight: 18,
    color: SD.debt,
    paddingHorizontal: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SD.surface2,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
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
    fontSize: 15,
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
  balanceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: SD.primary,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    elevation: 3,
    shadowColor: SD.primaryShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  balanceCardBroke: {
    backgroundColor: SD.debt,
    shadowColor: "#A82D20",
  },
  bankruptBox: {
    backgroundColor: SD.debt,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bankruptTitle: {
    fontSize: 16,
    color: SD.white,
  },
  bankruptText: {
    fontSize: 12,
    lineHeight: 18,
    color: "rgba(255,255,255,0.9)",
    marginTop: 3,
  },
  balanceLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.9)",
  },
  balanceSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  balanceValue: {
    fontSize: 26,
    color: SD.white,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 2,
    borderTopColor: SD.line,
  },
  doneFace: {
    paddingVertical: 17,
    alignItems: "center",
  },
  doneLabel: {
    fontSize: 17,
    color: SD.white,
  },
});
