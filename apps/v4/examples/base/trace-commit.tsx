import {
  ChevronRightIcon,
  FilePenIcon,
  FilePlusIcon,
  GitCommitHorizontalIcon,
} from "lucide-react"

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

const files = [
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
]

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

export function TraceCommit() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GitCommitHorizontalIcon />
            </TraceIcon>
            <TraceTitle>Committed a1b2c3: Fix the login redirect</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {files.map((file) => (
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
    </Trace>
  )
}
