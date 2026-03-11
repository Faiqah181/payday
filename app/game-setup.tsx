import Bank from "@/assets/svg/bank.svg";
import CalendarClockSvg from "@/assets/svg/calendar-clock.svg";
import CalendarSvg from "@/assets/svg/calendar.svg";
import CoinSvg from "@/assets/svg/coin.svg";
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
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const PLAYER_OPTIONS = [2, 3, 4];
const MONTH_OPTIONS = [2, 3, 4, 5, 6];
const ACCOUNT_TYPES = ["Savings", "Loan"] as const;
type AccountType = (typeof ACCOUNT_TYPES)[number];

const PLAYER_COLORS = ["#3F86BE", "#E8554B", "#F6BF4B", "#A871CF"];

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
              GAME SETTINGS
            </StrokeText>
          </View>
        </View>

        <View style={styles.setup}>
          {/* 1. NUMBER OF PLAYERS */}
          <View style={styles.player_panel}>
            <StrokeText fontSize={16} letterSpacing={2}>
              1. NUMBER OF PLAYERS
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
          </View>

          {/* 2. NUMBER OF MONTHS */}
          <View style={styles.panel}>
            <StrokeText fontSize={16} letterSpacing={2}>
              2. NUMBER OF MONTHS
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
          {/* 3. PLAYER INFO */}
          <View style={[styles.panel, styles.player_info_panel]}>
            <StrokeText fontSize={16} letterSpacing={2}>
              3. PLAYER INFO
            </StrokeText>
            {Array.from({ length: playerCount }, (_, i) => (
              <View key={i} style={styles.playerCard}>
                <View style={styles.playerRow}>
                  <Ionicons
                    name="person-circle"
                    size={44}
                    color={PLAYER_COLORS[i]}
                    style={{
                      borderColor: "#fff",
                      borderWidth: 2,
                      borderRadius: 50,
                      backgroundColor: "#AFDAE1",
                    }}
                  />
                  <View style={styles.playerInputArea}>
                    <Text style={styles.playerLabel}>PLAYER {i + 1} NAME</Text>
                    <TextInput
                      style={styles.nameInput}
                      placeholder={`Enter name`}
                      placeholderTextColor="#9E9E9E"
                      value={playerNames[i]}
                      onChangeText={(text) => updateName(i, text)}
                      maxLength={15}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                  <View style={styles.accountButtons}>
                    <Pressable
                      style={[
                        styles.accountBtn,
                        accountTypes[i] === "Savings" &&
                          styles.accountBtnSelected,
                      ]}
                      onPress={() => updateAccountType(i, "Savings")}
                    >
                      <CoinSvg width={20} height={20} />
                      <Text style={styles.accountBtnText}>SAVING</Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.accountBtn,
                        accountTypes[i] === "Loan" && styles.accountBtnSelected,
                      ]}
                      onPress={() => updateAccountType(i, "Loan")}
                    >
                      <Bank width={20} height={20} />
                      <Text style={styles.accountBtnText}>LOAN</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* 4. START GAME */}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#000",
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
  player_panel: {
    borderRadius: 16,
    padding: SPACING.sm,
    alignItems: "center",
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
  playerCard: {
    marginBottom: 10,
    width: "100%",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playerInputArea: {
    flex: 1,
  },
  playerLabel: {
    fontWeight: "700",
    fontSize: 13,
    color: "#2C4643",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nameInput: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  // Account type buttons
  accountButtons: {
    flexDirection: "row",
    gap: 4,
  },
  accountBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B0BEC5",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  accountBtnSelected: {
    backgroundColor: "#B1E9FA",
    borderColor: "rgba(255, 255, 255, 1)",
    borderWidth: 3,
  },
  accountBtnText: {
    fontWeight: "600",
    fontSize: 10,
    color: "#000",
    letterSpacing: 0.5,
  },

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
