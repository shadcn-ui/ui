import { PreviewFontVariables } from "@/app/(create)/preview/font-variables"
import { previewFontVariables } from "@/app/(create)/preview/fonts"

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
