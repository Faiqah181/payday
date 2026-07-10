import { FONTS } from "@/constants/fonts";
import { Text, TextProps } from "react-native";

export type TypographyWeight = 600 | 700 | 800;
export type TypographyDesign = "money" | "title" | "body";

const TITLE_FAMILIES: Record<TypographyWeight, string> = {
  600: FONTS.semibold,
  700: FONTS.bold,
  800: FONTS.extrabold,
};

const BODY_FAMILIES: Record<TypographyWeight, string> = {
  600: FONTS.bodySemibold,
  700: FONTS.bodyBold,
  800: FONTS.bodyExtrabold,
};

type TypographyProps = TextProps &
  (
    | { design: "money"; weight?: never }
    | { design: "title" | "body"; weight?: TypographyWeight }
  );

export default function Typography({
  design,
  weight,
  style,
  ...rest
}: TypographyProps) {

  const fontFamily =
    design === "money"
      ? FONTS.display
      : design === "title"
        ? TITLE_FAMILIES[weight ?? 800]
        : BODY_FAMILIES[weight ?? 600];

  return <Text {...rest} style={[{ fontFamily }, style]} />;
}
