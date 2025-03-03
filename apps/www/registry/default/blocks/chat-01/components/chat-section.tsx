"use client"

import {
  ChatHandler,
  ChatSection as ChatSectionUI,
  Message,
} from "@llamaindex/chat-ui"

import "@llamaindex/chat-ui/styles/markdown.css"
import { useState } from "react"

const initialMessages: Message[] = [
  {
    content: "Write simple Javascript hello world code",
    role: "user",
  },
  {
    role: "assistant",
    content:
      'Got it! Here\'s the simplest JavaScript code to print "Hello, World!" to the console:\n\n```javascript\nconsole.log("Hello, World!");\n```\n\nYou can run this code in any JavaScript environment, such as a web browser\'s console or a Node.js environment. Just paste the code and execute it to see the output.',
  },
  {
    content: "Write a simple math equation",
    role: "user",
  },
  {
    role: "assistant",
    content:
      "Let's explore a simple mathematical equation using LaTeX:\n\n The quadratic formula is: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\nThis formula helps us solve quadratic equations in the form $ax^2 + bx + c = 0$. The solution gives us the x-values where the parabola intersects the x-axis.",
  },
]

export function ChatSection() {
  // You can replace the handler with a useChat hook from Vercel AI SDK
  const handler = useMockChat(initialMessages)
  return (
    <div className="flex max-h-[80vh] flex-col gap-6 overflow-y-auto">
      <ChatSectionUI handler={handler} />
    </div>
  )
}

function useMockChat(initMessages: Message[]): ChatHandler {
  const [messages, setMessages] = useState<Message[]>(initMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const append = async (message: Message) => {
    setIsLoading(true)

    const mockResponse: Message = {
      role: "assistant",
      content: "",
    }
    setMessages((prev) => [...prev, message, mockResponse])

    const mockContent =
      "This is a mock response. In a real implementation, this would be replaced with an actual AI response."

    let streamedContent = ""
    const words = mockContent.split(" ")

    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      streamedContent += (streamedContent ? " " : "") + word
      setMessages((prev) => {
        return [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content: streamedContent,
          },
        ]
      })
    }

    setIsLoading(false)
    return mockContent
  }

  return {
    messages,
    input,
    setInput,
    isLoading,
    append,
  }
}
