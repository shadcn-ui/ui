---
title: Test Results
description: Displays a test run by the agent, with its suites and failures.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-rhea"
  name="test-results-demo"
  previewClassName="h-auto"
/>

Test Results is a test run by the agent. The summary line counts what passed and failed. Open it to see each suite, its tests, and the error for each failure.

Test Results is built with `Trace` with a `TraceCollapsible` for the run and for each suite.

## Installation

Test Results is built with the [Trace](/docs/components/radix/trace) and [Code Block](/docs/components/radix/code-block) components.

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
      <TraceLine status="error">
        <TraceIcon>
          <FlaskConicalIcon />
        </TraceIcon>
        <TraceTitle>Ran 2 tests, 1 failed</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CheckIcon />
          </TraceIcon>
          <TraceTitle>creates a user</TraceTitle>
        </TraceLine>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <XIcon />
              </TraceIcon>
              <TraceTitle>updates a user profile</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                Expected status 200, received 500
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Suites

Group tests by file. Each suite is a collapsible line with a `Trace` of its tests. Open the suites that have a failure.

<ComponentPreview
  styleName="radix-rhea"
  name="test-results-suites"
  previewClassName="h-auto"
/>

```tsx showLineNumbers
<TraceCollapsible defaultOpen={failed > 0}>
  <TraceCollapsibleTrigger>
    <TraceLine status={failed > 0 ? "error" : undefined}>
      <TraceIcon>
        <FileCodeIcon />
      </TraceIcon>
      <TraceTitle>user-api.test.ts, 14 tests, 2 failed</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>
    <Trace>…</Trace>
  </TraceCollapsibleContent>
</TraceCollapsible>
```

## AI SDK

Run the tests as a tool and render its output. The tool states map the same way as in [Tool](/docs/ai-elements/radix/tool#states).

```tsx showLineNumbers
const tests = part.output.suites.flatMap((suite) => suite.tests)
const failed = tests.filter((test) => test.status === "failed").length

return (
  <TraceCollapsible defaultOpen={failed > 0}>
    <TraceCollapsibleTrigger>
      <TraceLine status={failed > 0 ? "error" : undefined}>
        <TraceIcon>
          <FlaskConicalIcon />
        </TraceIcon>
        <TraceTitle>
          Ran {tests.length} tests{failed > 0 && `, ${failed} failed`}
        </TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>…</TraceCollapsibleContent>
  </TraceCollapsible>
)
```

## Migrating from AI SDK Elements

If you added Test Results from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/test-results.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace and Code Block. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/test-results.tsx from AI SDK Elements to the shadcn/ui Trace and Code Block components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace code-block
2. Read https://ui.shadcn.com/docs/ai-elements/radix/test-results.md and build Test Results the same way.
3. Rebuild each part:
   - Import CodeBlock and CodeBlockContent from @/components/ui/code-block, not from ./code-block.
   - TestResults renders a Trace with a TraceCollapsible. Keep summary.
   - TestResultsHeader renders a TraceCollapsibleTrigger with a TraceLine, and TestResultsSummary a TraceTitle with the counts, like "Ran 42 tests, 2 failed". Set status="error" when a test failed.
   - TestResultsContent renders a TraceCollapsibleContent with a Trace for the suites.
   - TestSuite renders a TraceCollapsible, open when it has a failure. TestSuiteName renders a TraceCollapsibleTrigger with a TraceLine, and TestSuiteContent a TraceCollapsibleContent with a Trace for the tests.
   - Test renders a TraceLine with a TraceTitle for its name. Set status="error" when it failed.
   - TestError renders a CodeBlock with size="sm", with TestErrorMessage and TestErrorStack in a CodeBlockContent.
   - Keep TestResultsDuration, TestResultsProgress, TestSuiteStats, TestName, TestDuration and TestStatus as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/radix/trace#api-reference).
