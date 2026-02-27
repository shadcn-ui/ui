"use client"

import * as React from "react"
import Script from "next/script"
import { Button } from "@/examples/base/ui/button"
import { DiceFaces05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useRandom } from "@/app/(create)/hooks/use-random"

export const RANDOMIZE_FORWARD_TYPE = "randomize-forward"

export function RandomButton() {
  const { randomize } = useRandom()

  return (
    <React.Fragment>
      <Button
        variant="ghost"
        onClick={randomize}
        className="border-foreground/10 bg-muted/50 flex h-[calc(--spacing(13.5))] w-[140px] touch-manipulation justify-between rounded-xl border select-none focus-visible:border-transparent focus-visible:ring-1 sm:hidden"
      >
        <div className="flex flex-col justify-start text-left">
          <div className="text-muted-foreground text-xs">Shuffle</div>
          <div className="text-foreground text-sm font-medium">Try Random</div>
        </div>
        <HugeiconsIcon icon={DiceFaces05Icon} className="size-5" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={randomize}
        className="hidden w-full sm:flex"
      >
        Shuffle
      </Button>
    </React.Fragment>
  )
}

export function RandomIconButton() {
  const { randomize } = useRandom()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={randomize}
      aria-label="Randomize"
    >
      <HugeiconsIcon icon={DiceFaces05Icon} />
      <span className="sr-only">Randomize</span>
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
