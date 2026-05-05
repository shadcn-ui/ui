/**
 * Experimental — Figma → Storybook export prototype (Card).
 *
 * **This is NOT Code Connect.** Storybook-only preview generated from the
 * Figma Card component page, intended for visual review before any
 * production component changes.
 *
 * **Source Figma node** (Card documentation page, file
 *  `f2gKVfCJNOS0MeLUk4CM8u`, page `45:61262`):
 *
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=45-61262
 *
 * The page documents the Card component (symbol `29:72255`) with four
 * example compositions: Buttons, Login form, Meeting Notes, and Image.
 *
 * **Design context source:** live Figma MCP fetch on `29:72255`. The
 * component documentation explicitly references shadcn's Card pattern
 * (https://ui.shadcn.com/docs/components/card) — Lead's React Card
 * follows the same compositional shape (CardHeader / CardContent /
 * CardFooter / CardTitle / CardDescription).
 *
 * **Why this exists:** second prototype in the JES-82 lane. Card is a
 * meaningful step up from Badge: it has compositional substructure
 * (header/content/footer subcomponents), text props on the title and
 * description, and instance-swap "slot" semantics in Figma that map
 * naturally to React children. Validating the export shape on a real
 * compositional component before scaling further.
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Label,
} from "@leadbank/ui"

const FIGMA_PAGE_URL =
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=45-61262"
const FIGMA_COMPONENT_NODE = "29:72255"

const meta: Meta<typeof Card> = {
  title: "Experimental/Figma Export/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Storybook-only Figma export prototype. Renders the Figma Card " +
          "component's documented compositional patterns alongside their " +
          `Lead React equivalents. Source page: ${FIGMA_PAGE_URL}. ` +
          `Component symbol: ${FIGMA_COMPONENT_NODE}. ` +
          "**Not Code Connect. Not a production change.**",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

/* ── Mapped: canonical Card composition matching Figma defaults ──── */

/**
 * Figma defaults → Lead React.
 *
 * Figma `Card` defaults (per live design-context fetch):
 *   - cardHeader   = true  → include `<CardHeader>` in React
 *   - cardContent  = true  → include `<CardContent>` in React
 *   - cardFooter   = true  → include `<CardFooter>` in React
 *   - cardTitle    = "Title Text" → `<CardTitle>` children
 *   - cardDescription = "This is a card description." → `<CardDescription>` children
 *   - swapContent  = null (default slot) → custom JSX in `<CardContent>`
 *   - swapFooter   = null (default slot) → custom JSX in `<CardFooter>`
 *
 * The boolean toggles (cardHeader/cardContent/cardFooter) don't have
 * React-prop equivalents on `<Card>` — Lead's Card is compositional, so
 * "include subcomponent" replaces "set boolean to true."
 */
export const FigmaDefaults: Story = {
  name: "Card — Figma defaults",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        Maps the Figma Card component's <em>default</em> configuration to
        the canonical Lead compositional shape. Title and description are
        rendered with the Figma default text values.
      </Annotation>
      <Card style={{ width: 420 }}>
        <CardHeader>
          <CardTitle>Title Text</CardTitle>
          <CardDescription>This is a card description.</CardDescription>
        </CardHeader>
        <CardContent>
          <SlotPreview label="Slot (swap with your content)" />
        </CardContent>
        <CardFooter>
          <SlotPreview label="Slot (swap with your footer)" />
        </CardFooter>
      </Card>
    </div>
  ),
}

/* ── Mapped: Buttons composition (Figma "Type=Buttons") ──────────── */

export const FigmaButtonsComposition: Story = {
  name: "Card — Buttons composition",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        Figma's <code>Type=Buttons</code> footer composition. Title +
        description in the header, two stacked buttons via{" "}
        <code>swapContent</code>. In React, just put the buttons inside{" "}
        <code>{`<CardContent>`}</code>.
      </Annotation>
      <Card style={{ width: 420 }}>
        <CardHeader>
          <CardTitle>Title Text</CardTitle>
          <CardDescription>This is a card description.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Button variant="primary">Get back it with your content</Button>
            <Button variant="primary">Get away it with your content</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

/* ── Mapped: Login composition (Figma "Type=Login Inputs/Login") ── */

export const FigmaLoginComposition: Story = {
  name: "Card — Login composition",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        Figma's <code>Type=Login Inputs</code> + <code>Type=Login</code>{" "}
        footer composition. The Figma instance-swap props translate to
        regular Lead form composition: <code>Field</code> +{" "}
        <code>FieldLabel</code> + <code>Input</code>, then a primary
        button + secondary button + sign-up link.
      </Annotation>
      <Card style={{ width: 420 }}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" placeholder="m@example.com" />
            </Field>
            <Field>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <FieldLabel>Password</FieldLabel>
                <a
                  href="#"
                  style={{
                    fontSize: 12,
                    color: "var(--lead-color-text-muted, #5a5d68)",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot your password?
                </a>
              </div>
              <Input type="password" placeholder="Password" />
            </Field>
          </div>
        </CardContent>
        <CardFooter>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}
          >
            <Button variant="primary" style={{ width: "100%" }}>
              Login
            </Button>
            <Button variant="secondary" style={{ width: "100%" }}>
              Login with Google
            </Button>
            <p
              style={{
                fontSize: 12,
                color: "var(--lead-color-text-muted, #5a5d68)",
                textAlign: "center",
              }}
            >
              Don't have an account?{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                Sign up
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  ),
}

/* ── Mapped: Text/notes composition (Figma "Type=Text") ──────────── */

export const FigmaNotesComposition: Story = {
  name: "Card — Notes composition",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        Figma's <code>Type=Text</code> content composition. Paragraph +
        ordered list + a small avatar/badge row. Lead React handles this
        with regular semantic markup inside <code>{`<CardContent>`}</code>.
      </Annotation>
      <Card style={{ width: 420 }}>
        <CardHeader>
          <CardTitle>Meeting Notes</CardTitle>
          <CardDescription>Tuesday's town hall meeting, with the founders.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol
            style={{
              margin: 0,
              paddingLeft: 20,
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--lead-color-text-default, #15161a)",
            }}
          >
            <li>New roadmap is aligned to daily/weekly cadence.</li>
            <li>Q3 OKRs to be finalized next Tuesday.</li>
            <li>OKRs cover live launch.</li>
            <li>One-on-ones in 2 weeks.</li>
            <li>Follow-up reading scheduled for next Tuesday.</li>
          </ol>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
              alignItems: "center",
            }}
          >
            <Badge size="sm" variant="neutral">JN</Badge>
            <Badge size="sm" variant="brand">EM</Badge>
            <Badge size="sm" variant="success">VK</Badge>
            <span
              style={{
                fontSize: 12,
                color: "var(--lead-color-text-muted, #5a5d68)",
              }}
            >
              + 4 more
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

/* ── Approximated: Image card (Figma uses an image asset) ─────────── */

export const FigmaImageCompositionApproximated: Story = {
  name: "Card — Image composition (approximated)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Annotation>
        <strong>Approximation</strong> — Figma's image variant uses an
        embedded image asset that the agent doesn't have access to from
        outside the Figma desktop session. Below is a placeholder
        representing the image slot, with the surrounding text/footer
        composition rendered faithfully.
        <br />
        <br />
        Lead has no <code>{`<CardImage>`}</code> subcomponent today; an
        image inside <code>{`<CardContent>`}</code> with appropriate
        styling is the standard pattern. If a dedicated image-card variant
        is desired in production, that's a separate API decision.
      </Annotation>
      <Card style={{ width: 420 }}>
        <CardHeader>
          <CardTitle>Is this an image?</CardTitle>
          <CardDescription>This is a card with image content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 6,
              background:
                "linear-gradient(135deg, #d6d8e0 0%, #e6e7ea 50%, #c9ccd6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--lead-color-text-muted, #5a5d68)",
              fontSize: 12,
            }}
            aria-label="Image preview placeholder"
          >
            (image asset — preview only)
          </div>
        </CardContent>
        <CardFooter>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              fontSize: 12,
              color: "var(--lead-color-text-muted, #5a5d68)",
            }}
          >
            <span>2.1 — 3.4 MB — IMG_0042.jpg</span>
            <span style={{ color: "var(--lead-color-text-default, #15161a)" }}>
              $39.00
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  ),
}

/* ── Side-by-side surface map ─────────────────────────────────────── */

export const FigmaSurfaceMap: Story = {
  name: "Surface mapping (Figma → Lead React)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Annotation>
        Source Figma page:{" "}
        <a href={FIGMA_PAGE_URL} target="_blank" rel="noreferrer">
          {FIGMA_PAGE_URL}
        </a>
        <br />
        Component symbol: <code>{FIGMA_COMPONENT_NODE}</code>. Documentation
        link in Figma references the shadcn Card pattern, which Lead's
        compositional Card follows directly.
      </Annotation>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gap: "12px 24px",
          alignItems: "start",
        }}
      >
        <ColumnHeader>Figma property</ColumnHeader>
        <ColumnHeader>Lead React</ColumnHeader>
        <ColumnHeader>Mapping note</ColumnHeader>

        <Cell>
          <code>cardTitle</code> (text)
        </Cell>
        <Cell>
          <code>{`<CardTitle>{cardTitle}</CardTitle>`}</code>
        </Cell>
        <Note>Direct text-to-children mapping.</Note>

        <Cell>
          <code>cardDescription</code> (text)
        </Cell>
        <Cell>
          <code>{`<CardDescription>{cardDescription}</CardDescription>`}</code>
        </Cell>
        <Note>Direct text-to-children mapping.</Note>

        <Cell>
          <code>cardHeader</code> (boolean)
        </Cell>
        <Cell>
          <code>{`<CardHeader>…</CardHeader>`}</code>
        </Cell>
        <Note>
          Boolean toggle → compositional inclusion. No prop on Card; just
          include or omit the subcomponent.
        </Note>

        <Cell>
          <code>cardContent</code> (boolean)
        </Cell>
        <Cell>
          <code>{`<CardContent>…</CardContent>`}</code>
        </Cell>
        <Note>Same pattern as cardHeader.</Note>

        <Cell>
          <code>cardFooter</code> (boolean)
        </Cell>
        <Cell>
          <code>{`<CardFooter>…</CardFooter>`}</code>
        </Cell>
        <Note>Same pattern as cardHeader.</Note>

        <Cell>
          <code>swapContent</code> (instance swap)
        </Cell>
        <Cell>
          children of <code>{`<CardContent>`}</code>
        </Cell>
        <Note>
          Figma instance-swap → arbitrary React JSX. No "swap" prop on
          Lead Card — the children placement is the swap.
        </Note>

        <Cell>
          <code>swapFooter</code> (instance swap)
        </Cell>
        <Cell>
          children of <code>{`<CardFooter>`}</code>
        </Cell>
        <Note>Same pattern as swapContent.</Note>

        <Cell style={{ color: "var(--lead-color-text-muted, #5a5d68)" }}>
          Image asset (in image variant)
        </Cell>
        <Cell style={{ color: "var(--lead-color-text-muted, #5a5d68)" }}>
          ⚠ approximated
        </Cell>
        <Note>
          <strong>Approximated.</strong> Image asset not retrievable from
          Figma in this session; placeholder used. Lead has no dedicated{" "}
          <code>{`<CardImage>`}</code> subcomponent.
        </Note>

        <Cell style={{ color: "var(--lead-color-text-muted, #5a5d68)" }}>
          Light/Dark theme variants
        </Cell>
        <Cell style={{ color: "var(--lead-color-text-muted, #5a5d68)" }}>
          ⚠ deferred
        </Cell>
        <Note>
          Figma page shows both themes; Lead Storybook themes are a
          separate concern (Storybook addon-themes, deployed Pages).
          Not rendered here.
        </Note>
      </div>
    </div>
  ),
}

/* ── helpers ──────────────────────────────────────────────────────── */

function SlotPreview({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "100%",
        padding: 16,
        background: "var(--lead-color-action-primary-default, #1856f3)",
        border: "1px dashed var(--lead-color-border-default, #d6d8e0)",
        borderRadius: 6,
        color: "#fff",
        textAlign: "center",
        fontSize: 13,
      }}
    >
      {label}
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
        fontSize: 12,
        color: "var(--lead-color-text-muted, #5a5d68)",
      }}
    >
      {children}
    </div>
  )
}

// Suppress unused-import warning for components surfaced in the surface map but
// not directly rendered in defaults (they're available for future stories
// without re-importing).
void Label
