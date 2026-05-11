"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectImagesProps {
  images: string[];
  title: string;
}

export function ProjectImages({ images, title }: ProjectImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-xs">IMAGE_NOT_AVAILABLE</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 shadow-lg group">
        <img
          src={images[currentIndex]}
          alt={`${title} - image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Index Indicator Badge */}
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-mono font-bold">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
