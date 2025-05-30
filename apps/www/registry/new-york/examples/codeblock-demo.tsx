import CodeBlock from "@/registry/new-york/ui/codeblock"

export default function CodeBlockDemo() {
  return (
    <div className="items-top flex space-x-2">
      <CodeBlock lang="js" maxHeight={300} maxWidth={300} textSize={14}>
        {`
function greet() {
  console.log("Hello, world!")
}

greet()
`}
      </CodeBlock>
    </div>
  )
}
