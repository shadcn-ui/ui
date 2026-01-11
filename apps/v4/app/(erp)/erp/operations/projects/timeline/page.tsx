'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { SidebarTrigger } from '@/registry/new-york-v4/ui/sidebar'
import { Separator } from '@/registry/new-york-v4/ui/separator'
import { OperationsNav } from '@/components/operations-nav'
import { ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ProjectTimelinePage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Project Timeline</h1>
      </header>

      <OperationsNav />

      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            Project Timeline
          </h2>
          <p className="text-muted-foreground mt-1">
            Visualize project schedules and milestones
          </p>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline & Gantt Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Project Timeline Module Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              This module will allow you to:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground">
              <li>• View Gantt chart timeline</li>
              <li>• Track milestone progress</li>
              <li>• Manage task dependencies</li>
              <li>• Visualize critical path</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
