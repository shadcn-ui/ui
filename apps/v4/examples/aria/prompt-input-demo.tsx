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
} from "@/styles/aria-rhea/ui/attachment"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/styles/aria-rhea/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/styles/aria-rhea/ui/input-group"

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
                      onPress={() =>
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
            onChange={(event) => {
              setText(
                typeof event === "string" ? event : event.currentTarget.value
              )
            }}
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
              onPress={() => inputRef.current?.click()}
            >
              <PlusIcon />
            </InputGroupButton>
            <DropdownMenuTrigger>
              <InputGroupButton
                size="sm"
                variant="outline"
                aria-label={`Model: ${currentModel.name}`}
                className="ml-auto"
              >
                {currentModel.name}
                <ChevronDownIcon />
              </InputGroupButton>
              <DropdownMenu
                className="w-48"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={[model]}
                onSelectionChange={(keys) => setModel([...keys][0] as string)}
              >
                {providers.map((provider, index) => (
                  <React.Fragment key={provider.name}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
                      {provider.models.map((item) => (
                        <DropdownMenuItem key={item.id} id={item.id}>
                          {item.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </React.Fragment>
                ))}
              </DropdownMenu>
            </DropdownMenuTrigger>
            <DropdownMenuTrigger>
              <InputGroupButton
                size="sm"
                variant="outline"
                aria-label={`Effort: ${currentEffort.name}`}
              >
                <span className="text-muted-foreground">Effort</span>
                {currentEffort.name}
                <ChevronDownIcon />
              </InputGroupButton>
              <DropdownMenu
                className="w-36"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={[effort]}
                onSelectionChange={(keys) => setEffort([...keys][0] as string)}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Effort</DropdownMenuLabel>
                  {efforts.map((item) => (
                    <DropdownMenuItem key={item.id} id={item.id}>
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenu>
            </DropdownMenuTrigger>
            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant="default"
              className="rounded-full"
              isDisabled={!canSend}
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
