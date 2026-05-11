export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 animate-pulse">
      {/* Intro Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-20">
        <div className="w-24 h-24 bg-muted rounded-2xl"></div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-8 w-48 bg-muted rounded"></div>
        </div>
      </div>

      {/* Tech Stack Skeleton */}
      <div className="mb-20">
        <div className="h-6 w-40 bg-muted rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Projects Skeleton */}
      <div>
        <div className="h-6 w-48 bg-muted rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted/30 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
