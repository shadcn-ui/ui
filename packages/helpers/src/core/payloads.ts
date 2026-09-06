import type {
  ChatIds,
  CustomPayload,
  FilePayload,
  JsonRecord,
  ReasoningFilePayload,
  SourceDocumentPayload,
  SourceUrlPayload,
} from "./types"
import { cloneValue } from "./utils"

/** Framework-neutral payload factories with sensible defaults for anything omitted. */
export type ChatPayloads = {
  file(overrides?: Partial<FilePayload>): FilePayload
  reasoningFile(overrides?: Partial<ReasoningFilePayload>): ReasoningFilePayload
  sourceUrl(overrides?: Partial<SourceUrlPayload>): SourceUrlPayload
  sourceDocument(
    overrides?: Partial<SourceDocumentPayload>
  ): SourceDocumentPayload
  custom(
    kind?: string,
    options?: { providerMetadata?: JsonRecord }
  ): CustomPayload
}

/**
 * Creates the default payload factories. Source payloads draw their
 * `sourceId` from the shared {@link ChatIds} sequence unless overridden.
 */
export function createChatPayloads(ids: ChatIds): ChatPayloads {
  function resolveSourceId(sourceId?: string) {
    if (sourceId !== undefined) {
      ids.reserveSourceId(sourceId)

      return sourceId
    }

    return ids.nextSourceId()
  }

  return {
    file(overrides = {}) {
      return {
        mediaType: "image/png",
        filename: "receipt.png",
        url: "https://example.com/receipt.png",
        ...cloneValue(overrides),
      }
    },

    reasoningFile(overrides = {}) {
      return {
        mediaType: "text/plain",
        url: "data:text/plain;base64,cmVhc29uaW5n",
        ...cloneValue(overrides),
      }
    },

    sourceUrl(overrides = {}) {
      const clonedOverrides = cloneValue(overrides)

      return {
        sourceId: resolveSourceId(clonedOverrides.sourceId),
        url: clonedOverrides.url ?? "https://ai-sdk.dev/docs",
        title: clonedOverrides.title ?? "AI SDK Docs",
        providerMetadata: clonedOverrides.providerMetadata,
      }
    },

    sourceDocument(overrides = {}) {
      const clonedOverrides = cloneValue(overrides)

      return {
        sourceId: resolveSourceId(clonedOverrides.sourceId),
        mediaType: clonedOverrides.mediaType ?? "text/markdown",
        title: clonedOverrides.title ?? "Retrieved document",
        filename: clonedOverrides.filename,
        providerMetadata: clonedOverrides.providerMetadata,
      }
    },

    custom(kind = "test.output", options = {}) {
      return {
        kind,
        ...cloneValue(options),
      }
    },
  }
}

/**
 * Creates the default message-metadata factory: a fixed-clock
 * `{ createdAt }` stamp (default `2026-01-01T00:00:00.000Z`) merged with any
 * overrides, so snapshots stay stable across runs.
 */
export function createMetadataFactory<METADATA>(now?: Date | string) {
  const resolvedNow =
    now instanceof Date ? now : new Date(now ?? "2026-01-01T00:00:00.000Z")

  return function metadata(overrides: Partial<METADATA> = {}) {
    return {
      createdAt: resolvedNow.toISOString(),
      ...cloneValue(overrides),
    } as METADATA
  }
}
