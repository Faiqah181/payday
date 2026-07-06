import { Image, StyleSheet, Text, View } from "react-native";

export const PLAYER_COLORS = ["#3F86BE", "#E8554B", "#F6BF4B", "#A871CF"];

interface AvatarProps {
  name?: string;
  index?: number;
  imageUrl?: string;
  size?: number;
}

export default function Avatar({
  name,
  index = 0,
  imageUrl,
  size = 40,
}: AvatarProps) {
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
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
      <Text style={[styles.letter, { fontSize: size * 0.42 }]}>{letter}</Text>
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
    fontWeight: "800",
    color: "#fff",
  },
});
