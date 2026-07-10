import { EventButton, EventCashRow } from "@/components/game/events/EventFooter";
import EventPlayerRow from "@/components/game/events/EventPlayerRow";
import EventShell from "@/components/game/events/EventShell";
import Typography from "@/components/ui/Typography";
import { SD_EVENT_GRADIENTS } from "@/constants/theme";
import type { Player } from "@/types/game";
import { ScrollView, StyleSheet, View } from "react-native";

const CONTRIBUTION = 50;

interface ElectionModalProps {
  players: Player[];
  pot: number;
  currentPlayerIndex?: number;
  onConfirm: () => void;
}

const initialOf = (player: Player) =>
  player.name?.trim()?.[0]?.toUpperCase() || "?";

export default function ElectionModal({
  players,
  pot,
  currentPlayerIndex = 0,
  onConfirm,
}: ElectionModalProps) {
  const newPot = pot + players.length * CONTRIBUTION;
  const me = players[currentPlayerIndex];

  return (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.election}
      eyebrow="🗳  TOWN ELECTION"
      title="Everyone chips in"
      subtitle="The next player to roll a 6 wins the whole Pot"
      pot={{ label: "THE POT", value: `$${newPot}` }}
      footer={
        <>
          <EventCashRow initial={initialOf(me)} color={me.color} cash={me.cash} />
          <EventButton
            label={`Everyone pays $${CONTRIBUTION}`}
            onPress={onConfirm}
          />
        </>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {players.map((player, i) => (
          <EventPlayerRow
            key={i}
            name={player.name}
            initial={initialOf(player)}
            color={player.color}
            statusText={`Pays $${CONTRIBUTION} into the Pot`}
            statusColor="#FF9B8E"
            right={<View style={styles.noSlot} />}
          />
        ))}
        <Typography design="body" weight={700} style={styles.note}>
          Short on cash? Savings are withdrawn or a loan is taken automatically.
        </Typography>
      </ScrollView>
    </EventShell>
  );
}

const styles = StyleSheet.create({
  noSlot: {
    width: 0,
    height: 40,
  },
  note: {
    fontSize: 11,
    lineHeight: 17,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 8,
  },
});
