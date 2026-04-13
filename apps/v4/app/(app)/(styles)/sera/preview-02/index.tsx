import { ArticleDirectory } from "./components/article-directory"
import { PreviewHeader } from "./components/preview-header"

export function Preview02() {
  return (
    <div className="preview theme-taupe w-full flex-1 bg-muted font-sans ring-1 ring-foreground/5">
      <PreviewHeader />
      <div className="container pb-8">
        <ArticleDirectory />
      </div>
    </div>
  )
}
