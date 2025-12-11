---
title: Next.js
description: Build forms in React using useActionState and Server Actions.
---

import { InfoIcon } from "lucide-react"

In this guide, we will take a look at building forms with Next.js using `useActionState` and Server Actions. We'll cover building forms, validation, pending states, accessibility, and more.

## Demo

We are going to build the following form with a simple text input and a textarea. On submit, we'll use a server action to validate the form data and update the form state.

<ComponentPreview
  name="form-next-demo"
  className="[&_.preview]:h-[700px] [&_pre]:!h-[700px]"
/>

<Callout icon={<InfoIcon />}>
  **Note:** The examples on this page intentionally disable browser validation
  to show how schema validation and form errors work in server actions.
</Callout>

## Approach

This form leverages Next.js and React's built-in capabilities for form handling. We'll build our form using the `<Field />` component, which gives you **complete flexibility over the markup and styling**.

- Uses Next.js `<Form />` component for navigation and progressive enhancement.
- `<Field />` components for building accessible forms.
- `useActionState` for managing form state and errors.
- Handles loading states with pending prop.
- Server Actions for handling form submissions.
- Server-side validation using Zod.

## Anatomy

Here's a basic example of a form using the `<Field />` component.

```tsx showLineNumbers
<Form action={formAction}>
  <FieldGroup>
    <Field data-invalid={!!formState.errors?.title?.length}>
      <FieldLabel htmlFor="title">Bug Title</FieldLabel>
      <Input
        id="title"
        name="title"
        defaultValue={formState.values.title}
        disabled={pending}
        aria-invalid={!!formState.errors?.title?.length}
        placeholder="Login button not working on mobile"
        autoComplete="off"
      />
      <FieldDescription>
        Provide a concise title for your bug report.
      </FieldDescription>
      {formState.errors?.title && (
        <FieldError>{formState.errors.title[0]}</FieldError>
      )}
    </Field>
  </FieldGroup>
  <Button type="submit">Submit</Button>
</Form>
```

## Usage

### Create a form schema

We'll start by defining the shape of our form using a Zod schema in a `schema.ts` file.

<Callout icon={<InfoIcon />}>
  **Note:** This example uses `zod v3` for schema validation, but you can
  replace it with any other schema validation library. Make sure your schema
  library conforms to the Standard Schema specification.
</Callout>

```tsx showLineNumbers title="schema.ts"
import { z } from "zod"

export const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})
```

### Define the form state type

Next, we'll create a type for our form state that includes values, errors, and success status. This will be used to type the form state on the client and server.

```tsx showLineNumbers title="schema.ts"
import { z } from "zod"

export type FormState = {
  values?: z.infer<typeof formSchema>
  errors: null | Partial<Record<keyof z.infer<typeof formSchema>, string[]>>
  success: boolean
}
```

**Important:** We define the schema and the `FormState` type in a separate file so we can import them into both the client and server components.

### Create the Server Action

A server action is a function that runs on the server and can be called from the client. We'll use it to validate the form data and update the form state.

<ComponentSource
  src="/registry/new-york-v4/examples/form-next-demo-action.ts"
  title="actions.ts"
/>

**Note:** We're returning `values` for error cases. This is because we want to keep the user submitted values in the form state. For success cases, we're returning empty values to reset the form.

### Build the form

We can now build the form using the `<Field />` component. We'll use the `useActionState` hook to manage the form state, server action, and pending state.

<ComponentSource
  src="/registry/new-york-v4/examples/form-next-demo.tsx"
  title="form.tsx"
/>

### Done

That's it. You now have a fully accessible form with client and server-side validation.

When you submit the form, the `formAction` function will be called on the server. The server action will validate the form data and update the form state.

If the form data is invalid, the server action will return the errors to the client. If the form data is valid, the server action will return the success status and update the form state.

## Pending States

Use the `pending` prop from `useActionState` to show loading indicators and disable form inputs.

```tsx showLineNumbers {11,26-34}
"use client"

import * as React from "react"
import Form from "next/form"

import { Spinner } from "@/components/ui/spinner"

import { bugReportFormAction } from "./actions"

export function BugReportForm() {
  const [formState, formAction, pending] = React.useActionState(
    bugReportFormAction,
    {
      errors: null,
      success: false,
    }
  )

  return (
    <Form action={formAction}>
      <FieldGroup>
        <Field data-disabled={pending}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" disabled={pending} />
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending && <Spinner />} Submit
          </Button>
        </Field>
      </FieldGroup>
    </Form>
  )
}
```

## Disabled States

### Submit Button

To disable the submit button, use the `pending` prop on the button's `disabled` prop.

```tsx showLineNumbers
<Button type="submit" disabled={pending}>
  {pending && <Spinner />} Submit
</Button>
```

### Field

To apply a disabled state and styling to a `<Field />` component, use the `data-disabled` prop on the `<Field />` component.

```tsx showLineNumbers
<Field data-disabled={pending}>
  <FieldLabel htmlFor="name">Name</FieldLabel>
  <Input id="name" name="name" disabled={pending} />
</Field>
```

## Validation

### Server-side Validation

Use `safeParse()` on your schema in your server action to validate the form data.

```tsx showLineNumbers title="actions.ts" {12-20}
"use server"

export async function bugReportFormAction(
  _prevState: FormState,
  formData: FormData
) {
  const values = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  }

  const result = formSchema.safeParse(values)

  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  return {
    errors: null,
    success: true,
  }
}
```

### Business Logic Validation

You can add additional custom validation logic in your server action.

Make sure to return the values on validation errors. This is to ensure that the form state maintains the user's input.

```tsx showLineNumbers title="actions.ts" {22-35}
"use server"

export async function bugReportFormAction(
  _prevState: FormState,
  formData: FormData
) {
  const values = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  }

  const result = formSchema.safeParse(values)

  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  // Check if email already exists in database.
  const existingUser = await db.user.findUnique({
    where: { email: result.data.email },
  })

  if (existingUser) {
    return {
      values,
      success: false,
      errors: {
        email: ["This email is already registered"],
      },
    }
  }

  return {
    errors: null,
    success: true,
  }
}
```

## Displaying Errors

Display errors next to the field using `<FieldError />`. Make sure to add the `data-invalid` prop to the `<Field />` component and `aria-invalid` prop to the input.

```tsx showLineNumbers
<Field data-invalid={!!formState.errors?.email?.length}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input
    id="email"
    name="email"
    type="email"
    aria-invalid={!!formState.errors?.email?.length}
  />
  {formState.errors?.email && (
    <FieldError>{formState.errors.email[0]}</FieldError>
  )}
</Field>
```

## Resetting the Form

When you submit a form with a server action, React will automatically reset the form state to the initial values.

### Reset on Success

To reset the form on success, you can omit the `values` from the server action and React will automatically reset the form state to the initial values. This is standard React behavior.

```tsx showLineNumbers title="actions.ts" {22-26}
export async function demoFormAction(
  _prevState: FormState,
  formData: FormData
) {
  const values = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  }

  // Validation.
  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  // Business logic.
  callYourDatabaseOrAPI(values)

  // Omit the values on success to reset the form state.
  return {
    errors: null,
    success: true,
  }
}
```

### Preserve on Validation Errors

To prevent the form from being reset on failure, you can return the values in the server action. This is to ensure that the form state maintains the user's input.

```tsx showLineNumbers title="actions.ts" {12-17}
export async function demoFormAction(
  _prevState: FormState,
  formData: FormData
) {
  const values = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  }

  // Validation.
  if (!result.success) {
    return {
      // Return the values on validation errors.
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }
}
```

## Complex Forms

Here is an example of a more complex form with multiple fields and validation.

<ComponentPreview
  name="form-next-complex"
  className="[&_.preview]:h-[1100px] [&_pre]:!h-[1100px]"
  hideCode
/>

### Schema

<ComponentSource
  src="/registry/new-york-v4/examples/form-next-complex-schema.ts"
  title="schema.ts"
/>

### Form

<ComponentSource
  src="/registry/new-york-v4/examples/form-next-complex.tsx"
  title="form.tsx"
/>

### Server Action

<ComponentSource
  src="/registry/new-york-v4/examples/form-next-complex-action.ts"
  title="actions.ts"
/>
