---
title: Context
description: How much of the context window the conversation has used.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="context-demo"
  previewClassName="h-auto"
/>

Context shows how much of the model's context window the conversation has used. It is a [Hover Card](/docs/components/base/hover-card) with a [Progress](/docs/components/base/progress) bar.

## Installation

Context is built with the [Hover Card](/docs/components/base/hover-card) and [Progress](/docs/components/base/progress) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add hover-card progress
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add hover-card progress
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="hover-card"
  title="components/ui/hover-card.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
<HoverCard>
  <HoverCardTrigger
    delay={10}
    closeDelay={100}
    render={<Button variant="outline" size="sm" />}
  >
    {percent}% context
  </HoverCardTrigger>
  <HoverCardContent className="flex w-64 flex-col gap-3">
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="font-medium">Context</span>
      <span className="text-muted-foreground">
        {used} / {limit}
      </span>
    </div>
    <Progress value={percent} aria-label="Context used" />
  </HoverCardContent>
</HoverCard>
```

## AI SDK

Read usage from the metadata on the agent's message. `messageMetadata` runs when the stream finishes.

```ts showLineNumbers title="app/api/chat/route.ts"
return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === "finish") {
      return { usage: part.totalUsage }
    }
  },
})
```

```tsx showLineNumbers
const usage = message.metadata?.usage
const used = (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0)
const percent = Math.round((used / limit) * 100)
```

`limit` is the model's context window. The AI SDK does not send it, so set it from the model you use.

## Migrating from AI SDK Elements

If you added Context from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/context.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Hover Card and Progress. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/context.tsx from AI SDK Elements to the shadcn/ui Hover Card and Progress components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add hover-card progress button
2. Read https://ui.shadcn.com/docs/ai-elements/base/context.md and build Context the same way.
3. Rebuild each part:
   - Context renders a HoverCard. Keep usedTokens, maxTokens, usage and modelId in its context.
   - ContextTrigger renders a HoverCardTrigger with render={<Button variant="outline" size="sm" />}, showing the percent used. Set delay and closeDelay on the trigger.
   - ContextContent renders a HoverCardContent.
   - ContextContentHeader renders the used and max tokens, and a Progress with aria-label="Context used".
   - Keep ContextContentBody, ContextContentFooter and the usage parts as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
