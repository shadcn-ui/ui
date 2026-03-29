import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function Payments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <div className="flex gap-2">
          <Button size="sm">Send</Button>
          <Button size="sm" variant="secondary">
            Request
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item asChild variant="muted">
            <a href="#">
              <ItemMedia variant="icon">
                <IconPlaceholder
                  lucide="GaugeIcon"
                  tabler="IconGauge"
                  hugeicons="Settings01Icon"
                  phosphor="GaugeIcon"
                  remixicon="RiDashboardLine"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Change transfer limit</ItemTitle>
                <ItemDescription>
                  Adjust how much you can send from your balance.
                </ItemDescription>
              </ItemContent>
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="size-4 shrink-0 text-muted-foreground"
              />
            </a>
          </Item>
          <Item asChild variant="muted">
            <a href="#">
              <ItemMedia variant="icon">
                <IconPlaceholder
                  lucide="CalendarIcon"
                  tabler="IconCalendar"
                  hugeicons="Calendar03Icon"
                  phosphor="CalendarIcon"
                  remixicon="RiCalendarLine"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Scheduled transfers</ItemTitle>
                <ItemDescription>
                  Set up a transfer to send at a later date.
                </ItemDescription>
              </ItemContent>
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="size-4 shrink-0 text-muted-foreground"
              />
            </a>
          </Item>
          <Item asChild variant="muted">
            <a href="#">
              <ItemMedia variant="icon">
                <IconPlaceholder
                  lucide="RepeatIcon"
                  tabler="IconRepeat"
                  hugeicons="RepeatIcon"
                  phosphor="RepeatIcon"
                  remixicon="RiRepeatLine"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Direct Debits</ItemTitle>
                <ItemDescription>
                  Set up and manage regular payments.
                </ItemDescription>
              </ItemContent>
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="size-4 shrink-0 text-muted-foreground"
              />
            </a>
          </Item>
          <Item asChild variant="muted">
            <a href="#">
              <ItemMedia variant="icon">
                <IconPlaceholder
                  lucide="RefreshCwIcon"
                  tabler="IconRefresh"
                  hugeicons="RepeatIcon"
                  phosphor="ArrowsClockwiseIcon"
                  remixicon="RiRefreshLine"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Recurring card payments</ItemTitle>
                <ItemDescription>
                  Manage your repeated card transactions.
                </ItemDescription>
              </ItemContent>
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="size-4 shrink-0 text-muted-foreground"
              />
            </a>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
