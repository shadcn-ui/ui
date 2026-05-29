import { Separator } from "@/styles/base-sera/ui/separator"

import { ArticleDirectory as ArticleDirectoryList } from "./components/article-directory"
import { PreviewHeader } from "./components/preview-header"

export function ArticleDirectory() {
  return (
    <div className="preview theme-taupe @container/preview w-full flex-1 bg-muted pt-4 font-sans ring-1 ring-foreground/5 [--gap:--spacing(4)] sm:pt-0 md:[--gap:--spacing(6)] xl:[--gap:--spacing(8)] 2xl:py-8 **:[.container]:px-(--gap)">
      <PreviewHeader />
      <Separator className="hidden sm:block" />
      <div className="container py-(--gap)">
        <ArticleDirectoryList />
      </div>
    </div>
  )
}
