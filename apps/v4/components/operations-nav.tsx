'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Factory, 
  Calendar, 
  ClipboardCheck, 
  Truck, 
  Network, 
  FolderKanban,
  FileText,
  BarChart3,
  FileBarChart,
  MapPin,
  ShoppingCart,
  Clock
} from 'lucide-react'

const mainNavItems = [
  {
    title: 'Manufacturing',
    href: '/erp/operations/manufacturing',
    icon: Factory,
    subItems: [
      { title: 'Work Orders', href: '/erp/operations/manufacturing' },
      { title: 'Bill of Materials', href: '/erp/operations/manufacturing/bom', icon: FileText },
    ],
  },
  {
    title: 'Production Planning',
    href: '/erp/operations/planning',
    icon: Calendar,
    subItems: [
      { title: 'Production Schedule', href: '/erp/operations/planning' },
      { title: 'Capacity Planning', href: '/erp/operations/planning/capacity', icon: BarChart3 },
    ],
  },
  {
    title: 'Quality Control',
    href: '/erp/operations/quality',
    icon: ClipboardCheck,
    subItems: [
      { title: 'Quality Checks', href: '/erp/operations/quality' },
      { title: 'Quality Reports', href: '/erp/operations/quality/reports', icon: FileBarChart },
    ],
  },
  {
    title: 'Logistics',
    href: '/erp/operations/logistics',
    icon: Truck,
    subItems: [
      { title: 'Shipments', href: '/erp/operations/logistics' },
      { title: 'Track Deliveries', href: '/erp/operations/logistics/tracking', icon: MapPin },
    ],
  },
  {
    title: 'Supply Chain',
    href: '/erp/operations/supply-chain',
    icon: Network,
    subItems: [
      { title: 'Overview', href: '/erp/operations/supply-chain' },
      { title: 'Procurement Advanced', href: '/erp/operations/supply-chain/procurement-advanced', icon: ShoppingCart },
    ],
  },
  {
    title: 'Projects',
    href: '/erp/operations/projects',
    icon: FolderKanban,
    subItems: [
      { title: 'Active Projects', href: '/erp/operations/projects' },
      { title: 'Project Timeline', href: '/erp/operations/projects/timeline', icon: Clock },
    ],
  },
]

export function OperationsNav() {
  const pathname = usePathname()

  // Find active module
  const activeModule = mainNavItems.find(item => 
    pathname.startsWith(item.href)
  )

  return (
    <div className="border-b bg-background">
      {/* Main Navigation */}
      <div className="flex h-14 items-center gap-2 px-4 overflow-x-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </div>

      {/* Sub Navigation */}
      {activeModule && activeModule.subItems && activeModule.subItems.length > 1 && (
        <div className="flex h-10 items-center gap-1 px-4 bg-muted/30 overflow-x-auto">
          {activeModule.subItems.map((subItem) => {
            const isActive = pathname === subItem.href
            const SubIcon = subItem.icon
            
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                )}
              >
                {SubIcon && <SubIcon className="h-3.5 w-3.5" />}
                {subItem.title}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
