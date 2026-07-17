import Typography from "@/components/ui/Typography";
import { useEffect, useRef, useState } from "react";
import { type StyleProp, type TextStyle } from "react-native";

interface AnimatedCashProps {
  /** The dollar amount. When it changes, the display counts up/down to it. */
  value: number;
  /** Currency symbol placed after the sign. */
  prefix?: string;
  /** Show a leading "+" on positive values (e.g. savings). */
  signed?: boolean;
  duration?: number;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

function formatCash(value: number, prefix: string, signed: boolean): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : signed && rounded > 0 ? "+" : "";
  return `${sign}${prefix}${Math.abs(rounded).toLocaleString("en-US")}`;
}

// Counts the displayed number from wherever it is now toward `target` — starting
// from the current display keeps a mid-flight change smooth instead of jumping.
function useCountTo(target: number, duration: number): number {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const raf = useRef<number | null>(null);

  displayRef.current = display;

  useEffect(() => {
    const from = displayRef.current;
    if (from === target || duration <= 0) {
      setDisplay(target);
      return;
    }
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setDisplay(target);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

/**
 * A money label that animates to its new value whenever `value` changes.
 * Renders through Typography's money design, so it matches a plain money label.
 */
export default function AnimatedCash({
  value,
  prefix = "$",
  signed = false,
  duration = 550,
  style,
  numberOfLines,
}: AnimatedCashProps) {
  const shown = useCountTo(value, duration);
  return (
    <Typography design="money" style={style} numberOfLines={numberOfLines}>
      {formatCash(shown, prefix, signed)}
    </Typography>
  );
}
