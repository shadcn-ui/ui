"use client"

import Script from "next/script"
import { Button } from "@/examples/base/ui/button"
import { DiceFaces05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useRandom } from "@/app/(create)/hooks/use-random"

export const RANDOMIZE_FORWARD_TYPE = "randomize-forward"

export function RandomButton({
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { randomize } = useRandom()

  return (
    <Button variant={variant} onClick={randomize} {...props}>
      <HugeiconsIcon
        icon={DiceFaces05Icon}
        strokeWidth={2}
        className="size-4"
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
