import { Separator } from "@/examples/base/ui/separator"
import { type RegistryItem } from "shadcn/schema"

import { ActionMenu } from "@/app/(create)/components/action-menu"
import { CopyPreset } from "@/app/(create)/components/copy-preset"
import { HistoryButtons } from "@/app/(create)/components/history-buttons"
import { ModeSwitcher } from "@/app/(create)/components/mode-switcher"
import { ProjectForm } from "@/app/(create)/components/project-form"
import { ShareButton } from "@/app/(create)/components/share-button"
import { V0Button } from "@/app/(create)/components/v0-button"

export function PageHeader({
  itemsByBase,
}: {
  itemsByBase: Record<string, Pick<RegistryItem, "name" | "title" | "type">[]>
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="px-2">
        <div className="flex h-12 items-center gap-4 **:data-[slot=separator]:h-4! **:data-[slot=separator]:self-center">
          <div className="item-center flex w-1/3 gap-2">
            <HistoryButtons />
            <Separator orientation="vertical" />
            <CopyPreset />
          </div>
          <div className="ml-auto flex items-center justify-end gap-2">
            <ShareButton />
            <V0Button />
            <Separator orientation="vertical" />
            <ProjectForm />
            <Separator orientation="vertical" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
