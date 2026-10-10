# @shadcn/helpers

A collection of helpers for building AI applications.

## createChat

```ts
import { createChat } from "@shadcn/helpers/ai-sdk"

const chat = createChat()
  .user("What's the weather in San Francisco?")
  .sleep(800)
  .assistant(({ writer }) => {
    writer.reasoning("I should call the weather tool first.")
    writer
      .tool("getWeather", { input: { city: "San Francisco" } })
      .sleep(1200)
      .output({ temperature: 72, condition: "sunny" })
    writer.text("It's sunny and 72 degrees in San Francisco.")
  })
```

## Human in the loop

A tool call left unresolved pauses the turn: the input streams, the turn
finishes, and the client decides what happens next. A callback turn scripted
after a paused turn becomes a continuation. It materializes when the follow-up
request arrives and receives the resolved `toolCall` in its context.

For client-executed tools, the user supplies the output through
`addToolOutput` and the continuation reads it:

```ts
const chat = createChat()
  .user("Help me plan the release.")
  .assistant(({ writer }) => {
    writer.tool("askQuestions", { dynamic: true, input: { questions } })
  })
  .assistant(({ writer, toolCall }) => {
    writer.text(`Got it. Starting with ${toolCall?.output?.answers.direction}.`)
  })
```

For approval-gated tools, `needsApproval` pauses behind the user's decision.
`output` (or `errorText`) then means "stream this if approved"; denial streams
`tool-output-denied` automatically:

```ts
const chat = createChat()
  .user("Clean up old deployments.")
  .assistant(({ writer }) => {
    writer.text("This will delete 3 deployments. Approve?")
    writer.tool("deleteDeployments", {
      input: { count: 3 },
      needsApproval: true,
      output: { deleted: 3 },
    })
  })
  .assistant(({ writer, toolCall }) => {
    writer.text(
      toolCall?.approved
        ? "Deleted 3 deployments."
        : "Okay, leaving them in place."
    )
  })
```

Wire the client with the AI SDK's own triggers:
`sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls` for
client-executed tools, or `lastAssistantMessageIsCompleteWithApprovalResponses`
plus `addToolApprovalResponse({ id: part.approval.id, approved })` for
approvals.

Continuation callbacks must be pure; regenerating re-resolves them against the
current transcript. `get()` stops before the first continuation turn, since a
continuation has no message without a live transcript.

## Installation

```bash
npm install @shadcn/helpers
```

## Documentation

Visit https://ui.shadcn.com/docs to view the documentation.

## Contributing

Please read the [contributing guide](https://github.com/shadcn-ui/ui/blob/main/CONTRIBUTING.md).

## License

Licensed under the [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).
