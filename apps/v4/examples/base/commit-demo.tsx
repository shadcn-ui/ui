"use client"

import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import {
  ChevronRightIcon,
  FilePenIcon,
  FilePlusIcon,
  GitCommitHorizontalIcon,
} from "lucide-react"

import { createChat } from "@/lib/ai"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/styles/base-rhea/ui/code-block"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/styles/base-rhea/ui/sheet"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/base-rhea/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    gitCommit: {
      input: { message: string }
      output: {
        hash: string
        files: {
          path: string
          added: boolean
          additions: number
          deletions: number
          diff: string
        }[]
      }
    }
  }
>

type CommitPart = Extract<
  ChatMessage["parts"][number],
  { type: "tool-gitCommit" }
>

const chat = createChat<ChatMessage>()
  .user("Commit the redirect fix.")
  .assistant(({ writer }) => {
    writer
      .tool("gitCommit", { input: { message: "Fix the login redirect" } })
      .sleep(1500)
      .output({
        hash: "a1b2c3",
        files: [
          {
            path: "app/login/page.tsx",
            added: false,
            additions: 2,
            deletions: 2,
            diff: `@@ -14,7 +14,7 @@ export default async function LoginPage({
   searchParams,
 }) {
   const { next } = await searchParams
-  const redirectTo =
-    next && next.startsWith("/") ? next : "/"
+  const redirectTo = safeRedirect(next)
+
   return <LoginForm redirectTo={redirectTo} />
 }`,
          },
          {
            path: "lib/auth/redirect.ts",
            added: true,
            additions: 7,
            deletions: 0,
            diff: `@@ -0,0 +1,7 @@
+export function safeRedirect(next: string | undefined) {
+  if (!next || !next.startsWith("/") || next.startsWith("//")) {
+    return "/"
+  }
+
+  return next
+}`,
          },
          {
            path: "lib/auth/redirect.test.ts",
            added: true,
            additions: 9,
            deletions: 0,
            diff: `@@ -0,0 +1,9 @@
+import { safeRedirect } from "./redirect"
+
+test("keeps a same-site path", () => {
+  expect(safeRedirect("/settings")).toBe("/settings")
+})
+
+test("drops an external URL", () => {
+  expect(safeRedirect("//evil.example")).toBe("/")
+})`,
          },
        ],
      })
    writer.text(
      "Committed the fix as a1b2c3 on main. The login page now only redirects to paths on this site."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function DiffLines({ diff }: { diff: string }) {
  return diff.split("\n").map((line, index) => {
    if (line.startsWith("@@")) {
      return (
        <CodeBlockLine key={index} className="text-muted-foreground">
          {line}
        </CodeBlockLine>
      )
    }

    return (
      <CodeBlockLine
        key={index}
        variant={
          line.startsWith("+")
            ? "added"
            : line.startsWith("-")
              ? "removed"
              : "default"
        }
      >
        {line.slice(1)}
      </CodeBlockLine>
    )
  })
}

function CommitRow({
  part,
  streaming,
}: {
  part: CommitPart
  streaming: boolean
}) {
  const message = part.input?.message

  if (part.state === "output-available") {
    return (
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GitCommitHorizontalIcon />
            </TraceIcon>
            <TraceTitle>
              Committed {part.output.hash}: {message}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {part.output.files.map((file) => (
              <Sheet key={file.path}>
                <SheetTrigger>
                  <TraceLine>
                    <TraceIcon>
                      {file.added ? <FilePlusIcon /> : <FilePenIcon />}
                    </TraceIcon>
                    <TraceTitle>
                      {file.added ? "Added" : "Edited"} {file.path}
                    </TraceTitle>
                    <TraceDescription className="font-mono">
                      +{file.additions} −{file.deletions}
                    </TraceDescription>
                    <TraceIcon>
                      <ChevronRightIcon />
                    </TraceIcon>
                  </TraceLine>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="font-mono">{file.path}</SheetTitle>
                    <SheetDescription>
                      {file.additions} additions, {file.deletions} deletions
                    </SheetDescription>
                  </SheetHeader>
                  <CodeBlock className="mx-6 mb-6 w-auto">
                    <CodeBlockContent>
                      <DiffLines diff={file.diff} />
                    </CodeBlockContent>
                  </CodeBlock>
                </SheetContent>
              </Sheet>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  if (part.state === "output-error") {
    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <GitCommitHorizontalIcon />
            </TraceIcon>
            <TraceTitle>Failed to commit: {message}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {part.errorText}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine status={streaming ? "running" : "error"}>
      <TraceIcon>
        <GitCommitHorizontalIcon />
      </TraceIcon>
      <TraceTitle>
        {streaming ? "Committing" : "Failed to commit"}: {message}
      </TraceTitle>
    </TraceLine>
  )
}

export function CommitDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        const streaming = busy && message === messages.at(-1)
        const commits = message.parts.filter(
          (part) => part.type === "tool-gitCommit"
        )
        const text = message.parts
          .map((part) => (part.type === "text" ? part.text : ""))
          .join("")

        return (
          <div key={message.id} className="flex flex-col gap-4">
            {commits.length > 0 && (
              <Trace>
                {commits.map((part) => (
                  <CommitRow
                    key={part.toolCallId}
                    part={part}
                    streaming={streaming}
                  />
                ))}
              </Trace>
            )}
            {text && (
              <p
                className={message.role === "user" ? "font-medium" : undefined}
              >
                {text}
              </p>
            )}
          </div>
        )
      })}
      <Button
        variant="outline"
        size="sm"
        className="mt-auto self-start"
        disabled={busy}
        onClick={() => {
          setMessages([])
          sendMessage(question)
        }}
      >
        Replay
      </Button>
    </div>
  )
}
