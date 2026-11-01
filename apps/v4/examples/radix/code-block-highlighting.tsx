"use client"

import { useHighlightedCode } from "@/registry/bases/radix/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/styles/radix-rhea/ui/code-block"

const code = `{
  "location": "San Francisco",
  "temperature": 18,
  "unit": "celsius",
  "conditions": ["fog", "wind"]
}`

export function CodeBlockHighlighting() {
  const lines = useHighlightedCode(code, "json")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>getWeather output</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
