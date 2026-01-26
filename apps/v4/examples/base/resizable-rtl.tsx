"use client"

import * as React from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/examples/base/ui-rtl/resizable"

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
      one: "واحد",
      two: "اثنان",
      three: "ثلاثة",
    },
  },
  he: {
    dir: "rtl",
    values: {
      one: "אחד",
      two: "שניים",
      three: "שלושה",
    },
  },
}

export function ResizableRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-sm rounded-lg border"
      dir={dir}
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">{t.one}</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical" dir={dir}>
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">{t.two}</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">{t.three}</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
