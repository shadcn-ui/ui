"use client"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"

export function AnomalyAlert() {
  return (
    <Card>
      <CardContent>
        <Empty className="h-48">
          <EmptyHeader>
            <EmptyTitle>Get alerted for anomalies</EmptyTitle>
            <EmptyDescription>
              Automatically monitor your projects for anomalies and get
              notified.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Upgrade to Observability Plus</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
