import { EditorWorkspace } from "./components/editor-workspace"
import { PreviewHeader } from "./components/preview-header"

export function Preview03() {
  return (
    <div className="preview theme-taupe w-full flex-1 bg-muted font-sans ring-1 ring-foreground/5">
      <PreviewHeader />
      <div className="container pb-8">
        <EditorWorkspace />
      </div>
    </div>
  )
}
