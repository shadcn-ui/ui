import React from "react"

import CodeBlock from "@/registry/default/ui/code-block"

const CodeBlockDemo = () => {
  return (
    <CodeBlock
      code={`function helloWorld() {
      console.log('Hello, World!');
    }
    
    helloWorld();`}
      language="javascript"
      theme="dracula"
    />
  )
}

export default CodeBlockDemo
