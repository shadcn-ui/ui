import { Separator } from "@/styles/base-sera/ui/separator"

import { AssetTable } from "./components/asset-table"
import { FilterLibrary } from "./components/filter-library"
import { PreviewHeader } from "./components/preview-header"

export function MediaLibraryTable() {
  return (
    <div className="preview theme-taupe @container/preview w-full flex-1 bg-muted pt-4 font-sans ring-1 ring-foreground/5 [--gap:--spacing(4)] sm:pt-0 md:[--gap:--spacing(6)] xl:[--gap:--spacing(8)] 2xl:py-8 **:[.container]:px-(--gap)">
      <PreviewHeader />
      <Separator className="hidden sm:block" />
      <div className="container grid grid-cols-1 items-start gap-(--gap) py-(--gap) xl:grid-cols-[minmax(0,1fr)_320px]">
        <AssetTable />
        <FilterLibrary />
      </div>
    </div>
  )
}
