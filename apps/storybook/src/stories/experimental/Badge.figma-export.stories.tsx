/**
 * Experimental — Figma → Storybook export prototype.
 *
 * **This is NOT Code Connect.** This story is a Storybook-only preview
 * generated from the Figma component surface, intended for visual review
 * before any production component changes are made. It does not push
 * code to Figma Dev Mode (that's Lane 1, separately blocked).
 *
 * **Source Figma node** (Badge, file `f2gKVfCJNOS0MeLUk4CM8u`,
 *  node `29:66938`):
 *
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66938
 *
 * **Why this exists:** JES-82 prototypes the "Figma component → Storybook
 * preview → human review → optional production change" pipeline shape.
 * It is deliberately Storybook-only and does NOT modify the production
 * `<Badge />` API. If a Figma surface change *should* drive a React API
 * change, that's a separate, deliberate decision made *after* reviewing
 * this preview, not a mechanical generation step.
 *
 * **Design context fetch:** the Figma MCP tooling requires an active
 * desktop-app session, which wasn't available at story-generation time.
 * The Figma surface below is sourced from the existing Code Connect
 * mapping (`packages/lead-ui/src/components/Badge/Badge.figma.tsx`)
 * which itself was authored against the live design earlier in the
 * project. Reviewers should compare this Storybook preview against the
 * live Figma node URL above before considering any production change.
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@leadbank/ui"

const FIGMA_NODE_URL =
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66938"

/**
 * Figma component property surface (per the file `f2gKVfCJNOS0MeLUk4CM8u`
 * Badge component, captured into `Badge.figma.tsx`):
 *
 *   - Variant (VARIANT): Default, Secondary, Outline, Destructive, Verified
 *   - State   (VARIANT): Default, Hover, Focus
 *   - Badge Text (TEXT)
 */

const meta: Meta<typeof Badge> = {
  title: "Experimental/Figma Export/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Storybook-only Figma export prototype (JES-82). Renders the Figma " +
          "Badge component's variants alongside their Lead React equivalents. " +
          "**Not Code Connect. Not a production change.** Compare against " +
          `the source Figma node: ${FIGMA_NODE_URL}`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

/* ── Mapped variants — clean Figma → Lead correspondence ──────────── */

/**
 * The four Figma variants that map cleanly to Lead's `<Badge variant>`
 * prop. Mapping decisions sourced from the existing Code Connect
 * mapping (PR #19 / Badge.figma.tsx):
 *
 *   - Default     → variant="neutral"
 *   - Secondary   → variant="brand"
 *   - Destructive → variant="danger"
 *   - Verified    → variant="success"  (Verified conventionally uses
 *                                       green/check semantics)
 */
export const FigmaVariantsMapped: Story = {
  name: "Figma variants — mapped",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <FigmaRow figmaVariant="Default" leadVariant="neutral" />
      <FigmaRow figmaVariant="Secondary" leadVariant="brand" />
      <FigmaRow figmaVariant="Destructive" leadVariant="danger" />
      <FigmaRow figmaVariant="Verified" leadVariant="success" />
    </div>
  ),
}

/* ── Approximated variant — Outline has no clean Lead equivalent ──── */

/**
 * Figma's `Outline` variant has no direct Lead equivalent. Lead's
 * `<Badge>` does not currently expose an `outline` variant or
 * `appearance="outline"` prop. The preview below approximates the
 * outline visual via a Storybook-only inline style wrapper (transparent
 * fill + border-color matching the `neutral` token) — strictly a
 * preview, NOT a proposed production API.
 *
 * If reviewers decide the outline visual is worth supporting in
 * production, a separate API decision would add `variant="outline"`
 * to the `<Badge>` props (or a new `appearance` prop) — out of scope
 * for this prototype.
 */
export const FigmaVariantOutlineApproximated: Story = {
  name: "Figma variant — Outline (approximated)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        <strong>Approximation</strong> — Figma's <code>Outline</code> variant
        has no Lead React prop equivalent. Below is a Storybook-only inline
        wrapper to preview the visual. If you want production support, that's
        a separate API decision.
      </Annotation>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span
          // Storybook-only preview wrapper. NOT a production pattern.
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 10px",
            borderRadius: "var(--lead-radius-pill, 9999px)",
            border: "1px solid var(--lead-color-border-default, #d6d8e0)",
            background: "transparent",
            color: "var(--lead-color-text-default, #15161a)",
            font: "inherit",
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 500,
          }}
        >
          Outline (preview)
        </span>
        <code style={{ fontSize: 12, color: "var(--lead-color-text-muted, #5a5d68)" }}>
          ← Storybook-only wrapper, not &lt;Badge variant="outline" /&gt;
        </code>
      </div>
    </div>
  ),
}

/* ── Side-by-side gallery: every Figma variant in one frame ───────── */

export const FigmaGallery: Story = {
  name: "All Figma variants",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Annotation>
        Source Figma node: <a href={FIGMA_NODE_URL} target="_blank" rel="noreferrer">{FIGMA_NODE_URL}</a>
        <br />
        Figma component properties: <code>Variant</code>{" "}
        (Default | Secondary | Outline | Destructive | Verified),{" "}
        <code>State</code> (Default | Hover | Focus), <code>Badge Text</code> (text).
        State variants are not rendered here — Lead Badge is non-interactive.
      </Annotation>
      <div style={{ display: "grid", gridTemplateColumns: "auto auto auto", gap: "16px 24px", alignItems: "center" }}>
        <ColumnHeader>Figma variant</ColumnHeader>
        <ColumnHeader>Lead React</ColumnHeader>
        <ColumnHeader>Mapping note</ColumnHeader>

        <Cell>Default</Cell>
        <Cell>
          <Badge variant="neutral">Default</Badge>
        </Cell>
        <Note>Mapped to <code>variant="neutral"</code>.</Note>

        <Cell>Secondary</Cell>
        <Cell>
          <Badge variant="brand">Secondary</Badge>
        </Cell>
        <Note>Mapped to <code>variant="brand"</code>.</Note>

        <Cell>Outline</Cell>
        <Cell>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 10px",
              borderRadius: "var(--lead-radius-pill, 9999px)",
              border: "1px solid var(--lead-color-border-default, #d6d8e0)",
              background: "transparent",
              color: "var(--lead-color-text-default, #15161a)",
              font: "inherit",
              fontSize: 12,
              lineHeight: "16px",
              fontWeight: 500,
            }}
          >
            Outline
          </span>
        </Cell>
        <Note>
          <strong>Approximated.</strong> No Lead variant; preview wrapper only.
          Production support requires an explicit API decision.
        </Note>

        <Cell>Destructive</Cell>
        <Cell>
          <Badge variant="danger">Destructive</Badge>
        </Cell>
        <Note>Mapped to <code>variant="danger"</code>.</Note>

        <Cell>Verified</Cell>
        <Cell>
          <Badge variant="success">Verified</Badge>
        </Cell>
        <Note>
          Mapped to <code>variant="success"</code>. Verified conventionally
          uses green/check semantics.
        </Note>
      </div>
    </div>
  ),
}

/* ── helpers — Storybook-only preview chrome (not exported) ───────── */

function FigmaRow({
  figmaVariant,
  leadVariant,
}: {
  figmaVariant: string
  leadVariant: "neutral" | "brand" | "success" | "warning" | "danger"
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Cell style={{ width: 110 }}>{figmaVariant}</Cell>
      <Badge variant={leadVariant}>{figmaVariant}</Badge>
      <code style={{ fontSize: 12, color: "var(--lead-color-text-muted, #5a5d68)" }}>
        &lt;Badge variant="{leadVariant}" /&gt;
      </code>
    </div>
  )
}

function Annotation({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "var(--lead-color-surface-muted, #f5f5f6)",
        border: "1px solid var(--lead-color-border-default, #d6d8e0)",
        borderRadius: "var(--lead-radius-md, 8px)",
        font: "inherit",
        fontSize: 13,
        lineHeight: "20px",
        color: "var(--lead-color-text-default, #15161a)",
      }}
    >
      {children}
    </div>
  )
}

function ColumnHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        font: "inherit",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "var(--lead-color-text-muted, #5a5d68)",
      }}
    >
      {children}
    </div>
  )
}

function Cell({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        font: "inherit",
        fontSize: 13,
        color: "var(--lead-color-text-default, #15161a)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        font: "inherit",
        fontSize: 12,
        color: "var(--lead-color-text-muted, #5a5d68)",
      }}
    >
      {children}
    </div>
  )
}
