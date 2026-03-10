import IconButton from "@/components/menu/IconButton";
import MenuButton from "@/components/menu/MenuButton";
import { SPACING } from "@/constants/colors";
import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/main-menu.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonContainer}>
          <MenuButton
            title="Pass & Play"
            variant="primary"
            icon="game-controller"
            size="large"
            enterDelay={0}
            onPress={() => router.push("/game-setup")}
          />
          <MenuButton
            title="Play with Friends"
            variant="disabled"
            icon="people"
            badge="Coming Soon"
            size="normal"
            enterDelay={100}
            onPress={() => {}}
          />
          <MenuButton
            title="vs Computer"
            variant="disabled"
            icon="desktop"
            badge="Coming Soon"
            size="normal"
            enterDelay={200}
            onPress={() => {}}
          />
          <MenuButton
            title="Online"
            variant="disabled"
            icon="globe"
            badge="Coming Soon"
            size="normal"
            enterDelay={300}
            onPress={() => {}}
          />
        </View>

        <View style={styles.bottomRow}>
          <IconButton
            icon="settings-sharp"
            enterDelay={400}
            onPress={() => router.push("/settings")}
          />
          <IconButton
            icon="help-circle"
            enterDelay={500}
            onPress={() => router.push("/how-to-play")}
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
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 14,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
});
