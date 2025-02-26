import { Message, useChat } from "ai/react"
import { cn } from "@/registry/new-york/lib/utils"
import { ChatSection } from "@llamaindex/chat-ui"

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Write simple Javascript hello world code',
    role: 'user',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Got it! Here\'s the simplest JavaScript code to print "Hello, World!" to the console:\n\n```javascript\nconsole.log("Hello, World!");\n```\n\nYou can run this code in any JavaScript environment, such as a web browser\'s console or a Node.js environment. Just paste the code and execute it to see the output.',
  },
  {
    id: '3',
    content: 'Write a simple math equation',
    role: 'user',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      "Let's explore a simple mathematical equation using LaTeX:\n\n The quadratic formula is: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\nThis formula helps us solve quadratic equations in the form $ax^2 + bx + c = 0$. The solution gives us the x-values where the parabola intersects the x-axis.",
  },
]


export function ChatSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const handler = useChat({ initialMessages })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <ChatSection handler={handler} />
    </div>
  )
}
