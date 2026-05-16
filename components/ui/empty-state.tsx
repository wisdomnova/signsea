export function EmptyState({ 
  title, 
  description, 
  icon: Icon,
  action,
  children 
}: { 
  title?: string
  description?: string
  icon?: any
  action?: { label: string; href: string }
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && <div className="text-4xl mb-4">
        {typeof Icon === 'function' ? <Icon size={48} weight="duotone" className="text-marine/30" /> : Icon}
      </div>}
      {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      {action && <a href={action.href} className="text-sm text-seafoam font-bold hover:underline">{action.label}</a>}
      {children}
    </div>
  )
}
