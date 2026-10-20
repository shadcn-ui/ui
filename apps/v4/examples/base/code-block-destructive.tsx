import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/styles/base-rhea/ui/code-block"

const error = `TypeError: Cannot read properties of undefined (reading 'map')
    at MessageList (components/message-list.tsx:18:22)
    at renderWithHooks (react-dom.development.js:16305:18)`

export function CodeBlockDestructive() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock variant="destructive">
        <CodeBlockHeader>
          <CodeBlockTitle>Error</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={error} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{error}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
