/**
 * StrokeText — Renders text with a visible stroke/outline using react-native-svg.
 *
 * Usage:
 *   <StrokeText fontSize={20}>HELLO WORLD</StrokeText>
 *   <StrokeText fontSize={16} strokeColor="#000" fillColor="#FFF" strokeWidth={4}>TITLE</StrokeText>
 *
 * How it works:
 *   Two SVG <Text> layers are stacked — stroke behind, fill on top — to create
 *   the outlined effect. The component measures its parent width via onLayout
 *   and uses numeric coordinates (not percentages) for Android compatibility.
 *
 * Important constraints:
 *   - children must be a plain string, not JSX or nested components.
 *   - The wrapper View uses `alignSelf: "stretch"` so it always fills the
 *     parent's width. Do NOT place this inside a parent with width: 0 or
 *     a collapsed flex container — the SVG won't render.
 *   - If the parent has `flexDirection: "row"`, the StrokeText will stretch
 *     to fill remaining space. Wrap it in a sized View if you need a fixed width.
 *   - Text is always horizontally centered within the component.
 *   - The visible outline thickness is roughly strokeWidth / 2 (the fill layer
 *     covers the inner half of the stroke).
 */
import React, { useState } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";

interface StrokeTextProps {
  children: string;
  fontSize: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  letterSpacing?: number;
  style?: ViewStyle;
}

export default function StrokeText({
  children,
  fontSize,
  fillColor = "#FFFFFF",
  strokeColor = "#333333",
  strokeWidth = 3,
  letterSpacing = 2,
  style,
}: StrokeTextProps) {
  const [width, setWidth] = useState(0);
  const height = Math.ceil(fontSize * 1.3);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const commonProps = {
    x: width / 2,
    y: fontSize,
    textAnchor: "middle" as const,
    fontWeight: "800" as const,
    fontSize: fontSize,
    letterSpacing: letterSpacing,
  };

  return (
    <View style={[{ alignSelf: "stretch" as const }, style]} onLayout={onLayout}>
      {width > 0 && (
        <Svg height={height} width={width}>
          <SvgText
            {...commonProps}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            {children}
          </SvgText>
          <SvgText {...commonProps} fill={fillColor}>
            {children}
          </SvgText>
        </Svg>
      )}
    </View>
  );
}
