import { SettingsDialog } from "@/registry/new-york/block/sidebar-13/components/settings-dialog"

export const iframeHeight = "800px"

export const description = "A sidebar in a dialog."

export default function Page() {
  return (
    <div className="flex h-svh items-center justify-center">
      <SettingsDialog />
    </div>
  )
}
