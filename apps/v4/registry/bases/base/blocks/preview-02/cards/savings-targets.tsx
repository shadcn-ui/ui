import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/base/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
} from "@/registry/bases/base/ui/item"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"
import { Progress } from "@/registry/bases/base/ui/progress"

export function SavingsTargets() {
  return (
    <div className="grid grid-cols-2 gap-(--gap)">
      <Card>
        <CardHeader>
          <CardTitle>Savings Targets</CardTitle>
          <CardDescription>Active milestones for 2024</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm">
              New Goal
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ItemGroup className="gap-3">
            <Item variant="muted" className="flex-col items-stretch">
              <ItemContent className="gap-3">
                <ItemDescription className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Retirement
                </ItemDescription>
                <span className="text-3xl font-semibold tabular-nums">
                  $420,000
                </span>
                <Progress value={65} />
              </ItemContent>
              <ItemFooter>
                <span className="text-sm text-muted-foreground">
                  65% achieved
                </span>
                <span className="text-sm font-medium tabular-nums">
                  $273,000
                </span>
              </ItemFooter>
            </Item>
            <Item variant="muted" className="flex-col items-stretch">
              <ItemContent className="gap-3">
                <ItemDescription className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Real Estate
                </ItemDescription>
                <span className="text-3xl font-semibold tabular-nums">
                  $85,000
                </span>
                <Progress value={32} />
              </ItemContent>
              <ItemFooter>
                <span className="text-sm text-muted-foreground">
                  32% achieved
                </span>
                <span className="text-sm font-medium tabular-nums">
                  $27,200
                </span>
              </ItemFooter>
            </Item>
          </ItemGroup>
        </CardContent>
        <CardFooter>
          <CardDescription className="text-center">
            You have not met your targets for this year.
          </CardDescription>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Buy Investment</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <FieldGroup className="flex-1">
            <Field>
              <FieldLabel htmlFor="invest-amount">Amount to Invest</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput id="invest-amount" defaultValue="1,000.00" />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="invest-type">Order Type</FieldLabel>
              <NativeSelect id="invest-type" defaultValue="market">
                <NativeSelectOption value="market">
                  Market Order
                </NativeSelectOption>
                <NativeSelectOption value="limit">
                  Limit Order
                </NativeSelectOption>
                <NativeSelectOption value="stop">Stop Order</NativeSelectOption>
              </NativeSelect>
              <FieldDescription>
                Market orders execute at the current price.
              </FieldDescription>
            </Field>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estimated Shares
                </span>
                <span className="text-sm font-semibold tabular-nums">1.95</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Buying Power
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  $12,450.00
                </span>
              </div>
            </div>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button className="w-full">Review Order</Button>
          <CardDescription className="text-center">
            Trades are typically executed within minutes during market hours.
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}
