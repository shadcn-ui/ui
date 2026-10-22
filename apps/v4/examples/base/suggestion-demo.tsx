"use client"

import * as React from "react"
import { ArrowUpIcon, PlusIcon } from "lucide-react"

import { Bubble, BubbleContent } from "@/styles/base-rhea/ui/bubble"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/styles/base-rhea/ui/input-group"
import { Message, MessageContent } from "@/styles/base-rhea/ui/message"

const suggestions = [
  "Add a dark mode toggle",
  "Fix the failing build",
  "Write tests for the form",
  "Upgrade to Next.js 16",
  "Add a loading state",
  "Find unused dependencies",
]

const replies: Record<string, string> = {
  "Add a dark mode toggle":
    "Added a ModeToggle to the site header. It calls setTheme from next-themes.",
  "Fix the failing build":
    "The build failed on a missing import in app/page.tsx. I added it and the build passes.",
  "Write tests for the form":
    "Added four tests in signup-form.test.tsx. They cover the empty, invalid and valid states.",
  "Upgrade to Next.js 16":
    "Ran the codemod and bumped next to 16. Two routes needed async params, so I updated them.",
  "Add a loading state":
    "Added a loading.tsx to the dashboard route. It shows skeletons while the data loads.",
  "Find unused dependencies":
    "Three packages are not imported anywhere: lodash, moment and classnames. Should I remove them?",
}

export function SuggestionDemo() {
  const [text, setText] = React.useState("")
  const [turn, setTurn] = React.useState<{
    prompt: string
    reply: string
  } | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const canSend = text.trim().length > 0

  function send(prompt: string) {
    setTurn({
      prompt,
      reply:
        replies[prompt] ?? "This demo only knows the suggestions. Pick one.",
    })
    setText("")
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) {
      return
    }

    send(text.trim())
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-6 text-sm">
      {turn && (
        <div className="flex flex-col gap-4">
          <Message align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>{turn.prompt}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageContent>
              <p>{turn.reply}</p>
            </MessageContent>
          </Message>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex scroll-fade-x scrollbar-none gap-2 overflow-x-auto overscroll-x-contain">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => send(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
        <form ref={formRef} onSubmit={onSubmit}>
          <InputGroup>
            <InputGroupTextarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ask the agent to change your code..."
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  formRef.current?.requestSubmit()
                }
              }}
              className="p-3"
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label="Attach files"
              >
                <PlusIcon />
              </InputGroupButton>
              <InputGroupButton
                type="submit"
                size="icon-sm"
                variant="default"
                className="ml-auto rounded-full"
                disabled={!canSend}
                aria-label="Send"
              >
                <ArrowUpIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  )
}
