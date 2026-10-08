import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function EmptyExploreCatalog() {
  return (
    <Card>
      <CardContent>
        <Empty className="p-4">
          <EmptyMedia variant="icon">
            <IconPlaceholder
              lucide="AudioLinesIcon"
              tabler="IconPlayerRecordFilled"
              hugeicons="AudioWave01Icon"
              phosphor="RecordIcon"
              remixicon="RiRecordCircleLine"
            />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Explore Catalog</EmptyTitle>
            <EmptyDescription>
              Check your ISRC codes, metadata, and visual assets before going
              live.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>View Catalog</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
