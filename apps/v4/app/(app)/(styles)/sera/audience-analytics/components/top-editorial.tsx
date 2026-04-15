"use client"

import * as React from "react"
import { ArrowDownIcon, MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/styles/base-sera/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/styles/base-sera/ui/dropdown-menu"
import { Spinner } from "@/styles/base-sera/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/styles/base-sera/ui/table"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/base-sera/ui/toggle-group"

type EditorialMetric = "views" | "time" | "shares"

type EditorialRow = {
  rank: number
  title: string
  author: string
  published: string
  pageviews: string
  avgTime: string
}

const METRIC_LABEL: Record<EditorialMetric, string> = {
  views: "VIEWS",
  time: "TIME",
  shares: "SHARES",
}

const EDITORIAL_ROWS: EditorialRow[] = [
  {
    rank: 1,
    title: "The New Vanguard of Minimalist Architecture",
    author: "Elena Rostova",
    published: "Oct 12",
    pageviews: "45.2k",
    avgTime: "04:15",
  },
  {
    rank: 2,
    title: "Autumn Sartorial Code: Deconstructed Classics",
    author: "Julian Vance",
    published: "Oct 05",
    pageviews: "38.9k",
    avgTime: "03:42",
  },
  {
    rank: 3,
    title: "Interview: Director Sofia Coppola on The Aesthetics of Isolation",
    author: "Marcus Trent",
    published: "Sep 28",
    pageviews: "31.4k",
    avgTime: "06:20",
  },
  {
    rank: 4,
    title: "Sourcing Ceramics from Kyoto's Oldest Kilns",
    author: "Sarah Lin",
    published: "Oct 18",
    pageviews: "22.1k",
    avgTime: "02:55",
  },
  {
    rank: 5,
    title: "Field Notes from Copenhagen Design Week",
    author: "Noah Bennett",
    published: "Oct 21",
    pageviews: "19.7k",
    avgTime: "03:18",
  },
  {
    rank: 6,
    title: "A Studio Visit with Milan's Most Elusive Lighting Designer",
    author: "Claire Duval",
    published: "Oct 09",
    pageviews: "17.4k",
    avgTime: "04:02",
  },
  {
    rank: 7,
    title: "Collecting the New Avant-Garde in Contemporary Furniture",
    author: "Tommy Rhodes",
    published: "Sep 30",
    pageviews: "15.9k",
    avgTime: "03:36",
  },
  {
    rank: 8,
    title: "Inside Lisbon's Quiet Culinary Renaissance",
    author: "Amara Iqbal",
    published: "Oct 14",
    pageviews: "14.2k",
    avgTime: "05:08",
  },
  {
    rank: 9,
    title: "Why Slow Interiors Are Defining the Next Luxury Wave",
    author: "Henry Vale",
    published: "Oct 03",
    pageviews: "12.7k",
    avgTime: "03:11",
  },
  {
    rank: 10,
    title: "The Return of Print: Independent Magazine Covers to Watch",
    author: "Mina Okafor",
    published: "Sep 26",
    pageviews: "11.3k",
    avgTime: "02:49",
  },
]

type TopEditorialProps = React.ComponentProps<typeof Card> & {
  selectedMetric?: EditorialMetric
}

export function TopEditorial({
  selectedMetric = "views",
  ...props
}: TopEditorialProps) {
  const [visibleCount, setVisibleCount] = React.useState(5)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const hasMoreRows = visibleCount < EDITORIAL_ROWS.length
  const visibleRows = EDITORIAL_ROWS.slice(0, visibleCount)

  const handleLoadMore = React.useCallback(() => {
    if (!hasMoreRows || isLoadingMore) {
      return
    }

    setIsLoadingMore(true)

    window.setTimeout(() => {
      setVisibleCount(EDITORIAL_ROWS.length)
      setIsLoadingMore(false)
    }, 2000)
  }, [hasMoreRows, isLoadingMore])

  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex flex-col gap-(--gap) sm:flex-row">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl">Top Editorials</CardTitle>
            <CardDescription>Ranked by engagement</CardDescription>
          </div>
          <ToggleGroup
            aria-label="Top editorials metric selector"
            value={[selectedMetric]}
            variant="outline"
            className="w-full sm:ml-auto sm:w-fit"
          >
            {(["views", "time", "shares"] as const).map((metric) => {
              return (
                <ToggleGroupItem key={metric} value={metric} className="flex-1">
                  {METRIC_LABEL[metric]}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="flex-1 **:data-[slot=table-container]:no-scrollbar **:data-[slot=table-container]:overflow-y-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Page Views</TableHead>
              <TableHead>Read Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.rank}>
                <TableCell className="translate-y-1 align-text-top">
                  {row.rank}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <p className="font-heading text-xl tracking-tight text-foreground">
                      {row.title}
                    </p>
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      By {row.author}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{row.published}</TableCell>
                <TableCell>{row.pageviews}</TableCell>
                <TableCell>{row.avgTime}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-xs" />}
                      aria-label={`Open actions for ${row.title}`}
                    >
                      <MoreHorizontalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Publish</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center">
        {hasMoreRows ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            Load more content{" "}
            {isLoadingMore ? (
              <Spinner data-icon="inline-end" />
            ) : (
              <ArrowDownIcon data-icon="inline-end" />
            )}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
