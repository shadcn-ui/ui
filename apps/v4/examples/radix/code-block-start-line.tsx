"use client"

import { useHighlightedCode } from "@/registry/bases/radix/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/styles/radix-rhea/ui/code-block"

const code = `  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return <ProjectList projects={projects} />
}`

export function CodeBlockStartLine() {
  const lines = useHighlightedCode(code, "tsx")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/dashboard/page.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers startLine={995}>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
