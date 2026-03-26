"use client"

import Script from "next/script"
import { Button } from "@/examples/base/ui/button"
import { DiceFaces05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useRandom } from "@/app/(create)/hooks/use-random"
import { RESET_FORWARD_TYPE } from "@/app/(create)/hooks/use-reset"

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
              // Forward r key (shuffle) and Shift+R (reset).
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
                    var type = e.shiftKey
                      ? '${RESET_FORWARD_TYPE}'
                      : '${RANDOMIZE_FORWARD_TYPE}';
                    window.parent.postMessage({
                      type: type,
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
