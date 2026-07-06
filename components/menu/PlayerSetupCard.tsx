import Avatar from "@/components/Avatar";
import { COLORS } from "@/constants/colors";
import { StyleSheet, TextInput, View } from "react-native";
import AccountTypeSwitcher, { type AccountType } from "./AccountTypeSwitcher";

interface PlayerSetupCardProps {
  index: number;
  name: string;
  accountType: AccountType;
  onChangeName: (name: string) => void;
  onChangeAccountType: (type: AccountType) => void;
  imageUrl?: string;
}

export default function PlayerSetupCard({
  index,
  name,
  accountType,
  onChangeName,
  onChangeAccountType,
  imageUrl,
}: PlayerSetupCardProps) {
  return (
    <View style={styles.playerCard}>
      <Avatar index={index} name={name} imageUrl={imageUrl} size={40} />
      <TextInput
        style={styles.nameInput}
        placeholder={`Player ${index + 1}`}
        placeholderTextColor="#9E9E9E"
        value={name}
        onChangeText={onChangeName}
        maxLength={15}
        underlineColorAndroid="transparent"
      />
      <AccountTypeSwitcher value={accountType} onChange={onChangeAccountType} />
    </View>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  nameInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
