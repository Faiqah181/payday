import { COLORS, SPACING } from "@/constants/colors";
import { useSound } from "@/contexts/SoundContext";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import {
  BackHandler,
  ImageBackground,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  color?: string;
}

function SettingsRow({
  icon,
  label,
  onPress,
  rightElement,
  color = COLORS.textDark,
}: SettingsRowProps) {
  const { playClick } = useSound();

  return (
    <Pressable
      style={styles.row}
      onPress={
        onPress
          ? () => {
              playClick();
              onPress();
            }
          : undefined
      }
    >
      <Ionicons name={icon} size={24} color={color} style={styles.rowIcon} />
      <Text style={[styles.rowLabel, { color }]}>{label}</Text>
      {rightElement ?? (
        <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
      )}
    </Pressable>
  );
}

export default function Settings() {
  const { soundEnabled, toggleSound, playClick } = useSound();

  return (
    <ImageBackground
      source={require("@/assets/images/generic-background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <SettingsRow
          icon="volume-high"
          label="Sound"
          rightElement={
            <Switch
              value={soundEnabled}
              onValueChange={() => {
                playClick();
                toggleSound();
              }}
              trackColor={{ false: "#ccc", true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          }
        />

        <SettingsRow
          icon="mail"
          label="Support"
          onPress={() => Linking.openURL("mailto:abchelp@support.com")}
        />

        <SettingsRow icon="star" label="Rate Us" onPress={() => {}} />

        <SettingsRow
          icon="exit"
          label="Quit Game"
          color="#D32F2F"
          onPress={() => BackHandler.exitApp()}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    height: 56,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontWeight: "800" as const,
    fontSize: 18,
  },
});
