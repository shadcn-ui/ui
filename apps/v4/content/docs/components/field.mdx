---
title: Field
description: Combine labels, controls, and help text to compose accessible form fields and grouped inputs.
component: true
---

<ComponentPreview
  name="field-demo"
  className="[&_.preview]:h-[800px] [&_.preview]:p-6 md:[&_.preview]:h-[850px]"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add field
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="field" title="components/ui/field.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
```

```tsx showLineNumbers
<FieldSet>
  <FieldLegend>Profile</FieldLegend>
  <FieldDescription>This appears on invoices and emails.</FieldDescription>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Full name</FieldLabel>
      <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
      <FieldDescription>This appears on invoices and emails.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input id="username" autoComplete="off" aria-invalid />
      <FieldError>Choose another username.</FieldError>
    </Field>
    <Field orientation="horizontal">
      <Switch id="newsletter" />
      <FieldLabel htmlFor="newsletter">Subscribe to the newsletter</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

## Anatomy

The `Field` family is designed for composing accessible forms. A typical field is structured as follows:

```tsx showLineNumbers
<Field>
  <FieldLabel htmlFor="input-id">Label</FieldLabel>
  {/* Input, Select, Switch, etc. */}
  <FieldDescription>Optional helper text.</FieldDescription>
  <FieldError>Validation message.</FieldError>
</Field>
```

- `Field` is the core wrapper for a single field.
- `FieldContent` is a flex column that groups label and description. Not required if you have no description.
- Wrap related fields with `FieldGroup`, and use `FieldSet` with `FieldLegend` for semantic grouping.

## Form

See the [Form](/docs/forms) documentation for building forms with the `Field` component and [React Hook Form](/docs/forms/react-hook-form) or [Tanstack Form](/docs/forms/tanstack-form).

## Examples

### Input

<ComponentPreview name="field-input" className="!mb-4 [&_.preview]:p-6" />

### Textarea

<ComponentPreview name="field-textarea" className="!mb-4 [&_.preview]:p-6" />

### Select

<ComponentPreview name="field-select" className="!mb-4 [&_.preview]:p-6" />

### Slider

<ComponentPreview name="field-slider" className="!mb-4 [&_.preview]:p-6" />

### Fieldset

<ComponentPreview name="field-fieldset" className="!mb-4 [&_.preview]:p-6" />

### Checkbox

<ComponentPreview name="field-checkbox" className="!mb-4 [&_.preview]:p-6" />

### Radio

<ComponentPreview name="field-radio" className="!mb-4 [&_.preview]:p-6" />

### Switch

<ComponentPreview name="field-switch" className="!mb-4 [&_.preview]:p-6" />

### Choice Card

Wrap `Field` components inside `FieldLabel` to create selectable field groups. This works with `RadioItem`, `Checkbox` and `Switch` components.

<ComponentPreview name="field-choice-card" className="!mb-4 [&_.preview]:p-6" />

### Field Group

Stack `Field` components with `FieldGroup`. Add `FieldSeparator` to divide them.

<ComponentPreview name="field-group" className="!mb-4 [&_.preview]:p-6" />

## Responsive Layout

- **Vertical fields:** Default orientation stacks label, control, and helper text—ideal for mobile-first layouts.
- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the label and control side-by-side. Pair with `FieldContent` to keep descriptions aligned.
- **Responsive fields:** Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at specific breakpoints.

<ComponentPreview
  name="field-responsive"
  className="!mb-4 [&_.preview]:h-[650px] [&_.preview]:p-6 [&_.preview]:md:h-[500px] [&_.preview]:md:p-10"
/>

## Validation and Errors

- Add `data-invalid` to `Field` to switch the entire block into an error state.
- Add `aria-invalid` on the input itself for assistive technologies.
- Render `FieldError` immediately after the control or inside `FieldContent` to keep error messages aligned with the field.

```tsx showLineNumbers /data-invalid/ /aria-invalid/
<Field data-invalid>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" aria-invalid />
  <FieldError>Enter a valid email address.</FieldError>
</Field>
```

## Accessibility

- `FieldSet` and `FieldLegend` keep related controls grouped for keyboard and assistive tech users.
- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend` when combined.
- Apply `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries.

## API Reference

### FieldSet

Container that renders a semantic `fieldset` with spacing presets.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldSet>
  <FieldLegend>Delivery</FieldLegend>
  <FieldGroup>{/* Fields */}</FieldGroup>
</FieldSet>
```

### FieldLegend

Legend element for a `FieldSet`. Switch to the `label` variant to align with label sizing.

| Prop        | Type                  | Default    |
| ----------- | --------------------- | ---------- |
| `variant`   | `"legend" \| "label"` | `"legend"` |
| `className` | `string`              |            |

```tsx
<FieldLegend variant="label">Notification Preferences</FieldLegend>
```

The `FieldLegend` has two variants: `legend` and `label`. The `label` variant applies label sizing and alignment. Handy if you have nested `FieldSet`.

### FieldGroup

Layout wrapper that stacks `Field` components and enables container queries for responsive orientations.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldGroup className="@container/field-group flex flex-col gap-6">
  <Field>{/* ... */}</Field>
  <Field>{/* ... */}</Field>
</FieldGroup>
```

### Field

The core wrapper for a single field. Provides orientation control, invalid state styling, and spacing.

| Prop           | Type                                         | Default      |
| -------------- | -------------------------------------------- | ------------ |
| `orientation`  | `"vertical" \| "horizontal" \| "responsive"` | `"vertical"` |
| `className`    | `string`                                     |              |
| `data-invalid` | `boolean`                                    |              |

```tsx
<Field orientation="horizontal">
  <FieldLabel htmlFor="remember">Remember me</FieldLabel>
  <Switch id="remember" />
</Field>
```

### FieldContent

Flex column that groups control and descriptions when the label sits beside the control. Not required if you have no description.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<Field>
  <Checkbox id="notifications" />
  <FieldContent>
    <FieldLabel htmlFor="notifications">Notifications</FieldLabel>
    <FieldDescription>Email, SMS, and push options.</FieldDescription>
  </FieldContent>
</Field>
```

### FieldLabel

Label styled for both direct inputs and nested `Field` children.

| Prop        | Type      | Default |
| ----------- | --------- | ------- |
| `className` | `string`  |         |
| `asChild`   | `boolean` | `false` |

```tsx
<FieldLabel htmlFor="email">Email</FieldLabel>
```

### FieldTitle

Renders a title with label styling inside `FieldContent`.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldContent>
  <FieldTitle>Enable Touch ID</FieldTitle>
  <FieldDescription>Unlock your device faster.</FieldDescription>
</FieldContent>
```

### FieldDescription

Helper text slot that automatically balances long lines in horizontal layouts.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldDescription>We never share your email with anyone.</FieldDescription>
```

### FieldSeparator

Visual divider to separate sections inside a `FieldGroup`. Accepts optional inline content.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldSeparator>Or continue with</FieldSeparator>
```

### FieldError

Accessible error container that accepts children or an `errors` array (e.g., from `react-hook-form`).

| Prop        | Type                                       | Default |
| ----------- | ------------------------------------------ | ------- |
| `errors`    | `Array<{ message?: string } \| undefined>` |         |
| `className` | `string`                                   |         |

```tsx
<FieldError errors={errors.username} />
```

When the `errors` array contains multiple messages, the component renders a list automatically.

`FieldError` also accepts issues produced by any validator that implements [Standard Schema](https://standardschema.dev/), including Zod, Valibot, and ArkType. Pass the `issues` array from the schema result directly to render a unified error list across libraries.
