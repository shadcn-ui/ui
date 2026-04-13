import { EditorialPipelineBoard } from "./components/editorial-pipeline-board"

export function Preview05() {
  return (
    <div className="preview theme-taupe w-full flex-1 bg-muted font-sans ring-1 ring-foreground/5">
      <div className="container py-8">
        <EditorialPipelineBoard />
      </div>
    </div>
  )
}
