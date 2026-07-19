import ComingSoonBadge from "@/components/menu/ComingSoonBadge";
import Avatar from "@/components/ui/Avatar";
import ChunkyButton from "@/components/ui/ChunkyButton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { useProfile } from "@/contexts/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  AppState,
  BackHandler,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { name, avatarColor } = useProfile();
  const [confirmExit, setConfirmExit] = useState(false);

  // Only while the menu is focused: hardware back asks to quit rather than
  // silently backgrounding the app. (useFocusEffect so it doesn't hijack
  // back on pushed screens like Settings, which stay mounted underneath.)
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        setConfirmExit((open) => !open);
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, []),
  );

  // If the OS only backgrounds the app on exit (some Android skins) instead of
  // killing it, clear the dialog so a resume lands on the menu, not the modal.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") setConfirmExit(false);
    });
    return () => sub.remove();
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/main-menu.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topRow}>
          <ChunkyButton
            color={SD.semiWhite}
            depthColor="rgba(0,0,0,0.12)"
            depth={3}
            borderRadius={13}
            contentStyle={styles.exitFace}
            onPress={() => setConfirmExit(true)}
          >
            <Ionicons name="exit-outline" size={22} color={SD.ink} />
          </ChunkyButton>
          <Pressable
            style={styles.profileChip}
            onPress={() => router.push("/profile")}
          >
            <Avatar name={name} color={avatarColor} size={32} />
            <Typography design="body" weight={800} style={styles.profileName}>
              {name}
            </Typography>
          </Pressable>
        </View>

        <View style={styles.spacer} />

        <View style={styles.menu}>
          <ChunkyButton
            color={SD.primary}
            depthColor={SD.primaryShadow}
            depth={6}
            contentStyle={styles.menuCard}
            onPress={() => router.push("/game-setup")}
          >
            <View style={[styles.iconTile, styles.iconTileLight]}>
              <Text style={styles.iconEmoji}>👥</Text>
            </View>
            <View style={styles.menuCardText}>
              <Typography design="title" style={styles.menuTitleLight}>
                Pass & Play
              </Typography>
              <Typography design="body" weight={700} style={styles.menuSubtitleLight}>
                One device, take turns
              </Typography>
            </View>
            <Typography design="body" weight={800} style={styles.chevronLight}>
              ›
            </Typography>
          </ChunkyButton>

          <View>
            <ComingSoonBadge />
            <ChunkyButton
              color={SD.accent}
              depthColor={SD.accentShadow}
              depth={6}
              borderRadius={20}
              disabled
              contentStyle={styles.menuCard}
              onPress={() => {}}
            >
              <View style={[styles.iconTile, styles.iconTileGold]}>
                <Text style={styles.iconEmoji}>🌐</Text>
              </View>
              <View style={styles.menuCardText}>
                <Typography design="title" style={styles.menuTitleGold}>
                  Play Online
                </Typography>
                <Typography design="body" weight={700} style={styles.menuSubtitleGold}>
                  Create or join a room
                </Typography>
              </View>
              <Typography design="body" weight={800} style={styles.chevronGold}>
                ›
              </Typography>
            </ChunkyButton>
          </View>
        </View>

        <View style={styles.spacer} />

        <View style={styles.smallRow}>
          <ChunkyButton
            color={SD.white}
            depthColor="rgba(0,0,0,0.12)"
            depth={4}
            borderRadius={16}
            style={styles.smallButton}
            contentStyle={styles.smallCard}
            onPress={() => router.push("/how-to-play")}
          >
            <Typography design="title" style={[styles.smallGlyph, { color: SD.blue }]}>
              ?
            </Typography>
            <Typography design="title" style={styles.smallLabel}>
              How to play
            </Typography>
          </ChunkyButton>
          <ChunkyButton
            color={SD.white}
            depthColor="rgba(0,0,0,0.12)"
            depth={4}
            borderRadius={16}
            style={styles.smallButton}
            contentStyle={styles.smallCard}
            onPress={() => router.push("/settings")}
          >
            <Typography design="title" style={[styles.smallGlyph, { color: SD.soft }]}>
              ⚙
            </Typography>
            <Typography design="title" style={styles.smallLabel}>
              Settings
            </Typography>
          </ChunkyButton>
        </View>

        {confirmExit && (
          <ConfirmDialog
            title="Exit the game?"
            body="You'll leave Salary Day and return to your home screen."
            confirmLabel="Exit"
            cancelLabel="Stay"
            onConfirm={() => {
              setConfirmExit(false);
              BackHandler.exitApp();
            }}
            onCancel={() => setConfirmExit(false)}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#E9F6F1",
  },
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  exitFace: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  profileChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: SD.semiWhite,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 11,
    borderRadius: 999,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  profileName: {
    fontSize: 14,
    color: SD.ink,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  menu: {
    gap: 20,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTileLight: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  iconTileGold: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  iconEmoji: {
    fontSize: 24,
  },
  menuCardText: {
    flex: 1,
  },
  menuTitleLight: {
    fontSize: 19,
    color: SD.white,
    lineHeight: 23,
  },
  menuSubtitleLight: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  menuTitleGold: {
    fontSize: 19,
    color: SD.accentInk,
    lineHeight: 23,
  },
  menuSubtitleGold: {
    fontSize: 12,
    color: "rgba(94,61,0,0.75)",
    marginTop: 2,
  },
  chevronLight: {
    fontSize: 32,
    color: "rgba(255,255,255,0.75)",
  },
  chevronGold: {
    fontSize: 32,
    color: "rgba(94,61,0,0.6)",
  },
  smallRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  smallButton: {
    flex: 1,
  },
  smallCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
  },
  smallGlyph: {
    fontSize: 15,
  },
  smallLabel: {
    fontSize: 14,
    color: SD.ink,
  },
});
