---
title: Input OTP
description: Accessible one-time password component with copy paste functionality.
component: true
links:
  doc: https://input-otp.rodz.dev
---

<ComponentPreview name="input-otp-demo" description="An 6 digits input OTP." />

## About

Input OTP is built on top of [input-otp](https://github.com/guilhermerodz/input-otp) by [@guilherme_rodz](https://twitter.com/guilherme_rodz).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

<Steps>

<Step>Run the following command:</Step>

```bash
npx shadcn@latest add input-otp
```

</Steps>

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install input-otp
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="input-otp" title="components/ui/input-otp.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
```

```tsx showLineNumbers
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

## Examples

### Pattern

Use the `pattern` prop to define a custom pattern for the OTP input.

<ComponentPreview
  name="input-otp-pattern"
  description="An input OTP with alphanumeric pattern."
/>

```tsx showLineNumbers {1,7}
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

...

<InputOTP
  maxLength={6}
  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    {/* ... */}
  </InputOTPGroup>
</InputOTP>
```

### Separator

You can use the `<InputOTPSeparator />` component to add a separator between the input groups.

<ComponentPreview
  name="input-otp-separator"
  description="An input OTP with custom separator."
/>

```tsx showLineNumbers {4,15}
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

...

<InputOTP maxLength={4}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>
```

### Controlled

You can use the `value` and `onChange` props to control the input value.

<ComponentPreview name="input-otp-controlled" />

### Form

<ComponentPreview name="input-otp-form" />

## Changelog

### 2024-03-19 Composition

We've made some updates and replaced the render props pattern with composition. Here's how to update your code if you prefer the composition pattern.

<Callout className="mt-6">
  **Note:** You are not required to update your code if you are using the
  `render` prop. It is still supported.
</Callout>

<Steps>

<Step>Update to the latest version of `input-otp`.</Step>

```bash
npm install input-otp@latest
```

<Step>Update `input-otp.tsx`</Step>

```diff showLineNumbers title="input-otp.tsx" {2,8-11}
- import { OTPInput, SlotProps } from "input-otp"
+ import { OTPInput, OTPInputContext } from "input-otp"

 const InputOTPSlot = React.forwardRef<
   React.ElementRef<"div">,
-   SlotProps & React.ComponentPropsWithoutRef<"div">
-  >(({ char, hasFakeCaret, isActive, className, ...props }, ref) => {
+   React.ComponentPropsWithoutRef<"div"> & { index: number }
+  >(({ index, className, ...props }, ref) => {
+   const inputOTPContext = React.useContext(OTPInputContext)
+   const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]
```

<Step>Then replace the `render` prop in your code.</Step>

```diff showLineNumbers {2-12}
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

</Steps>

### 2024-03-19 Disabled

To add a disabled state to the input, update `<InputOTP />` as follows:

```tsx showLineNumbers title="input-otp.tsx" {4,7-11}
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"
```
