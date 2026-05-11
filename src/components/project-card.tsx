"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn, type Project } from "@/lib/utils";
import { Highlighter } from "./highlighter";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { title, description, tags, imageUrl } = project;

  return (
    <Link
      href={`/project/${project.id}`}
      className={cn(
        "group relative flex flex-col sm:flex-row gap-6 p-5 sm:p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:bg-card hover:border-primary/30 items-stretch",
        className
      )}
    >
      {/* Decorative background glow on hover */}
      <div className="absolute -inset-x-20 -top-20 h-40 bg-primary/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Thumbnail */}
      <div className="flex-shrink-0 w-full sm:w-48 h-52 sm:h-36 bg-muted rounded-xl overflow-hidden border border-border/20 relative z-10 shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.12]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <span className="text-[10px] font-mono tracking-widest uppercase">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 min-w-0 flex-1 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            <span className="relative inline-flex items-center gap-1.5">
              <span className="relative z-10">{title}</span>
              <Highlighter variant={1} className="scale-x-110 opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-primary flex-shrink-0" />
            </span>
          </h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border border-border/40 text-muted-foreground bg-muted/20 group-hover:border-primary/20 group-hover:text-primary/80 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
