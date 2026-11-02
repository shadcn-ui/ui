"use client"

import * as React from "react"
import { Edit2, Eye, Plus, Trash2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

interface ActionHandlerProps extends React.ComponentProps<"div"> {
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  onAdd?: () => void
  onClose?: () => void
}

const iconMap = {
  onEdit: Edit2,
  onDelete: Trash2,
  onView: Eye,
  onAdd: Plus,
  onClose: X,
} as const

const labelMap: Record<keyof typeof iconMap, string> = {
  onEdit: "Edit",
  onDelete: "Delete",
  onView: "View",
  onAdd: "Add",
  onClose: "Close",
}

function ActionHandler({
  onEdit,
  onDelete,
  onView,
  onAdd,
  onClose,
  className,
  ...props
}: ActionHandlerProps) {
  const actions: Array<{
    key: keyof typeof iconMap
    handler?: () => void
  }> = [
    { key: "onEdit", handler: onEdit },
    { key: "onDelete", handler: onDelete },
    { key: "onView", handler: onView },
    { key: "onAdd", handler: onAdd },
    { key: "onClose", handler: onClose },
  ]

  return (
    <div
      className={cn(
        "flex w-fit gap-2 rounded-md border border-border p-1",
        className
      )}
      data-slot="action-handler"
      role="toolbar"
      aria-label="Actions"
      {...props}
    >
      {actions.map(({ key, handler }) => {
        if (!handler) return null

        const Icon = iconMap[key]

        return (
          <Button
            key={key}
            variant="ghost"
            size="icon"
            onClick={handler}
            title={labelMap[key]}
            aria-label={labelMap[key]}
            data-slot={`action-${key}`}
          >
            <Icon className="h-4 w-4" />
          </Button>
        )
      })}
    </div>
  )
}

export { ActionHandler }
