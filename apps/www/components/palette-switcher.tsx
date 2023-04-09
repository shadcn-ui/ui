"use client"

import * as React from "react"

import { palettes } from "@/lib/palettes"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Palettes = typeof palettes

export function PaletteSwitcher() {
  const [currentPalette, setCurrentPalette] =
    React.useState<Palettes[number]["name"]>("Default")
  const [palette, setPalette] = React.useState<Palettes[number]>(palettes[0])

  React.useEffect(() => {
    const palette = palettes.find((palette) => palette.name === currentPalette)
    if (palette) setPalette(palette)
  }, [currentPalette])

  return (
    <>
      <style global jsx>{`
        :root {
          ${Object.entries(palette.colors.light)
            .map(([name, color]) => `${name}: ${color};`)
            .join()
            .replace(/,/g, "")}
        }
        .dark {
          ${Object.entries(palette.colors.dark)
            .map(([name, color]) => `${name}: ${color};`)
            .join()
            .replace(/,/g, "")}
        }
      `}</style>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          {palettes.map((palette, index) => (
            <Tooltip key={index} delayDuration={0}>
              <TooltipContent>{palette.name}</TooltipContent>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setCurrentPalette(palette.name)}
                  className="block h-6 w-6 flex-1 rounded-full p-0"
                  style={{
                    backgroundColor: `hsl(${palette.colors.light["--primary"]})`,
                  }}
                >
                  <span className="sr-only">{palette.name}</span>
                </Button>
              </TooltipTrigger>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </>
  )
}
