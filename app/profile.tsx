import ChunkyButton from "@/components/ui/ChunkyButton";
import ScreenBackground from "@/components/ui/ScreenBackground";
import Typography from "@/components/ui/Typography";
import { mixHex, SD, SD_AVATAR_COLORS } from "@/constants/theme";
import { useProfile } from "@/contexts/ProfileContext";
import { useSound } from "@/contexts/SoundContext";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GOOGLE_BLUE = "#4285F4";
const GOOGLE_BLUE_SHADOW = "#2C63C7";

export default function Profile() {
  const router = useRouter();
  const { playClick } = useSound();
  const { name, initial, isSignedIn, avatarIdx, avatarColor, setAvatarIdx } =
    useProfile();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <ChunkyButton
            color={SD.surface2}
            depthColor="rgba(0,0,0,0.1)"
            depth={3}
            borderRadius={11}
            contentStyle={styles.backFace}
            onPress={() => router.back()}
          >
            <Typography design="title" style={styles.backGlyph}>
              ‹
            </Typography>
          </ChunkyButton>
          <Typography design="money" style={styles.screenTitle}>
            Profile
          </Typography>
        </View>

        <View style={styles.content}>
          <View style={styles.hero}>
            <View
              style={[
                styles.bigAvatar,
                {
                  backgroundColor: avatarColor,
                  shadowColor: mixHex(avatarColor, "#000000", 0.32),
                },
              ]}
            >
              <Typography design="title" style={styles.bigAvatarInitial}>
                {initial}
              </Typography>
            </View>
            <View style={styles.heroText}>
              <Typography design="title" style={styles.heroName}>
                {name}
              </Typography>
              <Typography design="body" weight={700} style={styles.heroStatus}>
                {isSignedIn ? "Signed in · progress saved" : "Playing as guest"}
              </Typography>
            </View>
          </View>

          <View style={styles.googleCard}>
            <View style={styles.googleRow}>
              <View style={styles.googleTile}>
                <Typography design="title" style={styles.googleG}>
                  G
                </Typography>
              </View>
              <View style={styles.googleText}>
                <Typography design="title" weight={800} style={styles.googleTitle}>
                  Google Play Games
                </Typography>
                <Typography design="body" weight={700} style={styles.googleStatus}>
                  {isSignedIn ? `Connected as ${name}` : "Not signed in"}
                </Typography>
              </View>
              {isSignedIn && <View style={styles.onlineDot} />}
            </View>
            {isSignedIn ? (
              <Pressable
                style={styles.signOutButton}
                onPress={() => {
                  playClick();
                }}
              >
                <Typography design="title" weight={800} style={styles.signOutLabel}>
                  Sign out
                </Typography>
              </Pressable>
            ) : (
              <ChunkyButton
                color={GOOGLE_BLUE}
                depthColor={GOOGLE_BLUE_SHADOW}
                depth={4}
                borderRadius={13}
                style={styles.signInButton}
                contentStyle={styles.signInFace}
                onPress={() => {}}
              >
                <Typography design="title" weight={800} style={styles.signInLabel}>
                  Sign in with Google Play
                </Typography>
              </ChunkyButton>
            )}
          </View>

          <View>
            <Typography design="body" weight={800} style={styles.eyebrow}>
              CHOOSE YOUR TOKEN
            </Typography>
            <View style={styles.tokenGrid}>
              {SD_AVATAR_COLORS.map((color, i) => {
                const selected = avatarIdx === i;
                return (
                  <Pressable
                    key={color}
                    style={styles.tokenWrap}
                    onPress={() => {
                      playClick();
                      setAvatarIdx(i);
                    }}
                  >
                    <View
                      style={[
                        styles.tokenDot,
                        {
                          backgroundColor: color,
                          borderColor: selected ? SD.ink : SD.white,
                          shadowColor: mixHex(color, "#000000", 0.3),
                        },
                      ]}
                    >
                      <Typography design="title" style={styles.tokenInitial}>
                        {initial}
                      </Typography>
                    </View>
                    {selected && (
                      <View style={styles.tokenCheck}>
                        <Typography design="title" style={styles.tokenCheckMark}>
                          ✓
                        </Typography>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.nameCard}>
            <View>
              <Typography design="title" weight={800} style={styles.nameTitle}>
                Display name
              </Typography>
              <Typography design="body" weight={700} style={styles.nameHint}>
                {isSignedIn ? "From your Google account" : "Sign in to set a name"}
              </Typography>
            </View>
            <Typography design="title" weight={800} style={styles.nameValue}>
              {name}
            </Typography>
          </View>
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
    paddingTop: 12,
    paddingBottom: 8,
  },
  backFace: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  backGlyph: {
    fontSize: 18,
    lineHeight: 22,
    color: SD.ink,
  },
  screenTitle: {
    fontSize: 20,
    color: SD.ink,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 16,
  },
  hero: {
    alignItems: "center",
    gap: 10,
  },
  bigAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: SD.white,
    elevation: 5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  bigAvatarInitial: {
    fontSize: 36,
    color: SD.white,
  },
  heroText: {
    alignItems: "center",
  },
  heroName: {
    fontSize: 20,
    color: SD.ink,
  },
  heroStatus: {
    fontSize: 12,
    color: SD.soft,
  },
  googleCard: {
    backgroundColor: SD.surface,
    borderRadius: 18,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 0,
  },
  googleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  googleTile: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: SD.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  googleG: {
    fontSize: 20,
    color: GOOGLE_BLUE,
  },
  googleText: {
    flex: 1,
  },
  googleTitle: {
    fontSize: 14,
    color: SD.ink,
  },
  googleStatus: {
    fontSize: 11,
    color: SD.soft,
  },
  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: SD.primary,
  },
  signInButton: {
    marginTop: 13,
  },
  signInFace: {
    paddingVertical: 13,
    alignItems: "center",
  },
  signInLabel: {
    fontSize: 14,
    color: SD.white,
  },
  signOutButton: {
    marginTop: 13,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: SD.line,
    borderRadius: 13,
    alignItems: "center",
  },
  signOutLabel: {
    fontSize: 14,
    color: SD.soft,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: SD.soft,
    marginBottom: 10,
  },
  tokenGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
  },
  tokenWrap: {
    width: "22%",
    aspectRatio: 1,
    flexGrow: 1,
  },
  tokenDot: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  tokenInitial: {
    fontSize: 18,
    color: SD.white,
  },
  tokenCheck: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: SD.primary,
    borderWidth: 2,
    borderColor: SD.white,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenCheckMark: {
    fontSize: 10,
    lineHeight: 12,
    color: SD.white,
  },
  nameCard: {
    backgroundColor: SD.surface,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameTitle: {
    fontSize: 14,
    color: SD.ink,
  },
  nameHint: {
    fontSize: 11,
    color: SD.soft,
  },
  nameValue: {
    fontSize: 15,
    color: SD.ink,
  },
});
