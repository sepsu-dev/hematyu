import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | "Present";
  tags: string[];
  imageUrl?: string;
  images?: string[];
  href?: string;
}
