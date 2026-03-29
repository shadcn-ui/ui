"use client"

import * as React from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { Slider } from "@/registry/bases/radix/ui/slider"
import { Switch } from "@/registry/bases/radix/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/radix/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function KitchenIsland() {
  const [enabled, setEnabled] = React.useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kitchen Island</CardTitle>
        <CardDescription>Hue Color Ambient</CardDescription>
        <CardAction>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ItemGroup>
          <Item size="sm" variant="outline">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="SunIcon"
                tabler="IconSun"
                hugeicons="Sun03Icon"
                phosphor="SunIcon"
                remixicon="RiSunLine"
              />
            </ItemMedia>
            <ItemContent className="flex-row items-center gap-3">
              <ItemTitle className="shrink-0">Brightness</ItemTitle>
            </ItemContent>
            <ItemActions className="flex-1">
              <Slider
                defaultValue={[70]}
                max={100}
                disabled={!enabled}
                className="w-full"
              />
            </ItemActions>
          </Item>
          <Item size="sm" variant="outline">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="ThermometerIcon"
                tabler="IconThermometer"
                hugeicons="ThermometerWarmIcon"
                phosphor="ThermometerIcon"
                remixicon="RiThermometerLine"
              />
            </ItemMedia>
            <ItemContent className="flex-row items-center gap-3">
              <ItemTitle className="shrink-0">Color Temp</ItemTitle>
            </ItemContent>
            <ItemActions className="flex-1">
              <Slider defaultValue={[50]} max={100} disabled={!enabled} />
            </ItemActions>
          </Item>
        </ItemGroup>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Scenes</span>
          <ToggleGroup
            type="single"
            defaultValue="cooking"
            variant="outline"
            spacing={1}
            className="flex-wrap"
          >
            <ToggleGroupItem value="cooking" disabled={!enabled}>
              Cooking
            </ToggleGroupItem>
            <ToggleGroupItem value="dining" disabled={!enabled}>
              Dining
            </ToggleGroupItem>
            <ToggleGroupItem value="nightlight" disabled={!enabled}>
              Nightlight
            </ToggleGroupItem>
            <ToggleGroupItem value="focus" disabled={!enabled}>
              Focus
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  )
}
