import { Kbd, KbdGroup } from "@/registry/new-york-v4/ui/kbd"

export default function KbdGroupExample() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-sm">
        Use{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>B</Kbd>
        </KbdGroup>{" "}
        to toggle the sidebar
      </p>
    </div>
  )
}
