"use client"

import Script from "next/script"
import { Button } from "@/examples/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"
import { DiceFaces05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useRandom } from "@/app/(create)/hooks/use-random"

export const RANDOMIZE_FORWARD_TYPE = "randomize-forward"

export function RandomButton({
  variant = "outline",
  className,
  collapsed = false,
  ...props
}: React.ComponentProps<typeof Button> & {
  collapsed?: boolean
}) {
  const { randomize } = useRandom()

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={variant}
              size="icon"
              aria-label="Shuffle"
              onClick={randomize}
              className={cn(
                "size-10 touch-manipulation rounded-xl bg-transparent! transition-none select-none hover:bg-muted!",
                className
              )}
              {...props}
            />
          }
        >
          <HugeiconsIcon icon={DiceFaces05Icon} strokeWidth={2} />
          <span className="sr-only">Shuffle</span>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          Shuffle
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button
      variant={variant}
      onClick={randomize}
      className={cn(
        "touch-manipulation bg-transparent! px-2! py-0! text-sm! transition-none select-none hover:bg-muted! pointer-coarse:h-10!",
        className
      )}
      {...props}
    >
      <span className="w-full text-center font-medium">Shuffle</span>
    </Button>
  )
}

export function RandomizeScript() {
  return (
    <Script
      id="randomize-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward R key
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey) {
                  if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                  ) {
                    return;
                  }
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${RANDOMIZE_FORWARD_TYPE}',
                      key: e.key
                    }, '*');
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}
