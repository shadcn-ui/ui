import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@leadbank/ui"

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead select built on @radix-ui/react-select. Compose Select + SelectTrigger + SelectValue + SelectContent + SelectItem (with optional SelectGroup, SelectLabel, SelectSeparator). Trigger supports `size` (sm/md/lg) and `invalid`. Supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) state, plus disabled select / disabled item.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const Basic: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Select>
        <SelectTrigger aria-label="plan">
          <SelectValue placeholder="Pick a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-3)",
        width: 280,
      }}
    >
      <Select defaultValue="pro">
        <SelectTrigger aria-label="sm" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="pro">
        <SelectTrigger aria-label="md" size="md">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="pro">
        <SelectTrigger aria-label="lg" size="lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const InvalidInField: Story = {
  name: "Invalid (in Field)",
  render: () => (
    <div style={{ width: 320 }}>
      <Field invalid>
        <FieldLabel required>Plan</FieldLabel>
        <FieldDescription>You can change this any time.</FieldDescription>
        <FieldControl>
          <Select>
            <SelectTrigger aria-label="plan" invalid>
              <SelectValue placeholder="Pick a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </FieldControl>
        <FieldError>Pick a plan to continue.</FieldError>
      </Field>
    </div>
  ),
}

export const Grouped: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Select>
        <SelectTrigger aria-label="region">
          <SelectValue placeholder="Pick a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="us-east-1">us-east-1 (N. Virginia)</SelectItem>
            <SelectItem value="us-west-2">us-west-2 (Oregon)</SelectItem>
            <SelectItem value="ca-central-1">ca-central-1</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem>
            <SelectItem value="eu-central-1">eu-central-1 (Frankfurt)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia Pacific</SelectLabel>
            <SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem>
            <SelectItem value="ap-southeast-1">
              ap-southeast-1 (Singapore)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Select disabled defaultValue="pro">
        <SelectTrigger aria-label="plan">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const DisabledItem: Story = {
  name: "Disabled item",
  render: () => (
    <div style={{ width: 280 }}>
      <Select>
        <SelectTrigger aria-label="plan">
          <SelectValue placeholder="Pick a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise" disabled>
            Enterprise (contact sales)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const InFormCard: Story = {
  name: "In a form Card",
  render: () => (
    <Card style={{ width: 400 }}>
      <CardHeader>
        <CardTitle level={2}>Create project</CardTitle>
        <CardDescription>
          Pick a name, region, and plan to spin up a workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel required>Project name</FieldLabel>
            <FieldControl>
              <Input placeholder="my-app" />
            </FieldControl>
          </Field>
          <Field>
            <FieldLabel required>Region</FieldLabel>
            <FieldControl>
              <Select defaultValue="us-east-1">
                <SelectTrigger aria-label="region">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>North America</SelectLabel>
                    <SelectItem value="us-east-1">us-east-1</SelectItem>
                    <SelectItem value="us-west-2">us-west-2</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Europe</SelectLabel>
                    <SelectItem value="eu-west-1">eu-west-1</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldControl>
          </Field>
          <Field>
            <FieldLabel required>Plan</FieldLabel>
            <FieldControl>
              <Select defaultValue="pro">
                <SelectTrigger aria-label="plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise" disabled>
                    Enterprise (contact sales)
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldControl>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter align="end">
        <Button variant="ghost">Cancel</Button>
        <Button>Create project</Button>
      </CardFooter>
    </Card>
  ),
}

/**
 * Figma parity story (JES-95, batch D).
 *
 * Mirrors the Figma `Lead UI - Select` (trigger/control 29:98157,
 * item 29:97998, label 29:97936, menu 29:98193). Per the existing
 * Code Connect mapping (Select.figma.tsx), the Figma trigger/control
 * node represents the *whole labeled field* — Label / Description /
 * Placeholder text + State variant — not just the button. Lead's
 * React API spreads this across `<Field>` + `<FieldLabel>` + `<Select>`
 * + `<SelectTrigger>` + `<SelectValue>` + `<FieldDescription>`.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98157
 *
 * **Documented non-parity exception:**
 *
 * - **Difference:** Figma exposes `Show Label` / `Show Description` /
 *   `Show Icon` as boolean visibility toggles on the trigger/control;
 *   Lead's compositional API has no "show" prop — caller includes or
 *   omits the subcomponent. Figma's State variants `Focus` / `Filled`
 *   / `Filled (Focus)` are runtime states, not React props. Figma's
 *   item-level `Show Icon` / `Type=Simple|Icon` / `Variant=Default|
 *   Checkbox` similarly have no Lead `<SelectItem>` props (Lead
 *   always renders a check indicator for the selected option; no
 *   icon-leading prop today).
 * - **Reason:** API shape — same compositional/runtime-state pattern
 *   as Card and Tabs in Batch C. Adding "show" props or runtime-state
 *   props would conflate caller composition with primitive state.
 * - **Authority:** `Select.figma.tsx` deliberate-unmapped block.
 * - **Resolution:** Permanent. Caller composes label/description via
 *   `<Field>` siblings; runtime states ship via CSS.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (labeled field with placeholder + disabled)",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 16,
        background: "var(--lead-color-surface-default)",
        width: 360,
      }}
    >
      <Field>
        <FieldLabel>Label Text</FieldLabel>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">Select Item Text</SelectItem>
            <SelectItem value="two">Another item</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>This is a description.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel>State=Disabled</FieldLabel>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">Select Item Text</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Select` (29:98157 trigger/control). " +
          "The Figma trigger/control node represents the *whole labeled " +
          "field*; renders here as the canonical Lead `<Field>` + " +
          "`<FieldLabel>` + `<Select>` + `<SelectTrigger>` + " +
          "`<SelectValue>` + `<FieldDescription>` composition. Figma's " +
          "Show Label/Show Description/Show Icon booleans, item-level " +
          "Show Icon/Type/Variant=Checkbox, and runtime State variants " +
          "are documented non-parity (see story header for the " +
          "API-shape exception).",
      },
    },
  },
}
