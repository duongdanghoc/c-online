import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Framer‑Motion Countdown
 * -----------------------------------------
 * • Works in React/Next.js (Client Component)
 * • Smooth digit roll animation on change
 * • Target a future Date OR count down from a number of seconds
 * • Zero‑dependency (besides framer‑motion). Tailwind optional.
 *
 * Usage:
 * <Countdown targetDate={new Date("2025-11-01T09:00:00+07:00")} />
 * // OR
 * <Countdown seconds={90} onComplete={() => console.log("Done!")} />
 */

// Small hook: stable setInterval that doesn’t drift
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function diffDHMS(ms: number) {
  const clamp = Math.max(0, ms);
  const d = Math.floor(clamp / 86400000);
  const h = Math.floor((clamp % 86400000) / 3600000);
  const m = Math.floor((clamp % 3600000) / 60000);
  const s = Math.floor((clamp % 60000) / 1000);
  return { d, h, m, s, done: ms <= 0 };
}

// Animated single digit that "rolls" vertically on change
function Digit({ value }: { value: string }) {
  return (
    <div className="relative h-4 w-3 overflow-hidden rounded-xs bg-neutral-900/30 text-white shadow-sm sm:h-4 sm:w-3">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold sm:text-sm"
          aria-hidden
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Two-digit block with a small label (e.g., minutes)
function Block({ value }: { label: string; value: number }) {
  const str = pad2(value);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-0.5">
        <Digit value={str[0]} />
        <Digit value={str[1]} />
      </div>
    </div>
  );
}

export default function Countdown({
  targetDate,
  seconds,
  onTick,
  onComplete,
  showDays = true,
  className = "",
}: {
  targetDate?: Date;
  seconds?: number;
  onTick?: (msRemaining: number) => void;
  onComplete?: () => void;
  showDays?: boolean;
  className?: string;
}) {
  const startMs = useMemo(() => Date.now(), []);
  const endMs = useMemo(() => {
    if (targetDate) return targetDate.getTime();
    if (typeof seconds === "number") return startMs + seconds * 1000;
    return startMs + 60 * 1000;
  }, [targetDate, seconds, startMs]);

  const [now, setNow] = useState(() => Date.now());

  useInterval(() => {
    const t = Date.now();
    setNow(t);
    onTick?.(Math.max(0, endMs - t));
  }, 1000);

  const { d, h, m, s, done } = useMemo(
    () => diffDHMS(endMs - now),
    [endMs, now]
  );

  // Fire onComplete exactly once
  const doneRef = useRef(false);
  useEffect(() => {
    if (!doneRef.current && done) {
      doneRef.current = true;
      onComplete?.();
    }
  }, [done, onComplete]);

  return (
    <div
      className={
        "mx-auto flex w-full max-w-xl items-center justify-center gap-1" +
        className
      }
      role="timer"
      aria-live="polite"
    >
      {showDays && (
        <div className="flex items-center gap-1">
          <Block label="Days" value={d} />
          <Separator />
        </div>
      )}

      <div className="flex items-center gap-1">
        <Block label="Hours" value={h} />
        <Separator />
      </div>

      <div className="flex items-center gap-1">
        <Block label="Minutes" value={m} />
        <Separator />
      </div>

      <div className="flex items-center gap-1">
        <Block label="Seconds" value={s} />
      </div>
    </div>
  );
}

function Separator() {
  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="text-sm font-bold text-neutral-400 select-none"
    >
      :
    </motion.span>
  );
}
