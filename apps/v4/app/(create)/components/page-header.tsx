import { Separator } from "@/registry/new-york-v4/ui/separator"
import { CopyPreset } from "@/app/(create)/components/copy-preset"
import { HistoryNavigation } from "@/app/(create)/components/history-navigation"
import { ItemPicker } from "@/app/(create)/components/item-picker"
import { ProjectForm } from "@/app/(create)/components/project-form"
import { ShareButton } from "@/app/(create)/components/share-button"
import { V0Button } from "@/app/(create)/components/v0-button"
import { getItemsForBase } from "@/app/(create)/lib/api"

export async function PageHeader({ baseName }: { baseName: string }) {
  const items = await getItemsForBase(baseName)

  const filteredItems = items
    .filter((item) => item !== null)
    .map((item) => ({
      name: item.name,
      title: item.title,
      type: item.type,
    }))
    .filter((item) => !/\d+$/.test(item.name))

  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="px-4">
        <div className="flex h-(--header-height) items-center gap-4 **:data-[slot=separator]:h-4!">
          <div className="item-center flex w-1/3 gap-2">
            <HistoryNavigation />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:self-center"
            />
            <CopyPreset />
          </div>
          <div className="flex flex-1 items-center gap-2">
            <ItemPicker items={filteredItems} />
          </div>
          <div className="ml-auto flex w-1/3 items-center gap-2 sm:ml-0 md:justify-end">
            <ShareButton />
            <V0Button />
            <Separator orientation="vertical" className="mr-0 -ml-2 sm:ml-0" />
            <ProjectForm />
          </div>
        </div>
      </div>
    </header>
  )
}
