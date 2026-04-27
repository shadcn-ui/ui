import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@leadbank/ui"

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead accordion built on @radix-ui/react-accordion. `type='single'` (with optional `collapsible`) shows one open item at a time; `type='multiple'` allows several. Compose Accordion + AccordionItem + AccordionTrigger + AccordionContent. The trigger renders a built-in chevron that rotates on open.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof Accordion>

export const Basic: Story = {
  render: () => (
    <div style={{ width: 520 }}>
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Is this Lead's official component library?</AccordionTrigger>
          <AccordionContent>
            Yes — `@leadbank/ui` is the canonical surface for Lead product UI.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Where do tokens come from?</AccordionTrigger>
          <AccordionContent>
            From the `@leadbank/design-tokens-cli` pipeline. The build emits
            CSS variables that the components consume directly.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>How do I add a new component?</AccordionTrigger>
          <AccordionContent>
            Read `packages/lead-ui/API-CONSISTENCY.md` first. Then open a PR
            following the auditing checklist at the bottom of that document.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div style={{ width: 520 }}>
      <Accordion type="multiple" defaultValue={["a", "c"]}>
        <AccordionItem value="a">
          <AccordionTrigger>Notifications</AccordionTrigger>
          <AccordionContent>
            Default to weekly digest. You can change this in settings.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Privacy</AccordionTrigger>
          <AccordionContent>
            Profile is private by default; activity is shared with your team.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>Beta features</AccordionTrigger>
          <AccordionContent>
            AI summaries and power shortcuts are off by default.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const FAQ: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <h2
        style={{
          fontFamily: "var(--lead-font-family-sans)",
          fontSize: "var(--lead-font-size-lg)",
          fontWeight: 600,
          marginBottom: "var(--lead-space-3)",
          color: "var(--lead-color-text-default)",
        }}
      >
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="q1">
          <AccordionTrigger>How is billing prorated?</AccordionTrigger>
          <AccordionContent>
            Plan changes prorate to the day. We email a receipt within 24
            hours of any change.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>Can I export my data?</AccordionTrigger>
          <AccordionContent>
            Yes. Settings → Advanced → Exports. Exports include a JSON dump
            of every workspace artifact.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>Do you support SSO?</AccordionTrigger>
          <AccordionContent>
            On Pro and Enterprise plans. Configure under Settings → Security.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q4" disabled>
          <AccordionTrigger>API rate limits (admin only)</AccordionTrigger>
          <AccordionContent>
            Contact your workspace admin to see current limits.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const InCard: Story = {
  name: "In a Card",
  render: () => (
    <Card style={{ width: 520 }}>
      <CardHeader>
        <CardTitle>Release notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="v4-2-1">
          <AccordionItem value="v4-2-1">
            <AccordionTrigger>v4.2.1 — Today</AccordionTrigger>
            <AccordionContent>
              Faster registry indexing. Audit log filters extended to 90 days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="v4-2-0">
            <AccordionTrigger>v4.2.0 — Last week</AccordionTrigger>
            <AccordionContent>
              New Field error placement. Tabs orientation prop. Polish on
              Select listbox sizing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="v4-1-0">
            <AccordionTrigger>v4.1.0 — Two weeks ago</AccordionTrigger>
            <AccordionContent>
              First Radix-backed components: Checkbox, Switch, RadioGroup.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  ),
}
