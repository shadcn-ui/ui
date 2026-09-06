---
title: TanStack AI
description: Create TanStack AI messages and stream predefined conversations through useChat without a model, API route, network request, or API key.
---

`@shadcn/helpers/tanstack-ai` lets you write an AI conversation in code and
stream it through TanStack AI's `useChat`, with no model, API route, network
request, or API key.

It creates native TanStack `UIMessage[]` values and replays each assistant
response through a local connection adapter as real AG-UI events, so your
components behave exactly as they would in production: text and reasoning
stream word by word, and tool calls move from input to result.

```ts showLineNumbers
import { createChat } from "@shadcn/helpers/tanstack-ai"

const chat = createChat()
  .user("What changed in this release?")
  .assistant("The release adds keyboard shortcuts and faster search.")
  .user("Can you show me the shortcuts?")
  .assistant("Press ⌘K to search and ⌘Enter to submit.")
```

Pass the chat to `useChat` with its initial messages and local connection.
TanStack AI receives the same AG-UI events it would receive from a server.

```tsx showLineNumbers
import { useChat } from "@tanstack/ai-react"

function Chat() {
  const { messages, append } = useChat({
    initialMessages: chat.get(0), // starts with no messages.
    connection: chat.transport(),
  })

  const nextMessage = chat.next(messages)

  return (
    <button
      disabled={!nextMessage}
      onClick={() => {
        if (nextMessage) {
          void append(nextMessage)
        }
      }}
    >
      Send next message
    </button>
  )
}
```

`get(0)` starts with no messages. `append(nextMessage)` adds the next
predefined user message; the connection then streams its assistant response
as AG-UI events.

---

## What It's For

The helper decouples your chat UI from the model and the backend, so you can
work on the frontend on its own. It runs offline, instantly, and the same way every time.

- **Build components.** Develop message bubbles, tool cards, and reasoning
  panels against realistic streaming output, without wiring up a model first.
- **Preview and demo.** Ship reproducible previews, screenshots, and videos
  that never depend on a live model.
- **Write docs.** Power documentation examples with conversations that render
  the same way on every load.
- **Test.** Assert against a deterministic stream in CI, with no network calls,
  token spend, or flaky model output.

---

## Installation

```bash
npm install @shadcn/helpers
```

---

## Usage

Create a conversation, pass its messages and connection to `useChat`, then
send each predefined user message with `next()`.

```tsx showLineNumbers {3-4,6-10,12-13,16-21,28-34}
"use client"

import { createChat } from "@shadcn/helpers/tanstack-ai"
import { useChat } from "@tanstack/ai-react"

const chat = createChat()
  .user("What changed in this release?")
  .assistant("The release adds keyboard shortcuts and faster search.")
  .user("Can you show me the shortcuts?")
  .assistant("Press ⌘K to search and ⌘Enter to submit.")

const initialMessages = chat.get(0)
const connection = chat.transport()

export function Chat() {
  const { messages, append, status } = useChat({
    initialMessages,
    connection,
  })
  const nextMessage = chat.next(messages)
  const isBusy = status === "submitted" || status === "streaming"

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{/* Render the message */}</div>
      ))}
      <button
        disabled={!nextMessage || isBusy}
        onClick={() => {
          if (nextMessage && !isBusy) {
            void append(nextMessage)
          }
        }}
      >
        Send
      </button>
    </div>
  )
}
```

<ComponentPreview
  styleName="base-rhea"
  name="tanstack-ai-helper-demo"
  className="rounded-[34px] sm:rounded-4xl"
  previewClassName="h-auto theme-blue bg-surface p-4 min-[480px]:p-8 min-[560px]:p-10 sm:px-10 sm:py-16 dark:bg-background"
/>

---

## User Messages

Messages added with this helper use the `user` and `assistant` roles. Use
`user()` to add a user message. Existing TanStack messages are preserved when
you start with `createChat({ messages })`.

```ts
const chat = createChat().user("What changed in this release?")

const [message] = chat.get()

message.role // "user"
message.parts // [{ type: "text", content: "What changed in this release?" }]
```

Pass an `id`, or a `createdAt` timestamp via `metadata`, as the second argument
when you need them.

```ts
chat.user("What changed in this release?", {
  id: "user-release-question",
  metadata: {
    createdAt: "2026-01-01T10:00:00.000Z",
  },
})
```

User messages can also include files. See [Files](#files).

---

## Assistant Messages

Use `assistant()` to add an assistant message.

```ts
const chat = createChat().assistant(
  "The release adds keyboard shortcuts and faster search."
)

const [message] = chat.get()

message.role // "assistant"
message.parts // [{ type: "text", content: "The release adds..." }]
```

A string creates one text part. You can also pass an array of TanStack message
parts.

```ts
chat.assistant([
  { type: "thinking", content: "I should summarize the release." },
  { type: "text", content: "The release adds keyboard shortcuts." },
])
```

Use the writer callback when the message should stream in smaller steps.

```ts
chat.assistant(({ writer }) => {
  writer.reasoning("I should summarize the release.")
  writer.text("The release adds keyboard shortcuts and faster search.")
})
```

The writer adds parts in the order you call them.

---

## Message Parts

The TanStack writer supports the parts that can round-trip through its AG-UI
connection: text, reasoning, and tool calls. It also supports timing and
errors.

```ts
chat.assistant(({ writer }) => {
  writer.reasoning("I should answer directly.")
  writer.text("Hello.")
})
```

See [Adapter Differences](#adapter-differences) for parts that do not have an
equivalent in this connection.

---

## Text

Use `text()` to add text.

```ts
chat.assistant(({ writer }) => {
  writer.text("The release adds keyboard shortcuts.")
  writer.text(" Search is faster too.")
})
```

Text streams word by word when the chat is used with `chat.transport()`.
Consecutive text calls materialize as separate parts in `get()`, but TanStack's
stream processor combines them into one text part during playback.

Use `mode: "instant"` to send the whole value at once, or `delayMs` to change
the delay between text deltas.

```ts
writer.text("Done.", { mode: "instant" })
writer.text("This part streams more slowly.", { delayMs: 100 })
```

---

## Reasoning

Use `reasoning()` to add reasoning. It becomes a TanStack `thinking` part.

```ts
chat.assistant(({ writer }) => {
  writer.reasoning("I should check the latest conditions first.")
  writer.text("Let me check the weather.")
})
```

Reasoning uses the same `delayMs` and `mode` options as text.

```ts
writer.reasoning("Checking the forecast.", { mode: "instant" })
```

---

## Tool Calls

Use `tool()` to add a tool call. It returns a handle that follows the tool from
input to output.

```ts
chat.assistant(({ writer }) => {
  writer
    .tool("getWeather", {
      input: { city: "San Francisco" },
    })
    .sleep(900)
    .output({
      city: "San Francisco",
      temperature: 18,
      condition: "Breezy",
    })

  writer.text("It is 18°C and breezy in San Francisco.")
})
```

The tool can finish with `output()` or `error()`.

```ts
writer.tool("getWeather", { input: { city: "San Francisco" } }).error()
```

The completed TanStack message contains a `tool-call` part and a sibling
`tool-result` part.

Pass the same client-tool tuple used by your app to type the tool name, input,
and output.

```ts
import { clientTools } from "@tanstack/ai-client"

import { getWeatherTool } from "@/lib/tools"

const tools = clientTools(getWeatherTool.client())
const chat = createChat<typeof tools>()

chat.assistant(({ writer }) => {
  writer
    .tool("getWeather", {
      input: { city: "San Francisco" },
    })
    .output({
      city: "San Francisco",
      temperature: 18,
      condition: "Breezy",
    })
})
```

---

## Files

Add files to a user message with the `files` option.

```ts
chat.user("Describe this image.", {
  files: [
    {
      mediaType: "image/png",
      url: "https://example.com/screenshot.png",
    },
  ],
})
```

The helper converts each file into a TanStack media part based on its media
type:

| Media type | TanStack part |
| ---------- | ------------- |
| `image/*`  | `image`       |
| `audio/*`  | `audio`       |
| `video/*`  | `video`       |
| Other      | `document`    |

These parts are available from `get()`. Because `next()` returns the complete
user `UIMessage`, `append()` preserves its text and media parts.

```ts
const nextMessage = chat.next(messages)

if (nextMessage) {
  void append(nextMessage)
}
```

Assistant media parts can be included in a static parts array and read with
`get()`, but the AG-UI connection does not stream assistant files.

---

## Adapter Differences

TanStack AI and the AI SDK use different message and streaming models. This
adapter exposes only the operations it can represent end to end.

| Feature                               | Behavior                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Text                                  | Streams as AG-UI text and becomes a `text` part.                           |
| Reasoning                             | Streams as AG-UI reasoning and becomes a `thinking` part.                  |
| Tool calls                            | Stream input, output, and errors into `tool-call` and `tool-result`.       |
| Data and structured output            | No writer method; existing message parts remain available through `get()`. |
| Custom events                         | No writer method in the public adapter.                                    |
| Sources, reasoning files, step starts | No TanStack message or AG-UI equivalent in this adapter.                   |
| Assistant files                       | Available in `get()`, but omitted from connection streams.                 |
| Stop                                  | Closes the stream; AG-UI has no separate abort event.                      |

Use the [AI SDK helper](/docs/helpers/ai-sdk) when a preview needs the AI SDK's
full message-part model.

---

## Reading Messages

Use `get()` to return messages from the start of the conversation.

```ts
chat.get() // Every message.
chat.get(2) // The first two messages.
chat.get(0) // An empty initial conversation.
```

`get()` returns cloned TanStack `UIMessage[]` values and does not change the
chat.

Use `next()` to find the next predefined user message after the messages
already shown.

```ts
const initialMessages = chat.get(2)
const nextMessage = chat.next(initialMessages)
```

`next()` always accepts a message transcript, not an index. It returns the next
user message or `null` when none remain.

---

## Start from Existing Messages

Pass `messages` to continue from a saved conversation or fixture.

```ts
import { createChat } from "@shadcn/helpers/tanstack-ai"
import type { UIMessage } from "@tanstack/ai-client"

declare const savedMessages: UIMessage[]

const chat = createChat({ messages: savedMessages })
  .user("What should we do next?")
  .assistant("Turn the open questions into a checklist.")
```

Existing IDs, timestamps, and parts are preserved.

---

## Transport

`transport()` creates a TanStack `ConnectConnectionAdapter` that you pass to
`useChat` as its `connection`.

```ts
const connection = chat.transport()

const { messages, append, sendMessage } = useChat({
  initialMessages: chat.get(0),
  connection,
})

const nextMessage = chat.next(messages)

// Replay the next predefined user message.
if (nextMessage) {
  void append(nextMessage)
}

// Or send ordinary user input as text or multimodal content.
void sendMessage("Tell me more.")
```

When `append()` or `sendMessage()` starts a run, the connection finds the
assistant message that follows the current transcript and emits AG-UI events
through TanStack's normal stream processor. It matches message IDs first and
falls back to the role and text of the latest message.

Use `append(nextMessage)` to replay a predefined user message. It preserves
that message's ID and media parts. Use `sendMessage()` for ordinary user input;
it accepts a string or multimodal content rather than a complete `UIMessage`.

### Events

A response can emit the following sequence:

```txt
RUN_STARTED
REASONING_MESSAGE_START → REASONING_MESSAGE_CONTENT → REASONING_MESSAGE_END
TOOL_CALL_START → TOOL_CALL_ARGS → TOOL_CALL_END → TOOL_CALL_RESULT
TEXT_MESSAGE_START → TEXT_MESSAGE_CONTENT → TEXT_MESSAGE_END
RUN_FINISHED
```

Predefined errors emit `RUN_ERROR`. TanStack supplies the `threadId` and
`runId` used by each run.

### Options

| Option     | Type                                     | Default | Description                                                                   |
| ---------- | ---------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| `delayMs`  | `number`                                 | `50`    | Delay between text and reasoning deltas. Use `0` or `undefined` to remove it. |
| `fallback` | `string`, `MessagePart[]`, or a callback | None    | Response to stream when no predefined assistant response remains.             |

The connection-level `delayMs` is the default for every streamed text and
reasoning part. Override it for one part with `writer.text(..., { delayMs })`
or `writer.reasoning(..., { delayMs })`.

```ts
const connection = chat.transport({
  delayMs: 25,
})
```

### Fallback

Use `fallback` when the conversation has no predefined assistant response
left. This keeps a demo usable after its predefined replies are exhausted.

```ts
const connection = chat.transport({
  fallback: "This demo has no more predefined replies.",
})
```

A fallback can also be an array of TanStack message parts or a writer callback.
The callback receives the incoming transcript, so it can create a response from
the current state.

```ts
const connection = chat.transport({
  fallback: ({ writer, messages }) => {
    writer.text(`This example already has ${messages.length} messages.`, {
      mode: "instant",
    })
  },
})
```

Fallback responses stream like assistant responses but are not added to the
predefined conversation. Without one, the connection throws
`"No assistant response found for this transcript."` when the conversation is
exhausted.

Calling `stop()` from `useChat` closes the active connection stream.

---

## Timing

Use delays to reproduce the pace of a real response.

```ts
const chat = createChat()
  .user("Give me a project update.")
  .sleep(800)
  .assistant(({ writer }) => {
    writer.reasoning("I should lead with the completed milestone.")
    writer.sleep(500)
    writer.text("The first milestone is complete.", { mode: "instant" })
  })

const connection = chat.transport({ delayMs: 50 })
```

- `chat.sleep(ms)` waits before the next assistant response starts.
- `writer.sleep(ms)` waits between parts of an assistant response.
- `tool.sleep(ms)` waits between a tool's input and its result.
- `transport({ delayMs })` sets the default delay between text and reasoning
  deltas.
- `writer.text(text, { delayMs })` and `writer.reasoning(text, { delayMs })`
  override that delay for one part.
- `mode: "instant"` sends a whole text or reasoning value in one delta.

For fast tests, use `chat.transport({ delayMs: 0 })` and instant text.

---

## Errors

Use `error()` on the chat when the whole assistant response should fail.

```ts
const chat = createChat()
  .user("Load the report.")
  .error("The report could not be loaded.")
```

This emits a TanStack `RUN_ERROR` event.

Use `writer.error()` to fail after other content has streamed.

```ts
chat.assistant(({ writer }) => {
  writer.text("I found the report.")
  writer.error("The connection closed before it could be read.")
})
```

---

## Metadata and IDs

TanStack messages support a `createdAt` timestamp. Pass it as message metadata;
it is preserved through `get()` and `next()`. The AG-UI connection does not
stream message metadata.

```ts
const chat = createChat()
  .user("Hello", {
    metadata: { createdAt: "2026-01-01T10:00:00.000Z" },
  })
  .assistant("Hi.", {
    id: "assistant-welcome",
    metadata: { createdAt: new Date("2026-01-01T10:00:01.000Z") },
  })
```

Use chat options when a fixture needs custom prefixes or a fixed clock.

```ts
const chat = createChat({
  messageIdPrefix: "demo-message",
  toolCallIdPrefix: "demo-tool",
  now: "2026-01-01T00:00:00.000Z",
})
```

---

## API Reference

The sections above cover the common flows. This reference lists every public
export and option.

### `createChat()`

Creates a typed conversation and returns the fluent TanStack chat interface.

```ts
function createChat<
  TOOLS extends ReadonlyArray<AnyClientTool> = AnyClientTool[],
  DATA = unknown,
>(options?: CreateChatOptions<TOOLS, DATA>): TanStackChat<TOOLS, DATA>
```

#### Type Parameters

| Parameter | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| `TOOLS`   | The client-tool tuple used to type tool names, inputs, and outputs.          |
| `DATA`    | The payload type of `structured-output` parts in existing TanStack messages. |

The helper writer does not create `structured-output` parts. `DATA` preserves
their type when a chat starts from existing messages.

#### Options

| Option             | Type                       | Default                      | Description                                             |
| ------------------ | -------------------------- | ---------------------------- | ------------------------------------------------------- |
| `messages`         | `UIMessage<TOOLS, DATA>[]` | `[]`                         | Start from an existing transcript. Messages are cloned. |
| `messageIdPrefix`  | `string`                   | `"msg"`                      | Prefix for generated message IDs.                       |
| `toolCallIdPrefix` | `string`                   | `"call"`                     | Prefix for generated tool call IDs.                     |
| `now`              | `Date \| string`           | `"2026-01-01T00:00:00.000Z"` | Fixed time used for generated `createdAt` values.       |

IDs found in `messages` are reserved, so newly generated IDs continue after
the existing transcript.

### `TanStackChat`

Every method that adds content returns the same chat, so calls can be chained.

| Method                        | Returns                    | Description                                                      |
| ----------------------------- | -------------------------- | ---------------------------------------------------------------- |
| `user(text?, options?)`       | `TanStackChat`             | Add a user message with text and optional files.                 |
| `assistant(input?, options?)` | `TanStackChat`             | Add an assistant message from text, parts, or a writer callback. |
| `sleep(delayMs)`              | `TanStackChat`             | Wait before the next assistant response starts.                  |
| `error(errorText?)`           | `TanStackChat`             | Add an assistant response that emits `RUN_ERROR`.                |
| `get(count?)`                 | `UIMessage[]`              | Return cloned messages from the start of the conversation.       |
| `next(messages)`              | `UIMessage \| null`        | Return the next predefined user message after a transcript.      |
| `transport(options?)`         | `ConnectConnectionAdapter` | Create the connection used by `useChat`.                         |

Calling `user()` or `assistant()` without content uses
`"Summarize the uploaded receipt."`. Calling `error()` without a message uses
`"An error occurred."`. `get(count)` throws when `count` is negative or not an
integer.

#### `user()` Options

| Option     | Type                      | Description                                  |
| ---------- | ------------------------- | -------------------------------------------- |
| `id`       | `string`                  | Use a specific message ID.                   |
| `metadata` | `TanStackMessageMetadata` | Set the message's `createdAt` timestamp.     |
| `files`    | `FilePayload[]`           | Append media parts after the user text part. |

A user file has this shape:

```ts
type FilePayload = {
  type?: "file"
  mediaType: string
  url: string
  filename?: string
  providerMetadata?: Record<string, unknown>
}
```

TanStack media parts preserve the URL and media type. Their message shape does
not preserve `filename` or `providerMetadata`.

#### `assistant()` Input

| Input                  | Result                                                                 |
| ---------------------- | ---------------------------------------------------------------------- |
| `string`               | One text part that streams word by word.                               |
| `MessagePart[]`        | Static TanStack parts in their existing order.                         |
| `({ writer }) => void` | A synchronous callback for scripting parts, tools, errors, and timing. |

#### `assistant()` Options

| Option     | Type                      | Description                              |
| ---------- | ------------------------- | ---------------------------------------- |
| `id`       | `string`                  | Use a specific message ID.               |
| `metadata` | `TanStackMessageMetadata` | Set the message's `createdAt` timestamp. |

#### `transport()` Options

| Option     | Type                                                        | Default | Description                                                                   |
| ---------- | ----------------------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| `delayMs`  | `number`                                                    | `50`    | Delay between text and reasoning deltas. Use `0` or `undefined` to remove it. |
| `fallback` | `string \| MessagePart[] \| ({ writer, messages }) => void` | None    | Response used when no predefined assistant response remains.                  |

See [Transport](#transport) for matching, fallback, errors, and AG-UI behavior.

### Writer

The writer is available inside `assistant(({ writer }) => {})` and fallback
callbacks.

| Method                       | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `text(text?, options?)`      | Add streamed text.                                       |
| `reasoning(text?, options?)` | Add streamed reasoning that becomes a `thinking` part.   |
| `tool(name, options?)`       | Add a typed tool call and return its lifecycle handle.   |
| `sleep(delayMs)`             | Pause before the next writer event.                      |
| `error(errorText?)`          | Emit `RUN_ERROR` and end without a `RUN_FINISHED` event. |

Calling `text()` without content uses `"Summarize the uploaded receipt."`.
Calling `reasoning()` without content uses
`"I need to inspect the available context before answering."`. Calling
`error()` without a message uses `"An error occurred."`.

#### Text and Reasoning Options

| Option    | Type                    | Default    | Description                                              |
| --------- | ----------------------- | ---------- | -------------------------------------------------------- |
| `delayMs` | `number`                | Connection | Override the connection delay for this value.            |
| `mode`    | `"stream" \| "instant"` | `"stream"` | Stream word deltas or emit the whole value in one delta. |

#### Tool Options

| Option       | Type                    | Description                             |
| ------------ | ----------------------- | --------------------------------------- |
| `toolCallId` | `string`                | Use a specific tool call ID.            |
| `input`      | `TOOLS[NAME]["input"]`  | Set the typed tool input.               |
| `output`     | `TOOLS[NAME]["output"]` | Immediately finish with a typed output. |
| `errorText`  | `string`                | Immediately finish with an error.       |

`tool()` returns a handle with `sleep(delayMs)`, `output(value)`, and
`error(errorText?)`. Use the handle when the tool lifecycle needs events
between its input and result. Calling `tool.error()` without a message uses
`"Tool call failed."`.

### Types

| Export                    | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `TanStackChat`            | The typed fluent chat returned by `createChat()`.             |
| `CreateChatOptions`       | Options accepted by `createChat()`.                           |
| `TanStackMessageMetadata` | The supported `{ createdAt? }` message metadata.              |
| `TanStackToolHandle`      | The lifecycle handle returned by `writer.tool()`.             |
| `TanStackWriter`          | The writer available inside assistant and fallback callbacks. |
