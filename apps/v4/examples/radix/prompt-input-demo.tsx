"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  ChevronDownIcon,
  FileTextIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/styles/radix-rhea/ui/attachment"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/styles/radix-rhea/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/styles/radix-rhea/ui/input-group"

type AttachmentFile = {
  id: string
  name: string
}

const providers = [
  {
    name: "OpenAI",
    models: [
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-mini", name: "GPT-5 mini" },
    ],
  },
  {
    name: "Anthropic",
    models: [
      { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
    ],
  },
]

const models = providers.flatMap((provider) => provider.models)

const efforts = [
  { id: "low", name: "Low" },
  { id: "medium", name: "Medium" },
  { id: "high", name: "High" },
]

export function PromptInputDemo() {
  const [text, setText] = React.useState("")
  const [files, setFiles] = React.useState<AttachmentFile[]>([])
  const [model, setModel] = React.useState(models[0].id)
  const [effort, setEffort] = React.useState(efforts[1].id)
  const formRef = React.useRef<HTMLFormElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const currentModel = models.find((item) => item.id === model) ?? models[0]
  const currentEffort = efforts.find((item) => item.id === effort) ?? efforts[1]
  const canSend = text.trim().length > 0

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) {
      return
    }

    setText("")
    setFiles([])
  }

  function onAttach(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files
    if (!selected) {
      return
    }

    setFiles((current) => [
      ...current,
      ...Array.from(selected, (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
      })),
    ])
    event.target.value = ""
  }

  return (
    <div className="mx-auto w-full max-w-lg py-6">
      <form ref={formRef} onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={onAttach}
        />
        <InputGroup>
          {files.length > 0 && (
            <InputGroupAddon align="block-start" className="flex-wrap">
              {files.map((file) => (
                <Attachment key={file.id} size="sm">
                  <AttachmentMedia>
                    <FileTextIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        setFiles((current) =>
                          current.filter((item) => item.id !== file.id)
                        )
                      }
                    >
                      <XIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              ))}
            </InputGroupAddon>
          )}
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
              onClick={() => inputRef.current?.click()}
            >
              <PlusIcon />
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  size="sm"
                  variant="outline"
                  aria-label={`Model: ${currentModel.name}`}
                  className="ml-auto"
                >
                  {currentModel.name}
                  <ChevronDownIcon />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
                  {providers.map((provider, index) => (
                    <React.Fragment key={provider.name}>
                      {index > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
                        {provider.models.map((item) => (
                          <DropdownMenuRadioItem key={item.id} value={item.id}>
                            {item.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuGroup>
                    </React.Fragment>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  size="sm"
                  variant="outline"
                  aria-label={`Effort: ${currentEffort.name}`}
                >
                  <span className="text-muted-foreground">Effort</span>
                  {currentEffort.name}
                  <ChevronDownIcon />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Effort</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={effort}
                    onValueChange={setEffort}
                  >
                    {efforts.map((item) => (
                      <DropdownMenuRadioItem key={item.id} value={item.id}>
                        {item.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant="default"
              className="rounded-full"
              disabled={!canSend}
              aria-label="Send"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}
