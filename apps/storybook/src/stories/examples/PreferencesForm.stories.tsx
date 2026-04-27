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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Switch,
} from "@leadbank/ui"

import "./examples.css"

const meta: Meta = {
  title: "Examples/Preferences Form",
  parameters: {
    docs: {
      description: {
        component:
          "End-to-end example: a preferences form composed from RadioGroup, Switch, Checkbox, Card, Field, and Button. Demonstrates a typical 'pick one of N + several toggles' product layout with proper labelling.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj

const PlanOption = ({
  value,
  active,
  title,
  caption,
}: {
  value: string
  active?: boolean
  title: string
  caption: string
}) => {
  const id = `plan-${value}`
  return (
    <div className="lead-Example__plan" data-active={active ? "true" : "false"}>
      <RadioGroupItem id={id} value={value} aria-label={title} />
      <div className="lead-Example__plan__body">
        <label htmlFor={id} className="lead-Example__plan__title">
          {title}
        </label>
        <span className="lead-Example__plan__caption">{caption}</span>
      </div>
    </div>
  )
}

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

export const Default: Story = {
  render: () => (
    <Card className="lead-Example lead-Example--frame">
      <CardHeader>
        <CardTitle level={2}>Preferences</CardTitle>
        <CardDescription>
          Tune the things that change every day.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <Field>
          <FieldGroup>
            <FieldLabel required>Plan</FieldLabel>
            <FieldDescription>
              You can change this at any time.
            </FieldDescription>
            <RadioGroup aria-label="plan" defaultValue="pro">
              <PlanOption
                value="free"
                title="Free"
                caption="Personal projects, up to 3 collaborators."
              />
              <PlanOption
                value="pro"
                active
                title="Pro"
                caption="Unlimited collaborators, advanced analytics."
              />
              <PlanOption
                value="enterprise"
                title="Enterprise"
                caption="SSO, audit log, and a dedicated success manager."
              />
            </RadioGroup>
          </FieldGroup>
        </Field>
      </CardContent>

      <Separator />

      <CardContent>
        <p className="lead-Example__row__title">Notifications</p>
        <ToggleRow
          id="prefs-weekly"
          title="Weekly summary"
          caption="A digest of what your team shipped this week."
          defaultChecked
        />
        <ToggleRow
          id="prefs-mentions"
          title="Mentions"
          caption="Notify me when someone @mentions me."
          defaultChecked
        />
        <ToggleRow
          id="prefs-billing"
          title="Billing alerts"
          caption="Email the workspace owner when invoices are due."
        />
      </CardContent>

      <Separator />

      <CardContent>
        <p className="lead-Example__row__title">Beta features</p>
        <Field>
          <div className="lead-Example__row lead-Example__row--start">
            <Checkbox id="prefs-ai" defaultChecked />
            <div className="lead-Example__row__text" style={{ flex: 1 }}>
              <label
                htmlFor="prefs-ai"
                className="lead-Example__row__title"
              >
                AI summaries
              </label>
              <span className="lead-Example__row__caption">
                Auto-summarise long threads at the top of each channel.
              </span>
            </div>
          </div>
        </Field>
        <Field>
          <div className="lead-Example__row lead-Example__row--start">
            <Checkbox id="prefs-shortcuts" />
            <div className="lead-Example__row__text" style={{ flex: 1 }}>
              <label
                htmlFor="prefs-shortcuts"
                className="lead-Example__row__title"
              >
                Power shortcuts
              </label>
              <span className="lead-Example__row__caption">
                Vim-style keyboard navigation across the app.
              </span>
            </div>
          </div>
        </Field>
      </CardContent>

      <CardFooter align="between">
        <Button variant="ghost">Reset</Button>
        <Button>Save preferences</Button>
      </CardFooter>
    </Card>
  ),
}

export const InvalidPlanSelection: Story = {
  name: "Invalid plan selection",
  render: () => (
    <Card className="lead-Example lead-Example--frame">
      <CardHeader>
        <CardTitle level={2}>Preferences</CardTitle>
        <CardDescription>Pick a plan to continue.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Field invalid>
          <FieldGroup>
            <FieldLabel required>Plan</FieldLabel>
            <RadioGroup aria-label="plan">
              <PlanOption
                value="free"
                title="Free"
                caption="Personal projects."
              />
              <PlanOption
                value="pro"
                title="Pro"
                caption="For growing teams."
              />
            </RadioGroup>
            <FieldError>Pick a plan to continue.</FieldError>
          </FieldGroup>
        </Field>
      </CardContent>
      <CardFooter align="end">
        <Button>Save preferences</Button>
      </CardFooter>
    </Card>
  ),
}
