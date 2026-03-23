"use client"

import { Alert, AlertDescription } from "@/registry/bases/base/ui/alert"
import { Badge } from "@/registry/bases/base/ui/badge"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Agent feature descriptions.
const agentFeatures = [
  {
    id: "code-reviews",
    content: (
      <>
        <strong>Code reviews</strong> with full codebase context to catch{" "}
        <strong>hard-to-find</strong> bugs.
      </>
    ),
  },
  {
    id: "code-suggestions",
    content: (
      <>
        <strong>Code suggestions</strong> validated in sandboxes before you
        merge.
      </>
    ),
  },
  {
    id: "root-cause",
    content: (
      <>
        <strong>Root-cause analysis</strong> for production issues with
        deployment context.{" "}
        <Badge variant="secondary" className="bg-chart-1 text-chart-5">
          Requires Observability Plus
        </Badge>
      </>
    ),
  },
]

export function ActivateAgentDialog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ship faster & safer with Vercel Agent</CardTitle>
        <CardDescription>
          Your use is subject to Vercel&apos;s{" "}
          <a href="#">Public Beta Agreement</a> and{" "}
          <a href="#">AI Product Terms</a>.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ItemGroup className="gap-0">
          {agentFeatures.map((feature) => (
            <Item key={feature.id} size="xs" className="px-0">
              <ItemMedia variant="icon" className="self-start">
                <IconPlaceholder
                  lucide="CheckCircle2Icon"
                  tabler="IconCircleCheckFilled"
                  hugeicons="CheckmarkCircle02Icon"
                  phosphor="CheckCircleIcon"
                  remixicon="RiCheckboxCircleLine"
                  className="size-5 fill-primary text-primary-foreground"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="inline leading-relaxed font-normal text-muted-foreground *:[strong]:font-medium *:[strong]:text-foreground">
                  {feature.content}
                </ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
        <Alert>
          <AlertDescription>
            Pro teams get $100 in Vercel Agent trial credit for 2 weeks after
            activation.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Enable with $100 credits</Button>
      </CardFooter>
    </Card>
  )
}
