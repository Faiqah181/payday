import { COLORS, SPACING } from "@/constants/colors";
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
import { useSound } from "@/contexts/SoundContext";

const PLAYER_OPTIONS = [2, 3, 4];
const MONTH_OPTIONS = [2, 3, 4, 5, 6];
const ACCOUNT_TYPES = ["Savings", "Loan"] as const;
type AccountType = (typeof ACCOUNT_TYPES)[number];

const PLAYER_COLORS = ["#E53935", "#1E88E5", "#43A047", "#FB8C00"];

export default function GameSetup() {
  const router = useRouter();
  const { playClick } = useSound();
  const [playerCount, setPlayerCount] = useState(2);
  const [monthCount, setMonthCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: PLAYER_OPTIONS[PLAYER_OPTIONS.length - 1] }, (_, i) => `Player ${i + 1}`)
  );
  const [accountTypes, setAccountTypes] = useState<AccountType[]>(
    Array(PLAYER_OPTIONS[PLAYER_OPTIONS.length - 1]).fill("Savings")
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
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {/* GAME SETTINGS Header */}
        <View style={styles.headerPanel}>
          <Ionicons name="settings" size={22} color={COLORS.white} />
          <Text style={styles.headerPanelText}>GAME SETTINGS</Text>
        </View>

        {/* 1. NUMBER OF PLAYERS */}
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>1. NUMBER OF PLAYERS</Text>
          <Ionicons
            name="people"
            size={48}
            color="#FFB74D"
            style={styles.sectionIcon}
          />
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
                <Text
                  style={[
                    styles.optionText,
                    playerCount === n && styles.optionTextSelected,
                  ]}
                >
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 2. NUMBER OF MONTHS */}
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>2. NUMBER OF MONTHS</Text>
          <Ionicons
            name="calendar"
            size={48}
            color="#FFB74D"
            style={styles.sectionIcon}
          />
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
                <Text
                  style={[
                    styles.optionText,
                    monthCount === n && styles.optionTextSelected,
                  ]}
                >
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 3. PLAYER INFO */}
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>3. PLAYER INFO</Text>
          {Array.from({ length: playerCount }, (_, i) => (
            <View key={i} style={styles.playerCard}>
              <View style={styles.playerRow}>
                <Ionicons
                  name="person-circle"
                  size={44}
                  color={PLAYER_COLORS[i]}
                />
                <View style={styles.playerInputArea}>
                  <Text style={styles.playerLabel}>
                    PLAYER {i + 1} NAME...
                  </Text>
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
                      accountTypes[i] === "Savings" && styles.accountBtnSavings,
                    ]}
                    onPress={() => updateAccountType(i, "Savings")}
                  >
                    <Ionicons
                      name="cash"
                      size={18}
                      color={accountTypes[i] === "Savings" ? COLORS.white : "#666"}
                    />
                    <Text
                      style={[
                        styles.accountBtnText,
                        accountTypes[i] === "Savings" && styles.accountBtnTextActive,
                      ]}
                    >
                      SAVING
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.accountBtn,
                      accountTypes[i] === "Loan" && styles.accountBtnLoan,
                    ]}
                    onPress={() => updateAccountType(i, "Loan")}
                  >
                    <Ionicons
                      name="book"
                      size={18}
                      color={accountTypes[i] === "Loan" ? COLORS.white : "#666"}
                    />
                    <Text
                      style={[
                        styles.accountBtnText,
                        accountTypes[i] === "Loan" && styles.accountBtnTextActive,
                      ]}
                    >
                      LOAN
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 4. START GAME */}
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>4. START GAME</Text>
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
              colors={allNamesFilled ? ["#4CAF50", "#2E7D32"] : ["#90A4AE", "#78909C"]}
              style={styles.startButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.startButtonText}>START GAME!</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },

  // Header panel
  headerPanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 80, 70, 0.85)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(150, 230, 255, 0.4)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: SPACING.md,
    gap: 10,
  },
  headerPanelText: {
    fontWeight: "800",
    fontSize: 20,
    color: COLORS.white,
    letterSpacing: 2,
  },

  // Section panels
  panel: {
    backgroundColor: "rgba(0, 80, 70, 0.75)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(150, 230, 255, 0.4)",
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  sectionIcon: {
    marginBottom: 10,
  },

  // Option buttons (player count, month count)
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  optionButton: {
    width: 56,
    height: 52,
    borderRadius: 12,
    backgroundColor: "rgba(80, 130, 140, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionButtonSelected: {
    backgroundColor: "rgba(60, 150, 160, 0.9)",
    borderColor: "rgba(100, 220, 255, 0.8)",
    shadowColor: "#64DCFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  optionText: {
    fontWeight: "800",
    fontSize: 24,
    color: "rgba(200, 220, 230, 0.7)",
  },
  optionTextSelected: {
    color: COLORS.white,
  },

  // Player cards
  playerCard: {
    backgroundColor: "rgba(220, 235, 240, 0.95)",
    borderRadius: 14,
    padding: 12,
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
    fontSize: 10,
    color: "#666",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  // Account type buttons
  accountButtons: {
    gap: 6,
  },
  accountBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(180, 200, 210, 0.8)",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 4,
    minWidth: 80,
  },
  accountBtnSavings: {
    backgroundColor: "#43A047",
  },
  accountBtnLoan: {
    backgroundColor: "#1a6b5a",
  },
  accountBtnText: {
    fontWeight: "800",
    fontSize: 10,
    color: "#666",
    letterSpacing: 0.5,
  },
  accountBtnTextActive: {
    color: COLORS.white,
  },

  // Start button
  startButton: {
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
