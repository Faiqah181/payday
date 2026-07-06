import CalendarClockSvg from "@/assets/svg/calendar-clock.svg";
import CalendarSvg from "@/assets/svg/calendar.svg";
import { type AccountType } from "@/components/menu/AccountTypeSwitcher";
import PlayerSetupCard from "@/components/menu/PlayerSetupCard";
import StrokeText from "@/components/StrokeText";
import { COLORS, SPACING } from "@/constants/colors";
import { useSound } from "@/contexts/SoundContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const PLAYER_OPTIONS = [2, 3, 4];
const MONTH_OPTIONS = [2, 3, 4, 5, 6];

export default function GameSetup() {
  const router = useRouter();
  const { playClick } = useSound();
  const [playerCount, setPlayerCount] = useState(2);
  const [monthCount, setMonthCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from(
      { length: PLAYER_OPTIONS[PLAYER_OPTIONS.length - 1] },
      (_, i) => `Player ${i + 1}`,
    ),
  );
  const [accountTypes, setAccountTypes] = useState<AccountType[]>(
    Array(PLAYER_OPTIONS[PLAYER_OPTIONS.length - 1]).fill("Savings"),
  );

  const updateName = (index: number, name: string) => {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  };

  const updateAccountType = (index: number, type: AccountType) => {
    playClick();
    setAccountTypes((prev) => {
      const next = [...prev];
      next[index] = type;
      return next;
    });
  };

  const allNamesFilled = playerNames
    .slice(0, playerCount)
    .every((name) => name.trim().length > 0);

  return (
    <ImageBackground
      source={require("@/assets/images/generic-background.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.9 }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {/* GAME SETTINGS Header */}
        <View style={styles.headerPanel}>
          <CalendarSvg width={36} height={36} />
          <View style={{ width: 210 }}>
            <StrokeText fontSize={24} letterSpacing={2}>
              GAME SETUP
            </StrokeText>
          </View>
        </View>

        <View style={styles.setup}>
          {/* NUMBER OF MONTHS */}
          <View style={styles.panel}>
            <StrokeText fontSize={16} letterSpacing={2}>
              GAME LENGTH (MONTHS)
            </StrokeText>
            <CalendarClockSvg width={48} height={48} />
            <View style={styles.optionsRow}>
              {MONTH_OPTIONS.map((n) => (
                <Pressable
                  key={n}
                  style={[
                    styles.optionButton,
                    monthCount === n && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    playClick();
                    setMonthCount(n);
                  }}
                >
                  <StrokeText fontSize={24} strokeColor="#555" fillColor="#FFF">
                    {String(n)}
                  </StrokeText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* PLAYERS */}
          <View style={[styles.panel, styles.player_info_panel]}>
            <StrokeText fontSize={16} letterSpacing={2}>
              PLAYERS
            </StrokeText>
            <Ionicons name="people" size={48} color="#fff" />
            <View style={styles.optionsRow}>
              {PLAYER_OPTIONS.map((n) => (
                <Pressable
                  key={n}
                  style={[
                    styles.optionButton,
                    playerCount === n && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    playClick();
                    setPlayerCount(n);
                  }}
                >
                  <StrokeText fontSize={24} strokeColor="#555" fillColor="#FFF">
                    {String(n)}
                  </StrokeText>
                </Pressable>
              ))}
            </View>
            <View style={styles.playersList}>
              {Array.from({ length: playerCount }, (_, i) => (
                <PlayerSetupCard
                  key={i}
                  index={i}
                  name={playerNames[i]}
                  accountType={accountTypes[i]}
                  onChangeName={(text) => updateName(i, text)}
                  onChangeAccountType={(type) => updateAccountType(i, type)}
                />
              ))}
            </View>
          </View>

          {/* START GAME */}
          <View style={styles.start_btn}>
            <Pressable
              onPress={() => {
                if (!allNamesFilled) return;
                playClick();
                router.push({
                  pathname: "/game",
                  params: {
                    playerNames: playerNames.slice(0, playerCount).join(","),
                    accountTypes: accountTypes.slice(0, playerCount).join(","),
                    playerCount: String(playerCount),
                    monthCount: String(monthCount),
                  },
                });
              }}
            >
              <LinearGradient
                colors={
                  allNamesFilled
                    ? ["#A5E887", "#41BABB"]
                    : ["#90A4AE", "#78909C"]
                }
                style={styles.startButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <StrokeText fontSize={22} letterSpacing={2}>
                  START GAME!
                </StrokeText>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Pressable
        style={styles.backButton}
        onPress={() => {
          playClick();
          router.back();
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 26,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.md,
    paddingBottom: 40,
  },

  // Header panel
  headerPanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(153, 208, 229, 0.75)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(229, 239, 241, 0.98)",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  headerPanelText: {
    fontWeight: "800",
    fontSize: 20,
    color: COLORS.white,
    letterSpacing: 2,
  },
  // Section panels
  setup: {
    backgroundColor: "#90CDC6",
    borderColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 4,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    borderTopWidth: 0,
    gap: SPACING.sm,
  },
  panel: {
    backgroundColor: "#70ACA8",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#BFF3ED",
    padding: SPACING.md,
    alignItems: "center",
    width: "97%",
    alignSelf: "center",
  },
  player_info_panel: {
    gap: 4,
  },
  playersList: {
    width: "100%",
    marginTop: 8,
  },
  start_btn: {
    alignSelf: "center",
    transform: [{ translateY: 25 }],
  },
  sectionTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 1.5,
  },

  // Option buttons (player count, month count)
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#30616A",
    borderRadius: 14,
    padding: 4,
  },
  optionButton: {
    width: 42,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#6B94A6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  optionButtonSelected: {
    backgroundColor: "#B0EAFD",
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 3,
    shadowColor: "#B0EAFD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },

  // Player cards

  // Start button
  startButton: {
    borderRadius: 28,
    borderColor: COLORS.white,
    borderWidth: 3,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  startButtonText: {
    fontWeight: "800",
    fontSize: 26,
    color: COLORS.white,
    letterSpacing: 2,
  },
});
