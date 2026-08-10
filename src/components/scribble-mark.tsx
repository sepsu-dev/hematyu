"use client";

import { cn } from "@/lib/utils";

/**
 * ScribbleMark — an abstract, hand-drawn marker scribble that
 * renders on top of active sidebar nav items.
 *
 * It is intentionally imperfect: strokes overshoot, cross each
 * other, vary in thickness, and draw themselves in one-by-one.
 */

interface Stroke {
  d: string;
  width: number;
  opacity: number;
  /** extra delay in seconds */
  delay: number;
  /** total path length estimate for dasharray */
  len: number;
}

// Each variant is a collection of raw strokes.
// viewBox: "0 0 110 32"  — wider than the element so strokes can bleed out
const VARIANTS = {
  /** Chaotic back-and-forth with stray marks — default */
  frenzy: [
    // Main rough underline →
    { d: "M-2,22 C12,18 26,24 42,19 C58,14 72,22 88,17 C96,14 104,19 112,16",          width: 5,   opacity: 0.90, delay: 0,    len: 220 },
    // Return stroke ← slightly higher
    { d: "M111,13 C95,17 78,12 62,16 C46,20 30,13 14,17 C6,20 0,17 -2,19",             width: 3.5, opacity: 0.60, delay: 0.13, len: 200 },
    // A third aggressive swipe in the middle
    { d: "M8,26 C25,22 45,28 65,23 C82,19 96,25 108,21",                                width: 6,   opacity: 0.35, delay: 0.26, len: 180 },
    // Stray short mark at end — like pen lifting off
    { d: "M98,10 C104,7 110,4 113,8",                                                   width: 2.5, opacity: 0.50, delay: 0.38, len: 60  },
    // Stray smudge at start — pen pressing down
    { d: "M-3,24 C2,20 6,17 4,13",                                                      width: 2.5, opacity: 0.45, delay: 0.42, len: 50  },
  ],

  /** Scribbled oval — energetic circling */
  circle: [
    // Outer loop — wobbly
    { d: "M8,24 C2,18 3,8 15,4 C32,0 72,0 90,4 C102,7 105,16 95,22 C80,28 28,30 8,26 C2,24 2,18 8,24", width: 5,   opacity: 0.85, delay: 0,    len: 310 },
    // Inner loop — offset for texture
    { d: "M12,22 C7,17 8,10 18,6 C35,2 68,2 84,6 C96,9 96,18 85,22 C70,26 28,27 12,24",               width: 3,   opacity: 0.40, delay: 0.18, len: 280 },
    // Extra slash across bottom for chaos
    { d: "M5,27 C30,24 60,29 95,25",                                                                    width: 2,   opacity: 0.30, delay: 0.32, len: 160 },
    // Tiny stray hook at top right
    { d: "M88,2 C96,-1 106,1 108,6",                                                                    width: 2,   opacity: 0.40, delay: 0.44, len: 45  },
  ],

  /** Raw underline — multiple messy passes */
  slash: [
    { d: "M-2,20 C20,16 45,22 70,18 C85,15 100,19 113,17",    width: 7,   opacity: 0.80, delay: 0,    len: 200 },
    { d: "M1,25 C22,21 50,27 75,22 C90,18 104,23 112,20",     width: 4,   opacity: 0.45, delay: 0.15, len: 185 },
    { d: "M-1,14 C15,11 38,16 58,12 C75,9 92,14 110,11",      width: 2.5, opacity: 0.35, delay: 0.28, len: 195 },
    { d: "M5,29 C18,26 32,31 50,27",                           width: 2,   opacity: 0.25, delay: 0.38, len: 80  },
    { d: "M85,8 C96,5 108,7 113,12",                           width: 2,   opacity: 0.30, delay: 0.43, len: 55  },
  ],
} satisfies Record<string, Stroke[]>;

export type ScribbleVariant = keyof typeof VARIANTS;

interface ScribbleMarkProps {
  variant?: ScribbleVariant;
  className?: string;
  /** Base color via currentColor — set text-* on the parent or here */
  color?: string;
}

export function ScribbleMark({
  variant = "frenzy",
  className,
}: ScribbleMarkProps) {
  const strokes = VARIANTS[variant];

  return (
    <svg
      viewBox="0 0 110 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn(
        // Bleed outside the element bounds on all sides
        "absolute -inset-x-2 -inset-y-1 w-[calc(100%+16px)] h-[calc(100%+8px)]",
        "-z-10 pointer-events-none",
        "text-primary",
        className
      )}
    >
      {strokes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          stroke="currentColor"
          strokeWidth={s.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={s.opacity}
          style={{
            strokeDasharray: s.len,
            strokeDashoffset: s.len,
            animation: `drawStroke 0.4s cubic-bezier(0.22,1,0.36,1) forwards ${s.delay}s`,
          }}
        />
      ))}
    </svg>
  );
}
