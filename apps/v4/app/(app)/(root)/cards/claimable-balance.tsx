import { Badge } from "@/styles/base-rhea/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/base-rhea/ui/card"
import { Item, ItemContent } from "@/styles/base-rhea/ui/item"
import { Separator } from "@/styles/base-rhea/ui/separator"

const netRoyalties = 1248.75
const processingFee = 37.46
const totalClaimable = netRoyalties - processingFee

const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export function ClaimableBalance() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Claimable Balance</CardDescription>
        <CardTitle className="text-4xl tabular-nums">
          ${formatCurrency(totalClaimable)}
        </CardTitle>
        <Badge variant="outline">
          <span className="size-2 rounded-full bg-yellow-500" />
          Pending Setup
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end">
        <Item variant="muted" className="flex-col items-stretch">
          <ItemContent className="gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Net Royalties
              </span>
              <span className="text-sm font-medium tabular-nums">
                ${formatCurrency(netRoyalties)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Processing Fee
              </span>
              <span className="text-sm font-medium tabular-nums">
                -${formatCurrency(processingFee)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Ready to Claim
              </span>
              <span className="text-sm font-semibold tabular-nums">
                ${formatCurrency(totalClaimable)} USD
              </span>
            </div>
          </ItemContent>
        </Item>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Once your bank is connected, balances over $10.00 are automatically
          eligible for monthly distribution on the 15th of each month.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
