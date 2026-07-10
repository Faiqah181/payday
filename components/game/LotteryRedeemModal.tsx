import DrawerHeader from "@/components/game/drawers/DrawerHeader";
import BottomDrawer, { BottomDrawerHandle } from "@/components/ui/BottomDrawer";
import ChunkyButton from "@/components/ui/ChunkyButton";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import type { HeldLotteryTicket } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface LotteryRedeemModalProps {
  tickets: HeldLotteryTicket[];
  onRedeem: (ticketIds: number[]) => void;
}

/**
 * Lottery Draw payout. Per the rules, ALL tickets from this month are
 * redeemed at once — no picking, no skipping. Any way of closing this
 * drawer cashes them in.
 */
export default function LotteryRedeemModal({
  tickets,
  onRedeem,
}: LotteryRedeemModalProps) {
  const drawer = useRef<BottomDrawerHandle>(null);
  const total = tickets.reduce((sum, t) => sum + t.card.amount, 0);
  const redeemAll = () => onRedeem(tickets.map((t) => t.card.id));

  return (
    <BottomDrawer ref={drawer} onClose={redeemAll}>
      <DrawerHeader
        color={SD.accent}
        eyebrow="LOTTERY DRAW · YOU WIN"
        headline={`+$${total}`}
        note="All of this month's tickets pay out at once."
      />
      <ScrollView contentContainerStyle={styles.list}>
        {tickets.map((ticket, i) => (
          <View key={`${ticket.card.id}-${i}`} style={styles.ticketRow}>
            <View style={styles.ticketTile}>
              <Ionicons name="ticket" size={17} color={SD.white} />
            </View>
            <View style={styles.ticketText}>
              <Typography design="title" weight={800} style={styles.ticketTitle}>
                {ticket.card.title}
              </Typography>
              <Typography design="body" weight={700} style={styles.ticketSub}>
                Month {ticket.monthReceived} ticket
              </Typography>
            </View>
            <Typography design="money" style={styles.ticketAmount}>
              +${ticket.card.amount}
            </Typography>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <ChunkyButton
          color={SD.primary}
          depthColor={SD.primaryShadow}
          depth={4}
          borderRadius={15}
          contentStyle={styles.redeemFace}
          onPress={() => drawer.current?.close()}
        >
          <Typography design="title" style={styles.redeemLabel}>
            Cash in ${total}
          </Typography>
        </ChunkyButton>
      </View>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: SD.surface2,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  ticketTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: SD.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketText: {
    flex: 1,
    minWidth: 0,
  },
  ticketTitle: {
    fontSize: 14,
    color: SD.ink,
  },
  ticketSub: {
    fontSize: 11,
    color: SD.soft,
  },
  ticketAmount: {
    fontSize: 13,
    color: SD.primary,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 22,
  },
  redeemFace: {
    paddingVertical: 15,
    alignItems: "center",
  },
  redeemLabel: {
    fontSize: 15,
    color: SD.white,
  },
});
