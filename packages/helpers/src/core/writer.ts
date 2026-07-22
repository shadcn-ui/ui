import type { ChatPayloads } from "./payloads"
import type {
  ChatEvent,
  ChatIds,
  DataEventInput,
  DataTypes,
  FilePayload,
  ReasoningFilePayload,
  SourceDocumentPayload,
  SourceUrlPayload,
  StreamTextOptions,
  ToolSet,
  ToolWriterOptions,
} from "./types"
import {
  cloneValue,
  DEFAULT_REASONING,
  DEFAULT_TEXT,
  getDataPartName,
} from "./utils"

/**
 * Lifecycle handle returned by `writer.tool()`. Chain `sleep()` between the
 * input and its `output()`/`error()`/`denied()` resolution to script tool
 * latency.
 */
export type ToolHandle<OUTPUT> = {
  sleep(delayMs: number): ToolHandle<OUTPUT>
  output(output: OUTPUT): ToolHandle<OUTPUT>
  error(errorText?: string): ToolHandle<OUTPUT>
  denied(): ToolHandle<OUTPUT>
}

/**
 * The fluent writer DSL handed to `assistant(({ writer }) => …)`. Each call
 * appends events to the turn's log in order; every method chains except
 * `tool()`, which returns a {@link ToolHandle}.
 */
export type EventWriter<DATA extends DataTypes, TOOLS extends ToolSet> = {
  text(text?: string, options?: StreamTextOptions): EventWriter<DATA, TOOLS>
  reasoning(
    text?: string,
    options?: StreamTextOptions
  ): EventWriter<DATA, TOOLS>
  sleep(delayMs: number): EventWriter<DATA, TOOLS>
  data(part: DataEventInput<DATA>): EventWriter<DATA, TOOLS>
  error(errorText?: string): EventWriter<DATA, TOOLS>
  tool<NAME extends keyof TOOLS & string>(
    name: NAME,
    options?: ToolWriterOptions<TOOLS, NAME>
  ): ToolHandle<TOOLS[NAME]["output"]>
  sourceUrl(overrides?: Partial<SourceUrlPayload>): EventWriter<DATA, TOOLS>
  sourceDocument(
    overrides?: Partial<SourceDocumentPayload>
  ): EventWriter<DATA, TOOLS>
  file(overrides?: Partial<FilePayload>): EventWriter<DATA, TOOLS>
  reasoningFile(
    overrides?: Partial<ReasoningFilePayload>
  ): EventWriter<DATA, TOOLS>
  custom(kind?: string): EventWriter<DATA, TOOLS>
  stepStart(): EventWriter<DATA, TOOLS>
}

/**
 * Creates an {@link EventWriter} that appends to `events`. Generated part ids
 * are `<kind>-<events.length + 1>` at push time, matching the reference
 * implementation this package was extracted from.
 */
export function createEventWriter<
  DATA extends DataTypes,
  TOOLS extends ToolSet,
>(
  events: ChatEvent<DATA, TOOLS>[],
  context: { ids: ChatIds; payloads: ChatPayloads }
): EventWriter<DATA, TOOLS> {
  function nextPartId(kind: string) {
    return `${kind}-${events.length + 1}`
  }

  const writer: EventWriter<DATA, TOOLS> = {
    text(text = DEFAULT_TEXT, options: StreamTextOptions = {}) {
      events.push({
        kind: "text",
        id: options.id ?? nextPartId("text"),
        text,
        options,
      })

      return writer
    },

    reasoning(text = DEFAULT_REASONING, options: StreamTextOptions = {}) {
      events.push({
        kind: "reasoning",
        id: options.id ?? nextPartId("reasoning"),
        text,
        options,
      })

      return writer
    },

    sleep(delayMs: number) {
      events.push({
        kind: "sleep",
        delayMs,
        phase: "after-start",
      })

      return writer
    },

    data(part) {
      const name = getDataPartName(part.type) as keyof DATA & string
      const clonedPart = cloneValue(part)

      events.push({
        kind: "data",
        name,
        id: clonedPart.id,
        data: clonedPart.data,
        transient: clonedPart.transient,
      } as ChatEvent<DATA, TOOLS>)

      return writer
    },

    error(errorText = "An error occurred.") {
      events.push({
        kind: "error",
        errorText,
      })

      return writer
    },

    tool<NAME extends keyof TOOLS & string>(
      name: NAME,
      options: ToolWriterOptions<TOOLS, NAME> = {}
    ) {
      const clonedOptions = cloneValue(options)
      const toolCallId =
        clonedOptions.toolCallId ?? context.ids.nextToolCallId()

      if (clonedOptions.toolCallId !== undefined) {
        context.ids.reserveToolCallId(clonedOptions.toolCallId)
      }

      events.push({
        kind: "tool-input",
        name,
        toolCallId,
        title: clonedOptions.title,
        toolMetadata: clonedOptions.toolMetadata,
        providerExecuted: clonedOptions.providerExecuted,
        dynamic: clonedOptions.dynamic,
        input: clonedOptions.input ?? {},
      })

      const handle: ToolHandle<TOOLS[NAME]["output"]> = {
        sleep(delayMs: number) {
          events.push({
            kind: "sleep",
            delayMs,
            phase: "after-start",
          })

          return handle
        },

        output(output: TOOLS[NAME]["output"]) {
          events.push({
            kind: "tool-output",
            toolCallId,
            output: cloneValue(output),
            providerExecuted: clonedOptions.providerExecuted,
            toolMetadata: clonedOptions.toolMetadata,
            dynamic: clonedOptions.dynamic,
          })

          return handle
        },

        error(errorText = "Tool call failed.") {
          events.push({
            kind: "tool-error",
            toolCallId,
            errorText,
            providerExecuted: clonedOptions.providerExecuted,
            toolMetadata: clonedOptions.toolMetadata,
            dynamic: clonedOptions.dynamic,
          })

          return handle
        },

        denied() {
          events.push({
            kind: "tool-denied",
            toolCallId,
          })

          return handle
        },
      }

      if (clonedOptions.output !== undefined) {
        handle.output(clonedOptions.output)
      }

      if (clonedOptions.errorText !== undefined) {
        handle.error(clonedOptions.errorText)
      }

      return handle
    },

    sourceUrl(overrides: Partial<SourceUrlPayload> = {}) {
      events.push({
        kind: "source-url",
        part: context.payloads.sourceUrl(overrides),
      })

      return writer
    },

    sourceDocument(overrides: Partial<SourceDocumentPayload> = {}) {
      events.push({
        kind: "source-document",
        part: context.payloads.sourceDocument(overrides),
      })

      return writer
    },

    file(overrides: Partial<FilePayload> = {}) {
      events.push({
        kind: "file",
        part: context.payloads.file(overrides),
      })

      return writer
    },

    reasoningFile(overrides: Partial<ReasoningFilePayload> = {}) {
      events.push({
        kind: "reasoning-file",
        part: context.payloads.reasoningFile(overrides),
      })

      return writer
    },

    custom(kind?: string) {
      events.push({
        kind: "custom",
        part: context.payloads.custom(kind),
      })

      return writer
    },

    stepStart() {
      events.push({
        kind: "step-start",
      })

      return writer
    },
  }

  return writer
}
