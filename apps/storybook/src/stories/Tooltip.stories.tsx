import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@leadbank/ui"

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead tooltip built on @radix-ui/react-tooltip. Wrap your app with `TooltipProvider` once at the root, then compose Tooltip + TooltipTrigger + TooltipContent at each anchor. Supports `side` (top/right/bottom/left), `align` (start/center/end), and `sideOffset`.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Basic: Story = {
  render: () => (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>This is a tooltip.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Sides: Story = {
  render: () => (
    <TooltipProvider delayDuration={150}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, max-content)",
          gap: "var(--lead-space-5)",
          padding: "var(--lead-space-5)",
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top</Button>
          </TooltipTrigger>
          <TooltipContent side="top">Above</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">To the right</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Bottom</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Below</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">To the left</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const Alignments: Story = {
  render: () => (
    <TooltipProvider delayDuration={150}>
      <div
        style={{
          display: "flex",
          gap: "var(--lead-space-3)",
          padding: "var(--lead-space-5)",
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Align start</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            Aligned to start
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Align center</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Aligned to center
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Align end</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            Aligned to end
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const InSettingsRow: Story = {
  name: "In a settings row",
  render: () => (
    <TooltipProvider delayDuration={150}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: 360,
          fontFamily: "var(--lead-font-family-sans)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--lead-space-2)",
          }}
        >
          <span>Public profile</span>
          <Tooltip>
            <TooltipTrigger
              aria-label="What does this mean?"
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "1px solid var(--lead-color-border-default)",
                background: "var(--lead-color-surface-muted)",
                color: "var(--lead-color-text-muted)",
                fontSize: 12,
                cursor: "help",
                lineHeight: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ?
            </TooltipTrigger>
            <TooltipContent side="top">
              Anyone outside your workspace will be able to see your name and
              avatar.
            </TooltipContent>
          </Tooltip>
        </div>
        <Switch aria-label="Public profile" />
      </div>
    </TooltipProvider>
  ),
}

export const NoArrow: Story = {
  name: "No arrow",
  render: () => (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent withArrow={false}>No arrow on this one.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

/**
 * Figma parity story (JES-93, batch B).
 *
 * Mirrors the Figma `Lead UI - Tooltip` page (component symbol
 * 29:107066). Per the existing Code Connect mapping
 * (Tooltip.figma.tsx), Figma's documented properties are:
 *
 *   - Tooltip Text (TEXT)
 *   - Side         (VARIANT): Top, Right, Bottom, Left
 *
 * Both map cleanly: `Tooltip Text` → `<TooltipContent>` children;
 * `Side` → `<TooltipContent side>` (matches Radix's
 * "top"|"right"|"bottom"|"left" union exactly).
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-107066
 *
 * No documented non-parity — Figma's surface maps 1:1 to Lead's
 * Tooltip props.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (all four sides)",
  render: () => (
    <TooltipProvider>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          padding: 64,
          placeItems: "center",
          background: "var(--lead-color-surface-default)",
          width: "fit-content",
        }}
      >
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side} defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="secondary">Side={side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Tooltip Text</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Tooltip` (29:107066). Renders all " +
          "four Side variants (Top, Right, Bottom, Left) with the " +
          "Figma default Tooltip Text. No documented non-parity — " +
          "Figma's surface maps 1:1 to Lead's `<TooltipContent>` " +
          "props.",
      },
    },
  },
}
