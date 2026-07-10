import Typography from "@/components/ui/Typography";
import { SD } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface DrawerRowProps {
  tileColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  right?: ReactNode;
  onPress?: () => void;
}

export default function DrawerRow({
  tileColor,
  icon,
  title,
  sub,
  right,
  onPress,
}: DrawerRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={[styles.tile, { backgroundColor: tileColor }]}>
        <Ionicons name={icon} size={17} color={SD.white} />
      </View>
      <View style={styles.text}>
        <Typography design="title" weight={800} style={styles.title} numberOfLines={1}>
          {title}
        </Typography>
        <Typography design="body" weight={700} style={styles.sub} numberOfLines={1}>
          {sub}
        </Typography>
      </View>
      {right}
      {onPress && (
        <Typography design="body" weight={800} style={styles.chevron}>
          ›
        </Typography>
      )}
    </Pressable>
  );
}

export function DrawerEmpty({ text }: { text: string }) {
  return (
    <View style={styles.empty}>
      <Typography design="body" weight={700} style={styles.emptyText}>
        {text}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SD.surface2,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  tile: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    color: SD.ink,
  },
  sub: {
    fontSize: 11,
    color: SD.soft,
  },
  chevron: {
    fontSize: 14,
    color: SD.soft,
  },
  empty: {
    backgroundColor: SD.surface2,
    borderRadius: 14,
    padding: 15,
  },
  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    color: SD.soft,
    textAlign: "center",
  },
});
