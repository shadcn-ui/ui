import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/styles/base-rhea/ui/code-block"

const code = `export default {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}`

const highlighted = [2, 3]

export function CodeBlockHighlightedLines() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent lineNumbers>
          {code.split("\n").map((line, index) => (
            <CodeBlockLine
              key={index}
              variant={highlighted.includes(index) ? "highlighted" : "default"}
            >
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
