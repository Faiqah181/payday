import ChunkyButton from "@/components/ui/ChunkyButton";
import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  /** "display" renders the title in Bungee, "heading" in Baloo. */
  variant?: "display" | "heading";
  subtitle?: string;
  right?: ReactNode;
}

export default function ScreenHeader({
  title,
  onBack,
  variant = "display",
  subtitle,
  right,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <ChunkyButton
        color={SD.surface2}
        depthColor="rgba(0,0,0,0.1)"
        depth={3}
        borderRadius={12}
        contentStyle={styles.backFace}
        onPress={onBack}
      >
        <Typography design="title" style={styles.backGlyph}>
          ‹
        </Typography>
      </ChunkyButton>
      <View style={styles.titles}>
        {variant === "display" ? (
          <Typography design="money" style={styles.displayTitle}>
            {title}
          </Typography>
        ) : (
          <Typography design="title" style={styles.headingTitle}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography design="body" weight={800} style={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backFace: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backGlyph: {
    fontSize: 18,
    lineHeight: 22,
    color: SD.ink,
  },
  titles: {
    flex: 1,
  },
  displayTitle: {
    fontSize: 20,
    color: SD.ink,
  },
  headingTitle: {
    fontSize: 20,
    color: SD.ink,
  },
  subtitle: {
    fontSize: 10,
    letterSpacing: 1,
    color: SD.soft,
  },
});
