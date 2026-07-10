import ChunkyButton from "@/components/ui/ChunkyButton";
import ScreenBackground from "@/components/ui/ScreenBackground";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEEDBACK_EMAIL = "kamranasad7@gmail.com";

function IconTile({ color, glyph }: { color: string; glyph: string }) {
  return (
    <View style={[styles.iconTile, { backgroundColor: color }]}>
      <Typography design="title" style={styles.iconGlyph}>
        {glyph}
      </Typography>
    </View>
  );
}

interface SettingsRowProps {
  tileColor: string;
  glyph: string;
  title: string;
  subtitle: string;
  right?: ReactNode;
  divider?: boolean;
  onPress?: () => void;
}

function SettingsRow({
  tileColor,
  glyph,
  title,
  subtitle,
  right,
  divider = false,
  onPress,
}: SettingsRowProps) {
  const { playClick } = useSound();
  const content = (
    <>
      <IconTile color={tileColor} glyph={glyph} />
      <View style={styles.rowText}>
        <Typography design="title" weight={800} style={styles.rowTitle}>
          {title}
        </Typography>
        <Typography design="body" weight={700} style={styles.rowSubtitle}>
          {subtitle}
        </Typography>
      </View>
      {right}
    </>
  );
  const rowStyle = [styles.row, divider && styles.rowDivider];

  if (onPress) {
    return (
      <Pressable
        style={rowStyle}
        onPress={() => {
          playClick();
          onPress();
        }}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={rowStyle}>{content}</View>;
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View>
      <Typography design="body" weight={800} style={styles.eyebrow}>
        {label}
      </Typography>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export default function Settings() {
  const router = useRouter();
  const { soundEnabled, toggleSound, hapticsEnabled, toggleHaptics, playClick } =
    useSound();

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
          Settings
        </Typography>
      </View>

      <View style={styles.content}>
        <Section label="SOUND & FEEL">
          <SettingsRow
            tileColor={SD.blue}
            glyph="♪"
            title="Sound"
            subtitle="Dice, coins & effects"
            right={
              <ToggleSwitch
                value={soundEnabled}
                onToggle={() => {
                  playClick();
                  toggleSound();
                }}
              />
            }
          />
          <SettingsRow
            tileColor={SD.purple}
            glyph="≈"
            title="Haptic feedback"
            subtitle="Vibrate on rolls & pay day"
            divider
            right={
              <ToggleSwitch
                value={hapticsEnabled}
                onToggle={() => {
                  playClick();
                  toggleHaptics();
                }}
              />
            }
          />
        </Section>

        <Section label="ABOUT">
          <SettingsRow
            tileColor={SD.accent}
            glyph="★"
            title="Rate the app"
            subtitle="Enjoying Salary Day? Leave 5 stars"
            right={
              <Typography design="title" style={styles.stars}>
                ★★★★★
              </Typography>
            }
            onPress={() => {}}
          />
          <SettingsRow
            tileColor={SD.primary}
            glyph="✉"
            title="Give Feedback"
            subtitle="Get a reply directly from the game developer"
            divider
            onPress={() => Linking.openURL(`mailto:${FEEDBACK_EMAIL}`)}
          />
        </Section>

        <Typography design="body" weight={700} style={styles.footer}>
          Salary Day · v1.0.0
        </Typography>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 18,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: SD.soft,
    marginBottom: 9,
  },
  card: {
    backgroundColor: SD.surface,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: SD.line,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlyph: {
    fontSize: 21,
    lineHeight: 26,
    color: SD.white,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    color: SD.ink,
  },
  rowSubtitle: {
    fontSize: 11,
    color: SD.soft,
  },
  stars: {
    fontSize: 17,
    color: SD.accent,
  },
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: SD.soft,
    marginTop: -4,
  },
});
