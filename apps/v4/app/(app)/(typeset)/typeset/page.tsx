import { type Metadata } from "next"

import { cn } from "@/lib/utils"
import { TypesetCustomizer } from "@/app/(app)/(typeset)/components/customizer"
import { TypesetDocsPanel } from "@/app/(app)/(typeset)/components/docs-panel"
import { TypesetPreview } from "@/app/(app)/(typeset)/components/preview"
import { TypesetPreviewOverrideProvider } from "@/app/(app)/(typeset)/components/preview-override"
import { previewFontVariables } from "@/app/(view)/preview/fonts"

export const metadata: Metadata = {
  title: "Typeset",
  description: "Typography for markdown you don't control.",
}

export default function TypesetPage() {
  return (
    <div
      className={cn(
        "relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden section-soft [--customizer-width:--spacing(48)] [--gap:--spacing(4)] md:[--gap:--spacing(6)] 2xl:[--customizer-width:--spacing(56)]",
        previewFontVariables
      )}
    >
      <div
        data-slot="designer"
        className="flex min-h-0 flex-1 flex-col items-start gap-(--gap) p-(--gap) pt-[calc(var(--gap)*0.25)] md:flex-row-reverse"
      >
        <TypesetDocsPanel />
        <TypesetPreviewOverrideProvider>
          <TypesetPreview />
          <TypesetCustomizer />
        </TypesetPreviewOverrideProvider>
      </div>
    </div>
  )
}
