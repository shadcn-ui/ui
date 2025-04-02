import { TopicRecordPayloads } from "./types"

const internalStreamEndpoint = "/api/track"

export async function runStreamInternal<T extends keyof TopicRecordPayloads>(
  topic: T,
  record: Partial<TopicRecordPayloads[T]>
): Promise<Response | null> {
  const payload = JSON.stringify({
    topic,
    record,
  })

  if ("sendBeacon" in navigator) {
    const didSend = navigator.sendBeacon(internalStreamEndpoint, payload)

    if (didSend) {
      return null
    }
  }

  return fetch(internalStreamEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  }).catch(() => null)
}
