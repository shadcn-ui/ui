"use client"

import * as React from "react"
import {
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterRoot,
} from "@/examples/ark/ui-rtl/resizable"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      one: "One",
      two: "Two",
      three: "Three",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      one: "\u0648\u0627\u062d\u062f",
      two: "\u0627\u062b\u0646\u0627\u0646",
      three: "\u062b\u0644\u0627\u062b\u0629",
    },
  },
  he: {
    dir: "rtl",
    values: {
      one: "\u05d0\u05d7\u05d3",
      two: "\u05e9\u05e0\u05d9\u05d9\u05dd",
      three: "\u05e9\u05dc\u05d5\u05e9\u05d4",
    },
  },
}

export function ResizableRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <SplitterRoot
      panels={[{ id: "a" }, { id: "b" }]}
      className="max-w-sm rounded-lg border"
      dir={dir}
    >
      <SplitterPanel id="a">
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">{t.one}</span>
        </div>
      </SplitterPanel>
      <SplitterResizeTrigger id="a:b" withHandle />
      <SplitterPanel id="b">
        <SplitterRoot
          panels={[{ id: "c" }, { id: "d" }]}
          orientation="vertical"
          dir={dir}
        >
          <SplitterPanel id="c">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">{t.two}</span>
            </div>
          </SplitterPanel>
          <SplitterResizeTrigger id="c:d" withHandle />
          <SplitterPanel id="d">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">{t.three}</span>
            </div>
          </SplitterPanel>
        </SplitterRoot>
      </SplitterPanel>
    </SplitterRoot>
  )
}
