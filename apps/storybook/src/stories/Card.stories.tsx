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
  FieldGroup,
  FieldLabel,
  Input,
  Separator,
} from "@leadbank/ui"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Card is a layout container with semantic subcomponents for header, title, description, content, and footer. Padding and variant are configurable; subcomponents are unstyled-by-default and compose freely.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    padding: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["default", "muted", "outline"],
    },
  },
  args: {
    padding: "md",
    variant: "default",
  },
}

export default meta

type Story = StoryObj<typeof Card>

export const Basic: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your account details.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the body of the card.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooterActions: Story = {
  name: "With footer actions",
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
        <CardDescription>This action is permanent.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>All your data will be removed within 30 days.</p>
      </CardContent>
      <CardFooter align="end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </CardFooter>
    </Card>
  ),
}

export const FormCard: Story = {
  name: "Form card",
  render: (args) => (
    <Card {...args} style={{ width: 400 }}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Use your work email to access the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel required>Email</FieldLabel>
            <FieldControl>
              <Input type="email" placeholder="you@lead.example" />
            </FieldControl>
          </Field>
          <Field>
            <FieldLabel required>Password</FieldLabel>
            <FieldControl>
              <Input type="password" placeholder="••••••••" />
            </FieldControl>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter align="between">
        <Button variant="ghost">Forgot password</Button>
        <Button>Sign in</Button>
      </CardFooter>
    </Card>
  ),
}

export const MutedVariant: Story = {
  name: "Muted variant",
  args: { variant: "muted" },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle level={4}>Tip</CardTitle>
        <CardDescription>You can switch teams in settings.</CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const OutlineVariant: Story = {
  name: "Outline variant",
  args: { variant: "outline" },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle level={4}>Outline card</CardTitle>
        <CardDescription>Transparent background.</CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const WithSeparator: Story = {
  name: "With separator between sections",
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <p>Account preferences live here.</p>
      </CardContent>
      <Separator />
      <CardFooter align="end">
        <Button variant="outline">Save</Button>
      </CardFooter>
    </Card>
  ),
}

/**
 * Figma parity story (JES-94, batch C).
 *
 * Mirrors the Figma `Lead UI - Card` page (component symbol
 * 29:72255). Per the existing Code Connect mapping
 * (Card.figma.tsx) and the experimental export at
 * `Experimental / Figma Export / Card` (JES-84):
 *
 *   - Card Title       (TEXT)
 *   - Card Description (TEXT)
 *   - Card Header      (BOOLEAN — show/hide section)
 *   - Card Content     (BOOLEAN — show/hide section)
 *   - Card Footer      (BOOLEAN — show/hide section)
 *
 * Lead's Card is *compositional* in React: header/content/footer are
 * subcomponents you include or omit. The Figma boolean toggles map to
 * composition decisions, not React props.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-72255
 *
 * **Documented non-parity exception:**
 *
 * - **Difference:** Figma's boolean toggles `Card Header` /
 *   `Card Content` / `Card Footer` (and instance-swap props
 *   `swapContent` / `swapFooter`) have no React-prop equivalents on
 *   `<Card>`. Lead's API expresses presence-or-absence via inclusion
 *   or omission of the subcomponent.
 * - **Reason:** API shape — compositional substructure is more
 *   flexible than boolean-toggle props for slot layouts. The same
 *   Figma surface drove AlertDialog's compositional pattern; Card
 *   follows the same convention.
 * - **Authority:** `Card.figma.tsx` mapping decisions; the
 *   experimental export at `Experimental / Figma Export / Card`
 *   demonstrates each Figma example composition.
 * - **Resolution:** Permanent.
 *
 * Additional approximations carried forward from the experimental
 * export (JES-84):
 *
 *   - Image asset in image-card composition → gradient placeholder
 *     (asset not retrievable from Figma MCP).
 *   - Avatar circles in notes-card composition → `<Badge size="sm">`
 *     initials (Lead has no `<Avatar>` component).
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (default header + content + footer)",
  render: () => (
    <div
      style={{
        padding: 16,
        background: "var(--lead-color-surface-default)",
        width: "fit-content",
      }}
    >
      <Card style={{ width: 420 }}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            style={{
              padding: 16,
              background: "var(--lead-color-surface-muted)",
              borderRadius: "var(--lead-radius-md)",
              border: "1px dashed var(--lead-color-border-default)",
              fontSize: 13,
              color: "var(--lead-color-text-muted)",
              textAlign: "center",
            }}
          >
            Slot — replace with your content
          </div>
        </CardContent>
        <CardFooter>
          <div
            style={{
              padding: 12,
              background: "var(--lead-color-surface-muted)",
              borderRadius: "var(--lead-radius-md)",
              border: "1px dashed var(--lead-color-border-default)",
              fontSize: 13,
              color: "var(--lead-color-text-muted)",
              textAlign: "center",
              width: "100%",
            }}
          >
            Slot — replace with your footer
          </div>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Card` (29:72255) default — title + " +
          "description + content slot + footer slot. The Figma boolean " +
          "toggles map to compositional inclusion in React (see story " +
          "header for the documented non-parity exception). For " +
          "real-world variants (Login, Notes, Image, Buttons " +
          "compositions) see the experimental export at " +
          "`Experimental / Figma Export / Card` — that lane shows the " +
          "same surface with meaningful in-context content.",
      },
    },
  },
}
