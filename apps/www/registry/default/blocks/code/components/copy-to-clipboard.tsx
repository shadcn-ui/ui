"use client"

import { useRef } from "react"
import { Check, Clipboard } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/default/ui/button"

type BlockCopyCodeButtonProps = {
  content: string
  forceTheme?: "light" | "dark"
}

export function BlockCopyCodeButton({
  content,
  forceTheme,
}: BlockCopyCodeButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  if (!content) {
    return null
  }

  return (
    <Button
      ref={ref}
      onClick={() => {
        copyToClipboard(content)
        ref.current?.blur()
      }}
      className={cn(
        "h-6 w-6 shrink-0 rounded-lg p-0 hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background focus-visible:bg-foreground focus-visible:text-background active:bg-foreground active:text-background data-[active=true]:bg-foreground data-[active=true]:text-background [&>svg]:size-3",
        forceTheme === "dark" && "text-white hover:bg-white hover:text-black",
        forceTheme === "light" && "text-black hover:bg-black hover:text-white"
      )}
      variant="ghost"
    >
      {isCopied ? <Check /> : <Clipboard />}
    </Button>
  )
}
