import React from "react"

import Code from "@/registry/default/blocks/code/components/code"

const Page = () => {
  return (
    <div className="flex flex-col min-h-svh max-w-xl mx-auto items-center justify-center gap-4 p-6 md:p-10 pb-20">
      <Code code={`npx shadcn@latest add code`} language="bash" />
      <Code
        code={`// JavaScript
const calculateSum = (a, b) => {
  return a + b;
}`}
        language="javascript"
      />
      <Code
        code={`# Python
def greet(name):
  return f"Hello, {name}!"`}
        language="python"
      />
      <Code
        code={`// Andromeeda theme
const calculateSum = (a, b) => {
  return a + b;
}`}
        language="javascript"
        theme="andromeeda"
        lineNumbers
        copyToClipboardTheme="dark"
      />
      <Code
        code={`# Catppuccin Macchiato theme
def greet(name):
  return f"Hello, {name}!"`}
        language="python"
        theme="catppuccin-macchiato"
        lineNumbers
        copyToClipboardTheme="dark"
      />
      <Code
        code={`# Monokai theme
class Animal
  def initialize(name)
    @name = name
  end
end`}
        language="ruby"
        theme="monokai"
        lineNumbers
        copyToClipboardTheme="dark"
      />
    </div>
  )
}

export default Page
