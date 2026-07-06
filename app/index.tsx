import Avatar from "@/components/Avatar";
import ComingSoonBadge from "@/components/menu/ComingSoonBadge";
import ChunkyButton from "@/components/ui/ChunkyButton";
import { FONTS } from "@/constants/fonts";
import { SD } from "@/constants/theme";
import { useSound } from "@/contexts/SoundContext";
import { useRouter } from "expo-router";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PROFILE_NAME = "Player";

export default function Index() {
  const router = useRouter();
  const { playClick } = useSound();

  return (
    <ImageBackground
      source={require("@/assets/images/main-menu.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topRow}>
          <Pressable
            style={styles.profileChip}
            onPress={() => {
              playClick();
            }}
          >
            <Avatar name={PROFILE_NAME} size={26} />
            <Text style={styles.profileName}>{PROFILE_NAME}</Text>
          </Pressable>
        </View>

        <View style={styles.spacer} />

        <View style={styles.menu}>
          <ChunkyButton
            color={SD.primary}
            depthColor={SD.primaryShadow}
            depth={6}
            borderRadius={20}
            contentStyle={styles.menuCard}
            onPress={() => router.push("/game-setup")}
          >
            <View style={[styles.iconTile, styles.iconTileLight]}>
              <Text style={styles.iconEmoji}>👥</Text>
            </View>
            <View style={styles.menuCardText}>
              <Text style={styles.menuTitleLight}>Pass & Play</Text>
              <Text style={styles.menuSubtitleLight}>One device, take turns</Text>
            </View>
            <Text style={styles.chevronLight}>›</Text>
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
                <Text style={styles.menuTitleGold}>Play Online</Text>
                <Text style={styles.menuSubtitleGold}>Create or join a room</Text>
              </View>
              <Text style={styles.chevronGold}>›</Text>
            </ChunkyButton>
          </View>

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
              <Text style={[styles.smallGlyph, { color: SD.blue }]}>?</Text>
              <Text style={styles.smallLabel}>How to play</Text>
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
              <Text style={[styles.smallGlyph, { color: SD.soft }]}>⚙</Text>
              <Text style={styles.smallLabel}>Settings</Text>
            </ChunkyButton>
          </View>
        </View>
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
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  profileChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: SD.white,
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
    fontFamily: FONTS.bodyExtrabold,
    fontSize: 12,
    color: SD.ink,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  menu: {
    gap: 12,
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
    fontFamily: FONTS.extrabold,
    fontSize: 19,
    color: SD.white,
    lineHeight: 23,
  },
  menuSubtitleLight: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  menuTitleGold: {
    fontFamily: FONTS.extrabold,
    fontSize: 19,
    color: SD.accentInk,
    lineHeight: 23,
  },
  menuSubtitleGold: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "rgba(94,61,0,0.75)",
    marginTop: 2,
  },
  chevronLight: {
    fontFamily: FONTS.bodyExtrabold,
    fontSize: 20,
    color: "rgba(255,255,255,0.75)",
  },
  chevronGold: {
    fontFamily: FONTS.bodyExtrabold,
    fontSize: 20,
    color: "rgba(94,61,0,0.6)",
  },
  smallRow: {
    flexDirection: "row",
    gap: 12,
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
    fontFamily: FONTS.extrabold,
    fontSize: 15,
  },
  smallLabel: {
    fontFamily: FONTS.extrabold,
    fontSize: 14,
    color: SD.ink,
  },
});
