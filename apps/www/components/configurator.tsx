"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { styles, type Style } from "@/registry/styles"

import { useConfig } from "@/hooks/use-config"

export function Configurator() {
  const [config, setConfig] = useConfig()

  return (
    <div>
      <Select
        value={config.style}
        onValueChange={(value) =>
          setConfig({
            style: value as Style["name"],
          })
        }
      >
        <SelectTrigger className="h-9 w-[180px]">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          {styles.map((style) => (
            <SelectItem key={style.name} value={style.name}>
              {style.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
