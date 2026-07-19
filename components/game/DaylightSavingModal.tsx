import DaylightSavingIcon from "@/components/game/DaylightSavingIcon";
import { EventButton } from "@/components/game/events/EventFooter";
import EventPlayerRow from "@/components/game/events/EventPlayerRow";
import EventShell from "@/components/game/events/EventShell";
import { getSpaceByDay, getSpaceDetail } from "@/constants/board";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { SD_EVENT_GRADIENTS } from "@/constants/theme";
import type { Player } from "@/types/game";
import { ScrollView, StyleSheet, View } from "react-native";

const GOLD = "#F4D03F";

interface DaylightSavingModalProps {
  players: Player[];
  /** Matches the reducer's out-check for retired/bankrupt players. */
  totalMonths: number;
  onConfirm: () => void;
}

const initialOf = (player: Player) =>
  player.name?.trim()?.[0]?.toUpperCase() || "?";

function tileName(day: number): string {
  if (day <= 0) return "Start";
  const space = getSpaceByDay(day);
  return space ? getSpaceDetail(space.type).title : `Day ${day}`;
}

/** Only the landing space is named — where they came from is just a number. */
function landingLabel(day: number): string {
  return day <= 0 ? "Start" : `Day ${day} · ${tileName(day)}`;
}

interface MoveStatus {
  text: string;
  color?: string;
  out: boolean;
}

// Mirrors CONFIRM_DAYLIGHT_SAVING: retired players sit out, Start players
// stay and re-collect salary, everyone else steps back one space.
function moveStatus(player: Player, totalMonths: number): MoveStatus {
  if (player.bankrupt || player.currentMonth > totalMonths) {
    return { text: "Retired · sits out", out: true };
  }
  if (player.position === 0) {
    return {
      text: `Stays on Start · collects $${GAME_CONFIG.salary}`,
      color: GOLD,
      out: false,
    };
  }
  const from = player.position;
  return { text: `Day ${from} → ${landingLabel(from - 1)}`, out: false };
}

export default function DaylightSavingModal({
  players,
  totalMonths,
  onConfirm,
}: DaylightSavingModalProps) {
  return (
    <EventShell
      gradient={SD_EVENT_GRADIENTS.daylight}
      emblem={<DaylightSavingIcon size={62} />}
      eyebrow="DAYLIGHT SAVINGS"
      title="Fall back!"
      subtitle="Every player moves back one space and follows it"
      footer={<EventButton label="Move everyone back" onPress={onConfirm} />}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {players.map((player, i) => {
          const status = moveStatus(player, totalMonths);
          return (
            <EventPlayerRow
              key={i}
              name={player.name}
              initial={initialOf(player)}
              color={player.color}
              statusText={status.text}
              statusColor={status.color}
              out={status.out}
              right={status.out ? undefined : <View style={styles.noSlot} />}
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
