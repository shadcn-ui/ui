---
title: Message
description: One turn. The person's message, and the agent's reply with its actions.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="message-pattern"
  previewClassName="h-auto"
/>

Use Message for one turn in a thread. The person's text is a [Bubble](/docs/components/base/bubble) on a [Message](/docs/components/base/message) with `align="end"`. The agent's reply is markdown on a Message, with actions under it. A thread of these turns is [Chat](/docs/ai-elements/base/chat).

## Installation

Message is built with the [Message](/docs/components/base/message), [Bubble](/docs/components/base/bubble), and [Tooltip](/docs/components/base/tooltip) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add message bubble tooltip
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add message bubble tooltip
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="message"
  title="components/ui/message.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { CopyIcon } from "lucide-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageContent, MessageFooter } from "@/components/ui/message"
```

```tsx showLineNumbers
<Message align="end">
  <MessageContent>
    <Bubble align="end" variant="muted">
      <BubbleContent>How do I add a settings dialog?</BubbleContent>
    </Bubble>
  </MessageContent>
</Message>
<Message>
  <MessageContent className="gap-2">
    <p>Install Dialog, then open it from the gear button.</p>
    <MessageFooter>
      <Button variant="ghost" size="icon-sm" aria-label="Copy">
        <CopyIcon />
      </Button>
    </MessageFooter>
  </MessageContent>
</Message>
```

See [Message](/docs/components/base/message).

## Actions

Put actions in `MessageFooter`. It follows the message alignment, so on the person's turn the actions sit on the right. Use ghost icon buttons with a tooltip for each.

- **Copy** writes the reply to the clipboard and swaps to a check for two seconds.
- **Good response** and **Bad response** are toggles. Set `aria-pressed` so screen readers announce the state.
- **Retry** runs the turn again.
- **Edit** on the person's turn puts the text back in the field.

## Markdown

The reply streams as markdown. Render it with [Streamdown](https://streamdown.ai) and route fenced code to a [Code Block](/docs/components/base/code-block#markdown), so code in the reply gets line numbers and a copy button.

## AI SDK

Branch on the message role. The person's turn is the bubble. The agent's turn is the reply, and `regenerate` with the message id runs it again.

```tsx showLineNumbers
const { messages, regenerate } = useChat()

if (message.role === "user") {
  return (
    <Message align="end">
      <MessageContent>
        <Bubble align="end" variant="muted">
          <BubbleContent>{text}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

return (
  <Message>
    <MessageContent className="gap-2">
      <Markdown>{text}</Markdown>
      <MessageFooter>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Retry"
          onClick={() => regenerate({ messageId: message.id })}
        >
          <RefreshCcwIcon />
        </Button>
      </MessageFooter>
    </MessageContent>
  </Message>
)
```

## Migrating from AI SDK Elements

If you added Message from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/message.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Message, Bubble and Tooltip. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/message.tsx from AI SDK Elements to the shadcn/ui Message, Bubble and Tooltip components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add message bubble tooltip
2. Read https://ui.shadcn.com/docs/ai-elements/base/message.md and build Message the same way.
3. Rebuild each part:
   - This file exports Message and MessageContent too, so import the shadcn/ui parts under other names, like MessageRoot and MessageBody.
   - Message renders the shadcn/ui Message, with align="end" when from is "user". Pass from down in a context.
   - MessageContent renders the shadcn/ui MessageContent. For the person's messages, wrap the children in a Bubble with align="end" and variant="muted".
   - MessageActions renders a MessageFooter.
   - MessageAction renders a Button with variant="ghost" and size="icon-sm" in a Tooltip, with its label as the aria-label.
   - Keep MessageResponse on Streamdown, and keep the branch parts and MessageToolbar as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
