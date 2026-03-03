import { Separator } from "@/examples/base/ui/separator"
import { type RegistryItem } from "shadcn/schema"

import { CopyPreset } from "@/app/(create)/components/copy-preset"
import { ProjectForm } from "@/app/(create)/components/project-form"
import { ShareButton } from "@/app/(create)/components/share-button"
import { V0Button } from "@/app/(create)/components/v0-button"

export function PageHeader({
  itemsByBase,
}: {
  itemsByBase: Record<string, Pick<RegistryItem, "name" | "title" | "type">[]>
}) {
  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b bg-card">
      <div className="px-3">
        <div className="flex h-14 items-center gap-4 **:data-[slot=separator]:h-4! **:data-[slot=separator]:self-center">
          <div className="item-center flex gap-2">
            <CopyPreset />
          </div>
          <div className="ml-auto flex items-center justify-end gap-2">
            <ShareButton />
            <V0Button />
            <Separator orientation="vertical" className="hidden md:block" />
            <ProjectForm />
          </div>
        </div>
      </div>
    </header>
  )
}
