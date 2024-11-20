"use client"

import { useTasks } from "@/registry/new-york/blocks/app-01/hooks/use-tasks"
import { Skeleton } from "@/registry/new-york/ui/skeleton"

export function TasksList() {
  const { tasks, isLoading } = useTasks()

  if (isLoading)
    return (
      <div className="grid gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-5 w-full" key={index} />
        ))}
      </div>
    )

  return (
    <div className="grid gap-2">
      {tasks.map((task, index) => (
        <div key={index} className="h-5 text-sm">
          {task}
        </div>
      ))}
    </div>
  )
}
