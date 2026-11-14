---
title: Chat
description: The thread. Message Scroller keeps your place while the reply streams.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="chat-demo"
  className="rounded-[34px] sm:rounded-4xl"
  previewClassName="h-auto theme-blue p-4 min-[480px]:p-8 min-[560px]:p-10 sm:px-10 sm:pt-16 sm:pb-8"
/>

Chat is the thread of a conversation with the agent. Each turn is a [Message](/docs/ai-elements/base/message) inside [Message Scroller](/docs/components/base/message-scroller). The person's message is the scroll anchor, so a new question settles near the top and the reply streams in under it. The field is a [Prompt Input](/docs/ai-elements/base/prompt-input).

## Installation

Chat is built with the [Message Scroller](/docs/components/base/message-scroller), [Message](/docs/components/base/message), [Bubble](/docs/components/base/bubble), and [Input Group](/docs/components/base/input-group) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add message-scroller message bubble input-group
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add message-scroller message bubble input-group
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="message-scroller"
  title="components/ui/message-scroller.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
<MessageScrollerProvider autoScroll>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        <MessageScrollerItem messageId={id} scrollAnchor>
          <Message align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>{text}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageScrollerItem>
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

`scrollAnchor` goes on the person's turn. `autoScroll` follows the reply while the person stays at the live edge.

See [Message Scroller](/docs/components/base/message-scroller).

## AI SDK Helper

To build without a model, script the conversation with [`createChat`](/docs/helpers/ai-sdk). Each agent turn streams reasoning, a tool call and a reply. `chat.next()` fills the field with the next scripted message, and a string `fallback` replies once the script runs out.

```ts showLineNumbers
const chat = createChat()
  .user("Add a dark mode toggle to the settings page.")
  .assistant(({ writer }) => {
    writer.reasoning("I need to know how themes are set up first.")
    writer
      .tool("runCommand", { input: { command: "rg -l ThemeProvider app" } })
      .output({ stdout: "app/layout.tsx" })
    writer.text("next-themes is already set up, so I added a ModeToggle.")
  })

const transport = chat.transport({
  fallback:
    "This demo only knows the scripted turns. Press reset to start over.",
})

const nextMessage = chat.next(messages)
```

## Migrating from AI SDK Elements

If you added Conversation from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/conversation.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Message Scroller. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/conversation.tsx from AI SDK Elements to the shadcn/ui Message Scroller component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Message Scroller: npx shadcn@latest add message-scroller
2. Read https://ui.shadcn.com/docs/ai-elements/base/chat.md and build Chat the same way.
3. Rebuild each part:
   - Conversation renders a MessageScrollerProvider with autoScroll and a MessageScroller, instead of StickToBottom.
   - ConversationContent renders a MessageScrollerViewport and a MessageScrollerContent.
   - ConversationScrollButton renders a MessageScrollerButton.
   - Keep ConversationEmptyState, ConversationDownload and messagesToMarkdown as they are.
4. In the code that renders the thread, wrap each message in a MessageScrollerItem with its messageId, and set scrollAnchor on the person's messages. This is the only change outside the file.
5. Remove use-stick-to-bottom from the dependencies.
6. Remove the imports the file no longer uses.
7. Run the type checker and fix any errors.
```
