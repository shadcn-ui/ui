"use client"

import Script from "next/script"
import { Button } from "@/examples/base/ui/button"
import { DiceFaces05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useRandom } from "@/app/(create)/hooks/use-random"

export const RANDOMIZE_FORWARD_TYPE = "randomize-forward"

export function RandomButton({
  variant = "outline",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { randomize } = useRandom()

  return (
    <Button
      variant={variant}
      onClick={randomize}
      className={cn(
        "h-17! w-42 touch-manipulation justify-between rounded-xl bg-transparent! p-4 text-sm! select-none hover:bg-muted! md:h-9! md:rounded-lg md:px-2!",
        className
      )}
      {...props}
    >
      <div className="flex touch-manipulation flex-col justify-start text-left md:hidden">
        <div className="text-xs text-muted-foreground">Shuffle</div>
        <div className="text-sm font-medium text-foreground">Try Random</div>
      </div>
      <span className="hidden font-medium md:inline md:w-full md:text-center">
        Shuffle
      </span>
      <HugeiconsIcon
        icon={DiceFaces05Icon}
        strokeWidth={2}
        className="size-5 md:hidden"
      />
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
