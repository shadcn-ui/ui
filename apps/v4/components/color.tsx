"use client"

import { Check, Clipboard } from "lucide-react"
import { toast } from "sonner"

import { type Color } from "@/lib/colors"
import { trackEvent } from "@/lib/events"
import { useColors } from "@/hooks/use-colors"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function Color({ color }: { color: Color }) {
  const { format, setLastCopied, lastCopied } = useColors()
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 0 })

  return (
    <button
      key={color.hex}
      className="group relative flex aspect-[3/1] w-full flex-1 cursor-pointer flex-col gap-2 text-(--text) sm:aspect-[2/3] sm:h-auto sm:w-auto [&>svg]:absolute [&>svg]:top-4 [&>svg]:right-4 [&>svg]:z-10 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-0 [&>svg]:transition-opacity"
      data-last-copied={lastCopied === color[format]}
      style={
        {
          "--bg": `${color.oklch}`,
          "--text": color.foreground,
        } as React.CSSProperties
      }
      onClick={() => {
        copyToClipboard(color[format])
        trackEvent({
          name: "copy_color",
          properties: {
            color: color.id,
            value: color[format],
            format,
          },
        })
        setLastCopied(color[format])
        toast.success(`Copied ${color[format]} to clipboard.`)
      }}
    >
      {isCopied ? (
        <Check className="group-hover:opacity-100 group-data-[last-copied=true]:opacity-100" />
      ) : (
        <Clipboard className="group-hover:opacity-100" />
      )}
      <div className="border-ghost after:border-input w-full flex-1 rounded-md bg-(--bg) after:rounded-lg md:rounded-lg" />
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <span className="text-muted-foreground group-hover:text-foreground group-data-[last-copied=true]:text-primary font-mono text-xs tabular-nums transition-colors sm:hidden xl:flex">
          {color.className}
        </span>
        <span className="text-muted-foreground group-hover:text-foreground group-data-[last-copied=true]:text-primary hidden font-mono text-xs tabular-nums transition-colors sm:flex xl:hidden">
          {color.scale}
        </span>
      </div>
    </button>
  )
}
