import ChunkyButton from "@/components/ui/ChunkyButton";
import PlayerToken from "@/components/ui/PlayerToken";
import ScreenBackground from "@/components/ui/ScreenBackground";
import Typography from "@/components/ui/Typography";
import { FONTS } from "@/constants/fonts";
import { mixHex, SD, SD_TOKEN_COLORS } from "@/constants/theme";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const PLAYER_OPTIONS = [2, 3, 4];
const LEN_PRESETS: [number, string][] = [
  [3, "3 months"],
  [6, "6 months"],
];
const MIN_MONTHS = 2;
const MAX_MONTHS = 12;

const clampLen = (n: number) => Math.max(MIN_MONTHS, Math.min(MAX_MONTHS, n));
const durHint = (m: number) =>
  m <= 3 ? "about 1 hour" : m <= 6 ? "about 2 hours" : "a long game";

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View>
      <Typography design="body" weight={800} style={styles.eyebrow}>
        {label}
      </Typography>
      {children}
    </View>
  );
}

export default function GameSetup() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState(2);
  const [monthCount, setMonthCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: 4 }, (_, i) => `Player ${i + 1}`),
  );

  const updateName = (index: number, name: string) => {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  };

  const allNamesFilled = playerNames
    .slice(0, playerCount)
    .every((name) => name.trim().length > 0);

  const startGame = () => {
    if (!allNamesFilled) return;
    router.push({
      pathname: "/game",
      params: {
        playerNames: playerNames.slice(0, playerCount).join(","),
        playerCount: String(playerCount),
        monthCount: String(monthCount),
      },
    });
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <ChunkyButton
            color={SD.surface2}
            depthColor="rgba(0,0,0,0.1)"
            depth={3}
            borderRadius={12}
            contentStyle={styles.backFace}
            onPress={() => router.back()}
          >
            <Typography design="title" style={styles.backGlyph}>
              ‹
            </Typography>
          </ChunkyButton>
          <Typography design="title" style={styles.screenTitle}>
            New Game
          </Typography>
        </View>

        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid={true}
          extraScrollHeight={20}
          showsVerticalScrollIndicator={false}
        >
          <Section label="GAME LENGTH">
            <View style={styles.lengthCard}>
              <View>
                <Typography design="title" style={styles.lengthLabel}>
                  Game length
                </Typography>
                <Typography design="body" weight={700} style={styles.lengthSub}>
                  {monthCount === 1 ? "1 month" : `${monthCount} months`} ·{" "}
                  {durHint(monthCount)}
                </Typography>
              </View>
              <View style={styles.stepper}>
                <ChunkyButton
                  color={SD.surface}
                  depthColor="rgba(0,0,0,0.1)"
                  depth={3}
                  borderRadius={12}
                  contentStyle={styles.stepBtnFace}
                  onPress={() => setMonthCount((m) => clampLen(m - 1))}
                >
                  <Typography design="title" style={styles.stepGlyph}>
                    −
                  </Typography>
                </ChunkyButton>
                <Typography design="title" style={styles.stepNum}>
                  {String(monthCount)}
                </Typography>
                <ChunkyButton
                  color={SD.surface}
                  depthColor="rgba(0,0,0,0.1)"
                  depth={3}
                  borderRadius={12}
                  contentStyle={styles.stepBtnFace}
                  onPress={() => setMonthCount((m) => clampLen(m + 1))}
                >
                  <Typography design="title" style={styles.stepGlyph}>
                    +
                  </Typography>
                </ChunkyButton>
              </View>
            </View>
            <View style={styles.presetRow}>
              {LEN_PRESETS.map(([months, label]) => {
                const active = monthCount === months;
                return (
                  <ChunkyButton
                    key={months}
                    color={active ? SD.primary : SD.surface2}
                    depthColor={
                      active ? SD.primaryShadow : mixHex(SD.surface2, "#000000", 0.1)
                    }
                    depth={3}
                    borderRadius={12}
                    style={styles.presetBtn}
                    contentStyle={styles.presetFace}
                    onPress={() => setMonthCount(months)}
                  >
                    <Typography
                      design="title"
                      style={[
                        styles.presetLabel,
                        { color: active ? SD.white : SD.soft },
                      ]}
                    >
                      {label}
                    </Typography>
                  </ChunkyButton>
                );
              })}
            </View>
          </Section>

          <Section label="PLAYERS">
            <View style={styles.playerChips}>
              {PLAYER_OPTIONS.map((n) => {
                const active = playerCount === n;
                return (
                  <ChunkyButton
                    key={n}
                    color={active ? SD.primary : SD.surface2}
                    depthColor={
                      active ? SD.primaryShadow : mixHex(SD.surface2, "#000000", 0.12)
                    }
                    depth={4}
                    borderRadius={15}
                    style={styles.playerChip}
                    contentStyle={styles.playerChipFace}
                    onPress={() => setPlayerCount(n)}
                  >
                    <Typography
                      design="title"
                      style={[
                        styles.playerChipLabel,
                        { color: active ? SD.white : SD.ink },
                      ]}
                    >
                      {n} Players
                    </Typography>
                  </ChunkyButton>
                );
              })}
            </View>
            <View style={styles.playerRows}>
              {Array.from({ length: playerCount }, (_, i) => {
                const token = SD_TOKEN_COLORS[i % SD_TOKEN_COLORS.length];
                const initial =
                  playerNames[i]?.trim()?.[0]?.toUpperCase() || String(i + 1);
                return (
                  <View key={i} style={styles.playerRow}>
                    <PlayerToken initial={initial} color={token.color} size={28} />
                    <TextInput
                      style={styles.playerNameInput}
                      value={playerNames[i]}
                      onChangeText={(text) => updateName(i, text)}
                      placeholder={`Player ${i + 1}`}
                      placeholderTextColor={SD.soft}
                      maxLength={15}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                );
              })}
            </View>
          </Section>

          <Section label="MODE">
            <View style={styles.modeCard}>
              <View style={styles.modeTile}>
                <Typography design="title" style={styles.modeTileGlyph}>
                  ▦
                </Typography>
              </View>
              <View style={styles.modeText}>
                <Typography design="title" style={styles.modeTitle}>
                  Pass & Play
                </Typography>
                <Typography design="body" weight={700} style={styles.modeSub}>
                  One device, take turns
                </Typography>
              </View>
              <Typography design="body" weight={800} style={styles.modeLink}>
                Play online ›
              </Typography>
            </View>
          </Section>
        </KeyboardAwareScrollView>

        <View style={styles.footer}>
          <ChunkyButton
            color={SD.primary}
            depthColor={SD.primaryShadow}
            depth={5}
            borderRadius={18}
            disabled={!allNamesFilled}
            contentStyle={styles.startFace}
            onPress={startGame}
          >
            <Typography design="title" style={styles.startLabel}>
              Start Game
            </Typography>
          </ChunkyButton>
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
    paddingTop: 10,
    paddingBottom: 6,
  },
  backFace: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backGlyph: {
    fontSize: 18,
    lineHeight: 22,
    color: SD.ink,
  },
  screenTitle: {
    fontSize: 22,
    color: SD.ink,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 20,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: SD.soft,
    marginBottom: 9,
  },
  lengthCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: SD.surface2,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  lengthLabel: {
    fontSize: 18,
    color: SD.ink,
  },
  lengthSub: {
    fontSize: 11,
    color: SD.soft,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  stepBtnFace: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  stepGlyph: {
    fontSize: 22,
    lineHeight: 26,
    color: SD.primary,
  },
  stepNum: {
    minWidth: 30,
    textAlign: "center",
    fontSize: 26,
    color: SD.ink,
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 9,
  },
  presetBtn: {
    flex: 1,
  },
  presetFace: {
    paddingVertical: 9,
    alignItems: "center",
  },
  presetLabel: {
    fontSize: 13,
  },
  playerChips: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 12,
  },
  playerChip: {
    flex: 1,
  },
  playerChipFace: {
    paddingVertical: 12,
    alignItems: "center",
  },
  playerChipLabel: {
    fontSize: 15,
  },
  playerRows: {
    gap: 8,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: SD.surface2,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  playerNameInput: {
    flex: 1,
    fontFamily: FONTS.extrabold,
    fontSize: 15,
    color: SD.ink,
    padding: 0,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SD.surface2,
    borderRadius: 16,
    padding: 13,
  },
  modeTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: SD.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  modeTileGlyph: {
    fontSize: 18,
    color: SD.white,
  },
  modeText: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    color: SD.ink,
  },
  modeSub: {
    fontSize: 12,
    color: SD.soft,
  },
  modeLink: {
    fontSize: 12,
    color: SD.soft,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 2,
    borderTopColor: SD.line,
  },
  startFace: {
    paddingVertical: 17,
    alignItems: "center",
  },
  startLabel: {
    fontSize: 17,
    color: SD.white,
  },
});
