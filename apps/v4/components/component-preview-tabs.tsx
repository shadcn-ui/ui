"use client"

import * as React from "react"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/examples/base/ui/popover"
import { IconAlertCircle } from "@tabler/icons-react"

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
import { Separator } from "@/registry/new-york-v4/ui/separator"

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
        "group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-xl border",
        className
      )}
      {...props}
    >
      {direction === "rtl" ? (
        <LanguageProvider defaultLanguage="ar">
          <div className="flex h-16 items-center border-b px-4">
            <RtlLanguageSelector />
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="ml-auto size-7"
                  >
                    <IconAlertCircle />
                    <span className="sr-only">Toggle</span>
                  </Button>
                }
              ></PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                className="w-56 text-xs"
              >
                <div>
                  I used AI to translate the text for demonstration purposes.
                  It&apos;s not perfect and may contain errors.
                </div>
                <Separator className="-mx-2.5 w-auto!" />
                <div data-lang="ar">
                  لقد استخدمت الذكاء الاصطناعي لترجمة النص للأغراض التجريبية
                  فقط. قد لا تكون الترجمة دقيقة وقد تحتوي على أخطاء.
                </div>
                <Separator className="-mx-2.5 w-auto!" />
                <div data-lang="he">
                  השתמשתי בבינה מלאכותית כדי לתרגם את הטקסט למטרות הדגמה. זה לא
                  מושלם ויכול להכיל שגיאות.
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
          className="relative overflow-hidden **:data-[slot=copy-button]:right-4 **:data-[slot=copy-button]:hidden data-[mobile-code-visible=true]:**:data-[slot=copy-button]:flex [&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
        >
          {isMobileCodeVisible ? (
            <>
              {direction === "rtl" && (
                <div className="relative z-10 no-scrollbar overflow-x-auto border-t bg-code p-6 font-mono text-sm text-muted-foreground">
                  <pre>{`// You will notice this example uses dir and data-lang attributes.
// This is because this site is not RTL by default.
// In your application, you won't need these.`}</pre>
                  <span>
                    {"// See the "}
                    <Link
                      href="/docs/rtl"
                      className="underline underline-offset-4"
                    >
                      RTL guide
                    </Link>
                    {" for more information."}
                  </span>
                </div>
              )}
              {source}
            </>
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
                  className="relative z-10 rounded-lg bg-background text-foreground shadow-none hover:bg-muted dark:bg-background dark:text-foreground dark:hover:bg-muted"
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

function RtlLanguageSelector({ className }: { className?: string }) {
  const context = useLanguageContext()
  if (!context) {
    return null
  }
  return (
    <LanguageSelector
      value={context.language}
      onValueChange={context.setLanguage}
      className={className}
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
    <div
      data-slot="preview"
      dir={dir}
      data-lang={dir === "rtl" ? translation.language : undefined}
    >
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
