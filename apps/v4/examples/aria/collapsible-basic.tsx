import { ChevronDownIcon } from "@/registry/icons/__lucide__"
import { Button } from "@/styles/aria-nova/ui/button"
import { Card, CardContent } from "@/styles/aria-nova/ui/card"
import {
  Collapsible,
  CollapsibleContent,
} from "@/styles/aria-nova/ui/collapsible"

export function CollapsibleBasic() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardContent>
        <Collapsible className="rounded-md data-open:bg-muted">
          <Button slot="trigger" variant="ghost" className="w-full">
            Product details
            <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
          </Button>
          <CollapsibleContent>
            <div className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
              <div>
                This panel can be expanded or collapsed to reveal additional
                content.
              </div>
              <Button size="xs">Learn More</Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
