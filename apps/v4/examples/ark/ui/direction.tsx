"use client"

import { LocaleProvider, useLocaleContext } from "@ark-ui/react/locale"

type Direction = "ltr" | "rtl"

function DirectionProvider({
  dir,
  direction,
  children,
}: {
  dir?: Direction
  direction?: Direction
  children: React.ReactNode
}) {
  const resolvedDir = direction ?? dir ?? "ltr"
  const locale = resolvedDir === "rtl" ? "ar" : "en-US"

  return <LocaleProvider locale={locale}>{children}</LocaleProvider>
}

function useDirection(): Direction {
  const { dir } = useLocaleContext()
  return dir as Direction
}

export { DirectionProvider, useDirection }
