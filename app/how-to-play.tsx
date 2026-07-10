import ChunkyButton from "@/components/ui/ChunkyButton";
import ScreenBackground from "@/components/ui/ScreenBackground";
import Typography from "@/components/ui/Typography";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { mixHex, SD } from "@/constants/theme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Block =
  | { kind: "p"; text: string }
  | { kind: "step"; n: number; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "tip"; text: string }
  | { kind: "warn"; text: string };

interface Section {
  color: string;
  glyph: string;
  title: string;
  blocks: Block[];
}

const SECTIONS: Section[] = [
  {
    color: "#1FA45C",
    glyph: "◎",
    title: "What's the Goal?",
    blocks: [
      { kind: "p", text: "Simple — have the most cash at the end of the game." },
      {
        kind: "p",
        text: "You'll go through a month of life (Day 1 to Day 31) dealing with bills, making deals, and trying not to go broke. The player with the most money after all months are done wins!",
      },
    ],
  },
  {
    color: "#2E7BD6",
    glyph: "↻",
    title: "How a Turn Works",
    blocks: [
      { kind: "step", n: 1, text: "Roll the die" },
      { kind: "step", n: 2, text: "Move that many spaces forward on the calendar" },
      {
        kind: "step",
        n: 3,
        text: "Do whatever the space tells you (draw cards, pay bills, etc.)",
      },
      { kind: "p", text: "That's it. Super simple. Next player goes!" },
    ],
  },
  {
    color: "#8B5CD6",
    glyph: "▦",
    title: "The Board",
    blocks: [
      {
        kind: "p",
        text: "The board is a 31-day calendar — like one month of your life.",
      },
      {
        kind: "p",
        text: "You start at Day 1 and move toward Day 31 (Salary Day!). Each space is a different type of event. After reaching Day 31, you start a new month from Day 1 again.",
      },
      {
        kind: "p",
        text: "You play for a set number of months (agreed before the game starts — usually 3 to 6).",
      },
    ],
  },
  {
    color: "#3AAFA9",
    glyph: "❖",
    title: "Space Types",
    blocks: [
      { kind: "bullet", text: "Mail — Draw a Mail card (could be a bill, could be good news)" },
      { kind: "bullet", text: "Deal — Draw a Deal card. You can buy it if you can afford it!" },
      { kind: "bullet", text: "Mail + Deal — Draw both. Double the action!" },
      {
        kind: "bullet",
        text: "Buyer — Someone wants to buy one of your deals! Sell it for profit",
      },
      {
        kind: "bullet",
        text: "Lottery — Place your bets and roll! Could win big or lose it all",
      },
      {
        kind: "bullet",
        text: "Happy Birthday — Your uncle abroad sends you birthday money (other players don't pay)",
      },
      { kind: "bullet", text: "Radio Contest — Roll the die to try to win a cash prize" },
      { kind: "bullet", text: "Yard Sale — Grab a deal at a bargain price" },
    ],
  },
  {
    color: "#2E7BD6",
    glyph: "✉",
    title: "Mail Cards",
    blocks: [
      { kind: "p", text: "When you draw a Mail card, it could be:" },
      {
        kind: "bullet",
        text: "Bills — You gotta pay these (utilities, insurance, medical, etc.)",
      },
      { kind: "bullet", text: "Ads — Junk mail, nothing happens" },
      {
        kind: "bullet",
        text: "Monster Charge — Credit card bill! Must be paid on Salary Day",
      },
      {
        kind: "bullet",
        text: "Good Stuff — Tax refunds, small inheritances, surprise money!",
      },
    ],
  },
  {
    color: "#E0A02E",
    glyph: "⇄",
    title: "Deal Cards",
    blocks: [
      { kind: "p", text: "Deals are how you make the big money!" },
      { kind: "p", text: "Each Deal card has two prices:" },
      { kind: "bullet", text: "Buy Price — what you pay now" },
      {
        kind: "bullet",
        text: "Sell Price — what you get when someone lands on a Buyer space",
      },
      {
        kind: "tip",
        text: "Strategy tip: Buy deals when you can! Selling them later is the #1 way to get ahead. Think of them like flipping items for profit.",
      },
    ],
  },
  {
    color: "#C8632B",
    glyph: "$",
    title: "Salary Day (Day 31)",
    blocks: [
      {
        kind: "p",
        text: "Every time you reach or pass Day 31, it's Salary Day! Here's what happens:",
      },
      {
        kind: "step",
        n: 1,
        text: `Collect your salary — $${GAME_CONFIG.salary} cash`,
      },
      { kind: "step", n: 2, text: "Pay all your outstanding Mail bills" },
      {
        kind: "step",
        n: 3,
        text: `Pay ${GAME_CONFIG.interestPercentage}% interest on any loans you have`,
      },
      {
        kind: "step",
        n: 4,
        text: "Optionally repay your loan, then deposit to savings",
      },
      { kind: "p", text: "Then start the new month from Day 1!" },
    ],
  },
  {
    color: "#E5432E",
    glyph: "%",
    title: "Loans & The Bank",
    blocks: [
      {
        kind: "p",
        text: "Running low on cash? No worries — take a loan from the bank!",
      },
      { kind: "bullet", text: `Borrow in amounts of $${GAME_CONFIG.borrowStep}` },
      { kind: "bullet", text: "You can borrow at any time during your turn" },
      {
        kind: "bullet",
        text: `On Pay Day, you pay ${GAME_CONFIG.interestPercentage}% interest on whatever you owe`,
      },
      {
        kind: "bullet",
        text: "You can repay loans (partially or fully) only on Pay Day",
      },
      {
        kind: "bullet",
        text: `Savings earn ${GAME_CONFIG.savingsInterestPercentage}% each Pay Day — deposit on Pay Day, withdraw anytime`,
      },
      {
        kind: "warn",
        text: "Interest adds up fast — and if your loan maxes out and you still can't pay your bills on Pay Day, you go bankrupt and you're out of the game!",
      },
    ],
  },
  {
    color: "#E0A02E",
    glyph: "★",
    title: "How to Win",
    blocks: [
      {
        kind: "p",
        text: "After the final month ends (everyone reaches the last Salary Day):",
      },
      { kind: "step", n: 1, text: "Loans are subtracted from your total" },
      {
        kind: "step",
        n: 2,
        text: "Unsold Deal cards are worthless — cash them in before the end!",
      },
      { kind: "step", n: 3, text: "Count your cash and savings" },
      {
        kind: "p",
        text: "The player with the most cash and savings (minus loans) wins!",
      },
    ],
  },
  {
    color: "#E07A2E",
    glyph: "✦",
    title: "Pro Tips",
    blocks: [
      {
        kind: "bullet",
        text: "Buy every Deal you can afford — they're your biggest profit source",
      },
      {
        kind: "bullet",
        text: `Don't over-borrow — ${GAME_CONFIG.interestPercentage}% interest every month is brutal`,
      },
      {
        kind: "bullet",
        text: "Keep cash for bills — getting caught with no money means more loans",
      },
      {
        kind: "bullet",
        text: "Timing matters — landing on Buyer spaces when you have deals = profit",
      },
      {
        kind: "bullet",
        text: "It's part strategy, part luck — don't rage if the dice aren't with you",
      },
    ],
  },
];

function BlockRow({ block, color }: { block: Block; color: string }) {
  switch (block.kind) {
    case "p":
      return (
        <Typography design="body" style={styles.paragraph}>
          {block.text}
        </Typography>
      );
    case "step":
      return (
        <View style={styles.stepRow}>
          <View style={[styles.stepBadge, { backgroundColor: color }]}>
            <Typography design="title" style={styles.stepBadgeText}>
              {String(block.n)}
            </Typography>
          </View>
          <Typography design="body" weight={700} style={styles.stepText}>
            {block.text}
          </Typography>
        </View>
      );
    case "bullet":
      return (
        <View style={styles.bulletRow}>
          <View style={[styles.bulletDot, { backgroundColor: color }]} />
          <Typography design="body" style={styles.bulletText}>
            {block.text}
          </Typography>
        </View>
      );
    case "tip":
    case "warn": {
      const tone = block.kind === "warn" ? SD.debt : color;
      return (
        <View
          style={[
            styles.calloutRow,
            {
              backgroundColor: mixHex(tone, SD.surface, 0.86),
              borderColor: mixHex(tone, SD.surface, 0.62),
            },
          ]}
        >
          <View style={[styles.calloutBadge, { backgroundColor: tone }]}>
            <Typography design="body" weight={800} style={styles.calloutBadgeText}>
              {block.kind === "warn" ? "!" : "TIP"}
            </Typography>
          </View>
          <Typography design="body" weight={700} style={styles.calloutText}>
            {block.text}
          </Typography>
        </View>
      );
    }
  }
}

export default function HowToPlay() {
  const router = useRouter();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <ChunkyButton
            color={SD.surface2}
            depthColor="rgba(0,0,0,0.1)"
            depth={3}
            borderRadius={11}
            contentStyle={styles.backFace}
            onPress={() => router.back()}
          >
            <Typography design="title" style={styles.backGlyph}>
              ‹
            </Typography>
          </ChunkyButton>
          <Typography design="money" style={styles.screenTitle}>
            How to Play
          </Typography>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.banner}>
            <Typography design="title" style={styles.bannerTitle}>
              Welcome to Salary Day!
            </Typography>
            <Typography design="body" weight={700} style={styles.bannerSubtitle}>
              Everything you need to know to play like a pro.
            </Typography>
          </View>

          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.glyphTile,
                    {
                      backgroundColor: section.color,
                      shadowColor: mixHex(section.color, "#000000", 0.3),
                    },
                  ]}
                >
                  <Typography design="title" style={styles.glyphText}>
                    {section.glyph}
                  </Typography>
                </View>
                <Typography design="title" style={styles.cardTitle}>
                  {section.title}
                </Typography>
              </View>
              {section.blocks.map((block, i) => (
                <BlockRow key={i} block={block} color={section.color} />
              ))}
            </View>
          ))}

          <Typography design="title" style={styles.footer}>
            Now go get that bread!
          </Typography>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backFace: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  backGlyph: {
    fontSize: 18,
    lineHeight: 22,
    color: SD.ink,
  },
  screenTitle: {
    fontSize: 20,
    color: SD.ink,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 13,
  },
  banner: {
    backgroundColor: SD.primary,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 17,
    elevation: 3,
    shadowColor: SD.primaryShadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  bannerTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: SD.white,
  },
  bannerSubtitle: {
    fontSize: 12.5,
    color: "rgba(255,255,255,0.9)",
    marginTop: 3,
  },
  card: {
    backgroundColor: SD.surface,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 6,
  },
  glyphTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  glyphText: {
    fontSize: 17,
    color: SD.white,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    color: SD.ink,
  },
  paragraph: {
    marginTop: 4,
    fontSize: 13.5,
    lineHeight: 21,
    color: mixHex(SD.ink, SD.surface, 0.1),
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 8,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    fontSize: 12,
    color: SD.white,
  },
  stepText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    color: SD.ink,
    paddingTop: 1,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 7,
  },
  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: SD.ink,
  },
  calloutRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 11,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  calloutBadge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 7,
  },
  calloutBadgeText: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: SD.white,
  },
  calloutText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 19,
    color: SD.ink,
  },
  footer: {
    textAlign: "center",
    fontSize: 16,
    color: SD.ink,
    paddingTop: 4,
    paddingBottom: 6,
  },
});
