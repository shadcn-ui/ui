import React from "react"

import { Text } from "../ui/Text"

const codeExample = `
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`.trim()

const TextDemo = () => {
  return (
    <div className="p-10 space-y-10">
      <div>
        [Heading]
        <Text variant="h1">This is H1</Text>
        <Text variant="h2">This is H2</Text>
        <Text variant="h3">This is H3</Text>
        <Text variant="h4">This is H4</Text>
        <Text variant="h5">This is H5</Text>
        <Text variant="h6">This is H6</Text>
      </div>

      <div>
        [Base]
        <Text variant="lead">This is lead</Text>
        <Text variant="large">This is large</Text>
        <Text variant="p">This is p (Default)</Text>
        <Text variant="small">This is small</Text>
        <Text variant="muted">This is muted</Text>
      </div>

      <div>
        [Styled]
        <Text variant="blockquote">This is a blockquote.</Text>
        <Text variant="p">
          You can <strong>Emphasize Text</strong> like this.
        </Text>
        <Text variant="p" className="italic">
          You can use italic Text like this.
        </Text>
        <Text variant="p" className="line-through">
          You can use deleted Text like this.
        </Text>
        <Text variant="highlighted">This Text is highlighted.</Text>
        <Text variant="p" className="text-indigo-500">
          You can easily customize Text with className, or you can add new
          variants to make it reusable.
        </Text>
      </div>

      <div>
        [Code]
        <Text variant="codeBlock" className="max-w-sm">
          {codeExample}
        </Text>
      </div>

      <div>
        [List]
        <Text variant="list">
          <li>First list</li>
          <li>Second list</li>
          <li>Third list</li>
        </Text>
        <Text variant="orderedList">
          <li>First orderedList</li>
          <li>Second orderedList</li>
          <li>Third orderedList</li>
        </Text>
      </div>

      <div>
        [Table]
        <div>
          <Text variant="small">
            This is a simple table. I recommend using the{" "}
            <a
              href="https://ui.shadcn.com/docs/components/table"
              className="text-slate-500 underline"
            >
              Table Component
            </a>{" "}
            instead of this. Additionally, you can use the Button component to
            easily handle link buttons.
          </Text>
        </div>
        <div className="max-w-md">
          <Text variant="table">
            <Text variant="thead">
              <Text variant="tr">
                <Text variant="th">Category</Text>
                <Text variant="th">Tech stack</Text>
              </Text>
            </Text>
            <Text variant="tbody">
              <Text variant="tr">
                <Text variant="td">Framework</Text>
                <Text variant="td">Next.js (React)</Text>
              </Text>
              <Text variant="tr">
                <Text variant="td">Language</Text>
                <Text variant="td">Typescript</Text>
              </Text>
              <Text variant="tr">
                <Text variant="td">Styling</Text>
                <Text variant="td">TailwindCSS</Text>
              </Text>
              <Text variant="tr">
                <Text variant="td">UI Component</Text>
                <Text variant="td">shadcn-ui</Text>
              </Text>
            </Text>
          </Text>
        </div>
      </div>
    </div>
  )
}

export default TextDemo
