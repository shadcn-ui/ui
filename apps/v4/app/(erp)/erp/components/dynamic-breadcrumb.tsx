"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/registry/new-york-v4/ui/breadcrumb"

// Map routes to breadcrumb labels
const routeLabels: Record<string, string> = {
  '/erp': 'Dashboard',
  '/erp/sales': 'Sales',
  '/erp/sales/leads': 'Leads',
  '/erp/sales/leads/reports': 'Reports',
  '/erp/sales/leads/reports/detailed': 'Detailed Reports',
  '/erp/sales/opportunities': 'Opportunities',
  '/erp/sales/quotations': 'Quotations',
  '/erp/sales/orders': 'Orders',
  '/erp/sales/customers': 'Customers',
  '/erp/sales/analytics': 'Sales Analytics',
  '/erp/sales/performance': 'Performance',
  '/erp/product': 'Product',
  '/erp/product/catalog': 'Product Catalog',
  '/erp/product/inventory': 'Inventory',
  '/erp/product/stock': 'Stock Management',
  '/erp/product/suppliers': 'Suppliers',
  '/erp/product/suppliers/performance': 'Performance',
  '/erp/product/suppliers/performance/compare': 'Compare',
  '/erp/operations': 'Operations',
  '/erp/operations/manufacturing': 'Manufacturing',
  '/erp/operations/manufacturing/bom': 'Bill of Materials',
  '/erp/operations/manufacturing/skincare-formulations': 'Formulations',
  '/erp/operations/planning': 'Production Planning',
  '/erp/operations/logistics': 'Logistics',
  '/erp/operations/logistics/tracking': 'Tracking',
  '/erp/operations/supply-chain': 'Supply Chain',
  '/erp/operations/supply-chain/procurement': 'Procurement',
  '/erp/operations/quality': 'Quality Control',
  '/erp/operations/quality/reports': 'Reports',
  '/erp/operations/quality/skincare-compliance': 'Compliance',
  '/erp/operations/projects': 'Projects',
  '/erp/operations/projects/timeline': 'Timeline',
  '/erp/operations/multi-location': 'Multi-Location',
  '/erp/accounting': 'Accounting',
    '/erp/accounting/chart-of-accounts': 'Chart of Accounts',
  '/erp/accounting/general-ledger': 'General Ledger',
    '/erp/accounting/ledger': 'Ledger',
    '/erp/accounting/accounts-payable': 'Accounts Payable',
    '/erp/accounting/accounts-receivable': 'Accounts Receivable',
    '/erp/accounting/journal-entries': 'Journals',
  '/erp/accounting/reports': 'Reports',
  '/erp/accounting/reports/profit-loss': 'Profit & Loss',
  '/erp/accounting/reports/balance-sheet': 'Balance Sheet',
  '/erp/accounting/budgeting': 'Budgeting',
    '/erp/accounting/close': 'Close',
    '/erp/accounting/close/pl': 'P&L Closing',
    '/erp/accounting/close/balance-sheet': 'BS Closing',
    // Legacy aliases (deprecated)
  '/accounting/reports': 'Reports',
  '/accounting/reports/profit-loss': 'Profit & Loss',
  '/accounting/reports/balance-sheet': 'Balance Sheet',
  '/accounting/journals': 'Journals',
  '/accounting/ledger': 'Ledger',
  '/erp/hris': 'HRIS',
  '/erp/hris/employees': 'Employees',
  '/erp/hris/payroll': 'Payroll',
  '/erp/hris/recruitment': 'Recruitment',
  '/erp/hris/attendance': 'Attendance',
  '/erp/hris/performance': 'Performance',
  '/erp/analytics': 'Analytics',
  '/erp/reports': 'Reports',
  '/erp/settings': 'Settings',
  '/erp/settings/profile': 'Profile',
  '/erp/settings/security': 'Security',
  '/erp/settings/users': 'Users',
  '/erp/settings/roles': 'Roles',
  '/erp/settings/company': 'Company',
  '/erp/settings/system': 'System',
  '/erp/integrations': 'Integrations',
  '/erp/trace': 'Trace',
  '/erp/trace/order': 'Order Trace',
  '/erp/trace/event': 'Event Trace',
  '/erp/trace/journal': 'Journal Trace',
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Build breadcrumb items from pathname
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbItems: { href: string; label: string }[] = []
  
  let currentPath = ''
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbItems.push({ href: currentPath, label })
  }

  // Always start with Dashboard
  if (breadcrumbItems.length === 0 || breadcrumbItems[0]?.href !== '/erp') {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/erp">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <div key={item.href} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
