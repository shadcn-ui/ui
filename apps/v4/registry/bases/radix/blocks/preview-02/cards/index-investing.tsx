import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function IndexInvesting() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dollar-Cost Averaging</CardTitle>
        <CardDescription>
          A strategy for building wealth over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription className="mt-3 text-sm leading-relaxed style-sera:mt-0">
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Over time
          </a>
          , this smooths out the average cost of your investments. When prices
          drop, your fixed amount buys more shares. When prices rise, you buy
          fewer. The result is a lower average cost per share compared to
          lump-sum investing during volatile periods.
        </CardDescription>
      </CardContent>
    </Card>
  )
}
