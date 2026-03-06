import { COLORS, SPACING, BORDER_RADIUS } from "@/constants/colors";
import MenuButton from "@/components/menu/MenuButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const PLAYER_OPTIONS = [2, 3, 4];
const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6];
const ACCOUNT_TYPES = ["Savings", "Loan"] as const;
type AccountType = (typeof ACCOUNT_TYPES)[number];

export default function GameSetup() {
  const [playerCount, setPlayerCount] = useState(2);
  const [monthCount, setMonthCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(PLAYER_OPTIONS[PLAYER_OPTIONS.length - 1]).fill("")
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
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} enableOnAndroid={true} extraScrollHeight={20}>
        <Text style={styles.heading}>Game Setup</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Number of Players</Text>
          <View style={styles.optionsRow}>
            {PLAYER_OPTIONS.map((n) => (
              <Pressable
                key={n}
                style={[
                  styles.optionButton,
                  playerCount === n && styles.optionButtonSelected,
                ]}
                onPress={() => setPlayerCount(n)}
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

        <View style={styles.section}>
          <Text style={styles.label}>Number of Months</Text>
          <View style={styles.optionsRow}>
            {MONTH_OPTIONS.map((n) => (
              <Pressable
                key={n}
                style={[
                  styles.optionButton,
                  monthCount === n && styles.optionButtonSelected,
                ]}
                onPress={() => setMonthCount(n)}
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

        <View style={styles.section}>
          <Text style={styles.label}>Players</Text>
          {Array.from({ length: playerCount }, (_, i) => (
            <View key={i} style={styles.playerCard}>
              <TextInput
                style={styles.nameInput}
                placeholder={`Player ${i + 1}`}
                placeholderTextColor="#9E9E9E"
                value={playerNames[i]}
                onChangeText={(text) => updateName(i, text)}
                maxLength={15}
                underlineColorAndroid="transparent"
              />
              <View style={styles.toggleRow}>
                {ACCOUNT_TYPES.map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.toggleButton,
                      accountTypes[i] === type &&
                        (type === "Savings"
                          ? styles.toggleButtonSavings
                          : styles.toggleButtonLoan),
                    ]}
                    onPress={() => updateAccountType(i, type)}
                  >
                    <Ionicons
                      name={type === "Savings" ? "wallet" : "card"}
                      size={16}
                      color={
                        accountTypes[i] === type
                          ? COLORS.white
                          : COLORS.textDark
                      }
                      style={styles.toggleIcon}
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        accountTypes[i] === type && styles.toggleTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.startContainer}>
          <MenuButton
            title="Start Game"
            variant={allNamesFilled ? "primary" : "disabled"}
            icon="play"
            size="large"
            enterDelay={0}
            onPress={() => {
              if (!allNamesFilled) return;
              // TODO: navigate to game screen with params
            }}
          />
        </View>

        </KeyboardAwareScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },
  heading: {
    fontFamily: "BlueWinter",
    fontSize: 42,
    color: COLORS.titleGreen,
    textShadowColor: COLORS.titleOutline,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    textAlign: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontFamily: "BlueWinter",
    fontSize: 20,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  optionButton: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryBorder,
  },
  optionText: {
    fontFamily: "BlueWinter",
    fontSize: 22,
    color: COLORS.textDark,
  },
  optionTextSelected: {
    color: COLORS.white,
  },
  playerCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.button,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  nameInput: {
    fontSize: 16,
    fontFamily: "BlueWinter",
    color: COLORS.textDark,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 0,
  },
  toggleRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonSavings: {
    backgroundColor: "#2E7D32",
  },
  toggleButtonLoan: {
    backgroundColor: COLORS.primary,
  },
  toggleIcon: {
    marginRight: 6,
  },
  toggleText: {
    fontFamily: "BlueWinter",
    fontSize: 14,
    color: COLORS.textDark,
  },
  toggleTextSelected: {
    color: COLORS.white,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  startContainer: {
    marginTop: SPACING.xl,
    width: "100%",
  },
});
