/**
 * Inspect mode (dev tooling — not part of the component library).
 *
 * On any story whose id starts with `playground-` a floating "Inspect" switch
 * appears. When it is ON:
 *   - hovering an element highlights it and shows a tooltip:
 *       * the library component it is (read from the `data-slot` attribute that
 *         every library component renders, e.g. `table-cell` -> TableCell),
 *       * the design tokens it uses (semantic utilities like `bg-primary` and
 *         primitive variables like `var(--noir-50)` found in its classes),
 *       * or "No component" if the element is not a library component;
 *   - clicking a component opens its Storybook page (the click is swallowed,
 *     so the page itself doesn't react);
 *   - on that page a "Back to <screen>" pill returns to the exact playground
 *     page and scroll position you came from.
 *
 * State lives in localStorage (toggle) and sessionStorage (return target).
 */
import * as React from "react"
import type { Decorator } from "@storybook/nextjs-vite"
import { SELECT_STORY } from "storybook/internal/core-events"
import { addons } from "storybook/preview-api"

import { Label } from "@/registry/new-york-v4/ui/label"
import { Switch } from "@/registry/new-york-v4/ui/switch"

const ON_KEY = "inspect:on"
const RETURN_KEY = "inspect:return"
const UI = "data-inspect-ui"

type ReturnTarget = { storyId: string; title: string; scrollY: number }

function read<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}
function write(storage: Storage, key: string, value: unknown) {
  try {
    if (value === null) storage.removeItem(key)
    else storage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode): feature degrades silently */
  }
}

/* ------------------------------------------------------------------ index */
// slot family ("table", "sidebar", "toggle-group"...) -> story id
let componentIndex: Promise<Record<string, string>> | null = null
function loadComponentIndex() {
  componentIndex ??= fetch("/index.json")
    .then((r) => r.json())
    .then((data) => {
      const map: Record<string, string> = {}
      for (const entry of Object.values<{
        id: string
        title: string
        type: string
      }>(data.entries)) {
        if (entry.type !== "story") continue
        if (!entry.title.startsWith("Shadcn/Components/")) continue
        const key = entry.title
          .split("/")
          .pop()!
          .toLowerCase()
          .replace(/\s+/g, "-")
        map[key] ??= entry.id
      }
      return map
    })
    .catch(() => ({}))
  return componentIndex
}

/** `table-cell` -> { family: "table", storyId } (longest matching prefix wins) */
function resolveFamily(slot: string, index: Record<string, string>) {
  const parts = slot.split("-")
  for (let n = parts.length; n > 0; n--) {
    const family = parts.slice(0, n).join("-")
    if (index[family]) return { family, storyId: index[family] }
  }
  return { family: slot, storyId: undefined as string | undefined }
}

const pascal = (slot: string) =>
  slot
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")

/* ----------------------------------------------------------------- tokens */
const SEMANTIC = [
  "background", "foreground", "card", "card-foreground", "popover",
  "popover-foreground", "primary", "primary-foreground", "primary-hover",
  "secondary", "secondary-foreground", "secondary-hover", "muted",
  "muted-foreground", "accent", "accent-foreground", "destructive",
  "destructive-foreground", "border", "input", "ring", "focus",
  "focus-destructive", "sidebar", "sidebar-foreground", "sidebar-primary",
  "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground",
  "sidebar-border", "sidebar-ring", "chart-1", "chart-2", "chart-3",
  "chart-4", "chart-5",
]
const UTIL =
  "(?:bg|text|border(?:-[trblxy])?|ring|fill|stroke|from|to|via|outline|divide|decoration|caret|accent|shadow)"
const SEMANTIC_RE = new RegExp(
  `^${UTIL}-(${SEMANTIC.sort((a, b) => b.length - a.length).join("|")})(?:/\\d+)?!?$`
)

/** `dark:hover:data-[state=on]:bg-accent` -> `bg-accent` (bracket-aware) */
function stripVariants(cls: string) {
  let depth = 0
  let cut = -1
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i]
    if (ch === "[" || ch === "(") depth++
    else if (ch === "]" || ch === ")") depth--
    else if (ch === ":" && depth === 0) cut = i
  }
  return cut === -1 ? cls : cls.slice(cut + 1)
}

type Token = { name: string; variant: string | null }

/** `dark:hover:bg-accent` -> { name: "--accent", variant: "dark:hover" } */
function tokensOf(el: Element): Token[] {
  const classes = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean)
  const found = new Map<string, Token>()
  const add = (name: string, variant: string | null) => {
    const prev = found.get(name)
    // an always-on use wins over a state-only use of the same token
    if (!prev || (prev.variant && !variant)) found.set(name, { name, variant })
  }
  for (const c of classes) {
    const bare = stripVariants(c)
    const variant = bare === c ? null : c.slice(0, c.length - bare.length - 1)
    for (const m of c.matchAll(/var\((--[a-z0-9-]+)\)/g)) add(m[1], variant)
    const m = SEMANTIC_RE.exec(bare)
    if (m) add(`--${m[1]}`, variant)
  }
  // always-on tokens first, then state-only ones
  return [...found.values()].sort(
    (a, b) => Number(a.variant !== null) - Number(b.variant !== null)
  )
}

/* ------------------------------------------------------------ hover model */
type Hit =
  | {
      kind: "component"
      name: string
      slot: string
      family: string
      storyId?: string
      tokens: Token[]
    }
  | { kind: "icon" }
  | { kind: "none"; inside?: string }

function hitFor(target: Element, index: Record<string, string>): Hit {
  const slot = target.getAttribute("data-slot")
  if (slot) {
    const { family, storyId } = resolveFamily(slot, index)
    return {
      kind: "component",
      name: pascal(slot),
      slot,
      family,
      storyId,
      tokens: tokensOf(target),
    }
  }
  if (target.closest("svg.lucide, svg[class*='lucide']")) return { kind: "icon" }
  const parent = target.closest("[data-slot]")?.getAttribute("data-slot")
  return { kind: "none", inside: parent ? pascal(parent) : undefined }
}

/* ----------------------------------------------------------------- shell */
const chip: React.CSSProperties = {
  display: "inline-block",
  padding: "1px 6px",
  borderRadius: 4,
  background: "color-mix(in srgb, var(--background) 18%, transparent)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 10,
  lineHeight: "14px",
}

function InspectShell({
  storyId,
  title,
  children,
}: {
  storyId: string
  title: string
  children: React.ReactNode
}) {
  const isPlayground = storyId.startsWith("playground-")
  const [on, setOn] = React.useState(false)
  const [back, setBack] = React.useState<ReturnTarget | null>(null)
  const [hover, setHover] = React.useState<{
    rect: DOMRect
    hit: Hit
    x: number
    y: number
  } | null>(null)
  const indexRef = React.useRef<Record<string, string>>({})

  // restore toggle + return target; restore scroll when arriving back
  React.useEffect(() => {
    setOn(read<boolean>(localStorage, ON_KEY) === true)
    const ret = read<ReturnTarget>(sessionStorage, RETURN_KEY)
    if (ret && ret.storyId === storyId) {
      window.scrollTo(0, ret.scrollY)
      write(sessionStorage, RETURN_KEY, null)
      setBack(null)
    } else {
      setBack(ret)
    }
    loadComponentIndex().then((i) => (indexRef.current = i))
  }, [storyId])

  const inspecting = isPlayground && on

  React.useEffect(() => {
    if (!inspecting) {
      setHover(null)
      return
    }
    const onMove = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (!t || t.closest(`[${UI}]`)) return setHover(null)
      setHover({
        rect: t.getBoundingClientRect(),
        hit: hitFor(t, indexRef.current),
        x: e.clientX,
        y: e.clientY,
      })
    }
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (!t || t.closest(`[${UI}]`)) return
      e.preventDefault()
      e.stopPropagation()
      const hit = hitFor(t, indexRef.current)
      if (hit.kind !== "component" || !hit.storyId) return
      write(sessionStorage, RETURN_KEY, {
        storyId,
        title,
        scrollY: window.scrollY,
      } satisfies ReturnTarget)
      addons.getChannel().emit(SELECT_STORY, { storyId: hit.storyId })
    }
    const onLeave = () => setHover(null)
    document.addEventListener("mousemove", onMove, true)
    document.addEventListener("click", onClick, true)
    document.addEventListener("mouseleave", onLeave)
    return () => {
      document.removeEventListener("mousemove", onMove, true)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [inspecting, storyId, title])

  const goBack = () => {
    if (!back) return
    addons.getChannel().emit(SELECT_STORY, { storyId: back.storyId })
  }

  return (
    <>
      {children}

      {/* Back pill — on every non-playground story reached via inspect */}
      {back && back.storyId !== storyId && (
        <button
          type="button"
          {...{ [UI]: "" }}
          onClick={goBack}
          style={{
            position: "fixed",
            left: 16,
            bottom: 16,
            zIndex: 2147483000,
            padding: "8px 14px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            font: "500 13px/20px var(--font-sans, system-ui)",
            boxShadow: "0 8px 24px color-mix(in srgb, black 20%, transparent)",
            cursor: "pointer",
          }}
        >
          ← Back to {back.title.split("/").slice(1).join(" / ")}
        </button>
      )}

      {/* Toggle — playground stories only */}
      {isPlayground && (
        <div
          {...{ [UI]: "" }}
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 2147483000,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "var(--background)",
            boxShadow: "0 8px 24px color-mix(in srgb, black 12%, transparent)",
          }}
        >
          <Switch
            id="inspect-mode"
            checked={on}
            onCheckedChange={(v) => {
              setOn(v)
              write(localStorage, ON_KEY, v)
            }}
          />
          <Label htmlFor="inspect-mode" className="text-xs">
            Inspect
          </Label>
        </div>
      )}

      {/* Highlight + tooltip */}
      {inspecting && hover && (
        <div
          {...{ [UI]: "" }}
          style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2147482999 }}
        >
          <div
            style={{
              position: "fixed",
              left: hover.rect.left,
              top: hover.rect.top,
              width: hover.rect.width,
              height: hover.rect.height,
              outline: `2px solid ${
                hover.hit.kind === "component"
                  ? "var(--indigo-80)"
                  : "var(--noir-40)"
              }`,
              outlineOffset: -1,
              background:
                hover.hit.kind === "component"
                  ? "color-mix(in srgb, var(--indigo-80) 12%, transparent)"
                  : "transparent",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "fixed",
              left: Math.min(hover.x + 14, window.innerWidth - 300),
              top: Math.min(hover.y + 16, window.innerHeight - 140),
              width: 280,
              padding: 10,
              borderRadius: 8,
              background: "var(--noir-90)",
              color: "var(--background)",
              font: "400 12px/16px var(--font-sans, system-ui)",
              boxShadow: "0 8px 24px color-mix(in srgb, black 30%, transparent)",
            }}
          >
            {hover.hit.kind === "component" ? (
              <>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {hover.hit.name}
                </div>
                <div style={{ opacity: 0.7, marginBottom: 6 }}>
                  shadcn · data-slot="{hover.hit.slot}"
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {hover.hit.tokens.length ? (
                    hover.hit.tokens.slice(0, 12).map((t) => (
                      <span
                        key={t.name}
                        title={t.variant ? `only when: ${t.variant}` : "always"}
                        style={{ ...chip, opacity: t.variant ? 0.55 : 1 }}
                      >
                        {t.name}
                        {t.variant ? ` · ${t.variant.split(":").pop()}` : ""}
                      </span>
                    ))
                  ) : (
                    <span style={{ opacity: 0.7 }}>No tokens on this element</span>
                  )}
                </div>
                <div style={{ marginTop: 8, opacity: 0.85 }}>
                  {hover.hit.storyId
                    ? `Click to open ${hover.hit.family} in Storybook →`
                    : "No Storybook page found for this component"}
                </div>
              </>
            ) : hover.hit.kind === "icon" ? (
              <>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Icon</div>
                <div style={{ opacity: 0.7 }}>
                  lucide-react — not a shadcn component
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 13 }}>No component</div>
                {hover.hit.inside && (
                  <div style={{ opacity: 0.7 }}>
                    inside {hover.hit.inside}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export const withInspect: Decorator = (Story, context) => (
  <InspectShell storyId={context.id} title={context.title}>
    <Story />
  </InspectShell>
)
