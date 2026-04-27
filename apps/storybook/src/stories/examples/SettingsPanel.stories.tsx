import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Separator,
  Switch,
} from "@leadbank/ui"

import "./examples.css"

const meta: Meta = {
  title: "Examples/Settings Panel",
  parameters: {
    docs: {
      description: {
        component:
          "End-to-end example: a workspace settings panel composed from Card, Switch, Checkbox, Separator, and Button. Demonstrates that the components share visual rhythm and accessibility wiring without any glue code beyond layout.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj

const ToggleRow = ({
  id,
  title,
  caption,
  defaultChecked,
}: {
  id: string
  title: string
  caption: string
  defaultChecked?: boolean
}) => (
  <div className="lead-Example__row">
    <div className="lead-Example__row__text">
      <label className="lead-Example__row__title" htmlFor={id}>
        {title}
      </label>
      <span className="lead-Example__row__caption">{caption}</span>
    </div>
    <Switch id={id} aria-label={title} defaultChecked={defaultChecked} />
  </div>
)

const CheckboxRow = ({
  id,
  title,
  caption,
  defaultChecked,
}: {
  id: string
  title: string
  caption: string
  defaultChecked?: boolean
}) => (
  <div className="lead-Example__row lead-Example__row--start">
    <Checkbox id={id} aria-label={title} defaultChecked={defaultChecked} />
    <div className="lead-Example__row__text" style={{ flex: 1 }}>
      <label className="lead-Example__row__title" htmlFor={id}>
        {title}
      </label>
      <span className="lead-Example__row__caption">{caption}</span>
    </div>
  </div>
)

export const Default: Story = {
  render: () => (
    <Card className="lead-Example lead-Example--frame">
      <CardHeader>
        <CardTitle level={2}>Workspace settings</CardTitle>
        <CardDescription>
          Manage notifications, privacy, and the people who can see your
          activity.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <ToggleRow
          id="settings-email"
          title="Email notifications"
          caption="Get a daily digest of activity in your workspace."
          defaultChecked
        />
        <ToggleRow
          id="settings-push"
          title="Push notifications"
          caption="Native alerts on your phone or laptop."
        />
        <ToggleRow
          id="settings-mentions"
          title="Mentions only"
          caption="Limit notifications to direct mentions."
          defaultChecked
        />
      </CardContent>

      <Separator />

      <CardContent>
        <p className="lead-Example__row__title">Privacy</p>
        <CheckboxRow
          id="settings-share-activity"
          title="Share activity"
          caption="Let teammates see what you're working on."
          defaultChecked
        />
        <CheckboxRow
          id="settings-search-indexing"
          title="Allow search indexing"
          caption="Make your public pages discoverable to anyone in the org."
        />
        <CheckboxRow
          id="settings-public-profile"
          title="Public profile"
          caption="Show your name and avatar outside the workspace."
        />
      </CardContent>

      <CardFooter align="between">
        <Button variant="ghost">Reset to defaults</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Card className="lead-Example lead-Example--frame">
      <CardHeader>
        <CardTitle level={2}>Workspace settings</CardTitle>
        <CardDescription>Read-only — your role doesn't allow changes.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <ToggleRow
          id="readonly-email"
          title="Email notifications"
          caption="Daily digest of workspace activity."
          defaultChecked
        />
        <ToggleRow
          id="readonly-push"
          title="Push notifications"
          caption="Native alerts on your devices."
        />
      </CardContent>
      <CardFooter align="end">
        <Button disabled>Save changes</Button>
      </CardFooter>
    </Card>
  ),
}
