"use client"

import { IconMinus, IconPlus } from "@tabler/icons-react"
import { CheckIcon } from "lucide-react"

import { useThemeConfig } from "@/components/active-theme"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ButtonGroup } from "@/registry/new-york-v4/ui/button-group"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import { Switch } from "@/registry/new-york-v4/ui/switch"

const accents = [
  {
    name: "Blue",
    value: "blue",
  },
  {
    name: "Amber",
    value: "amber",
  },
  {
    name: "Green",
    value: "green",
  },
  {
    name: "Rose",
    value: "rose",
  },
]

export function AppearanceSettings() {
  const { activeTheme, setActiveTheme } = useThemeConfig()
  return (
    <FieldSet>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Compute Environment</FieldLegend>
          <FieldDescription>
            Select the compute environment for your cluster.
          </FieldDescription>
          <RadioGroup defaultValue="kubernetes">
            <FieldLabel htmlFor="kubernetes-r2h">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Kubernetes</FieldTitle>
                  <FieldDescription>
                    Run GPU workloads on a K8s configured cluster. This is the
                    default.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="kubernetes"
                  id="kubernetes-r2h"
                  aria-label="Kubernetes"
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="vm-z4k">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Virtual Machine</FieldTitle>
                  <FieldDescription>
                    Access a VM configured cluster to run workloads. (Coming
                    soon)
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="vm"
                  id="vm-z4k"
                  aria-label="Virtual Machine"
                />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Accent</FieldTitle>
            <FieldDescription>Select the accent color.</FieldDescription>
          </FieldContent>
          <FieldSet aria-label="Accent">
            <RadioGroup
              className="flex flex-wrap gap-2"
              value={activeTheme}
              onValueChange={setActiveTheme}
            >
              {accents.map((accent) => (
                <Label
                  htmlFor={accent.value}
                  key={accent.value}
                  data-theme={accent.value}
                  className="flex size-6 items-center justify-center rounded-full data-[theme=amber]:bg-amber-600 data-[theme=blue]:bg-blue-700 data-[theme=green]:bg-green-600 data-[theme=rose]:bg-rose-600"
                >
                  <RadioGroupItem
                    id={accent.value}
                    value={accent.value}
                    aria-label={accent.name}
                    className="peer sr-only"
                  />
                  <CheckIcon className="hidden size-4 stroke-white peer-data-[state=checked]:block" />
                </Label>
              ))}
            </RadioGroup>
          </FieldSet>
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="number-of-gpus-f6l">Number of GPUs</FieldLabel>
            <FieldDescription>You can add more later.</FieldDescription>
          </FieldContent>
          <ButtonGroup>
            <Input
              id="number-of-gpus-f6l"
              placeholder="8"
              size={3}
              className="h-8 !w-14 font-mono"
              maxLength={3}
            />
            <Button
              variant="outline"
              size="icon-sm"
              type="button"
              aria-label="Decrement"
            >
              <IconMinus />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              type="button"
              aria-label="Increment"
            >
              <IconPlus />
            </Button>
          </ButtonGroup>
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="tinting">Wallpaper Tinting</FieldLabel>
            <FieldDescription>
              Allow the wallpaper to be tinted.
            </FieldDescription>
          </FieldContent>
          <Switch id="tinting" defaultChecked />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
