import { useEffect, useRef, useState } from "react";

/** Die tumble duration (RollingDie SPIN) — the wait before passing the turn. */
export const DIE_SETTLE_MS = 2100;
// Winner/draw reveals hold an extra second after the die settles
const REVEAL_DELAY_MS = DIE_SETTLE_MS + 1000;

/**
 * Delays an outcome (next roller, winner screen, draw banner) until the die
 * finishes tumbling. `pending` disables the roll button meanwhile.
 */
export function useDelayedReveal(): [
  boolean,
  (reveal: () => void, delayMs?: number) => void,
] {
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const schedule = (reveal: () => void, delayMs: number = REVEAL_DELAY_MS) => {
    setPending(true);
    timer.current = setTimeout(() => {
      setPending(false);
      reveal();
    }, delayMs);
  };

  return [pending, schedule];
}
