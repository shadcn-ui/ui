---
title: Task
description: Displays the steps the agent takes, as it takes them.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="task-demo"
  previewClassName="h-auto"
/>

Task is a piece of work the agent is doing, such as finding the project files or updating a page. Each step, like a search, a read or an edit, appears under the task when the agent takes it.

Task is built with `Trace` with a `TraceCollapsible` for each task.

## Task or Plan

Both are a list of steps under a collapsible line. The difference is when the steps are known.

Use [Plan](/docs/ai-elements/base/plan) when the agent decides the steps before it starts. Use Task when the steps come from the work itself, and the agent only knows the next one once it has taken the last.

|               | Plan                                   | Task                                            |
| ------------- | -------------------------------------- | ----------------------------------------------- |
| Steps         | Every step, from the start             | Each step, once the agent takes it              |
| Pending steps | Yes, waiting their turn                | None                                            |
| Title         | The goal, with progress: "2 of 4 done" | What the agent is doing, then what it did       |
| Per reply     | One plan                               | One or more tasks, each closing when it is done |

## Installation

Task is built with the [Trace](/docs/components/base/trace) component.

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
  styleName="base-rhea"
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
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
```

```tsx showLineNumbers
<Trace>
  <TraceCollapsible defaultOpen>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceTitle>Found the project files</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <SearchIcon />
          </TraceIcon>
          <TraceTitle>Searched for app/page.tsx</TraceTitle>
        </TraceLine>
        <a href="/files/app/page.tsx">
          <TraceLine>
            <TraceIcon>
              <FileTextIcon />
            </TraceIcon>
            <TraceTitle>Read app/page.tsx</TraceTitle>
          </TraceLine>
        </a>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Status

Set the task's status from its steps. Write the title in the present tense while the task runs, and in the past tense once it is done.

| Steps                   | `status`    | Title                              |
| ----------------------- | ----------- | ---------------------------------- |
| A step is still running | `"running"` | Updating the page metadata         |
| A step failed           | `"error"`   | Failed to update the page metadata |
| Every step is done      | none        | Updated the page metadata          |

Put several tasks in one `Trace`. Keep the running task open, and close each task once it is done.

## AI SDK

Stream each task as a data part with its own `id`. The AI SDK replaces a data part with the same `id`, so writing a task again with a new step updates it in place.

```ts showLineNumbers title="app/api/chat/route.ts"
const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    writer.write({ type: "data-task", id: "update", data: { title, steps } })
  },
})
```

```tsx showLineNumbers
const tasks = message.parts.filter((part) => part.type === "data-task")
```

## Migrating from AI SDK Elements

If you added Task from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/task.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/task.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/base/task.md and build Task the same way.
3. Rebuild each part:
   - Task renders a Trace with a TraceCollapsible.
   - TaskTrigger renders a TraceCollapsibleTrigger with a TraceLine and a TraceTitle with title.
   - TaskContent renders a TraceCollapsibleContent with keepMounted, and a Trace for the steps.
   - TaskItem renders a TraceLine with a TraceTitle.
   - Keep TaskItemFile as it is.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
