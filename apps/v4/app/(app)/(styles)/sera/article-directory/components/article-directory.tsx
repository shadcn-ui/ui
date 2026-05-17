"use client"

import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/styles/base-sera/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-sera/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/base-sera/ui/input-group"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/styles/base-sera/ui/pagination"
import { Progress, ProgressValue } from "@/styles/base-sera/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/styles/base-sera/ui/table"

const ARTICLE_ROWS = [
  {
    title: "The Future of Sustainable Architecture",
    wordProgress: "1.4k / 2.6k words",
    author: "Elena Rostova",
    issue: "Summer 2024",
    status: "in-revision",
    statusLabel: "In revision",
    progress: 45,
  },
  {
    title: "Brutalism's Second Act",
    wordProgress: "2.1k / 2.5k words",
    author: "Marcus Chen",
    issue: "Summer 2024",
    status: "final-edit",
    statusLabel: "Final edit",
    progress: 90,
  },
  {
    title: "The Typography of Public Spaces",
    wordProgress: "0.5k / 1.5k words",
    author: "Sarah Jenkins",
    issue: "Autumn 2024",
    status: "drafting",
    statusLabel: "Drafting",
    progress: 20,
  },
  {
    title: "Rethinking Urban Canopies",
    wordProgress: "1.8k / 1.8k words",
    author: "David O'Connor",
    issue: "Summer 2024",
    status: "published",
    statusLabel: "Published",
    progress: 100,
  },
  {
    title: "Light, Glass, and the Modern Museum",
    wordProgress: "1.2k / 2.0k words",
    author: "Amara Osei",
    issue: "Autumn 2024",
    status: "in-revision",
    statusLabel: "In revision",
    progress: 55,
  },
  {
    title: "Concrete Utopias: Housing in the 21st Century",
    wordProgress: "3.0k / 3.0k words",
    author: "Tomás Herrera",
    issue: "Summer 2024",
    status: "published",
    statusLabel: "Published",
    progress: 100,
  },
  {
    title: "Designing for Silence",
    wordProgress: "0.8k / 2.2k words",
    author: "Ingrid Solberg",
    issue: "Winter 2024",
    status: "drafting",
    statusLabel: "Drafting",
    progress: 30,
  },
  {
    title: "The Invisible Infrastructure of Cities",
    wordProgress: "2.4k / 2.8k words",
    author: "James Whitfield",
    issue: "Autumn 2024",
    status: "final-edit",
    statusLabel: "Final edit",
    progress: 85,
  },
] as const

const STATUS_BADGE_VARIANT = {
  "in-revision": "outline",
  "final-edit": "default",
  drafting: "ghost",
  published: "secondary",
} as const

const STATUS_DOT_CLASSNAME = {
  "in-revision": "bg-amber-600/80",
  "final-edit": "bg-foreground/90",
  drafting: "bg-muted-foreground/60",
  published: "bg-emerald-600/80",
}

export function ArticleDirectory() {
  return (
    <Card>
      <CardHeader>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput type="search" placeholder="Search articles..." />
        </InputGroup>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead className="w-[170px]">Author</TableHead>
              <TableHead className="w-[150px]">Issue</TableHead>
              <TableHead className="w-[180px]">Status</TableHead>
              <TableHead className="w-[140px]">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ARTICLE_ROWS.map((row) => (
              <TableRow key={row.title}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <p className="font-heading text-xl tracking-tight text-foreground">
                      {row.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {row.wordProgress}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>{row.issue}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[row.status]}>
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        STATUS_DOT_CLASSNAME[row.status]
                      )}
                    />
                    {row.statusLabel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Progress
                    value={row.progress}
                    aria-label={`${row.progress}% complete`}
                    className="flex flex-row-reverse items-center **:data-[slot=progress-track]:w-16"
                  >
                    <ProgressValue>
                      {(formattedValue) => `${formattedValue}`}
                    </ProgressValue>
                  </Progress>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="#"
                size="icon-sm"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="cn-rtl-flip" />
              </PaginationLink>
            </PaginationItem>
            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href="#" size="icon-sm" isActive={page === 1}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink href="#" size="icon-sm" aria-label="Next page">
                <ChevronRightIcon className="cn-rtl-flip" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}
