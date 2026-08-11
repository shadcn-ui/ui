---
"@shadcn/helpers": minor
---

`createChat` for the AI SDK adapter is now generic over the UI message type, mirroring `useChat`: `createChat<ChatMessage>()` replaces `createChat<Metadata, DataParts, Tools>()`.
