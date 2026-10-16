import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  ChevronsUpDownIcon,
  CircleCheckIcon,
  CirclePauseIcon,
  CirclePlayIcon,
  CircleStopIcon,
  CopyIcon,
  FilePenLineIcon,
  SearchIcon,
} from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york-v4/ui/alert"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/registry/new-york-v4/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"

import { AdsPortalLayout, text } from "./AdsPortalLayout"

/**
 * Playground — "Myntra Ads Portal › Ad Account view › Manage Campaign"
 * campaign list (Figma node 12935:611272).
 *
 * Library components only: Alert (notification banner), InputGroup (search), Button, Badge,
 * Table, Select + Pagination + Input (footer). The sidebar comes from the
 * shared AdsPortalLayout (also library-only).
 *
 * Colours: semantic tokens, or primitives from app/tokens/primitives.css where
 * no semantic token exists yet (status tones below). No hex values.
 */

// Status / allocation tones (Figma uses the Noir / Amber / Atlantic / Cherry /
// Jade families). Candidates for semantic tokens: --warning, --info, --success.
const tone = {
  neutral:
    "bg-[color:var(--noir-10)] text-[color:var(--noir-70)] border-transparent",
  warning:
    "bg-[color:var(--amber-10)] text-[color:var(--amber-140)] border-transparent",
  info: "bg-[color:var(--atlantic-10)] text-[color:var(--atlantic-140)] border-transparent",
  error:
    "bg-[color:var(--cherry-10)] text-[color:var(--cherry-140)] border-transparent",
  success:
    "bg-[color:var(--jade-10)] text-[color:var(--jade-140)] border-transparent",
} as const

type Tone = keyof typeof tone
type Row = {
  type: "PLA+" | "PLA" | "SPA"
  status: string
  statusTone: Tone
  note?: string
  created: string
  start: [string, string]
  end: [string, string]
  allocation: "Automatic" | "Manual"
  budget: string
  spent: string
  balance: string
  /** copy, edit, pause/play, stop */
  actions: { copy: boolean; edit: boolean; run: "pause" | "play" | "off"; stop: boolean }
}

const on = { copy: true, edit: true }
const rows: Row[] = [
  { type: "PLA+", status: "Processing", statusTone: "neutral", created: "30 Dec 2024", start: ["30 Dec 24", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Automatic", budget: "₹12000", spent: "₹10000", balance: "₹2000", actions: { copy: false, edit: false, run: "off", stop: false } },
  { type: "SPA", status: "Draft", statusTone: "warning", created: "30 Dec 2024", start: ["25 Jan 25", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Manual", budget: "₹24000", spent: "₹12000", balance: "₹12000", actions: { ...on, run: "off", stop: false } },
  { type: "SPA", status: "Onhold", statusTone: "warning", note: "Attention required", created: "30 Dec 2024", start: ["25 Jan 25", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Manual", budget: "₹52000", spent: "₹12000", balance: "₹40000", actions: { copy: false, edit: false, run: "pause", stop: true } },
  { type: "PLA", status: "Paused", statusTone: "warning", created: "30 Dec 2024", start: ["25 Jan 25", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Automatic", budget: "₹12000", spent: "₹12000", balance: "₹12000", actions: { ...on, run: "play", stop: false } },
  { type: "SPA", status: "Scheduled", statusTone: "info", created: "30 Dec 2024", start: ["25 Jan 25", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Manual", budget: "₹12000", spent: "₹12000", balance: "₹12000", actions: { ...on, run: "off", stop: false } },
  { type: "PLA", status: "Aborted", statusTone: "error", created: "30 Dec 2024", start: ["25 Jan 25", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Automatic", budget: "₹12000", spent: "₹12000", balance: "₹12000", actions: { ...on, run: "play", stop: false } },
  { type: "SPA", status: "Budget Met", statusTone: "error", created: "30 Dec 2024", start: ["25 Jan 25", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Manual", budget: "₹12000", spent: "₹12000", balance: "₹12000", actions: { ...on, run: "pause", stop: true } },
  { type: "SPA", status: "Completed", statusTone: "neutral", created: "30 Dec 2024", start: ["25 Jan 25", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Automatic", budget: "₹12000", spent: "₹12000", balance: "₹12000", actions: { ...on, run: "pause", stop: true } },
  { type: "SPA", status: "Live", statusTone: "success", created: "30 Dec 2024", start: ["25 Jan 25", "05:00"], end: ["31 Jan 25", "23:59"], allocation: "Manual", budget: "₹12000", spent: "₹12000", balance: "₹12000", actions: { ...on, run: "pause", stop: true } },
]

const columns: [label: string, sortable: boolean][] = [
  ["Campaign Name", false],
  ["Status", true],
  ["Created On", true],
  ["Start", true],
  ["End", true],
  ["Allocation", false],
  ["Budget", true],
  ["Spent", true],
  ["Balance", true],
]

function DateTime({ value }: { value: [string, string] }) {
  return (
    <span className="flex flex-col">
      <span>{value[0]}</span>
      <span className="text-xs text-muted-foreground">{value[1]}</span>
    </span>
  )
}

const disabledTone =
  " disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
const actionTone = {
  idle: "bg-secondary text-primary hover:bg-secondary" + disabledTone,
  pause:
    "bg-[color:var(--amber-10)] text-[color:var(--amber-100-base)] hover:bg-[color:var(--amber-10)]" + disabledTone,
  stop: "bg-[color:var(--cherry-10)] text-[color:var(--cherry-100-base)] hover:bg-[color:var(--cherry-10)]" + disabledTone,
  play: "bg-[color:var(--jade-10)] text-[color:var(--jade-100-base)] hover:bg-[color:var(--jade-10)]",
}

function ManageCampaignList() {
  return (
    <AdsPortalLayout contentClassName="gap-4 overflow-hidden">

      {/* Notification banner: the library Alert as-is (icon + title +
          description). The wrapper only places it top-right like the Figma. */}
      <div className="absolute top-3 right-3 z-10 w-[388px]">
        <Alert>
          <CircleCheckIcon />
          <AlertTitle>Campaign Successfully Updated</AlertTitle>
          <AlertDescription>
            <p>
              “Campaign name” with 5 Adgroup and 200 Styles from 31 jan 25 to 27
              Feb 25 Updated successfully. and currently in processing state.
            </p>
            <p className="text-xs">3m ago</p>
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex items-start justify-between">
        <h1 className={`${text.h1} text-foreground`}>Manage Campaign</h1>
        <Button size="sm" className="h-7 text-xs">
          Create New Campaign
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <InputGroup className="w-[259px]">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput className="text-xs" placeholder="Search With Campaign Name & ID" />
        </InputGroup>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(([label, sortable]) => (
              <TableHead key={label}>
                <span className="flex items-center justify-between">
                  {label}
                  {sortable && (
                    <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
                  )}
                </span>
              </TableHead>
            ))}
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell>
                <Button
                  asChild
                  variant="link"
                  className="h-auto justify-start p-0 text-xs"
                >
                  <a href="#">Campaign Name</a>
                </Button>
                <span className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`rounded-sm px-2 text-xs font-medium ${
                      row.type === "PLA+" ? tone.info : tone.neutral
                    }`}
                  >
                    {row.type}
                  </Badge>
                  <span className="max-w-24 truncate text-xs text-muted-foreground">
                    MYDGYP0VIJCNWQ
                  </span>
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`rounded-sm px-2 text-xs font-medium ${tone[row.statusTone]}`}
                >
                  {row.status}
                </Badge>
                {row.note && (
                  <span className="mt-0.5 block text-[10px] leading-[14px] text-[color:var(--amber-140)]">
                    {row.note}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span className="flex flex-col">
                  <span>{row.created}</span>
                  <span className="text-xs text-muted-foreground">
                    by: abc@xyz.com
                  </span>
                </span>
              </TableCell>
              <TableCell>
                <DateTime value={row.start} />
              </TableCell>
              <TableCell>
                <DateTime value={row.end} />
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`rounded-sm px-2 text-xs font-medium ${
                    row.allocation === "Automatic" ? tone.info : tone.warning
                  }`}
                >
                  {row.allocation}
                </Badge>
              </TableCell>
              <TableCell>{row.budget}</TableCell>
              <TableCell>{row.spent}</TableCell>
              <TableCell>{row.balance}</TableCell>
              <TableCell>
                <span className="flex items-center justify-center gap-1.5">
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    aria-label="Duplicate"
                    disabled={!row.actions.copy}
                    className={actionTone.idle}
                  >
                    <CopyIcon />
                  </Button>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    aria-label="Edit"
                    disabled={!row.actions.edit}
                    className={actionTone.idle}
                  >
                    <FilePenLineIcon />
                  </Button>
                  {row.actions.run === "play" ? (
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Resume"
                      className={actionTone.play}
                    >
                      <CirclePlayIcon />
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        aria-label="Pause"
                        disabled={row.actions.run === "off"}
                        className={actionTone.pause}
                      >
                        <CirclePauseIcon />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        aria-label="Stop"
                        disabled={!row.actions.stop}
                        className={actionTone.stop}
                      >
                        <CircleStopIcon />
                      </Button>
                    </>
                  )}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer: page size, pagination, go-to-page */}
      <div className="mt-auto flex items-center justify-between">
        <Select defaultValue="10">
          <SelectTrigger size="sm" className="w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["10", "20", "50"].map((n) => (
              <SelectItem key={n} value={n}>
                {n}/Page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-6">
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              {["1", "2", "3", "4", "5"].map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink href="#" isActive={n === "1"} size="icon-sm">
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" size="icon-sm">
                  50
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="px-2 [&>span]:hidden" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="flex items-center gap-2 text-sm">
            Go To
            <Input
              defaultValue="30"
              aria-label="Go to page"
              className="h-8 w-14 text-center"
            />
            Page
          </div>
        </div>
      </div>
    </AdsPortalLayout>
  )
}

const meta = {
  title: "Playground/Ads Portal/Manage Campaign — List",
  component: ManageCampaignList,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ManageCampaignList>

export default meta
type Story = StoryObj<typeof meta>

export const Screen: Story = {}
