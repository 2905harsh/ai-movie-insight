export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster skeleton */}
        <div className="lg:col-span-1">
          <div className="skeleton aspect-[2/3] w-full max-w-[280px] mx-auto" />
        </div>

        {/* Details skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <div className="skeleton h-9 w-3/4" />
            <div className="skeleton h-5 w-1/3" />
          </div>

          {/* Badges */}
          <div className="flex gap-3">
            <div className="skeleton h-8 w-20 rounded-full" />
            <div className="skeleton h-8 w-24 rounded-full" />
            <div className="skeleton h-8 w-16 rounded-full" />
          </div>

          {/* Plot */}
          <div className="space-y-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
          </div>

          {/* Cast */}
          <div className="space-y-2">
            <div className="skeleton h-4 w-1/4" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment skeleton */}
      <div className="mt-10 space-y-4">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-28 w-full rounded-xl" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-7 w-28 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
