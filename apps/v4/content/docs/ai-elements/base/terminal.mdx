---
title: Terminal
description: Displays a command the agent runs, with its output as it streams.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="terminal-demo"
  previewClassName="h-auto"
/>

Terminal is a shell command the agent runs, such as a lint, a test run or a build. The line shows the command, and its output streams in underneath while it runs.

Terminal is built with `Trace` with a `TraceCollapsible` for each command.

## Installation

Terminal is built with the [Trace](/docs/components/base/trace) and [Code Block](/docs/components/base/code-block) components.

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
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
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
        <TraceTitle>Ran pnpm build</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <CodeBlock size="sm">
        <CodeBlockContent wrap className="max-h-64">
          {output}
        </CodeBlockContent>
      </CodeBlock>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Exit Code

A command that exits with any code other than `0` failed. Set `status="error"`.

<ComponentPreview
  styleName="base-rhea"
  name="terminal-error"
  previewClassName="h-auto"
/>

| Command                  | `status`    | Title                        |
| ------------------------ | ----------- | ---------------------------- |
| Running                  | `"running"` | Running pnpm build           |
| Exited with `0`          | none        | Ran pnpm build               |
| Exited with another code | `"error"`   | pnpm lint exited with code 1 |

The command is a tool call, so its states map the same way as in [Tool](/docs/ai-elements/base/tool#states).

## Open While Running

Open the line once the first output arrives, so the output is visible while the command runs. Leave it open or closed after that, as in [Trace](/docs/components/base/trace#open-state).

## AI SDK

A tool result arrives only once the command exits. To stream the output while it runs, write it from the tool as a data part with the tool call's id. The AI SDK replaces a data part that has the same id, so the output grows in place.

```ts showLineNumbers
writer.write({
  type: "data-terminal",
  id: toolCallId,
  data: { output },
})
```

On the client, find the data part that matches each tool part.

```tsx showLineNumbers
function getOutput(message: ChatMessage, toolCallId: string) {
  for (const part of message.parts) {
    if (part.type === "data-terminal" && part.id === toolCallId) {
      return part.data.output
    }
  }

  return ""
}
```

## Migrating from AI SDK Elements

If you added Terminal from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/terminal.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace and Code Block. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/terminal.tsx from AI SDK Elements to the shadcn/ui Trace and Code Block components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace code-block
2. Read https://ui.shadcn.com/docs/ai-elements/base/terminal.md and build Terminal the same way.
3. Rebuild each part:
   - Import CodeBlock and CodeBlockContent from @/components/ui/code-block, not from ./code-block.
   - Terminal renders a Trace with a TraceCollapsible. Keep output, isStreaming, autoScroll and onClear.
   - TerminalHeader renders a TraceCollapsibleTrigger with a TraceLine. Set status="running" while isStreaming is true.
   - TerminalTitle renders a TraceIcon with a TerminalIcon and a TraceTitle, like "Ran pnpm build".
   - TerminalContent renders a TraceCollapsibleContent with a CodeBlock with size="sm", and a CodeBlockContent with wrap and className="max-h-64" for the output.
   - Open the line once output arrives while the command runs.
   - Buttons cannot sit inside a trigger. Render TerminalStatus, TerminalActions and the copy and clear buttons next to the TraceCollapsibleTrigger, not inside it.
4. Remove ansi-to-react from the dependencies if nothing else uses it.
5. Remove the imports the file no longer uses.
6. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
