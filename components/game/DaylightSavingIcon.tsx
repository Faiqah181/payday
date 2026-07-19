import Svg, { Circle, G, Line, Path } from "react-native-svg";

const ORANGE = "#F5A23C";
const YELLOW = "#F9D15E";
const RED = "#F1584F";
const RED_DARK = "#D8443D";
const FACE = "#FFFFFF";
const HAND = "#6C6D71";
const PINK = "#EE5D8F";
const HUB = "#55565A";

// Scalloped sun outline: a circle whose radius ripples with cos(bumps·θ).
function sunPath(
  cx: number,
  cy: number,
  base: number,
  amp: number,
  bumps: number,
  steps = 168,
): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = base + amp * Math.cos(bumps * a);
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

const SUN = sunPath(68, 32, 19, 3, 12);

export default function DaylightSavingIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.92} viewBox="0 0 100 92">
      {/* Sun behind the clock */}
      <Path d={SUN} fill={ORANGE} />
      <Circle cx={68} cy={32} r={14} fill={YELLOW} />

      {/* Clock: darker side peeking out for depth, then the red face */}
      <Circle cx={46} cy={59} r={30} fill={RED_DARK} />
      <Circle cx={42} cy={56} r={30} fill={RED} />
      <Circle cx={42} cy={56} r={21} fill={FACE} />

      {/* Hands */}
      <G strokeLinecap="round">
        <Line x1={42} y1={56} x2={42} y2={41} stroke={HAND} strokeWidth={4.6} />
        <Line x1={42} y1={56} x2={32} y2={67} stroke={HAND} strokeWidth={4.6} />
        <Line x1={42} y1={56} x2={60} y2={56} stroke={PINK} strokeWidth={2.6} />
      </G>
      <Circle cx={42} cy={56} r={2.9} fill={HUB} />
    </Svg>
  );
}
