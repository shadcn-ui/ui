"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  LanguageProvider,
  LanguageSelector,
  useLanguageContext,
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { DirectionProvider as BaseDirectionProvider } from "@/registry/bases/base/ui/direction"
import { DirectionProvider as RadixDirectionProvider } from "@/registry/bases/radix/ui/direction"
import { Button } from "@/registry/new-york-v4/ui/button"

export function ComponentPreviewTabs({
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  component,
  source,
  sourcePreview,
  direction = "ltr",
  styleName,
  ...props
}: React.ComponentProps<"div"> & {
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  chromeLessOnMobile?: boolean
  component: React.ReactNode
  source: React.ReactNode
  sourcePreview?: React.ReactNode
  direction?: "ltr" | "rtl"
  styleName?: string
}) {
  const [isMobileCodeVisible, setIsMobileCodeVisible] = React.useState(false)
  const base = styleName?.split("-")[0]

  return (
    <div
      data-slot="component-preview"
      className={cn(
        "group relative mt-4 mb-12 flex flex-col gap-2 overflow-hidden rounded-xl border",
        className
      )}
      {...props}
    >
      {direction === "rtl" ? (
        <LanguageProvider defaultLanguage="ar">
          <RtlLanguageSelector />
          <PreviewWrapper
            align={align}
            chromeLessOnMobile={chromeLessOnMobile}
            previewClassName={previewClassName}
          >
            <DirectionProviderWrapper base={base}>
              {component}
            </DirectionProviderWrapper>
          </PreviewWrapper>
        </LanguageProvider>
      ) : (
        <DirectionProviderWrapper base={base} dir="ltr">
          <PreviewWrapper
            align={align}
            chromeLessOnMobile={chromeLessOnMobile}
            previewClassName={previewClassName}
            dir="ltr"
          >
            {component}
          </PreviewWrapper>
        </DirectionProviderWrapper>
      )}
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
  )
}

const directionTranslations: Translations<Record<string, never>> = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

function RtlLanguageSelector() {
  const context = useLanguageContext()
  // This component is always rendered inside LanguageProvider when direction === "rtl".
  // so context should always be available.
  if (!context) {
    return null
  }
  return (
    <LanguageSelector
      value={context.language}
      onValueChange={context.setLanguage}
    />
  )
}

function PreviewWrapper({
  align,
  chromeLessOnMobile,
  previewClassName,
  dir: explicitDir,
  children,
}: {
  align: "center" | "start" | "end"
  chromeLessOnMobile: boolean
  previewClassName?: string
  dir?: "ltr" | "rtl"
  children: React.ReactNode
}) {
  // useTranslation handles the case when there's no LanguageProvider context.
  // It will fall back to local state with defaultLanguage.
  const translation = useTranslation(directionTranslations, "ar")
  const dir = explicitDir ?? translation.dir

  return (
    <div data-slot="preview" dir={dir}>
      <div
        data-align={align}
        data-chromeless={chromeLessOnMobile}
        className={cn(
          "preview relative flex h-72 w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start data-[chromeless=true]:h-auto data-[chromeless=true]:p-0",
          previewClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

function DirectionProviderWrapper({
  base,
  dir: explicitDir,
  children,
}: {
  base?: string
  dir?: "ltr" | "rtl"
  children: React.ReactNode
}) {
  // useTranslation handles the case when there's no LanguageProvider context.
  // It will fall back to local state with defaultLanguage.
  const translation = useTranslation(directionTranslations, "ar")
  const dir = explicitDir ?? translation.dir

  if (base === "base") {
    return (
      <BaseDirectionProvider direction={dir}>{children}</BaseDirectionProvider>
    )
  }

  return <RadixDirectionProvider dir={dir}>{children}</RadixDirectionProvider>
}
