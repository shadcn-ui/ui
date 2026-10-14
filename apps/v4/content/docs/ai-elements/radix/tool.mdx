---
title: Tool
description: Displays a tool call the agent makes, from input to output.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-rhea"
  name="tool-demo"
  previewClassName="h-auto"
/>

Tool is a tool call the agent makes, such as running a command or reading a file. The line follows the call from input to output, including errors and calls that wait for approval.

Tool is built with `Trace` with a `TraceCollapsible` for each call that has output.

## Installation

Tool is built with the [Trace](/docs/components/radix/trace) and [Code Block](/docs/components/radix/code-block) components.

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
        <TraceTitle>Ran git status --short</TraceTitle>
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

## States

Trace does not read tool parts. Map each part's `state` to a `status` and a title.

<ComponentPreview
  styleName="radix-rhea"
  name="tool-states"
  previewClassName="h-auto"
/>

| Tool part state                                           | `status`                             | Title                                                                |
| --------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| `input-streaming`, `input-available`                      | `"running"` while the chat streams   | Running …                                                            |
| `input-streaming`, `input-available` after the chat stops | `"error"`                            | Failed to run …                                                      |
| `approval-requested`                                      | -                                    | Not a line. An `Item` outside `Trace` with Approve and Deny buttons. |
| `approval-responded`                                      | `"running"` if approved, none if not | Running … if approved, Denied … if not                               |
| `output-available`                                        | none                                 | Ran …                                                                |
| `output-error`                                            | `"error"`                            | Failed to run …                                                      |
| `output-denied`                                           | none                                 | Denied …                                                             |

A tool is a plain `TraceLine` while it runs, and a `TraceCollapsible` once its output arrives.

```tsx showLineNumbers
function ToolLine({ part, streaming }: { part: ToolPart; streaming: boolean }) {
  const command = part.input?.command

  if (
    part.state === "output-denied" ||
    (part.state === "approval-responded" && !part.approval.approved)
  ) {
    return (
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Denied {command}</TraceTitle>
      </TraceLine>
    )
  }

  if (part.state === "output-available" || part.state === "output-error") {
    const failed = part.state === "output-error"

    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status={failed ? "error" : undefined}>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>
              {failed ? "Failed to run" : "Ran"} {command}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {failed ? part.errorText : part.output.stdout}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine status={streaming ? "running" : "error"}>
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {streaming ? "Running" : "Failed to run"} {command}
      </TraceTitle>
    </TraceLine>
  )
}
```

```tsx showLineNumbers
<Trace>
  {message.parts
    .filter((part) => part.type === "tool-runCommand")
    .map((part) => (
      <ToolLine key={part.toolCallId} part={part} streaming={streaming} />
    ))}
</Trace>
```

A tool that runs on the client stays `input-available` after the chat stops until you call `addToolOutput`. Treat it as waiting, not failed.

## Output in a Sheet

For long output, wrap the `TraceLine` in a `SheetTrigger` and show the output in the sheet.

<ComponentPreview
  styleName="radix-rhea"
  name="tool-sheet"
  previewClassName="h-auto"
/>

See [Trace](/docs/components/radix/trace#dialog).

## Approval

A pending approval is a question for the person, not a step the agent took, so it sits outside `Trace` as an `Item`. Once the person answers, the tool goes back to being a line. See [Confirmation](/docs/ai-elements/radix/confirmation).

<ComponentPreview
  styleName="radix-rhea"
  name="tool-approval"
  previewClassName="h-auto"
/>

```tsx showLineNumbers
if (part.state === "approval-requested") {
  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <TerminalIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Run {part.input.command}?</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            addToolApprovalResponse({ id: part.approval.id, approved: false })
          }
        >
          Deny
        </Button>
        <Button
          size="sm"
          onClick={() =>
            addToolApprovalResponse({ id: part.approval.id, approved: true })
          }
        >
          Approve
        </Button>
      </ItemActions>
    </Item>
  )
}
```

Pass `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses` to `useChat` so the chat continues once every approval has an answer.

## Migrating from AI SDK Elements

If you added Tool from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/tool.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace and Code Block. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/tool.tsx from AI SDK Elements to the shadcn/ui Trace and Code Block components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace code-block
2. Read https://ui.shadcn.com/docs/ai-elements/radix/tool.md and build Tool the same way.
3. Rebuild each part:
   - Import CodeBlock and CodeBlockContent from @/components/ui/code-block, not from ./code-block.
   - Tool renders a Trace with a TraceCollapsible.
   - ToolHeader renders a TraceCollapsibleTrigger with a TraceLine, a TraceIcon and a TraceTitle, instead of a status Badge. Map state to the status and title: "running" and "Running …" while the input streams or is available, no status and "Ran …" for output-available, "error" and "Failed to run …" for output-error, and "Denied …" for output-denied.
   - ToolContent renders a TraceCollapsibleContent.
   - ToolInput and ToolOutput render a CodeBlock with size="sm" and a CodeBlockContent. ToolOutput shows errorText when the tool failed.
   - Keep getStatusBadge and ToolPart exported, even if nothing renders the badge.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/radix/trace#api-reference).
