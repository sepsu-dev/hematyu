import { cn } from "@/lib/utils";

interface HighlighterProps {
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  className?: string;
  strokeWidth?: number;
}

export const Highlighter = ({ variant = 1, className, strokeWidth = 8 }: HighlighterProps) => {
  const paths = {
    1: "M4,18 C25,14 55,20 96,16", // Simple underline
    2: "M3,16 C30,20 70,14 97,18", // Wavy underline
    3: "M2,19 C20,15 40,22 60,16 C80,10 90,20 98,17", // Rough underline
    4: "M5,18 L20,14 L40,20 L60,14 L80,20 L95,16", // Zig-zag underline
    5: "M5,15 C30,12 70,18 95,14 M10,20 C40,23 60,17 90,21", // Double underline
    6: "M5,17 C15,15 25,18 35,16 M45,18 C55,16 65,19 75,17 M85,16 C90,17 93,15 98,16", // Dashed underline
    7: "M5,22 C30,19 60,14 95,8", // Upwards slanted underline
  };

  return (
    <svg 
      className={cn(
        "absolute top-1/2 left-0 w-full h-full -translate-y-1/2 text-primary/30 -z-10 scale-110",
        className
      )} 
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
    >
      <path 
        d={paths[variant]} 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};
