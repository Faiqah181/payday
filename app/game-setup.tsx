import { COLORS, SPACING, BORDER_RADIUS } from "@/constants/colors";
import MenuButton from "@/components/menu/MenuButton";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PLAYER_OPTIONS = [2, 3, 4];
const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function GameSetup() {
  const [playerCount, setPlayerCount] = useState(2);
  const [monthCount, setMonthCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(PLAYER_OPTIONS[PLAYER_OPTIONS.length - 1]).fill("")
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

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <Text style={styles.label}>Player Names</Text>
          {Array.from({ length: playerCount }, (_, i) => (
            <TextInput
              key={i}
              style={styles.nameInput}
              placeholder={`Player ${i + 1}`}
              placeholderTextColor="#9E9E9E"
              value={playerNames[i]}
              onChangeText={(text) => updateName(i, text)}
              maxLength={15}
            />
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

        </ScrollView>
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
  nameInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.button,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "BlueWinter",
    color: COLORS.textDark,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  startContainer: {
    marginTop: SPACING.xl,
    width: "100%",
  },
});
