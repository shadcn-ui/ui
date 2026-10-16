/**
 * Playground building blocks for the Myntra Ads Portal screens.
 *
 * Rules for this folder
 * - Compose from the library (`registry/new-york-v4/ui/*`) wherever a component
 *   exists (Button, Badge, Table, Separator...).
 * - Colours come from semantic tokens (`bg-primary`, `text-muted-foreground`...).
 *   Where the Figma screen uses a colour that has no semantic token yet
 *   (Noir/50 captions, Jade success, Atlantic info) we reference the *primitive*
 *   variable from `app/tokens/primitives.css` — never a hex value. Those spots
 *   are the candidates for new semantic tokens (e.g. --success, --info).
 */
import * as React from "react"
import {
  ArrowLeftIcon,
  ChevronUpIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleUserRoundIcon,
  CoinsIcon,
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  MegaphoneIcon,
  MessageSquareTextIcon,
  PlusIcon,
  UserRoundCogIcon,
} from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"

/* ----------------------------------------------------------------------------
 * Typography presets (Figma text styles → Tailwind)
 * ------------------------------------------------------------------------- */
export const type = {
  h1: "text-[22px] leading-[30px] font-bold",
  h3: "text-base leading-[22px] font-bold",
  labelLgMedium: "text-sm leading-5 font-medium",
  labelLgRegular: "text-sm leading-5 font-normal",
  labelMdMedium: "text-xs leading-4 font-medium",
  labelMdSemibold: "text-xs leading-4 font-semibold",
  labelMdRegular: "text-xs leading-4 font-normal",
  labelSmRegular: "text-[10px] leading-[14px] font-normal",
} as const

/** Secondary caption colour (Noir/50) — primitive, no semantic token yet. */
export const captionColor = "text-[color:var(--noir-50)]"

/* ----------------------------------------------------------------------------
 * Side navigation
 * ------------------------------------------------------------------------- */
type NavItemProps = {
  icon: React.ReactNode
  label: string
  active?: boolean
  count?: string
}

function NavItem({ icon, label, active, count }: NavItemProps) {
  return (
    <a
      href="#"
      data-active={active || undefined}
      className={`flex min-h-9 items-center gap-2 px-4 py-2 text-sm leading-5 ${
        active ? "font-medium text-primary" : "font-normal text-foreground"
      } [&_svg]:size-[18px] [&_svg]:shrink-0`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {count && (
        <Badge variant="secondary" className="px-1.5 text-[10px] leading-[14px]">
          {count}
        </Badge>
      )}
    </a>
  )
}

function NavSection({ title }: { title: string }) {
  return (
    <p
      className={`px-4 pt-3 pb-1 uppercase ${type.labelSmRegular} ${captionColor}`}
    >
      {title}
    </p>
  )
}

/** Placeholder brand mark — swap for the real logo asset. */
function LogoMark() {
  return (
    <span
      aria-hidden
      className="flex h-[22px] w-8 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground"
    >
      M
    </span>
  )
}

export function SideNav() {
  return (
    <aside
      data-slot="side-nav"
      className="flex h-full w-[211px] shrink-0 flex-col bg-linear-to-b from-background to-secondary"
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <LogoMark />
        <span
          className={`${type.labelMdSemibold} uppercase leading-[11px] text-foreground`}
        >
          Advertisement
          <br />
          Portal
        </span>
      </div>

      <div
        className={`flex items-center gap-1 px-0 ${type.labelMdMedium} text-[color:var(--atlantic-100-base)]`}
      >
        <GlobeIcon className="size-[18px]" />
        Indian Standard Time (GMT +05:30)
      </div>

      <div className="m-0 mt-2 flex items-center rounded-md bg-background">
        <span className="flex h-[52px] w-[26px] items-center justify-center rounded-l-md bg-[color:var(--jade-10)] text-[color:var(--jade-140)]">
          <span className="rotate-180 text-[8px] leading-none font-bold whitespace-nowrap [writing-mode:vertical-rl]">
            AD ACC.
          </span>
        </span>
        <span
          className={`flex-1 truncate px-2 ${type.labelMdMedium} text-foreground`}
        >
          maninder.singh@myntra.com
        </span>
        <ChevronUpIcon className="mr-2 size-4 text-foreground" />
      </div>

      <nav className="mt-4 flex flex-col">
        <NavItem icon={<HomeIcon />} label="Home" />
        <NavItem icon={<MegaphoneIcon />} label="Manage Campaign" active />
        <div className="px-3 py-1">
          <Button size="sm" className="h-7 text-xs">
            <PlusIcon /> Create New Campaign
          </Button>
        </div>

        <NavSection title="Reports" />
        <NavItem icon={<FileTextIcon />} label="Product Listing Ads (PLA)" />
        <NavItem icon={<FileTextIcon />} label="Product Contextual Ads (PCA)" />
        <NavItem icon={<FileTextIcon />} label="Additional Reports" />

        <NavSection title="Budget Source" />
        <NavItem
          icon={<MessageSquareTextIcon />}
          label="Release Orders"
          count="15"
        />
        <NavItem icon={<CoinsIcon />} label="Free Credit" count="02" />

        <NavSection title="Account Control" />
        <NavItem icon={<UserRoundCogIcon />} label="Manage Users" />
        <NavItem icon={<CircleUserRoundIcon />} label="Account Details" />
      </nav>

      <div className="mt-auto p-3">
        <div className="overflow-hidden rounded-md bg-background">
          <div className="flex items-center justify-between px-3 pt-2">
            <span className={`${type.labelLgMedium} text-foreground`}>
              Maninder Singh
            </span>
            <ChevronUpIcon className="size-4" />
          </div>
          <p
            className={`px-3 pb-2 ${type.labelSmRegular} ${captionColor}`}
          >
            maninder.singh@myntra.com
          </p>
          <p
            className={`bg-primary px-3 py-1 ${type.labelMdMedium} text-primary-foreground`}
          >
            Network Admin
          </p>
        </div>
      </div>
    </aside>
  )
}

/* ----------------------------------------------------------------------------
 * App shell: side nav + white content panel
 * ------------------------------------------------------------------------- */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[713px] min-w-[1268px] bg-muted pt-[5px] pr-[6px] pb-1 pl-0">
      <SideNav />
      <main className="flex min-w-0 flex-1 flex-col rounded-xl bg-background p-4">
        {children}
      </main>
    </div>
  )
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 pl-1">
      <ArrowLeftIcon className="size-5 text-foreground" />
      <h1 className={`${type.h1} text-foreground`}>{children}</h1>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Stepper
 * ------------------------------------------------------------------------- */
export type Step = { label: string; status: "done" | "active" | "todo" }

function StepPill({ step }: { step: Step }) {
  return (
    <span
      className={`inline-flex h-7 items-center gap-2 rounded-sm bg-secondary px-2 ${type.labelLgMedium} text-foreground`}
    >
      {step.status === "done" && (
        <CircleCheckIcon className="size-5 fill-[var(--jade-140)] text-background" />
      )}
      {step.status === "active" && (
        <CircleDotIcon className="size-5 text-primary" />
      )}
      {step.label}
    </span>
  )
}

export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex w-full max-w-[880px] items-center">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <li aria-current={step.status === "active" ? "step" : undefined}>
            <StepPill step={step} />
          </li>
          {i < steps.length - 1 && (
            <span aria-hidden className="mx-0 h-px flex-1 bg-[color:var(--indigo-80)]" />
          )}
        </React.Fragment>
      ))}
    </ol>
  )
}
