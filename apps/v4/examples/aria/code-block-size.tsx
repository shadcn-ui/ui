import { TerminalIcon } from "lucide-react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/styles/aria-rhea/ui/code-block"

const output = `$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`

export function CodeBlockSize() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{output}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
