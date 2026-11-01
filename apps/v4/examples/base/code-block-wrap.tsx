import { CodeBlock, CodeBlockContent } from "@/styles/base-rhea/ui/code-block"

const output = `Error: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens and the context window is 200,000 tokens. Remove some messages or summarize the conversation and try again.`

export function CodeBlockWrap() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CodeBlock>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock>
        <CodeBlockContent wrap>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
