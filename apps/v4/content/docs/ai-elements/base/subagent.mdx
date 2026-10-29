---
title: Subagent
description: Displays a subagent run, with its tool calls and result.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="subagent-demo"
  previewClassName="h-auto"
/>

Subagent is a line for work the agent hands to a subagent. The run is the title, like "Ran the research agent". Open it for the tool calls the subagent made and what it found.

Subagent is built with `Trace` with a `TraceCollapsible` for the run and a nested `Trace` for its tool calls.

## Installation

Subagent is built with the [Trace](/docs/components/base/trace), [Code Block](/docs/components/base/code-block) and [Badge](/docs/components/base/badge) components.

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
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Ran the research agent</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted className="flex flex-col gap-3">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
        </TraceLine>
      </Trace>
      <p>The cache is keyed on the commit SHA.</p>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Running

While the subagent runs, the line has `status="running"` and its content shows the tool calls so far. Add the result when the subagent finishes.

<ComponentPreview
  styleName="base-rhea"
  name="subagent-running"
  previewClassName="h-auto"
/>

## Details

Put the task the subagent was given at the top of the content, with its model and tools as [Badge](/docs/components/base/badge) items. Show how long it ran in a `TraceDescription` after the title.

<ComponentPreview
  styleName="base-rhea"
  name="subagent-details"
  previewClassName="h-auto"
/>

## AI SDK

With the AI SDK, a subagent is a tool whose `execute` yields the subagent's `UIMessage` as it streams. Render the tool part as the line and `part.output.parts` as the nested `Trace`. Map each nested tool part as in [Tool](/docs/ai-elements/base/tool#states).

Each yield is a preliminary output: the part is `output-available` with `preliminary: true`. The final output replaces it, so check `preliminary` before you show "Ran".

| Tool part state                                         | `TraceLine` status                 | Title           |
| ------------------------------------------------------- | ---------------------------------- | --------------- |
| `input-streaming`, `input-available`                    | `"running"` while the chat streams | Running …       |
| `output-available` with `preliminary: true`             | `"running"` while the chat streams | Running …       |
| `output-available`                                      | none                               | Ran …           |
| `output-error`, or a running state after the chat stops | `"error"`                          | Failed to run … |

## Migrating from AI SDK Elements

If you added Agent from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/agent.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace, Code Block and Badge. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/agent.tsx from AI SDK Elements to the shadcn/ui Trace, Code Block and Badge components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace code-block badge
2. Read https://ui.shadcn.com/docs/ai-elements/base/subagent.md and build Subagent the same way.
3. Rebuild each part:
   - Import CodeBlock and CodeBlockContent from @/components/ui/code-block, not from ./code-block.
   - Agent renders a Trace with a TraceCollapsible.
   - AgentHeader renders a TraceCollapsibleTrigger with a TraceLine, a TraceIcon and a TraceTitle with the name, like "Ran the research agent". Show model in a Badge.
   - AgentContent renders a TraceCollapsibleContent with keepMounted.
   - AgentTools renders a Trace, and AgentTool a TraceLine for each tool call, instead of an Accordion.
   - Keep AgentInstructions and AgentOutput, with AgentOutput on CodeBlock.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
