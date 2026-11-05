---
title: Chain of Thought
description: Displays a summary that expands into the steps an agent took.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="chain-of-thought-demo"
  previewClassName="h-auto"
/>

Chain of Thought is a summary line that expands into the steps an agent took. The summary says what happened, like "Researched in 3 steps". The steps sit inside it, each one a line of its own.

Chain of Thought is built with `Trace` with a `TraceCollapsible` for the summary.

## Installation

Chain of Thought is built with the [Trace](/docs/components/base/trace), [Code Block](/docs/components/base/code-block) and [Badge](/docs/components/base/badge) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add trace code-block badge
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible code-block badge
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
        <TraceIcon>
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Researched in 3 steps</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Read the build log for dpl_8Kx2</TraceTitle>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Searched the web for next.js image cache key</TraceTitle>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Searched the code for cacheKey</TraceTitle>
        </TraceLine>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Steps

Each step is a `TraceLine`. Set its `status` and write the title in the matching tense.

| Step              | `status`    | Title                         |
| ----------------- | ----------- | ----------------------------- |
| Running           | `"running"` | Searching for …               |
| Done, with detail | none        | Searched for …                |
| Done, links out   | none        | Read the Image component docs |
| Failed            | `"error"`   | Failed to search for …        |

Add `keepMounted` to the summary's `TraceCollapsibleContent`. Steps keep their open state when the summary closes.

## Search Results

When a step runs a web search, show the results as a `Badge` for each hostname in the step's content.

```tsx showLineNumbers
<TraceCollapsibleContent className="flex flex-wrap gap-1.5">
  {results.map((result) => (
    <Badge key={result.url} variant="secondary">
      {new URL(result.url).hostname}
    </Badge>
  ))}
</TraceCollapsibleContent>
```

## AI SDK

Render each tool part as a step. `running` is true while tool parts stream and before the reply starts. Set the summary's status and title from the steps. The summary opens while the steps run, as in [Trace](/docs/components/base/trace#open-state).

```tsx showLineNumbers
const [open, setOpen] = React.useState<boolean>()
const running = streaming && !answering
const failed = steps.filter((part) => part.state === "output-error").length

<TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? "running" : failed > 0 ? "error" : undefined}>
      <TraceTitle>
        {running ? "Researching" : `Researched in ${steps.length} steps`}
      </TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent keepMounted>
    <Trace>
      {steps.map((part) => (
        <StepLine key={part.toolCallId} part={part} streaming={streaming} />
      ))}
    </Trace>
  </TraceCollapsibleContent>
</TraceCollapsible>
```

`StepLine` renders one tool part as a `TraceLine`, as in [Tool](/docs/ai-elements/base/tool#states).

## Migrating from AI SDK Elements

If you added ChainOfThought from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/chain-of-thought.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace and Badge. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/chain-of-thought.tsx from AI SDK Elements to the shadcn/ui Trace and Badge components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace badge
2. Read https://ui.shadcn.com/docs/ai-elements/base/chain-of-thought.md and build Chain of Thought the same way.
3. Rebuild each part:
   - ChainOfThought renders a Trace with a TraceCollapsible. Pass open, defaultOpen and onOpenChange to the TraceCollapsible.
   - ChainOfThoughtHeader renders a TraceCollapsibleTrigger with a TraceLine, a TraceIcon and a TraceTitle, like "Researched in 3 steps".
   - ChainOfThoughtContent renders a TraceCollapsibleContent with keepMounted, and a Trace for the steps.
   - ChainOfThoughtStep renders a TraceLine. Its icon goes in a TraceIcon, its label in a TraceTitle and its description in a TraceDescription. Map status "active" to "running", "pending" to "pending", and "complete" to no status.
   - ChainOfThoughtSearchResults renders a flex-wrap list, and ChainOfThoughtSearchResult a Badge with variant="secondary".
   - Keep ChainOfThoughtImage as it is.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
