"use client"

import * as React from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/aria/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/aria/ui/item"
import { Slider } from "@/registry/bases/aria/ui/slider"
import { Switch } from "@/registry/bases/aria/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/aria/ui/toggle-group"
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
          <Switch isSelected={enabled} onChange={setEnabled} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="sr-only">Scenes</span>
          <ToggleGroup
            selectedKeys={[scene]}
            onSelectionChange={(value) =>
              handleSceneChange((Array.from(value)[0] as string) ?? "cooking")
            }
            variant="outline"
            spacing={1}
            className="flex-wrap"
          >
            <ToggleGroupItem id="cooking" isDisabled={!enabled}>
              Cooking
            </ToggleGroupItem>
            <ToggleGroupItem id="dining" isDisabled={!enabled}>
              Dining
            </ToggleGroupItem>
            <ToggleGroupItem id="nightlight" isDisabled={!enabled}>
              Nightlight
            </ToggleGroupItem>
            <ToggleGroupItem id="focus" isDisabled={!enabled}>
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
                onChange={(value) =>
                  setBrightness(Array.isArray(value) ? [...value] : [value])
                }
                maxValue={100}
                isDisabled={!enabled}
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
                onChange={(value) =>
                  setColorTemp(Array.isArray(value) ? [...value] : [value])
                }
                maxValue={100}
                isDisabled={!enabled}
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
                onChange={(value) =>
                  setVolume(Array.isArray(value) ? [...value] : [value])
                }
                maxValue={100}
                isDisabled={!enabled}
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
                onChange={(value) =>
                  setFade(Array.isArray(value) ? [...value] : [value])
                }
                maxValue={100}
                isDisabled={!enabled}
              />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
