"use client"

import { addDays } from "date-fns"
import { Check, Plus, Send } from "lucide-react"
import { Card, CardContent } from "@/registry/tui/ui/card"
import { } from "../../ui/badge"
import ButtonAsChild from "../button-as-child"
import ButtonDemo from "../button-demo"
import ButtonDestructive from "../button-destructive"
import ButtonGhost from "../button-ghost"
import ButtonIcon from "../button-icon"
import ButtonLink from "../button-link"
import ButtonLoading from "../button-loading"
import ButtonOutline from "../button-outline"
import ButtonSecondary from "../button-secondary"
import ButtonWithIcon from "../button-with-icon"
import { Button } from "../../ui/button"

const start = new Date(2023, 5, 5)

export function CardsButton() {
  return (
    <Card>
      <CardContent className="space-y-1 p-2">
        <div className="space-x-2 space-y-2">
          <Button size="xs">Button Text</Button>
          <Button size="sm">Button Text</Button>
          <Button>Button Text</Button>
          <Button size="lg">Button Text</Button>
          <Button size="xl">Button Text</Button>
        </div>
        <div className="space-x-2 space-y-2">
          <Button variant="outline" size="xs">Button Text</Button>
          <Button variant="outline" size="sm">Button Text</Button>
          <Button variant="outline">Button Text</Button>
          <Button variant="outline" size="lg">Button Text</Button>
          <Button variant="outline" size="xl">Button Text</Button>
        </div>
        <div className="space-x-2 space-y-2">
          <Button variant="soft" size="xs">Button Text</Button>
          <Button variant="soft" size="sm">Button Text</Button>
          <Button variant="soft">Button Text</Button>
          <Button variant="soft" size="lg">Button Text</Button>
          <Button variant="soft" size="xl">Button Text</Button>
        </div>
        <div className="space-x-2 space-y-2">
          <Button rounded="full" size="xs">Button Text</Button>
          <Button rounded="full" size="sm">Button Text</Button>
          <Button rounded="full">Button Text</Button>
          <Button rounded="full" size="lg">Button Text</Button>
          <Button rounded="full" size="xl">Button Text</Button>
        </div>
        <div className="space-x-2 space-y-2">
          <Button rounded="full" variant="outline" size="xs">Button Text</Button>
          <Button rounded="full" variant="outline" size="sm">Button Text</Button>
          <Button rounded="full" variant="outline">Button Text</Button>
          <Button rounded="full" variant="outline" size="lg">Button Text</Button>
          <Button rounded="full" variant="outline" size="xl">Button Text</Button>
        </div>
        <div className="space-x-2 space-y-2">
          <Button icon={"check-solid"} size="xs">Button Text</Button>
          <Button icon={"check-solid"} size="sm">Button Text</Button>
          <Button icon={"check-solid"}>Button Text</Button>
          <Button icon={"check-solid"} size="lg">Button Text</Button>
          <Button icon={"check-solid"} size="xl">Button Text</Button>
        </div>
        <div className="space-x-2 space-y-2">
          <ButtonAsChild />
          <ButtonDemo />
          <ButtonDestructive />
          <ButtonGhost />
          <ButtonIcon />
          <ButtonLink />
          <ButtonLoading />
          <ButtonOutline />
          <ButtonSecondary />
          <ButtonWithIcon />
        </div>
      </CardContent>
    </Card>
  )
}
