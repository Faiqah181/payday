import Typography from "@/components/ui/Typography";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface DrawerHeaderProps {
  color?: string;
  gradient?: [string, string];
  eyebrow: string;
  headline: string;
  note: string;
}

function HeaderContent({ eyebrow, headline, note }: Omit<DrawerHeaderProps, "color" | "gradient">) {
  return (
    <>
      <View style={styles.handle} />
      <View style={styles.row}>
        <View>
          <Typography design="body" weight={800} style={styles.eyebrow}>
            {eyebrow}
          </Typography>
          <Typography design="money" style={styles.headline}>
            {headline}
          </Typography>
        </View>
        <View style={styles.noteWrap}>
          <Typography design="body" weight={700} style={styles.note}>
            {note}
          </Typography>
        </View>
      </View>
    </>
  );
}

export default function DrawerHeader({ color, gradient, ...content }: DrawerHeaderProps) {
  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <HeaderContent {...content} />
      </LinearGradient>
    );
  }
  return (
    <View style={[styles.header, { backgroundColor: color }]}>
      <HeaderContent {...content} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
    alignSelf: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.7)",
  },
  headline: {
    fontSize: 30,
    color: "#FFFFFF",
  },
  noteWrap: {
    maxWidth: 150,
  },
  note: {
    fontSize: 11,
    lineHeight: 15,
    color: "rgba(255,255,255,0.85)",
    textAlign: "right",
  },
});
