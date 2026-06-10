"use client"

import { Badge } from "@/registry/bases/radix/ui/badge"
import { Card, CardContent, CardHeader } from "@/registry/bases/radix/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/radix/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/radix/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const HOLDINGS = [
  {
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    type: "ETF",
    added: "Jan 2021",
    shares: "112",
    value: "$48,230.40",
  },
  {
    ticker: "VIG",
    name: "Vanguard Dividend Appreciation",
    type: "ETF",
    added: "Mar 2022",
    shares: "450",
    value: "$26,033.79",
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    type: "Stock",
    added: "Nov 2020",
    shares: "85",
    value: "$18,488.90",
  },
  {
    ticker: "O",
    name: "Realty Income Corp",
    type: "REIT",
    added: "Jun 2023",
    shares: "320",
    value: "$15,136.59",
  },
]

export function ReleaseCatalog() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <IconPlaceholder
                lucide="SearchIcon"
                tabler="IconSearch"
                hugeicons="Search01Icon"
                phosphor="MagnifyingGlassIcon"
                remixicon="RiSearchLine"
              />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search holdings or tickers..." />
          </InputGroup>
          <ToggleGroup
            type="single"
            defaultValue="etfs"
            variant="outline"
            spacing={1}
          >
            <ToggleGroupItem value="stocks">Stocks</ToggleGroupItem>
            <ToggleGroupItem value="etfs">ETFs</ToggleGroupItem>
            <ToggleGroupItem value="reits">REITs</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {HOLDINGS.map((holding) => (
            <Item key={holding.ticker} variant="muted">
              <ItemMedia>
                <div className="flex size-12 items-center justify-center rounded-lg border text-sm font-semibold">
                  {holding.ticker}
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{holding.name}</ItemTitle>
                <ItemDescription className="text-xs tracking-wider uppercase">
                  {holding.shares} Shares · {holding.added}
                </ItemDescription>
              </ItemContent>
              <div className="flex shrink-0 items-center gap-6">
                <Badge variant="outline">{holding.type}</Badge>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs tracking-wider text-muted-foreground uppercase">
                    Value
                  </span>
                  <span className="font-medium tabular-nums">
                    {holding.value}
                  </span>
                </div>
              </div>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
