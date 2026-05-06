import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldControl,
  FieldGroup,
  FieldLabel,
  Input,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@leadbank/ui"

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead popover built on @radix-ui/react-popover. Compose Popover + PopoverTrigger + PopoverContent + (optional) PopoverClose / PopoverAnchor. Includes overlay-free portal, focus management, ESC-to-close, and side/align positioning. Triggers expose `asChild` so a Lead Button is the canonical anchor.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof Popover>

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p style={{ margin: 0 }}>
          Hello from the popover. Press ESC or click outside to dismiss.
        </p>
      </PopoverContent>
    </Popover>
  ),
}

export const Sides: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, max-content)",
        gap: "var(--lead-space-5)",
        padding: "var(--lead-space-5)",
      }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">Above</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">To the right</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">Below</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left">To the left</PopoverContent>
      </Popover>
    </div>
  ),
}

export const InFormCard: Story = {
  name: "In a form Card",
  render: () => (
    <Card style={{ width: 400 }}>
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>Display name</FieldLabel>
            <FieldControl>
              <Input defaultValue="Jane Doe" />
            </FieldControl>
          </Field>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--lead-space-3)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--lead-font-family-sans)",
                fontWeight: 500,
              }}
            >
              Pronouns
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  Add
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="end">
                <FieldGroup>
                  <Field>
                    <FieldLabel size="sm">Pronouns</FieldLabel>
                    <FieldControl>
                      <Input size="sm" placeholder="they / them" />
                    </FieldControl>
                  </Field>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "var(--lead-space-2)",
                    }}
                  >
                    <PopoverClose asChild>
                      <Button variant="ghost" size="sm">
                        Cancel
                      </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                      <Button size="sm">Save</Button>
                    </PopoverClose>
                  </div>
                </FieldGroup>
              </PopoverContent>
            </Popover>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  ),
}

export const NoArrow: Story = {
  name: "No arrow",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open</Button>
      </PopoverTrigger>
      <PopoverContent withArrow={false}>
        Popover content without an arrow.
      </PopoverContent>
    </Popover>
  ),
}

/**
 * Figma parity story (JES-95, batch D).
 *
 * Mirrors the Figma `Lead UI - Popover` page (component symbol
 * 29:96969). Per the existing Code Connect mapping
 * (Popover.figma.tsx), the Figma node has **no documented text or
 * enum properties** — the mapping is example-only because Popover's
 * Figma surface is essentially "the trigger + content shape." The
 * caller fills the content; the primitive doesn't constrain it.
 *
 * Lead's `<Popover>` is *compositional* — `<PopoverTrigger>` /
 * `<PopoverContent>` are children. `<PopoverContent>`'s `side`,
 * `align`, and `sideOffset` are Lead-side layout tuning knobs, not
 * Figma properties.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-96969
 *
 * No documented non-parity — there are no Figma props to map. This
 * story renders the canonical compositional shape the Code Connect
 * mapping documents as "example-only," with placeholder content.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (canonical compositional shape)",
  render: () => (
    <div
      style={{
        padding: 64,
        background: "var(--lead-color-surface-default)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <strong style={{ fontSize: 14 }}>Popover content</strong>
            <span
              style={{
                fontSize: 13,
                color: "var(--lead-color-text-muted)",
              }}
            >
              Caller-provided body. The Lead primitive supplies the
              trigger/content scaffold and arrow; the caller fills the
              content.
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Popover` (29:96969). The Figma " +
          "Popover surface has no documented text or enum properties — " +
          "the Code Connect mapping is example-only. Renders Lead's " +
          "canonical `<Popover>` + `<PopoverTrigger>` + " +
          "`<PopoverContent>` shape with placeholder content. No " +
          "documented non-parity — there are no Figma props to map.",
      },
    },
  },
}
