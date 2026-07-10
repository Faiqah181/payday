import Typography from "@/components/ui/Typography";
import { mixHex, SD } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface PlayerTokenProps {
  initial: string;
  color: string;
  size?: number;
}

export default function PlayerToken({ initial, color, size = 28 }: PlayerTokenProps) {
  return (
    <View
      style={[
        styles.token,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: mixHex(color, "#000000", 0.34),
        },
      ]}
    >
      <Typography design="title" style={[styles.initial, { fontSize: size * 0.42 }]}>
        {initial}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  token: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: SD.white,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  initial: {
    color: SD.white,
  },
});
