import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <img 
      src="/logo.png" 
      alt="Hematyu Logo" 
      className={cn("h-auto w-auto object-contain block rounded-xl", className)}
    />
  );
}
