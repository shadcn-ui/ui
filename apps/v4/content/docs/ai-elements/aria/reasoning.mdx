---
title: Reasoning
description: Displays the agent's thinking as it streams.
base: aria
component: true
---

<ComponentPreview
  styleName="aria-rhea"
  name="reasoning-demo"
  previewClassName="h-auto"
/>

Reasoning is a line for the agent's thinking. It reads "Thinking" and opens while the model thinks, then reads "Thought" and closes when it is done. The thinking itself sits inside, and the line can show how long it took.

Reasoning is built with `Trace` with a `TraceCollapsible` for the thinking.

## Installation

Reasoning is built with the [Trace](/docs/components/aria/trace) component.

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
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Thought</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent className="whitespace-pre-wrap">
      {text}
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Duration

The AI SDK does not time reasoning. Measure it on the server, send it as message metadata, and show it in a `TraceDescription` after the title.

<ComponentPreview
  styleName="aria-rhea"
  name="reasoning-duration"
  previewClassName="h-auto"
/>

```tsx showLineNumbers
<TraceLine>
  <TraceIcon>
    <CircleCheckIcon />
  </TraceIcon>
  <TraceTitle>Thought</TraceTitle>
  <TraceDescription>{seconds}s</TraceDescription>
</TraceLine>
```

## AI SDK

Render each `reasoning` part as a line. It starts as a plain `TraceLine` and becomes a `TraceCollapsible` once text arrives, so there is nothing to open before the model has written anything. It opens while the model thinks and closes when it finishes. If the person opens or closes it, their choice wins. See [Open State](/docs/components/aria/trace#open-state).

```tsx showLineNumbers
function ReasoningLine({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>()

  const line = (
    <TraceLine status={running ? "running" : undefined}>
      <TraceIcon>
        {running ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleCheckIcon />
        )}
      </TraceIcon>
      <TraceTitle>{running ? "Thinking" : "Thought"}</TraceTitle>
    </TraceLine>
  )

  if (text.length === 0) {
    return line
  }

  return (
    <TraceCollapsible isExpanded={open ?? running} onExpandedChange={setOpen}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
```

```tsx showLineNumbers
<Trace>
  {message.parts
    .filter((part) => part.type === "reasoning")
    .map((part, index) => (
      <ReasoningLine
        key={index}
        text={part.text}
        running={streaming && part.state === "streaming"}
      />
    ))}
</Trace>
```

Some models send several reasoning parts in one message. Each one is a line in the same `Trace`.

## Migrating from AI SDK Elements

If you added Reasoning from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/reasoning.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/reasoning.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/aria/reasoning.md and build Reasoning the same way.
3. Rebuild each part:
   - Reasoning renders a Trace with a TraceCollapsible. Keep isStreaming, open, defaultOpen, onOpenChange and duration, and the useReasoning context. Pass open, defaultOpen and onOpenChange to the TraceCollapsible as isExpanded, defaultExpanded and onExpandedChange.
   - ReasoningTrigger renders a TraceCollapsibleTrigger with a TraceLine, a TraceIcon and a TraceTitle. Set status="running" while isStreaming is true, instead of the Shimmer. The title reads "Thinking" while it streams, then the duration, like "Thought for 5s".
   - ReasoningContent renders a TraceCollapsibleContent. Keep Streamdown for the text.
   - Keep the open behavior: open while it streams, close when it finishes, unless the person opened or closed it.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/aria/trace#api-reference).
