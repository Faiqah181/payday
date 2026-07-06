import React from "react";
import { StyleSheet } from "react-native";

export const FONTS = {
  regular: "Baloo2_400Regular",
  medium: "Baloo2_500Medium",
  semibold: "Baloo2_600SemiBold",
  bold: "Baloo2_700Bold",
  extrabold: "Baloo2_800ExtraBold",
  display: "Bungee_400Regular",
  body: "Nunito_400Regular",
  bodySemibold: "Nunito_600SemiBold",
  bodyBold: "Nunito_700Bold",
  bodyExtrabold: "Nunito_800ExtraBold",
} as const;

export const BALOO_FONTS = {
  Baloo2_400Regular: require("@/assets/fonts/Baloo2_400Regular.ttf"),
  Baloo2_500Medium: require("@/assets/fonts/Baloo2_500Medium.ttf"),
  Baloo2_600SemiBold: require("@/assets/fonts/Baloo2_600SemiBold.ttf"),
  Baloo2_700Bold: require("@/assets/fonts/Baloo2_700Bold.ttf"),
  Baloo2_800ExtraBold: require("@/assets/fonts/Baloo2_800ExtraBold.ttf"),
  Bungee_400Regular: require("@/assets/fonts/Bungee_400Regular.ttf"),
  Nunito_400Regular: require("@/assets/fonts/Nunito_400Regular.ttf"),
  Nunito_600SemiBold: require("@/assets/fonts/Nunito_600SemiBold.ttf"),
  Nunito_700Bold: require("@/assets/fonts/Nunito_700Bold.ttf"),
  Nunito_800ExtraBold: require("@/assets/fonts/Nunito_800ExtraBold.ttf"),
};

export function fontFamilyForWeight(weight?: string | number): string {
  const w = String(weight ?? "400");
  if (w === "500") return FONTS.medium;
  if (w === "600") return FONTS.semibold;
  if (w === "700" || w === "bold") return FONTS.bold;
  if (w === "800" || w === "900") return FONTS.extrabold;
  return FONTS.regular;
}

// Baloo 2 ships one static file per weight, so React Native's `fontWeight` is
// ignored once a specific family is set. RN 0.81 exports Text/TextInput as
// plain function components (no `.render` to patch) behind getters on the
// `react-native` module, so we redefine those getters to return a wrapper that
// injects the matching Baloo family — giving every text in the app the right
// Baloo weight without touching each style. fontWeight is dropped so the OS
// doesn't synthesize bold on top of an already-bold static face.
export function applyBalooFont() {
  const RN = require("react-native");
  for (const name of ["Text", "TextInput"] as const) {
    const Original = RN[name];
    if (!Original || (Original as any).__baloo) continue;

    const Wrapped = React.forwardRef((props: any, ref: any) => {
      const { fontWeight, ...rest } = StyleSheet.flatten(props.style) || {};
      const fontFamily = rest.fontFamily ?? fontFamilyForWeight(fontWeight);
      return React.createElement(Original, {
        ...props,
        ref,
        style: { ...rest, fontFamily },
      });
    });
    (Wrapped as any).__baloo = true;
    Wrapped.displayName = `Baloo(${name})`;

    try {
      Object.defineProperty(RN, name, {
        configurable: true,
        enumerable: true,
        get: () => Wrapped,
      });
    } catch {
      // If the property can't be redefined, leave the original in place.
    }
  }
}
