import { PreviewFontVariables } from "@/app/(view)/preview/font-variables"
import { previewFontVariables } from "@/app/(view)/preview/fonts"

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={previewFontVariables}>
      <PreviewFontVariables className={previewFontVariables} />
      {children}
    </div>
  )
}
