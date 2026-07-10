import { EventButton } from "@/components/game/events/EventFooter";
import EventPlayerRow from "@/components/game/events/EventPlayerRow";
import EventShell from "@/components/game/events/EventShell";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { SD_EVENT_GRADIENTS } from "@/constants/theme";
import type { Player } from "@/types/game";
import { ScrollView, StyleSheet, View } from "react-native";

const GOLD = "#F4D03F";

interface DaylightSavingModalProps {
  players: Player[];
  onConfirm: () => void;
}

const initialOf = (player: Player) =>
  player.name?.trim()?.[0]?.toUpperCase() || "?";

export default function DaylightSavingModal({
  players,
  onConfirm,
}: DaylightSavingModalProps) {
  return (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.daylight}
      eyebrow="🕐  DAYLIGHT SAVINGS"
      title="Fall back!"
      subtitle="Every player moves back one space and follows it"
      footer={<EventButton label="Move everyone back" onPress={onConfirm} />}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {players.map((player, i) => {
          const onStart = player.position === 0;
          return (
            <EventPlayerRow
              key={i}
              name={player.name}
              initial={initialOf(player)}
              color={player.color}
              statusText={
                onStart
                  ? `Stays on Start · collects $${GAME_CONFIG.salary}`
                  : `Day ${player.position} → Day ${player.position - 1}`
              }
              statusColor={onStart ? GOLD : undefined}
              right={<View style={styles.noSlot} />}
            />
          );
        })}
      </ScrollView>
    </EventShell>
  );
}

const styles = StyleSheet.create({
  noSlot: {
    width: 0,
    height: 40,
  },
});
