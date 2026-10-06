"use client"

import { Markdown } from "@/components/markdown"

const markdown = `## Getting started

Markdown lets you write formatted text with a simple syntax.

### Features

- **Bold** and *italic* text
- [Links](https://example.com) and \`inline code\`
- Ordered and unordered lists
- Tables, blockquotes, and code blocks

| Syntax | Result |
| --- | --- |
| \`**bold**\` | **bold** |
| \`*italic*\` | *italic* |
| \`\`code\`\` | \`code\` |

How about a quote? How does this look?

> The best way to learn markdown is to write it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.

Now let's try a code block. It should have line numbers, a copy button and syntax highlighting.

\`\`\`tsx
export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>
}
\`\`\`

If you need more plugins, you can pass them to the \`Markdown\` component.
`

export function MarkdownDemo() {
  return (
    <div className="max-w-md">
      <Markdown>{markdown}</Markdown>
    </div>
  )
}
