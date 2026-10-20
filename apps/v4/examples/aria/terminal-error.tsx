import { TerminalIcon } from "lucide-react"

import { CodeBlock, CodeBlockContent } from "@/styles/aria-rhea/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

const LINT_OUTPUT = `> acme-chat@0.1.0 lint
> eslint .

app/api/chat/route.ts
  14:7  error  'model' is assigned a value but never used  no-unused-vars

components/chat.tsx
  42:5  error  React Hook useEffect has a missing dependency: 'messages'  react-hooks/exhaustive-deps

✖ 2 problems (2 errors, 0 warnings)

 ELIFECYCLE  Command failed with exit code 1.`

export function TerminalError() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
      <TraceCollapsible defaultExpanded>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>pnpm lint exited with code 1</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {LINT_OUTPUT}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
