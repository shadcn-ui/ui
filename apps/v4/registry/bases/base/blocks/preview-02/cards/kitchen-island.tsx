"use client"

import * as React from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { Slider } from "@/registry/bases/base/ui/slider"
import { Switch } from "@/registry/bases/base/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const SCENES = {
  cooking: { brightness: [90], colorTemp: [70], volume: [30], fade: [0] },
  dining: { brightness: [50], colorTemp: [40], volume: [20], fade: [60] },
  nightlight: { brightness: [15], colorTemp: [20], volume: [0], fade: [80] },
  focus: { brightness: [100], colorTemp: [85], volume: [0], fade: [0] },
} as const

export function KitchenIsland() {
  const [enabled, setEnabled] = React.useState(true)
  const [scene, setScene] = React.useState("cooking")
  const [brightness, setBrightness] = React.useState([90])
  const [colorTemp, setColorTemp] = React.useState([70])
  const [volume, setVolume] = React.useState([30])
  const [fade, setFade] = React.useState([0])

  const handleSceneChange = (value: string) => {
    if (!value) return
    setScene(value)
    const preset = SCENES[value as keyof typeof SCENES]
    setBrightness([...preset.brightness])
    setColorTemp([...preset.colorTemp])
    setVolume([...preset.volume])
    setFade([...preset.fade])
  }

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
        <div className="flex flex-col gap-2">
          <span className="sr-only">Scenes</span>
          <ToggleGroup
            value={[scene]}
            onValueChange={(value) => handleSceneChange(value[0] ?? "cooking")}
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
                value={brightness}
                onValueChange={(value) =>
                  setBrightness(Array.isArray(value) ? [...value] : [value])
                }
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
              <Slider
                value={colorTemp}
                onValueChange={(value) =>
                  setColorTemp(Array.isArray(value) ? [...value] : [value])
                }
                max={100}
                disabled={!enabled}
              />
            </ItemActions>
          </Item>
          <Item size="sm" variant="outline">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="Volume2Icon"
                tabler="IconVolume"
                hugeicons="VolumeHighIcon"
                phosphor="SpeakerHighIcon"
                remixicon="RiVolumeUpLine"
              />
            </ItemMedia>
            <ItemContent className="flex-row items-center gap-3">
              <ItemTitle className="shrink-0">Volume</ItemTitle>
            </ItemContent>
            <ItemActions className="flex-1">
              <Slider
                value={volume}
                onValueChange={(value) =>
                  setVolume(Array.isArray(value) ? [...value] : [value])
                }
                max={100}
                disabled={!enabled}
              />
            </ItemActions>
          </Item>
          <Item size="sm" variant="outline">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="TimerIcon"
                tabler="IconClock"
                hugeicons="Clock03Icon"
                phosphor="TimerIcon"
                remixicon="RiTimerLine"
              />
            </ItemMedia>
            <ItemContent className="flex-row items-center gap-3">
              <ItemTitle className="shrink-0">Fade</ItemTitle>
            </ItemContent>
            <ItemActions className="flex-1">
              <Slider
                value={fade}
                onValueChange={(value) =>
                  setFade(Array.isArray(value) ? [...value] : [value])
                }
                max={100}
                disabled={!enabled}
              />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
