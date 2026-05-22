export default function ReportesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-surface-high rounded-lg" />
          <div className="h-8 w-72 bg-surface-high rounded-xl" />
          <div className="h-4 w-40 bg-surface-high rounded-lg" />
        </div>
        <div className="h-12 w-52 bg-surface-high rounded-xl" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* P&L card */}
        <div className="col-span-12 lg:col-span-8 bg-surface-lowest rounded-(--radius-card) p-8 shadow-card space-y-6">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-6 w-52 bg-surface-high rounded-lg" />
              <div className="h-4 w-40 bg-surface-high rounded-lg" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-12 bg-surface-high rounded-full" />
              <div className="h-6 w-14 bg-surface-high rounded-full" />
            </div>
          </div>
          {/* Bar chart skeleton */}
          <div className="h-48 flex items-end gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-surface-high rounded-t-lg"
                style={{ height: `${20 + Math.random() * 60}%` }}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-surface-high">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-surface-high rounded-lg" />
                <div className="h-8 w-32 bg-surface-high rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Balance card */}
        <div className="col-span-12 lg:col-span-4 editorial-gradient rounded-(--radius-card) p-8 space-y-4">
          <div className="h-6 w-36 bg-white/20 rounded-lg" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 pb-4 border-b border-white/10">
              <div className="h-3 w-24 bg-white/20 rounded-lg" />
              <div className="h-7 w-32 bg-white/20 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Monthly summary */}
        <div className="col-span-12 lg:col-span-6 bg-surface-low rounded-(--radius-card) p-8 space-y-4">
          <div className="flex justify-between">
            <div className="h-6 w-48 bg-surface-high rounded-lg" />
            <div className="h-4 w-16 bg-surface-high rounded-lg" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-lowest p-4 rounded-xl space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-12 bg-surface-high rounded-lg" />
                <div className="h-4 w-28 bg-surface-high rounded-lg" />
              </div>
              <div className="h-2 w-full bg-surface-high rounded-full" />
            </div>
          ))}
        </div>

        {/* Cash flow */}
        <div className="col-span-12 lg:col-span-6 bg-surface-lowest rounded-(--radius-card) p-8 shadow-card space-y-4">
          <div className="h-6 w-44 bg-surface-high rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 bg-surface-low rounded-xl space-y-2">
                <div className="h-3 w-28 bg-surface-high rounded-lg" />
                <div className="h-7 w-32 bg-surface-high rounded-xl" />
              </div>
            ))}
          </div>
          <div className="p-4 bg-surface-low rounded-xl flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-surface-high rounded-lg" />
              <div className="h-6 w-24 bg-surface-high rounded-xl" />
            </div>
            <div className="h-9 w-9 bg-surface-high rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
