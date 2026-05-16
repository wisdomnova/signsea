export function DashboardSkeleton() {
  return <div className="space-y-4 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-12 bg-slate-200 rounded-lg" />
    ))}
  </div>
}

export function WalletSkeleton() {
  return <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-16 bg-slate-200 rounded-lg" />
    ))}
  </div>
}

export function SettingsSkeleton() {
  return <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-12 bg-slate-200 rounded-lg" />
    ))}
  </div>
}

export function PlannerSkeleton() {
  return <div className="space-y-4 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-20 bg-slate-200 rounded-lg" />
    ))}
  </div>
}

export function ReputationSkeleton() {
  return <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-16 bg-slate-200 rounded-lg" />
    ))}
  </div>
}

export function ProjectDetailSkeleton() {
  return <div className="space-y-6 animate-pulse">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="h-20 bg-slate-200 rounded-lg" />
    ))}
  </div>
}
