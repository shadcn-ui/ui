---
title: Plan
description: Displays the steps the agent plans to take, and how far it has got.
base: aria
component: true
---

<ComponentPreview
  styleName="aria-rhea"
  name="plan-demo"
  previewClassName="h-auto"
/>

Plan is the list of steps the agent decides on before it starts, such as the steps of a migration. Each step is done, running or pending, and the title counts how many are done.

Plan is built with `Trace` with a `TraceCollapsible` for the plan.

When the steps are not known up front, use [Task](/docs/ai-elements/aria/task#task-or-plan) instead.

## Installation

Plan is built with the [Trace](/docs/components/aria/trace) component.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add trace
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="trace"
  title="components/ui/trace.tsx"
  styleName="aria-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
```

```tsx showLineNumbers
<Trace>
  <TraceCollapsible defaultExpanded>
    <TraceCollapsibleTrigger>
      <TraceLine status="running">
        <TraceIcon>
          <RouteIcon />
        </TraceIcon>
        <TraceTitle>Plan: migrate to Base UI</TraceTitle>
        <TraceDescription>2 of 5 done</TraceDescription>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Replace the Radix imports</TraceTitle>
        </TraceLine>
        <TraceLine status="running">
          <TraceIcon>
            <CircleDotIcon />
          </TraceIcon>
          <TraceTitle>Rename asChild to render</TraceTitle>
        </TraceLine>
        <TraceLine status="pending">
          <TraceIcon>
            <CircleIcon />
          </TraceIcon>
          <TraceTitle>Run the type checker</TraceTitle>
        </TraceLine>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Details

Put a description above the steps, inside `TraceCollapsibleContent`.

<ComponentPreview
  styleName="aria-rhea"
  name="plan-description"
  previewClassName="h-auto"
/>

## AI SDK

Stream the plan as a data part with a fixed `id`. The AI SDK replaces a data part with the same `id`, so it updates in place.

```ts showLineNumbers title="app/api/chat/route.ts"
const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    writer.write({ type: "data-plan", id: "plan", data: { title, steps } })
  },
})
```

```tsx showLineNumbers
const plan = message.parts.find((part) => part.type === "data-plan")
```

## Migrating from AI SDK Elements

If you added Plan from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/plan.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/plan.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/aria/plan.md and build Plan the same way.
3. Rebuild each part:
   - Plan renders a Trace with a TraceCollapsible, instead of a Card. Pass isStreaming down in a context.
   - PlanHeader renders a TraceCollapsibleTrigger with a TraceLine. Set status="running" on the TraceLine while isStreaming is true, instead of the Shimmer.
   - PlanTitle renders a TraceTitle, and PlanDescription a TraceDescription, like "2 of 4 done".
   - PlanContent renders a TraceCollapsibleContent with a Trace for the steps.
   - PlanTrigger renders only its children, since the whole line opens the plan.
   - Buttons cannot sit inside a trigger. Render PlanAction next to the TraceCollapsibleTrigger, not inside it.
   - Keep PlanFooter as a plain container.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/aria/trace#api-reference).
