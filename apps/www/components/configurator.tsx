"use client"

import { Style, styles } from "@/registry/styles"

import { useConfig } from "@/hooks/use-config"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Configurator() {
  const [config, setConfig] = useConfig()

  return (
    <div>
      <Select
        value={config.style}
        onValueChange={(value) =>
          setConfig({
            style: value as Style,
          })
        }
      >
        <SelectTrigger className="h-9 w-[180px]">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(styles).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
