import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  CircleDotIcon,
  FilePenLineIcon,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import { Button } from "@/registry/new-york-v4/ui/button"

import { Separator } from "@/registry/new-york-v4/ui/separator"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"

import {
  AdsPortalLayout,
  text,
} from "./AdsPortalLayout"

/**
 * Playground — "Myntra Ads Portal › Ad Account view › Manage Campaign"
 * (Figma node 18344:205730), built ONLY from library components:
 * Sidebar, DropdownMenu, Badge, Breadcrumb, Separator, Button and Table.
 *
 * There is no custom component file. shadcn has no stepper, so the timeline
 * uses Breadcrumb (steps) + Separator (connector line) — the closest native fit.
 *
 * Colours are semantic tokens. Three Figma colours have no semantic token yet,
 * so they reference primitives from app/tokens/primitives.css (never hex):
 * Noir/50 captions, Jade success, Atlantic info.
 */

const steps = [
  { label: "Campaign Details", status: "done" },
  { label: "Product Selection & Budget", status: "done" },
  { label: "Ad Groups", status: "active" },
] as const

const adGroups = [
  { products: 43, cpc: "₹12" },
  { products: 23, cpc: "₹2" },
  { products: 53, cpc: "₹5" },
  { products: 43, cpc: "₹1" },
  { products: 32, cpc: "₹12" },
  { products: 23, cpc: "₹5" },
].map((row) => ({
  name: "Ad Group Name 01",
  id: "MYDGYP0VIJCNWQ",
  start: { date: "31 Jan 25", time: "16:00" },
  end: { date: "31 Jan 25", time: "23:59" },
  budget: "₹20000",
  ...row,
}))

type Range = (typeof adGroups)[number]["start"]

function DateTime({ value }: { value: Range }) {
  return (
    <span className="flex flex-col">
      <span>{value.date}</span>
      <span className="text-xs text-muted-foreground">{value.time}</span>
    </span>
  )
}

function ManageCampaignAdGroups() {
  return (
    <AdsPortalLayout>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" aria-label="Back">
            <ArrowLeftIcon />
          </Button>
          <h1 className={`${text.h1} text-foreground`}>
            Edit &lt;Campaign Name&gt;
          </h1>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-4">
          {/* Timeline: shadcn has no stepper; Breadcrumb is the native fit
              (ordered list, links for done steps, aria-current for the
              active one, and a separator slot that takes a Separator line). */}
          <Breadcrumb aria-label="Campaign steps" className="w-full max-w-[880px]">
            <BreadcrumbList className="flex-nowrap gap-0 text-sm sm:gap-0">
              {steps.map((step, i) => (
                <React.Fragment key={step.label}>
                  <BreadcrumbItem>
                    {step.status === "active" ? (
                      <BreadcrumbPage className="inline-flex h-7 items-center gap-2 rounded-sm bg-secondary px-2 font-medium [&>svg]:size-5">
                        <CircleDotIcon className="text-primary" />
                        {step.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href="#"
                        className="inline-flex h-7 items-center gap-2 rounded-sm bg-secondary px-2 font-medium text-foreground [&>svg]:size-5"
                      >
                        <CircleCheckIcon className="fill-[var(--jade-140)] text-background" />
                        {step.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {i < steps.length - 1 && (
                    <BreadcrumbSeparator className="flex flex-1 items-center">
                      <Separator className="bg-[color:var(--indigo-80)]" />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <section className="flex flex-col gap-2">
            <h2 className={`${text.h3} text-foreground`}>Ad Groups</h2>

            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    ["Ad Group Name & ID", false],
                    ["Ad Duration", true],
                    ["Selected Products", false],
                    ["Ad Group Budget", true],
                    ["Avg CPC", true],
                  ].map(([label, sortable]) => (
                    <TableHead key={label as string}>
                      <span className="flex items-center justify-between">
                        {label}
                        {sortable && (
                          <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
                        )}
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adGroups.map((row, i) => (
                  <TableRow key={i} className="group">
                    <TableCell>
                      <Button
                        asChild
                        variant="link"
                        className="h-auto justify-start p-0"
                      >
                        <a href="#">{row.name}</a>
                      </Button>
                      <span className="block text-xs text-muted-foreground">
                        {row.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-6">
                        <DateTime value={row.start} />
                        <span className="text-muted-foreground">-</span>
                        <DateTime value={row.end} />
                      </span>
                    </TableCell>
                    <TableCell>{row.products}</TableCell>
                    <TableCell>{row.budget}</TableCell>
                    <TableCell>{row.cpc}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Edit ad group"
                        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <FilePenLineIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="link" size="sm" className="h-7 px-0 text-xs">
            <ChevronLeftIcon className="size-3" /> Back
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="link" size="sm" className="h-7 px-0 text-xs">
              Discard Changes
            </Button>
            <Button size="sm" className="h-7 text-xs">
              <CircleCheckIcon /> Confirm
            </Button>
          </div>
        </div>
    </AdsPortalLayout>
  )
}

const meta = {
  title: "Playground/Ads Portal/Manage Campaign — Ad Groups",
  component: ManageCampaignAdGroups,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ManageCampaignAdGroups>

export default meta
type Story = StoryObj<typeof meta>

export const Screen: Story = {}
