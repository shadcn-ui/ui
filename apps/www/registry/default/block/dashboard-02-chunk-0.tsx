"use client"

import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"

export default function Component() {
  return (
    <Card x-chunk="dashboard-02-chunk-0">
      <CardHeader className="p-2 pt-0 md:p-4">
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Button size="sm" className="w-full">
          Upgrade
        </Button>
      </CardContent>
    </Card>
  )
}
