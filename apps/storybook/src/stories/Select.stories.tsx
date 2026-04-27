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
