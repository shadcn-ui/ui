import type {
  AnyClientTool,
  ExtractToolInput,
  ExtractToolOutput,
} from "@tanstack/ai-client"

import type { StreamTextOptions, ToolWriterOptions } from "../core"

type TanStackStreamTextOptions = Omit<StreamTextOptions, "id">

type TanStackToolWriterOptions<
  TOOLS extends ReadonlyArray<AnyClientTool>,
  NAME extends keyof TanStackToolSet<TOOLS>,
> = Pick<
  ToolWriterOptions<TanStackToolSet<TOOLS>, NAME>,
  "errorText" | "input" | "output" | "toolCallId"
>

export type TanStackMessageMetadata = {
  createdAt?: Date | string
}

export type TanStackEventData = Record<never, never>

export type TanStackToolSet<TOOLS extends ReadonlyArray<AnyClientTool>> = {
  [NAME in TOOLS[number]["name"]]: {
    input: ExtractToolInput<TOOLS, NAME>
    output: ExtractToolOutput<TOOLS, NAME>
  }
}

export type TanStackToolHandle<OUTPUT> = {
  sleep(delayMs: number): TanStackToolHandle<OUTPUT>
  output(output: OUTPUT): TanStackToolHandle<OUTPUT>
  error(errorText?: string): TanStackToolHandle<OUTPUT>
}

/** Writer operations that TanStack AI can represent end-to-end over AG-UI. */
export type TanStackWriter<TOOLS extends ReadonlyArray<AnyClientTool>> = {
  text(
    text?: string,
    options?: TanStackStreamTextOptions
  ): TanStackWriter<TOOLS>
  reasoning(
    text?: string,
    options?: TanStackStreamTextOptions
  ): TanStackWriter<TOOLS>
  sleep(delayMs: number): TanStackWriter<TOOLS>
  error(errorText?: string): TanStackWriter<TOOLS>
  tool<NAME extends keyof TanStackToolSet<TOOLS> & string>(
    name: NAME,
    options?: TanStackToolWriterOptions<TOOLS, NAME>
  ): TanStackToolHandle<TanStackToolSet<TOOLS>[NAME]["output"]>
}
