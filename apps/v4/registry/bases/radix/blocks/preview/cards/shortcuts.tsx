import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { Kbd } from "@/registry/bases/radix/ui/kbd"
import { Separator } from "@/registry/bases/radix/ui/separator"

export function Shortcuts() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium">Shortcuts</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Search</span>
              <div className="flex gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Quick Actions</span>
              <div className="flex gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>J</Kbd>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>New File</span>
              <div className="flex gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>N</Kbd>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Save</span>
              <div className="flex gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>S</Kbd>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Toggle Sidebar</span>
              <div className="flex gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>B</Kbd>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
