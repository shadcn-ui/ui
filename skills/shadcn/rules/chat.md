# Chat & Messaging

Components for conversation and chat UI. Compose these instead of hand-rolling
bubbles, scroll containers, dividers, or attachment cards.

Install: `npx shadcn@latest add message-scroller message bubble attachment marker trace code-block`

The same component names and props ship for both `base` and `radix`; only
composition differs (`render` vs `asChild`). See [base-vs-radix.md](./base-vs-radix.md).

## Contents

- Scrollable threads use MessageScroller
- Message rows use Message
- Message surfaces use Bubble
- Attachments use Attachment
- System notes and dividers use Marker
- Assistant activity uses Trace
- Code and tool output use CodeBlock
- Streaming, anchoring, and jump-to-latest are built in
- Escape hatch: the scroller hooks

---

## Scrollable threads use MessageScroller

A conversation that scrolls, follows new messages, restores position, or jumps
to a message uses `MessageScroller`. Don't build a raw overflow container with
manual scroll wiring, and don't reach for `ScrollArea`.

The parts nest in a fixed order. Every direct child of the content is wrapped in
a `MessageScrollerItem` so the scroller can measure, anchor, preserve position,
track visibility, and jump to it. `MessageScrollerButton` sits inside
`MessageScroller`, after the viewport.

**Incorrect:**

```tsx
// Hand-rolled scroll container with manual stick-to-bottom logic.
<div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
  <div className="flex flex-col gap-6 p-4">
    {messages.map((m) => (
      <ChatMessage key={m.id} message={m} />
    ))}
  </div>
</div>
```

**Correct:**

```tsx
<MessageScrollerProvider autoScroll>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        {messages.map((message) => (
          <MessageScrollerItem
            key={message.id}
            messageId={message.id}
            scrollAnchor={message.role === "user"}
          >
            <Message align={message.role === "user" ? "end" : "start"}>
              {/* ...message content... */}
            </Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

---

## Message rows use Message

`Message` lays out a single row: avatar, header, content, footer, with
alignment. Group consecutive rows from one sender with `MessageGroup`. Don't
rebuild the row from flex divs.

`align="end"` is the current user's side; `align="start"` is everyone else.

```tsx
<Message align="start">
  <MessageAvatar>
    <Avatar>
      <AvatarImage src={sender.avatar} alt={sender.name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  </MessageAvatar>
  <MessageContent>
    <MessageHeader>{sender.name}</MessageHeader>
    <Bubble>
      <BubbleContent>{text}</BubbleContent>
    </Bubble>
    <MessageFooter>{time}</MessageFooter>
  </MessageContent>
</Message>
```

---

## Message surfaces use Bubble

The colored message surface is `Bubble` + `BubbleContent`, never a styled `div`
with `bg-muted` / `bg-primary` and hand-managed corners.

- `variant`: `default`, `secondary`, `muted`, `tinted`, `outline`, `ghost`, `destructive`.
- `align`: `start` or `end` (matches the `Message` side).

`BubbleReactions` renders the reaction cluster. `side` (`top` | `bottom`) and
`align` (`start` | `end`) position it against the bubble. Don't lay reactions out
with absolutely-positioned `Badge`s.

**Incorrect:**

```tsx
<div className="w-fit rounded-2xl bg-primary px-3 py-2 text-primary-foreground">
  {text}
</div>
```

**Correct:**

```tsx
<Bubble variant="default" align="end">
  <BubbleContent>{text}</BubbleContent>
  <BubbleReactions side="bottom" align="end">
    <Badge variant="secondary">👍 2</Badge>
  </BubbleReactions>
</Bubble>
```

---

## Attachments use Attachment

File and image attachments use `Attachment`, not `Item` or a custom card. It
carries upload state, so wire `state` to the real status rather than rendering a
separate spinner.

- `state`: `idle`, `uploading`, `processing`, `error`, `done`. `uploading` and
  `processing` apply the `shimmer` animation to the title automatically.
- `size`: `default`, `sm`, `xs`. `orientation`: `horizontal`, `vertical`.
- Use `AttachmentGroup` to lay out several attachments in a scrolling row.

```tsx
<Attachment state="done">
  <AttachmentMedia variant="icon">
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>homepage-feedback.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction>
      <DownloadIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

For an image, use `<AttachmentMedia variant="image">` with an `img` child.

---

## System notes and dividers use Marker

Status lines ("Sarah joined the conversation"), date dividers ("Today"), and
labeled separators are `Marker`, not a `Separator` plus a centered span.

- `variant`: `default` (plain row), `separator` (centered label with rules on
  each side), `border` (bottom-bordered row).
- `MarkerIcon` holds a leading icon; `MarkerContent` holds the label.

**Incorrect:**

```tsx
<div className="flex items-center gap-3 py-2">
  <Separator className="flex-1" />
  <span className="text-xs text-muted-foreground">Today</span>
  <Separator className="flex-1" />
</div>
```

**Correct:**

```tsx
<Marker variant="separator">
  <MarkerContent>Today</MarkerContent>
</Marker>
```

---

## Assistant activity uses Trace

What the assistant did or is doing (reasoning, tool calls, chain of thought,
steps, sources, file reads) is a `TraceLine` in a `Trace`, not a hand-rolled
`Collapsible` or a `Marker`. One line reports one thing; it may have detail.

- `TraceLine` is always the line: a `TraceIcon` and a `TraceTitle`, then an
  optional `TraceDescription` for a count, a duration or a diff stat. `status`
  goes on the `TraceLine`. Never hand-roll a span for secondary text.
- Behavior wraps the line. To make a line do something, wrap it in that thing's
  trigger:
  - nothing to open: the `TraceLine` alone;
  - expands: `TraceCollapsible` > `TraceCollapsibleTrigger` > `TraceLine`, then
    `TraceCollapsibleContent`. The trigger adds its own chevron;
  - link: `<a href>` > `TraceLine`;
  - overlay: `<SheetTrigger>` > `TraceLine` (Dialog, Drawer and Popover the
    same). Aria: `<DialogTrigger><Button>` > `TraceLine`, with React Aria's
    `Button`.
- Never make the line the trigger: no `asChild` or `render={<TraceLine />}` on
  a trigger. The trigger must stay a real button.
- A `TraceCollapsibleTrigger` always has a `TraceCollapsibleContent`. A tool row
  is a `TraceLine` until its output arrives, then a `TraceCollapsible`.
- Rows rendered from message parts go in one `Trace` per run of parts. A text
  part or a pending approval ends the run. A heading for a run is plain text
  above it, or a collapsible summary row.
- A pending approval (`approval-requested`) is a prompt, not a row. Render it
  outside `Trace` as an `Item` with Approve and Deny in `ItemActions`. See
  /docs/ai-elements/base/confirmation. Once answered, the tool part is a line
  again.
- A summary (sources, a task, a whole turn) is a `TraceCollapsible` whose
  `TraceCollapsibleContent` holds a `Trace`. Set the parent line's status and
  title from its children yourself.
- `status` is `"running"`, `"error"` or `"pending"` (a plan step that has not
  started), or omitted. The words agree: Running, Ran, Failed to run. Never dim
  a line with `opacity-*`. Map SDK states yourself; never pass one through.
- Add a trailing `TraceIcon` only for a link (arrow-up-right for a new tab, with
  sr-only " (opens in a new tab)" in the `TraceTitle`) or an overlay
  (chevron-right).
- Open state goes on `TraceCollapsible`: `defaultOpen`, or `open` with
  `onOpenChange` (aria: `defaultExpanded`, or `isExpanded` with
  `onExpandedChange`).
- Use `Marker` for notes and dividers between turns, not for activity.
- A checkpoint marks a turn the reader can return to. Render a `Marker`
  separator after that message, with a Button that calls `setMessages` with the
  messages up to and including it. See /docs/ai-elements/base/checkpoint.
- A folder of files is nested `Collapsible`s, one folder per row, and a file is
  a `Button`. See /docs/ai-elements/base/file-tree. A single file the assistant
  read is still a `TraceLine`.
- A person's turn is a `Message` with `align="end"` and a `Bubble`. The
  assistant's answer is a `Message`. See /docs/ai-elements/base/message.
- A thread is those turns in `MessageScroller`. The person's turn is the
  `scrollAnchor`, and `autoScroll` follows the reply. See
  /docs/ai-elements/base/chat.
- A prompt is an `InputGroup`: a textarea, an attachment chip, and a submit
  button. See /docs/ai-elements/base/prompt-input.
- A suggestion is a `Button` that sends its label with `sendMessage({ text })`.
  See /docs/ai-elements/base/suggestion.
- A model picker is a `DropdownMenu` with a `DropdownMenuRadioGroup`, next to a
  second one for effort. Send the selected ids on `sendMessage` as
  `body.model` and `body.effort`. See /docs/ai-elements/base/model-selector.
- An inline citation is a `HoverCard` on a short `Button` in the sentence, from
  a `source-url` part. See /docs/ai-elements/base/inline-citation. A list of
  sources after the answer is still Sources.
- Context usage is a `HoverCard` with `Progress`, read from message metadata
  `usage`. The window size is the model's limit. See
  /docs/ai-elements/base/context.
- Asked for an AI Elements component such as Tool, Reasoning, Chain of Thought,
  Task, Plan, Sources or Subagent? It is a component page built with Trace (for example
  /docs/ai-elements/base/tool). Install `trace` and copy the composition.
  Message is one turn (/docs/ai-elements/base/message). Chat is the thread in
  Message Scroller (/docs/ai-elements/base/chat). Checkpoint is a Marker
  (/docs/ai-elements/base/checkpoint). File Tree is nested
  Collapsibles (/docs/ai-elements/base/file-tree). Confirmation is an Item
  (/docs/ai-elements/base/confirmation). Prompt Input is an Input Group
  (/docs/ai-elements/base/prompt-input). Suggestion is a Button
  (/docs/ai-elements/base/suggestion). Model Selector is a Dropdown Menu
  (/docs/ai-elements/base/model-selector). Inline Citation is a Hover Card
  (/docs/ai-elements/base/inline-citation). Context is a Hover Card and Progress
  (/docs/ai-elements/base/context).

**Incorrect:**

```tsx
const [open, setOpen] = useState(true)

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger className="text-sm text-muted-foreground">
    {isStreaming ? "Thinking..." : "Thought for a few seconds"}
  </CollapsibleTrigger>
  <CollapsibleContent>{part.text}</CollapsibleContent>
</Collapsible>
```

**Correct:**

```tsx
<TraceCollapsible>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? "running" : undefined}>
      <TraceIcon>
        <BrainIcon />
      </TraceIcon>
      <TraceTitle>{running ? "Thinking" : "Thought"}</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>{part.text}</TraceCollapsibleContent>
</TraceCollapsible>
```

**Incorrect:** a tool row whose output may not exist yet.

```tsx
<TraceCollapsible>
  <TraceCollapsibleTrigger>
    <TraceLine status={status}>…</TraceLine>
  </TraceCollapsibleTrigger>
  {output && <TraceCollapsibleContent>{output}</TraceCollapsibleContent>}
</TraceCollapsible>
```

**Correct:** a `TraceLine` until there is something to open.

```tsx
function ToolRow({
  icon,
  title,
  status,
  output,
}: {
  icon: React.ReactNode
  title: string
  status?: "running" | "error"
  output?: string
}) {
  const line = (
    <TraceLine status={status}>
      <TraceIcon>{icon}</TraceIcon>
      <TraceTitle>{title}</TraceTitle>
    </TraceLine>
  )

  if (output === undefined) {
    return line
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <CodeBlock size="sm">
          <CodeBlockContent wrap className="max-h-64">
            {output}
          </CodeBlockContent>
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
```

**Incorrect:** the trigger renders as the line, so it is a span.

```tsx
<Sheet>
  <SheetTrigger asChild>
    <TraceLine>…</TraceLine>
  </SheetTrigger>
</Sheet>
```

**Correct:** sources, each link wrapping its own line.

```tsx
<TraceCollapsible>
  <TraceCollapsibleTrigger>
    <TraceLine>
      <TraceIcon>
        <GlobeIcon />
      </TraceIcon>
      <TraceTitle>Used {sources.length} sources</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>
    <Trace>
      {sources.map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>
              {source.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </TraceTitle>
            <TraceIcon>
              <ArrowUpRightIcon />
            </TraceIcon>
          </TraceLine>
        </a>
      ))}
    </Trace>
  </TraceCollapsibleContent>
</TraceCollapsible>
```

---

## Code and tool output use CodeBlock

Code, terminal output, tool input and output, logs, stack traces and diffs are
a `CodeBlock`, never a hand-rolled `<pre>`.

- `CodeBlockContent` takes a string. Add `wrap` for tool output and errors,
  `lineNumbers` for source, and a `max-h-*` class to cap the height.
- Errors use `variant="destructive"` on `CodeBlock`. Don't recolor the block.
- For diffs and highlighted lines, map each line to a `CodeBlockLine` with
  `variant="added"`, `"removed"` or `"highlighted"`.
- `CodeBlockCopyButton` takes the text to copy as `value`.
- Output inside a Trace row is `size="sm"` with `wrap` and `max-h-64`, so long
  output wraps and scrolls inside the row. Docs, Markdown fences and chat
  answers use the default size.
- Header buttons go in `CodeBlockActions`. With no header, put
  `CodeBlockActions` directly in `CodeBlock`; it floats and shows on hover.
- `code-block` installs `use-highlighted-code`. For source code, map the lines
  of `useHighlightedCode(code, language)` into `CodeBlockLine`. In a Server
  Component, use `await highlightCode(code, language)` instead. Don't
  highlight tool output; pass the string.
- `startLine` numbers a snippet from the middle of a file.

**Incorrect:**

```tsx
<pre className="rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
  {output}
</pre>
```

**Correct:**

```tsx
<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>Output</CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton value={output} />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent wrap className="max-h-72">
    {output}
  </CodeBlockContent>
</CodeBlock>
```

---

## Streaming, anchoring, and jump-to-latest are built in

`MessageScroller` handles the behavior that chat UIs usually reinvent. Don't
write a `useStickToBottom` hook, a `ResizeObserver`, or manual `scrollTop` math.

- **Follow the live edge while streaming.** `MessageScrollerProvider` with
  `autoScroll` keeps the view pinned to new content and yields the moment the
  user scrolls up. Streaming token updates that grow the last message are
  followed automatically.
- **Anchor a turn.** `scrollAnchor` on a `MessageScrollerItem` marks the row to
  hold in view (typically the user's message that started the turn).
- **Jump to latest.** `MessageScrollerButton` appears when the user scrolls away
  and scrolls back on click. `direction="end"` (default) or `direction="start"`.
  It is a self-managing control, so don't gate it behind your own scroll-position
  state.
- **Open a saved transcript without a flash.** `defaultScrollPosition` applies
  after mount. When it is `"end"` or `"last-anchor"`, the viewport has
  `data-pending-scroll` until that position is applied. The styled viewport
  hides. For `"end"` on first paint when messages are in the server HTML, copy
  this script into the page, not into the primitive. Skip it for `"last-anchor"`
  and for client-fetched messages. Keep `suppressHydrationWarning` on the
  viewport. Pass a `nonce` if you use a Content Security Policy.

```tsx
const scrollToEndScript = `(function () {
  var viewport = document.getElementById("messages")
  if (!viewport) {
    return
  }
  viewport.scrollTop = viewport.scrollHeight
  viewport.removeAttribute("data-pending-scroll")
})()`

<MessageScroller>
  <MessageScrollerViewport id="messages" suppressHydrationWarning>
    <MessageScrollerContent>{/* transcript */}</MessageScrollerContent>
  </MessageScrollerViewport>
  <script dangerouslySetInnerHTML={{ __html: scrollToEndScript }} />
  <MessageScrollerButton />
</MessageScroller>
```

For a "thinking…" indicator while the model generates, apply the `shimmer`
utility to text. Don't author a custom keyframe animation. See
[styling.md](./styling.md).

---

## Escape hatch: the scroller hooks

For behavior the parts don't expose, read state from the hooks rather than
re-implementing the scroller: `useMessageScroller`,
`useMessageScrollerVisibility`, and `useMessageScrollerScrollable`. They come
from the auto-installed `@shadcn/react` dependency, so there's nothing extra to
install. Reach for them only when composition can't express what you need.
