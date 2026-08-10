import { cn } from "@/lib/utils";

interface HighlighterProps {
  /**
   * 1 – simple underline
   * 2 – wavy
   * 3 – rough / scratchy
   * 4 – zig-zag
   * 5 – double
   * 6 – dashed
   * 7 – slanted
   * 8 – hand-drawn oval encircle
   * 9 – marker highlight block (thick, rounded background highlighter marker style)
   * 10 – rough double scratch
   * 11 – loops & loops scribble circle
   */
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  className?: string;
  strokeWidth?: number;
  /** Animate the stroke drawing in on mount */
  animated?: boolean;
}

const paths: Record<number, string | string[]> = {
  1: "M4,18 C25,14 55,20 96,16",
  2: "M3,16 C30,20 70,14 97,18",
  3: "M2,19 C20,15 40,22 60,16 C80,10 90,20 98,17",
  4: "M5,18 L20,14 L40,20 L60,14 L80,20 L95,16",
  5: ["M5,15 C30,12 70,18 95,14", "M10,20 C40,23 60,17 90,21"],
  6: [
    "M5,17 C15,15 25,18 35,16",
    "M45,18 C55,16 65,19 75,17",
    "M85,16 C90,17 93,15 98,16",
  ],
  7: "M5,22 C30,19 60,14 95,8",
  8: [
    "M10,20 C5,14 8,6 20,4 C40,1 75,1 88,5 C97,8 97,16 88,20 C75,24 30,25 12,22 C5,20 4,14 10,20",
    "M14,19 C10,15 12,8 22,5 C42,2 72,2 85,6 C94,9 94,17 85,21 C72,25 32,25 15,22",
  ],
  // Variant 9: Straight rounded pill block background (clean marker badge style)
  9: "M0,13 L100,13",
  10: [
    "M3,15 C18,12 35,17 52,14 C68,11 82,16 97,13",
    "M4,20 C20,18 38,22 55,19 C72,16 86,21 97,19",
  ],
  11: [
    "M 5,14 C 20,2 60,0 95,4 C 110,6 102,18 80,22 C 40,26 8,20 4,12 C 1,3 40,2 85,6 C 105,8 108,16 85,20 C 50,24 10,21 8,16 C 6,10 50,11 98,13"
  ]
};

export const Highlighter = ({
  variant = 1,
  className,
  strokeWidth = 8,
  animated = false,
}: HighlighterProps) => {
  const raw = paths[variant];
  const pathList = Array.isArray(raw) ? raw : [raw];

  const isMarker = variant === 9;
  const isEncircle = variant === 8 || variant === 11;

  return (
    <svg
      className={cn(
        "absolute top-1/2 left-0 w-full h-full -translate-y-1/2 -z-10 pointer-events-none",
        isMarker ? "scale-y-[0.8] scale-x-[1.0] translate-y-[-45%]" : isEncircle ? "scale-[1.08] scale-y-[1.4]" : "scale-110",
        className
      )}
      viewBox="0 0 100 26"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {pathList.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={isMarker ? 26 : isEncircle && variant === 8 && i === 1 ? strokeWidth * 0.6 : strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isMarker ? 0.95 : isEncircle && variant === 8 && i === 1 ? 0.4 : 1}
          className={animated ? "animate-draw" : undefined}
          style={
            animated
              ? {
                strokeDasharray: 500,
                strokeDashoffset: 500,
                animation: `drawStroke 0.6s ease-in-out forwards ${i * 0.15}s`,
              }
              : undefined
          }
        />
      ))}
    </svg>
  );
};
