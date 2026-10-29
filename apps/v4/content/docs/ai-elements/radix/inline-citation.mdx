---
title: Inline Citation
description: A source in the sentence that opens on hover.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-rhea"
  name="inline-citation-demo"
  previewClassName="h-auto"
/>

Inline Citation is a source that sits in the sentence it supports. It is a [Hover Card](/docs/components/radix/hover-card) on a [Button](/docs/components/radix/button).

To show a list of sources after the reply, use [Sources](/docs/ai-elements/radix/sources).

## Installation

Inline Citation is built with the [Hover Card](/docs/components/radix/hover-card) and [Button](/docs/components/radix/button) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add hover-card button
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add hover-card button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="hover-card"
  title="components/ui/hover-card.tsx"
  styleName="radix-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
<HoverCard openDelay={10} closeDelay={100}>
  <HoverCardTrigger asChild>
    <Button variant="secondary" size="xs">
      {hostname}
    </Button>
  </HoverCardTrigger>
  <HoverCardContent className="flex w-64 flex-col gap-1">
    <div className="font-medium">{title}</div>
    <a href={url} target="_blank" rel="noreferrer">
      {hostname}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  </HoverCardContent>
</HoverCard>
```

## AI SDK

A `source-url` part is the citation. Set `sendSources: true` on `toUIMessageStreamResponse()`, or write the part yourself.

```ts showLineNumbers title="app/api/chat/route.ts"
writer.write({
  type: "source-url",
  sourceId: "shadcn",
  url: "https://ui.shadcn.com",
  title: "shadcn/ui",
})
```

```tsx showLineNumbers
const sources = message.parts.filter((part) => part.type === "source-url")
```

`title` is optional. Fall back to the URL's hostname.

## Migrating from AI SDK Elements

If you added Inline Citation from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/inline-citation.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Hover Card and Button. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/inline-citation.tsx from AI SDK Elements to the shadcn/ui Hover Card and Button components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add hover-card button
2. Read https://ui.shadcn.com/docs/ai-elements/radix/inline-citation.md and build Inline Citation the same way.
3. Rebuild each part:
   - InlineCitationCard renders a HoverCard with openDelay and closeDelay.
   - InlineCitationCardTrigger renders a HoverCardTrigger with asChild and a Button with variant="secondary" and size="xs" instead of a Badge, so it can take keyboard focus.
   - InlineCitationCardBody renders a HoverCardContent.
   - InlineCitationSource renders the title and a link to the URL that opens in a new tab, with "(opens in a new tab)" in an sr-only span.
   - Keep InlineCitation, InlineCitationText, InlineCitationQuote and the carousel parts as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
