export default function DashboardPageLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-28 bg-surface-high rounded-lg" />
        <div className="h-8 w-64 bg-surface-high rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-lowest rounded-(--radius-card) p-8 space-y-4 shadow-card">
            <div className="h-5 w-40 bg-surface-high rounded-lg" />
            <div className="h-4 w-full bg-surface-high rounded-lg" />
            <div className="h-4 w-3/4 bg-surface-high rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
