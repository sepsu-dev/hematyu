import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.ComponentPropsWithoutRef<"div"> {
  size?: number;
  className?: string;
}

export function Spinner({ className, size = 16, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn("flex items-center justify-center animate-spin text-current", className)}
      {...props}
    >
      <Loader2 style={{ width: size, height: size }} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
