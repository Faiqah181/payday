import StrokeText from "@/components/StrokeText";
import { COLORS, SPACING } from "@/constants/colors";
import { useSound } from "@/contexts/SoundContext";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

function SettingsRow({
  icon,
  label,
  onPress,
  rightElement,
  bgColor,
  borderColor,
}: SettingsRowProps) {
  const { playClick } = useSound();

  return (
    <Pressable
      style={[
        styles.row,
        {
          backgroundColor: bgColor,
          borderBottomColor: borderColor,
        },
      ]}
      onPress={
        onPress
          ? () => {
              playClick();
              onPress();
            }
          : undefined
      }
    >
      <Ionicons
        name={icon}
        size={24}
        color={COLORS.white}
        style={styles.rowIcon}
      />
      <Text style={styles.rowLabel}>{label}</Text>
      {rightElement ?? (
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
      )}
    </Pressable>
  );
}

export default function Settings() {
  const { soundEnabled, toggleSound, playClick } = useSound();
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/generic-background.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              playClick();
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <StrokeText
              fontSize={28}
              fillColor="#FFFFFF"
              strokeColor="#1B5E20"
              strokeWidth={5}
            >
              SETTINGS
            </StrokeText>
          </View>
        </View>

        <View style={styles.content}>
          <SettingsRow
            icon="volume-high"
            label="Sound"
            bgColor={COLORS.primary}
            borderColor={COLORS.primaryBorder}
            rightElement={
              <Switch
                value={soundEnabled}
                onValueChange={() => {
                  playClick();
                  toggleSound();
                }}
                trackColor={{ false: "rgba(255,255,255,0.3)", true: "#4CAF50" }}
                thumbColor={COLORS.white}
              />
            }
          />

          <SettingsRow
            icon="mail"
            label="Support"
            bgColor={COLORS.secondary}
            borderColor={COLORS.secondaryBorder}
            onPress={() => Linking.openURL("mailto:abchelp@support.com")}
          />

          <SettingsRow
            icon="star"
            label="Rate Us"
            bgColor="#AB47BC"
            borderColor="#8E24AA"
            onPress={() => {}}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    marginTop: 26,
    paddingBottom: SPACING.sm,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
    gap: 28,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontWeight: "800" as const,
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 1,
  },
});
