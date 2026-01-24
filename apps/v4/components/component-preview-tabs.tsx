"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"

import { cn } from "@/lib/utils"

export function ComponentPreviewTabs({
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  component,
  source,
  sourcePreview,
  ...props
}: React.ComponentProps<"div"> & {
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  chromeLessOnMobile?: boolean
  component: React.ReactNode
  source: React.ReactNode
  sourcePreview?: React.ReactNode
}) {
  const [isMobileCodeVisible, setIsMobileCodeVisible] = React.useState(false)

  return (
    <div
      data-slot="component-preview"
      className={cn(
        "group relative mt-4 mb-12 flex flex-col gap-2 overflow-hidden rounded-xl border",
        className
      )}
      {...props}
    >
      <div data-slot="preview">
        <div
          data-align={align}
          data-chromeless={chromeLessOnMobile}
          className={cn(
            "preview flex h-72 w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start data-[chromeless=true]:h-auto data-[chromeless=true]:p-0",
            previewClassName
          )}
        >
          {component}
        </div>
        {!hideCode && (
          <div
            data-slot="code"
            data-mobile-code-visible={isMobileCodeVisible}
            className="relative overflow-hidden [&_[data-rehype-pretty-code-figure]]:!m-0 [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
          >
            {isMobileCodeVisible ? (
              source
            ) : (
              <div className="relative">
                {sourcePreview}
                <div className="absolute inset-0 flex items-center justify-center pb-4">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, var(--color-code), color-mix(in oklab, var(--color-code) 60%, transparent), transparent)",
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="bg-background text-foreground dark:bg-background dark:text-foreground hover:bg-muted dark:hover:bg-muted relative z-10"
                    onClick={() => {
                      setIsMobileCodeVisible(true)
                    }}
                  >
                    View Code
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
