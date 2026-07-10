import Typography from "@/components/ui/Typography";
import { Image, StyleSheet, View } from "react-native";

export const PLAYER_COLORS = ["#3F86BE", "#E8554B", "#F6BF4B", "#A871CF"];

interface AvatarProps {
  name?: string;
  index?: number;
  imageUrl?: string;
  size?: number;
  color?: string;
}

export default function Avatar({
  name,
  index = 0,
  imageUrl,
  size = 40,
  color: colorProp,
}: AvatarProps) {
  const color = colorProp ?? PLAYER_COLORS[index % PLAYER_COLORS.length];
  const letter = name?.trim()?.[0]?.toUpperCase() || "?";

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.avatar, containerStyle]}
      />
    );
  }

  return (
    <View style={[styles.avatar, containerStyle, { backgroundColor: color }]}>
      <Typography design="title" style={[styles.letter, { fontSize: size * 0.42 }]}>
        {letter}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#AFDAE1",
  },
  letter: {
    color: "#fff",
  },
});
