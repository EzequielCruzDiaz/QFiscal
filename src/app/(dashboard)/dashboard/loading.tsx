export default function DashboardLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-surface-high rounded-xl" />
        <div className="h-4 w-96 bg-surface-high rounded-lg" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="kpi-card kpi-card-navy space-y-4">
            <div className="flex justify-between">
              <div className="h-9 w-9 rounded-xl bg-surface-high" />
              <div className="h-4 w-20 bg-surface-high rounded-lg" />
            </div>
            <div className="h-4 w-28 bg-surface-high rounded-lg" />
            <div className="h-8 w-36 bg-surface-high rounded-xl" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-low rounded-(--radius-card) p-8 space-y-4">
            <div className="h-6 w-48 bg-surface-high rounded-lg" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-surface-high">
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 rounded-xl bg-surface-high" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-surface-high rounded-lg" />
                    <div className="h-3 w-24 bg-surface-high rounded-lg" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-surface-high rounded-lg" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="quick-action">
                <div className="h-10 w-10 rounded-xl bg-surface-high" />
                <div className="h-4 w-20 bg-surface-high rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="dgii-card space-y-3">
            <div className="h-5 w-32 bg-white/20 rounded-lg" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-20 bg-white/20 rounded-lg" />
                  <div className="h-3 w-full bg-white/20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-surface-lowest rounded-(--radius-card) p-5 space-y-3">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-surface-high" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-surface-high rounded-lg" />
                <div className="h-3 w-40 bg-surface-high rounded-lg" />
              </div>
            </div>
            <div className="h-10 w-full bg-surface-high rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
