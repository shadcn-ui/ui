import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function IndexInvesting() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What&apos;s index investing?</CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon-sm" className="bg-muted">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          The MSCI World Index measures the performance of the global stock
          market. It includes hundreds of the world&apos;s biggest companies.
        </CardDescription>
        <CardDescription className="mt-3 text-sm leading-relaxed">
          Your money will be in a fund that tracks this index. So you&apos;re
          investing in all the companies it includes — and your investment will
          go up and down with the market.
        </CardDescription>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Save
        </Button>
        <Button className="flex-1">Copy</Button>
      </CardFooter>
    </Card>
  )
}
