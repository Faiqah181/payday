import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "@/constants/colors";

const sections = [
  {
    title: "🎯 What's the Goal?",
    body: `Simple — have the MOST CASH at the end of the game. 💰

You'll go through a month of life (day 1 to day 31) dealing with bills, making deals, and trying not to go broke. The player with the most money after all months are done WINS!`,
  },
  {
    title: "🎲 How a Turn Works",
    body: `1️⃣  Roll the die
2️⃣  Move that many spaces forward on the calendar
3️⃣  Do whatever the space tells you (draw cards, pay bills, etc.)

That's it. Super simple. Next player goes!`,
  },
  {
    title: "📅 The Board",
    body: `The board is a 31-day calendar — like one month of your life.

You start at Day 1 and move toward Day 31 (Pay Day!). Each space is a different type of event. After reaching Day 31, you start a new month from Day 1 again.

You play for a set number of months (agreed before the game starts — usually 3 to 6).`,
  },
  {
    title: "🟢 Space Types",
    body: `Here's what you'll land on:

📬 Mail — Draw a Mail card (could be a bill, could be good news)

🤝 Deal — Draw a Deal card. You can buy it if you can afford it!

📬🤝 Mail + Deal — Draw both. Double the action!

🛒 Buyer — Someone wants to buy one of your deals! Sell it for profit 💸

🎰 Lottery — Place your bets and roll! Could win big or lose it all

🎂 Happy Birthday — Every other player gives you a gift ($100 each)

📻 Radio Contest — Roll the die to try to win a cash prize

🛍️ Yard Sale — Grab a deal at a bargain price`,
  },
  {
    title: "✉️ Mail Cards",
    body: `When you draw a Mail card, it could be:

💸 Bills — You gotta pay these (utilities, insurance, medical, etc.)
📺 Ads — Junk mail, nothing happens lol
💳 Monster Charge — Credit card bill! Must be paid on Pay Day
🎁 Good Stuff — Tax refunds, small inheritances, surprise money!`,
  },
  {
    title: "🤝 Deal Cards",
    body: `Deals are how you make the BIG money! 🤑

Each Deal card has two prices:
  • Buy Price — what you pay now
  • Sell Price — what you get when someone lands on a Buyer space

💡 Strategy tip: Buy deals when you can! Selling them later is the #1 way to get ahead. Think of them like flipping items for profit.`,
  },
  {
    title: "💰 Pay Day (Day 31)",
    body: `Every time you reach or pass Day 31, it's PAY DAY! Here's what happens:

1️⃣  Collect your salary — $3,500 cash money 🎉
2️⃣  Pay all your outstanding Mail bills
3️⃣  Pay 10% interest on any loans you have
4️⃣  Optionally pay back some or all of your loan

Then start the new month from Day 1!`,
  },
  {
    title: "🏦 Loans & The Bank",
    body: `Running low on cash? No worries — take a loan from the bank!

📌 Borrow in amounts of $1,000
📌 You can borrow at ANY time during your turn
📌 On Pay Day, you pay 10% interest on whatever you owe
📌 You can pay back loans (partially or fully) on Pay Day

⚠️ Be careful though — interest adds up FAST and eats into your profits!`,
  },
  {
    title: "🏆 How to Win",
    body: `After the final month ends (everyone reaches the last Pay Day):

1️⃣  Pay off ALL remaining loans
2️⃣  Sell any unsold Deal cards at their sale price
3️⃣  Count your cash

The player with the MOST CASH wins! 👑

That's literally it. May the richest player win! 🎉`,
  },
  {
    title: "💡 Pro Tips",
    body: `🔥 Buy every Deal you can afford — they're your biggest profit source

🔥 Don't over-borrow — 10% interest every month is brutal

🔥 Keep cash for bills — getting caught with no money means more loans

🔥 Timing matters — landing on Buyer spaces when you have deals = profit

🔥 It's part strategy, part luck — don't rage if the dice aren't with you 😂`,
  },
];

export default function HowToPlay() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Welcome to PayDay! 🎉 Here's everything you need to know to play like a
        pro.
      </Text>

      {sections.map((section, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{section.title}</Text>
          <Text style={styles.cardBody}>{section.body}</Text>
        </View>
      ))}

      <Text style={styles.footer}>Now go get that bread! 🍞💰</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  intro: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    color: "#424242",
    lineHeight: 23,
  },
  footer: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
});
