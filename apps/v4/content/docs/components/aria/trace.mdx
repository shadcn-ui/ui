---
title: Trace
description: The building block for reasoning, tool calls, sources and more.
base: aria
component: true
---

<ComponentPreview
  styleName="aria-rhea"
  name="trace-demo"
  previewClassName="h-auto"
/>

`Trace` is a list of lines. Each line has an icon, a title, and an optional description and status. A line can expand to show more detail, link to a page, or open a dialog or sheet.

Every line has the same shape, so reasoning, tool calls, sources and plans built from `Trace` look and behave the same.

Use `Trace` for the steps an agent takes, like calling a tool, running a subagent or editing a file. Use [Message](/docs/components/aria/message) for its reply, and [Marker](/docs/components/aria/marker) for notes and dividers between turns.

## Built with Trace

Every pattern below is a composition of `Trace` parts. See [AI Elements](/docs/ai-elements) for examples and code.

| Pattern                                                     | Shows                                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| [Chain of Thought](/docs/ai-elements/aria/chain-of-thought) | A summary that expands into the steps behind it.                 |
| [Plan](/docs/ai-elements/aria/plan)                         | The steps the agent plans to take, and how far it has got.       |
| [Queue](/docs/ai-elements/aria/queue)                       | The agent's todo list, split into what is left and what is done. |
| [Reasoning](/docs/ai-elements/aria/reasoning)               | The agent's thinking as it streams.                              |
| [Sources](/docs/ai-elements/aria/sources)                   | The links the agent used for a reply.                            |
| [Stack Trace](/docs/ai-elements/aria/stack-trace)           | A failed tool call and its stack frames.                         |
| [Subagent](/docs/ai-elements/aria/subagent)                 | A subagent run, with its tool calls and result.                  |
| [Task](/docs/ai-elements/aria/task)                         | The steps the agent takes, as it takes them.                     |
| [Terminal](/docs/ai-elements/aria/terminal)                 | A command the agent runs, with its output as it streams.         |
| [Test Results](/docs/ai-elements/aria/test-results)         | A test run by the agent, with its suites and failures.           |
| [Tool](/docs/ai-elements/aria/tool)                         | A tool call the agent makes, from input to output.               |

## Installation

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

Use a `TraceLine` for a single step:

```tsx showLineNumbers
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"
```

```tsx showLineNumbers
<Trace>
  <TraceLine>
    <TraceIcon>
      <SearchIcon />
    </TraceIcon>
    <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
  </TraceLine>
</Trace>
```

Wrap the line in a `TraceCollapsible` to show more detail when it expands:

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
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran node --version</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Composition

Use the following composition to build a trace line:

```text
Trace
└── TraceLine
    ├── TraceIcon
    ├── TraceTitle
    ├── TraceDescription
    └── TraceIcon
```

Wrap the line in a `TraceCollapsible` to show more detail when it expands:

```text
Trace
└── TraceCollapsible
    ├── TraceCollapsibleTrigger
    │   └── TraceLine
    └── TraceCollapsibleContent
```

`TraceLine` is always the line. To make a line do something, wrap it in that thing's trigger.

## Features

- One row for reasoning, tool calls, sources, plans and tasks
- Rows that expand, link out, or open a dialog, sheet, drawer or popover
- `running`, `error` and `pending` states, with a shimmer while running
- Nested rows, so a summary expands into steps and a step into its output
- Works with reasoning, tool and source parts from the AI SDK
- Keyboard and screen reader support from the trigger that wraps each row
- Customizable styling through the `className` prop on every part

## Trace Line

Use a `TraceLine` on its own for a step with no detail to show. It reads as plain text.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-static"
  previewClassName="h-auto"
/>

## Status

Set `status` on `TraceLine` when a step is running, has failed or hasn't started yet.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-status"
  previewClassName="h-auto"
/>

| Status      | Use for                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| none        | Work that is done: "Ran pnpm install".                                        |
| `"error"`   | Work that failed. Say so in the title: "Failed to run pnpm lint".             |
| `"running"` | Work in progress. Write the title in the present tense: "Running pnpm build". |
| `"pending"` | Work that has not started, such as a plan step: "Run pnpm test".              |

## Description

Put secondary text such as a diff stat, a duration or a count in a `TraceDescription` after the `TraceTitle`. It does not truncate.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-description"
  previewClassName="h-auto"
/>

## Collapsible

Wrap the line in a `TraceCollapsible` to show more detail when it expands. Put the `TraceLine` inside `TraceCollapsibleTrigger` and the detail in `TraceCollapsibleContent`.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-collapsible"
  previewClassName="h-auto"
/>

## Open State

Rows start closed. Use `defaultExpanded` on `TraceCollapsible` to start open, or `isExpanded` with `onExpandedChange` to control a row.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-open"
  previewClassName="h-auto"
/>

To open a row while it streams and let the reader's click win, pass `open ?? running`.

```tsx showLineNumbers
const [open, setOpen] = React.useState<boolean>()

<TraceCollapsible
  isExpanded={open ?? running}
  onExpandedChange={setOpen}
>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? "running" : undefined}>…</TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>{text}</TraceCollapsibleContent>
</TraceCollapsible>
```

## Link

Wrap the `TraceLine` in an anchor. For a new tab, use an arrow-up-right icon and sr-only "(opens in a new tab)".

<ComponentPreview
  styleName="aria-rhea"
  name="trace-link"
  previewClassName="h-auto"
/>

```tsx showLineNumbers
<a href="https://docs.astro.build" target="_blank" rel="noreferrer">
  <TraceLine>
    <TraceTitle>
      Install Astro
      <span className="sr-only"> (opens in a new tab)</span>
    </TraceTitle>
    <TraceIcon>
      <ArrowUpRightIcon />
    </TraceIcon>
  </TraceLine>
</a>
```

## Dialog

Wrap the `TraceLine` in the dialog's trigger. The dialog owns its open state, Escape and focus return.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-dialog"
  previewClassName="h-auto"
/>

```tsx showLineNumbers
<DialogTrigger>
  <Button>
    <TraceLine>
      <TraceTitle>Searched the web for cache keys</TraceTitle>
      <TraceIcon>
        <ChevronRightIcon />
      </TraceIcon>
    </TraceLine>
  </Button>
  <Dialog>…</Dialog>
</DialogTrigger>
```

**Note:** `Button` is React Aria's `Button`. `DialogTrigger` needs a pressable child, and a plain `button` or a `TraceLine` is not one. React Aria's `Button` is a client component, so the file needs `"use client"`.

## Sheet

The same shape as the dialog. Popover works the same way. Drawer is a Base UI drawer, so its trigger wraps the line directly: `<Drawer><DrawerTrigger><TraceLine>…</TraceLine></DrawerTrigger><DrawerContent>…</DrawerContent></Drawer>`.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-sheet"
  previewClassName="h-auto"
/>

## Group

Put rows that sit next to each other in a `Trace`. It also styles any trigger or link that wraps a `TraceLine`.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-group"
  previewClassName="h-auto"
/>

## Sources

A collapsible row whose detail is a `Trace` of link rows.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-sources"
  previewClassName="h-auto"
/>

See [Sources](/docs/ai-elements/aria/sources) for more examples.

## Chain of Thought

A chain of thought is a collapsible row with step rows inside. Set the parent's status and title from its children.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-steps"
  previewClassName="h-auto"
/>

See [Chain of Thought](/docs/ai-elements/aria/chain-of-thought) and [Task](/docs/ai-elements/aria/task) for more examples.

## Commit

A commit is a collapsible row with a line for each changed file. Say what changed in the title, Added, Edited or Deleted, and put the line counts in the description. Each file opens its diff in a [Sheet](#sheet).

<ComponentPreview
  styleName="aria-rhea"
  name="trace-commit"
  previewClassName="h-auto"
/>

## Whole Turn

Three levels: the turn, a summary, and the rows. Text between steps sits between two `Trace` lists.

<ComponentPreview
  styleName="aria-rhea"
  name="trace-turn"
  previewClassName="h-auto"
/>

## Reasoning

Render a `reasoning` part from the AI SDK. The row is a `TraceLine` until the first text arrives. See [Open State](#open-state).

<ComponentPreview
  styleName="aria-rhea"
  name="trace-thinking"
  previewClassName="h-auto"
/>

See [Reasoning](/docs/ai-elements/aria/reasoning) for more examples.

## Tool

Render tool parts from the AI SDK. Map the tool part as in [Tool](/docs/ai-elements/aria/tool#states).

<ComponentPreview
  styleName="aria-rhea"
  name="trace-tool-calls"
  previewClassName="h-auto"
/>

See [Tool](/docs/ai-elements/aria/tool) for more examples.

## Accessibility

`Trace` adds no roles of its own. Each line gets its semantics from the element that wraps it.

- A `TraceLine` on its own is a `span`. It is read as text and is not a tab stop.
- Wrap it in a `TraceCollapsibleTrigger` and it becomes a button with `aria-expanded`. Wrap it in a link, or in the trigger for a dialog or sheet, and it takes the keyboard and focus behavior of that element.
- `TraceIcon` is hidden from assistive tech, so `TraceTitle` is the accessible name. Write it as a sentence that says what happened, like "Edited trace.tsx", not just "trace.tsx".
- When a link opens a new tab, add "(opens in a new tab)" to the title with `sr-only`.
- Status is shown with color and motion, so put it in the title too. Write "Running pnpm build" while it runs and "Failed to run pnpm build" when it errors.
- The shimmer on a running title stops when the reader prefers reduced motion. The title still says what is happening.
- Inside a [Message Scroller](/docs/components/aria/message-scroller), each line is announced once when it is added.
- `TraceCollapsibleContent` mutes its text. If you put a block with a muted background inside it, give the block `text-foreground` so it keeps its contrast. `CodeBlock` sets its own text color.

## API Reference

### Trace

A list of rows. It also styles any trigger or link that wraps a `TraceLine`.

| Prop        | Type     | Default | Description                              |
| ----------- | -------- | ------- | ---------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the list. |

### TraceLine

One line: an icon and a title. It is a span, so it is not a button or a tab stop. Wrap it in a trigger or a link to make it do something.

| Prop        | Type                                | Default | Description                              |
| ----------- | ----------------------------------- | ------- | ---------------------------------------- |
| `status`    | `"running" \| "error" \| "pending"` | -       | The state of the work the line reports.  |
| `className` | `string`                            | -       | Additional classes to apply to the line. |

### TraceIcon

A decorative icon slot, hidden from assistive tech. Before the title it names the action; after it, it is the indicator.

| Prop        | Type     | Default | Description                                   |
| ----------- | -------- | ------- | --------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the icon slot. |

### TraceTitle

One sentence on one line. It truncates and shimmers while the line is running.

| Prop        | Type     | Default | Description                               |
| ----------- | -------- | ------- | ----------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the title. |

### TraceDescription

Secondary text after the title, such as a count or a duration. It does not truncate.

| Prop        | Type     | Default | Description                                     |
| ----------- | -------- | ------- | ----------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the description. |

### TraceCollapsible

A row that expands. It accepts the props of [`Collapsible`](/docs/components/aria/collapsible). `className` takes a string only.

| Prop               | Type                            | Default | Description                                                 |
| ------------------ | ------------------------------- | ------- | ----------------------------------------------------------- |
| `isExpanded`       | `boolean`                       | -       | The controlled open state. Pass it with `onExpandedChange`. |
| `defaultExpanded`  | `boolean`                       | `false` | Whether the row starts open.                                |
| `onExpandedChange` | `(isExpanded: boolean) => void` | -       | Called when the open state changes.                         |
| `className`        | `string`                        | -       | Additional classes to apply to the row.                     |

### TraceCollapsibleTrigger

The button that opens and closes the row. Put a `TraceLine` inside it. It adds a chevron after the line.

| Prop        | Type     | Default | Description                                 |
| ----------- | -------- | ------- | ------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the trigger. |

### TraceCollapsibleContent

The detail of a row that expands.

| Prop        | Type     | Default | Description                                 |
| ----------- | -------- | ------- | ------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the content. |
