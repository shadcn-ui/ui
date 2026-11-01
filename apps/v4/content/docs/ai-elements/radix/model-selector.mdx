---
title: Model Selector
description: Two menus. One picks the model the agent runs, the other picks how hard it thinks.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-rhea"
  name="model-selector-demo"
  previewClassName="h-auto"
/>

## Installation

Model Selector is built with the [Dropdown Menu](/docs/components/radix/dropdown-menu) and [Input Group](/docs/components/radix/input-group) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add dropdown-menu input-group
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add dropdown-menu input-group
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="dropdown-menu"
  title="components/ui/dropdown-menu.tsx"
  styleName="radix-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { ArrowUpIcon, ChevronDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
```

```tsx showLineNumbers
<InputGroup>
  <InputGroupTextarea placeholder="Ask the agent to change your code..." />
  <InputGroupAddon align="block-end">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton size="sm">
          GPT-5
          <ChevronDownIcon />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>OpenAI</DropdownMenuLabel>
            <DropdownMenuRadioItem value="gpt-5">GPT-5</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="gpt-5-mini">
              GPT-5 mini
            </DropdownMenuRadioItem>
          </DropdownMenuGroup>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton size="sm">
          Medium
          <ChevronDownIcon />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={effort} onValueChange={setEffort}>
          <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    <InputGroupButton type="submit" variant="default" className="ml-auto">
      <ArrowUpIcon />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## AI SDK

Send the model and the effort with the message. Map them to a model and provider options in the route.

```tsx showLineNumbers
sendMessage({ text }, { body: { model, effort } })
```

```ts showLineNumbers title="app/api/chat/route.ts"
import { anthropic } from "@ai-sdk/anthropic"
import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

const models = {
  "gpt-5": openai("gpt-5"),
  "gpt-5-mini": openai("gpt-5-mini"),
  "claude-sonnet-4-5": anthropic("claude-sonnet-4-5"),
  "claude-haiku-4-5": anthropic("claude-haiku-4-5"),
}

export async function POST(req: Request) {
  const { messages, model, effort } = (await req.json()) as {
    messages: UIMessage[]
    model: keyof typeof models
    effort: "low" | "medium" | "high"
  }

  const result = streamText({
    model: models[model] ?? models["gpt-5"],
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: { reasoningEffort: effort },
      anthropic: { effort },
    },
  })

  return result.toUIMessageStreamResponse()
}
```

Each provider reads its own key in `providerOptions` and ignores the rest.

## Migrating from AI SDK Elements

If you added Model Selector from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/model-selector.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Dropdown Menu. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/model-selector.tsx from AI SDK Elements to the shadcn/ui Dropdown Menu component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Dropdown Menu: npx shadcn@latest add dropdown-menu
2. Read https://ui.shadcn.com/docs/ai-elements/radix/model-selector.md and build Model Selector the same way.
3. Rebuild each part:
   - ModelSelector renders a DropdownMenu, instead of a Dialog. ModelSelectorTrigger renders a DropdownMenuTrigger with asChild.
   - ModelSelectorContent renders a DropdownMenuContent, and ModelSelectorList a DropdownMenuRadioGroup with the selected model as its value.
   - ModelSelectorGroup renders a DropdownMenuGroup with a DropdownMenuLabel for its heading.
   - ModelSelectorItem renders a DropdownMenuRadioItem. Picking a model closes the menu.
   - ModelSelectorSeparator renders a DropdownMenuSeparator, and ModelSelectorShortcut a DropdownMenuShortcut.
   - A menu has no search field. Keep ModelSelectorInput, ModelSelectorEmpty and ModelSelectorDialog on Command if you use search, or remove them if nothing imports them.
   - Keep ModelSelectorLogo, ModelSelectorLogoGroup and ModelSelectorName as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
