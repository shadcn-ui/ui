import { Suspense } from "react"

import {
  DarkModeScript,
  HistoryScript,
  RandomizeScript,
} from "@/app/(app)/(typeset)/components/forward-scripts"
import { TypesetPreviewProvider } from "@/app/(app)/(typeset)/components/preview-provider"
import { findFont } from "@/app/(app)/(typeset)/lib/fonts"
import {
  loadTypesetSearchParams,
  TYPESET_MEASURES,
} from "@/app/(app)/(typeset)/lib/search-params"

import "@/app/(app)/(typeset)/typeset.css"

const DEFAULTS = loadTypesetSearchParams(new URLSearchParams())
const DEFAULT_FONT = findFont(DEFAULTS.body)?.value
const DEFAULT_MONO = findFont(DEFAULTS.mono)?.value
const DEFAULT_MEASURE = TYPESET_MEASURES.find(
  (option) => option.value === DEFAULTS.measure
)?.width

const PARAMS_STYLE = `.preview-params .typeset {
  --typeset-leading: var(--preview-leading, ${DEFAULTS.leading});
  --typeset-flow: var(--preview-flow, ${DEFAULTS.flow});
}`

export default function TypesetPreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DarkModeScript />
      <RandomizeScript />
      <HistoryScript />
      {/* TypesetPreviewProvider reads useSearchParams() via nuqs, which opts
          this subtree out of prerendering up to this boundary. */}
      <Suspense>
        <TypesetPreviewProvider>
          <style dangerouslySetInnerHTML={{ __html: PARAMS_STYLE }} />
          <div
            className="flex min-h-svh justify-center px-6 pt-8 pb-24 md:pt-24 md:pb-32"
            style={
              {
                fontFamily: `var(--preview-font, ${DEFAULT_FONT})`,
                "--font-heading": `var(--preview-font-heading, ${DEFAULT_FONT})`,
                "--font-mono": `var(--preview-font-mono, ${DEFAULT_MONO})`,
              } as React.CSSProperties
            }
          >
            <div
              className="preview-params w-full"
              style={
                {
                  fontSize: `var(--preview-size, ${DEFAULTS.scale}px)`,
                  maxWidth: `var(--preview-measure, ${DEFAULT_MEASURE})`,
                } as React.CSSProperties
              }
            >
              {children}
            </div>
          </div>
        </TypesetPreviewProvider>
      </Suspense>
    </>
  )
}
