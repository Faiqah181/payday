import BottomDrawer from "@/components/ui/BottomDrawer";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import type { HeldLotteryTicket, MailCard } from "@/types/game";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import CardItemModal from "./CardItemModal";
import DrawerHeader from "./DrawerHeader";
import DrawerRow, { DrawerEmpty } from "./DrawerRow";

type MailItem =
  | { kind: "bill"; card: MailCard }
  | { kind: "lottery"; ticket: HeldLotteryTicket }
  | { kind: "insurance"; card: MailCard };

interface MailDrawerProps {
  bills: MailCard[];
  lotteryTickets: HeldLotteryTicket[];
  insurance: MailCard[];
  onClose: () => void;
}

function itemModalProps(item: MailItem) {
  switch (item.kind) {
    case "bill":
      return {
        tone: SD.blue,
        eyebrow: "MAIL · BILL",
        title: item.card.title,
        sub: item.card.description,
        amount: { text: `-$${Math.abs(item.card.amount)}`, color: SD.debt },
        note: "Keep this bill until Pay Day, then pay it to the Bank. Insurance may cancel some bills.",
      };
    case "lottery":
      return {
        tone: SD.accent,
        eyebrow: "MAIL · LOTTERY TICKET",
        title: item.ticket.card.title,
        sub: item.ticket.card.description,
        amount: { text: `+$${item.ticket.card.amount}`, color: SD.primary },
        note: "Cash it in if you land on Lottery Draw this month. It expires when the month ends.",
      };
    case "insurance":
      return {
        tone: SD.purple,
        eyebrow: "MAIL · INSURANCE",
        title: item.card.title,
        sub: item.card.description,
        note: "Held for the rest of the game. New bills of the covered type are cancelled for free.",
      };
  }
}

export default function MailDrawer({
  bills,
  lotteryTickets,
  insurance,
  onClose,
}: MailDrawerProps) {
  const [selected, setSelected] = useState<MailItem | null>(null);

  const billsTotal = bills.reduce((sum, bill) => sum + Math.abs(bill.amount), 0);
  const isEmpty = !bills.length && !lotteryTickets.length && !insurance.length;

  return (
    <>
      <BottomDrawer onClose={onClose}>
        <DrawerHeader
          color={SD.blue}
          eyebrow="MAIL · BILLS TO PAY"
          headline={billsTotal > 0 ? `-$${billsTotal}` : "$0"}
          note="Bills you draw from Mail wait here until Pay Day."
        />
        <ScrollView contentContainerStyle={styles.list}>
          {isEmpty && (
            <DrawerEmpty text="No mail yet. Bills you draw land here until Pay Day." />
          )}
          {bills.map((card) => (
            <DrawerRow
              key={card.id}
              tileColor={SD.blue}
              icon="mail"
              title={card.title}
              sub={`Bill · ${card.billCategory ?? "other"}`}
              right={
                <Typography design="money" style={styles.billAmount}>
                  -${Math.abs(card.amount)}
                </Typography>
              }
              onPress={() => setSelected({ kind: "bill", card })}
            />
          ))}
          {lotteryTickets.map((ticket, i) => (
            <DrawerRow
              key={`lottery-${ticket.card.id}-${i}`}
              tileColor={SD.accent}
              icon="ticket"
              title={ticket.card.title}
              sub={`Lottery ticket · month ${ticket.monthReceived} only`}
              right={
                <Typography design="money" style={styles.prizeAmount}>
                  +${ticket.card.amount}
                </Typography>
              }
              onPress={() => setSelected({ kind: "lottery", ticket })}
            />
          ))}
          {insurance.map((card) => (
            <DrawerRow
              key={card.id}
              tileColor={SD.purple}
              icon="shield-checkmark"
              title={card.title}
              sub="Insurance · held for the game"
              onPress={() => setSelected({ kind: "insurance", card })}
            />
          ))}
        </ScrollView>
      </BottomDrawer>
      {selected && (
        <CardItemModal {...itemModalProps(selected)} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 22,
    gap: 8,
  },
  billAmount: {
    fontSize: 13,
    color: SD.debt,
  },
  prizeAmount: {
    fontSize: 13,
    color: SD.primary,
  },
});
