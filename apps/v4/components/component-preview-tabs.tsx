"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

export function ComponentPreviewTabs({
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  component,
  source,
  ...props
}: React.ComponentProps<"div"> & {
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  chromeLessOnMobile?: boolean
  component: React.ReactNode
  source: React.ReactNode
}) {
  const [isMobileCodeVisible, setIsMobileCodeVisible] = React.useState(false)

  return (
    <div
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
            className="relative overflow-hidden data-[mobile-code-visible=false]:max-h-24 [&_[data-rehype-pretty-code-figure]]:!m-0 [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
            style={{
              contentVisibility: "auto",
              containIntrinsicSize: "auto 96px",
            }}
          >
            {source}
            {!isMobileCodeVisible && (
              <div className="absolute inset-0 flex items-center justify-center">
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
                  className="bg-background text-foreground dark:bg-background dark:text-foreground relative z-10"
                  onClick={() => {
                    setIsMobileCodeVisible(true)
                  }}
                >
                  View Code
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
