'use client'

import { Badge } from '@/registry/new-york-v4/ui/badge'
import { CheckCircle2, Clock, XCircle, AlertCircle, Ban } from 'lucide-react'

interface WorkflowStatusBadgeProps {
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled'
  className?: string
}

export function WorkflowStatusBadge({ status, className }: WorkflowStatusBadgeProps) {
  const variants = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-gray-100 text-gray-800 border-gray-300'
    },
    in_progress: {
      label: 'In Progress',
      icon: AlertCircle,
      className: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle2,
      className: 'bg-green-100 text-green-800 border-green-300'
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-300'
    },
    cancelled: {
      label: 'Cancelled',
      icon: Ban,
      className: 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const variant = variants[status]
  const Icon = variant.icon

  return (
    <Badge variant="outline" className={`${variant.className} ${className || ''}`}>
      <Icon className="mr-1 h-3 w-3" />
      {variant.label}
    </Badge>
  )
}
