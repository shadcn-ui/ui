"use client"

import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function ObservabilityCard() {
  return (
    <Card className="relative w-full max-w-md overflow-hidden pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color" />
      <img
        src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Photo by mymind on Unsplash"
        title="Photo by mymind on Unsplash"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
      />
      <CardHeader>
        <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
        <CardDescription>
          Switch to the improved way to explore your data, with natural
          language. Monitoring will no longer be available on the Pro plan in
          November, 2025
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>
          Create Query{" "}
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            data-icon="inline-end"
          />
        </Button>
        <Badge variant="secondary" className="ml-auto">
          Warning
        </Badge>
      </CardFooter>
    </Card>
  )
}
