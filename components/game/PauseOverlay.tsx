import ChunkyButton from "@/components/ui/ChunkyButton";
import ScreenBackground from "@/components/ui/ScreenBackground";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SlideOverlay, { SlideOverlayHandle } from "@/components/ui/SlideOverlay";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PauseOverlayProps {
  month: number;
  totalMonths: number;
  playerCount: number;
  onResume: () => void;
  /** Opens the shared leave-game confirmation (owned by the game screen). */
  onLeave: () => void;
}

function QuickSettingRow({
  tileColor,
  glyph,
  label,
  value,
  onToggle,
  divider = false,
}: {
  tileColor: string;
  glyph: string;
  label: string;
  value: boolean;
  onToggle: () => void;
  divider?: boolean;
}) {
  return (
    <View style={[styles.settingRow, divider && styles.settingRowDivider]}>
      <View style={[styles.settingTile, { backgroundColor: tileColor }]}>
        <Typography design="title" style={styles.settingGlyph}>
          {glyph}
        </Typography>
      </View>
      <Typography design="title" weight={800} style={styles.settingLabel}>
        {label}
      </Typography>
      <ToggleSwitch value={value} onToggle={onToggle} />
    </View>
  );
}

export default function PauseOverlay({
  month,
  totalMonths,
  playerCount,
  onResume,
  onLeave,
}: PauseOverlayProps) {
  const overlay = useRef<SlideOverlayHandle>(null);
  const { soundEnabled, toggleSound, hapticsEnabled, toggleHaptics, playClick } =
    useSound();

  return (
    <SlideOverlay ref={overlay} onClose={onResume} from="left">
      <ScreenBackground>
        <SafeAreaView style={styles.screen}>
          <ScreenHeader title="Game Menu" onBack={() => overlay.current?.close()} />

          <View style={styles.content}>
            <View style={styles.matchCard}>
              <View style={styles.matchTile}>
                <Typography design="money" style={styles.matchTileGlyph}>
                  $
                </Typography>
              </View>
              <View>
                <Typography design="title" style={styles.matchTitle}>
                  Month {month} of {totalMonths}
                </Typography>
                <Typography design="body" weight={700} style={styles.matchSub}>
                  {playerCount} players · Pass & play
                </Typography>
              </View>
            </View>

            <View>
              <Typography design="body" weight={800} style={styles.eyebrow}>
                QUICK SETTINGS
              </Typography>
              <View style={styles.settingsCard}>
                <QuickSettingRow
                  tileColor={SD.blue}
                  glyph="♪"
                  label="Sound"
                  value={soundEnabled}
                  onToggle={() => {
                    playClick();
                    toggleSound();
                  }}
                />
                <QuickSettingRow
                  tileColor={SD.purple}
                  glyph="≈"
                  label="Haptic feedback"
                  value={hapticsEnabled}
                  divider
                  onToggle={() => {
                    playClick();
                    toggleHaptics();
                  }}
                />
              </View>
            </View>

            <View style={styles.spacer} />

            <ChunkyButton
              color={SD.primary}
              depthColor={SD.primaryShadow}
              depth={5}
              borderRadius={18}
              contentStyle={styles.resumeFace}
              onPress={() => overlay.current?.close()}
            >
              <Typography design="title" style={styles.resumeLabel}>
                Back to Game
              </Typography>
            </ChunkyButton>
            <ChunkyButton
              color={SD.debt}
              depthColor="#A82D20"
              depth={5}
              borderRadius={18}
              contentStyle={styles.leaveFace}
              onPress={onLeave}
            >
              <Typography design="title" style={styles.leaveLabel}>
                Leave Game
              </Typography>
            </ChunkyButton>
          </View>
        </SafeAreaView>
      </ScreenBackground>
    </SlideOverlay>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 16,
  },
  matchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: SD.surface,
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
  },
  matchTile: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: SD.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  matchTileGlyph: {
    fontSize: 16,
    color: "#7A4E00",
  },
  matchTitle: {
    fontSize: 16,
    color: SD.ink,
  },
  matchSub: {
    fontSize: 11,
    color: SD.soft,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: SD.soft,
    marginBottom: 9,
  },
  settingsCard: {
    backgroundColor: SD.surface,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  settingRowDivider: {
    borderTopWidth: 1,
    borderTopColor: SD.line,
  },
  settingTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingGlyph: {
    fontSize: 16,
    lineHeight: 20,
    color: SD.white,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    color: SD.ink,
  },
  spacer: {
    flex: 1,
    minHeight: 8,
  },
  resumeFace: {
    paddingVertical: 17,
    alignItems: "center",
  },
  resumeLabel: {
    fontSize: 17,
    color: SD.white,
  },
  leaveFace: {
    paddingVertical: 15,
    alignItems: "center",
  },
  leaveLabel: {
    fontSize: 15,
    color: SD.white,
  },
});
