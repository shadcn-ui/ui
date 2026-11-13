---
title: Stack Trace
description: Displays a failed tool call and its stack frames.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-rhea"
  name="stack-trace-demo"
  previewClassName="h-auto"
/>

Stack Trace is a line for a tool call that failed. The error is the title, like "Failed: TypeError". Open it for the stack frames, which can link to the file and line.

Stack Trace is built with `Trace` with a `TraceCollapsible` for the frames.

## Installation

Stack Trace is built with the [Trace](/docs/components/radix/trace) and [Code Block](/docs/components/radix/code-block) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add trace code-block
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible code-block
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="trace"
  title="components/ui/trace.tsx"
  styleName="radix-rhea"
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
const [error, ...frames] = stack.split("\n").map((line) => line.trim())

<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine status="error">
        <TraceIcon>
          <CircleXIcon />
        </TraceIcon>
        <TraceTitle>Failed: {error}</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <div className="flex flex-col gap-2 rounded-md bg-muted p-3 font-mono text-xs">
        <p className="text-destructive">{error}</p>
        <ol>
          {frames.map((frame, index) => (
            <li
              key={index}
              className={
                frame.includes("node_modules") ? undefined : "text-foreground"
              }
            >
              {frame}
            </li>
          ))}
        </ol>
      </div>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

The title truncates, so repeat the full error at the top of the content. Frames from `node_modules` stay muted, so your own frames stand out.

## Frame Links

Turn your own frames into links that open the file at the line. Fold the framework frames into a collapsible line of their own, so the frames you can fix come first.

<ComponentPreview
  styleName="radix-rhea"
  name="stack-trace-frames"
  previewClassName="h-auto"
/>

## AI SDK

When a tool throws, its part is `output-error`. By default `errorText` is only the error message, with no frames. Return `error.stack` from `onError` in `toUIMessageStreamResponse` to send them.

```ts showLineNumbers title="app/api/chat/route.ts"
return result.toUIMessageStreamResponse({
  onError: (error) =>
    error instanceof Error ? (error.stack ?? error.message) : String(error),
})
```

A stack shows file paths from your server, so only send it in development.

```tsx showLineNumbers
if (part.state === "output-error") {
  const [error, ...frames] = part.errorText
    .split("\n")
    .map((line) => line.trim())

  return <TraceCollapsible>…</TraceCollapsible>
}
```

Map the other tool states as in [Tool](/docs/ai-elements/radix/tool#states).

## Migrating from AI SDK Elements

If you added Stack Trace from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/stack-trace.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/stack-trace.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/radix/stack-trace.md and build Stack Trace the same way.
3. Rebuild each part:
   - StackTrace renders a Trace with a TraceCollapsible. Keep trace, open, defaultOpen, onOpenChange and onFilePathClick, and the parsing.
   - StackTraceHeader renders a TraceCollapsibleTrigger with a TraceLine with status="error" and a TraceIcon.
   - StackTraceError renders a TraceTitle, like "Failed: TypeError: …". Keep StackTraceErrorType and StackTraceErrorMessage as spans inside it.
   - StackTraceContent renders a TraceCollapsibleContent.
   - StackTraceFrames renders the frames as a list in a muted, monospace block. Dim the frames from node_modules, and keep the file path buttons.
   - StackTraceExpandButton renders nothing, since the whole line opens the frames.
   - Buttons cannot sit inside a trigger. Render StackTraceActions and StackTraceCopyButton next to the TraceCollapsibleTrigger, not inside it.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/radix/trace#api-reference).
