import type {
  ChunkEncoder,
  DataTypes,
  NeutralChunk,
  StreamStep,
  ToolSet,
} from "./types"
import { wait } from "./utils"

/**
 * Plays lowered steps through an encoder into a `ReadableStream`. Honors
 * sleep steps, skips chunks the encoder maps to `null`, fans out arrays, and
 * handles aborts: before the `start` chunk the stream closes silently, after
 * it an `abort` chunk is emitted first.
 */
export function createTurnStream<
  CHUNK,
  METADATA = unknown,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
>(
  steps: StreamStep<METADATA, DATA, TOOLS>[],
  encode: ChunkEncoder<CHUNK, METADATA, DATA, TOOLS>,
  abortSignal?: AbortSignal
): ReadableStream<CHUNK> {
  let cancelled = false

  return new ReadableStream<CHUNK>({
    async start(controller) {
      let aborted = abortSignal?.aborted ?? false
      const abort = () => {
        aborted = true
      }

      abortSignal?.addEventListener("abort", abort)

      function enqueue(chunk: NeutralChunk<METADATA, DATA, TOOLS>) {
        const encoded = encode(chunk)

        if (encoded === null) {
          return
        }

        if (Array.isArray(encoded)) {
          for (const item of encoded) {
            controller.enqueue(item)
          }

          return
        }

        controller.enqueue(encoded)
      }

      try {
        let started = false

        function closeAfterAbort() {
          if (started) {
            enqueue({
              type: "abort",
              reason: "aborted",
            })
          }

          controller.close()
        }

        for (const step of steps) {
          // The consumer already tore the stream down — enqueueing or
          // closing a cancelled stream would throw.
          if (cancelled) {
            return
          }

          if (aborted) {
            closeAfterAbort()
            return
          }

          if (step.kind === "sleep") {
            await wait(step.delayMs, abortSignal)

            if (aborted) {
              closeAfterAbort()
              return
            }

            continue
          }

          if (step.kind === "close") {
            controller.close()
            return
          }

          enqueue(step.chunk)

          if (step.chunk.type === "start") {
            started = true
          }
        }

        if (!cancelled) {
          controller.close()
        }
      } finally {
        abortSignal?.removeEventListener("abort", abort)
      }
    },

    cancel() {
      cancelled = true
    },
  })
}
