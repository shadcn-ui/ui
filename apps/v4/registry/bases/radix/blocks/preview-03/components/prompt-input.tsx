"use client"

import * as React from "react"
import { type ChatStatus } from "ai"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { FieldGroup } from "@/registry/bases/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/registry/bases/radix/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function PromptInput({
  onSubmit,
  status,
  className,
  defaultValue,
}: {
  onSubmit: (input: string) => void
  status: ChatStatus
  className?: string
  defaultValue?: string
}) {
  const [value, setValue] = React.useState(defaultValue ?? "")

  React.useEffect(() => {
    setValue(defaultValue ?? "")
  }, [defaultValue])
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (value?.trim()) {
      onSubmit(value)
    }
  }

  const isBusy = status === "submitted" || status === "streaming"
  const showStopButton = status === "streaming"
  const showSendButton = status !== "streaming"

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn("w-full", className)}
      id="chat-form"
    >
      <FieldGroup className="gap-1">
        <InputGroup>
          <InputGroupTextarea
            placeholder="Ask me anything..."
            className="h-10 min-h-10 overflow-y-auto transition-all"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <InputGroupAddon align="block-end" className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant="ghost" size="icon-sm">
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                  />
                  <span className="sr-only">Add</span>
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="PaperclipIcon"
                      tabler="IconPaperclip"
                      hugeicons="AttachmentIcon"
                      phosphor="PaperclipIcon"
                      remixicon="RiAttachmentLine"
                    />
                    Add Photos and Files
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="MonitorIcon"
                      tabler="IconDeviceDesktop"
                      hugeicons="ComputerIcon"
                      phosphor="MonitorIcon"
                      remixicon="RiComputerLine"
                    />
                    Take a Screenshot
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="ImageIcon"
                      tabler="IconPhoto"
                      hugeicons="ImageIcon"
                      phosphor="ImageIcon"
                      remixicon="RiImageLine"
                    />
                    Create Image
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="BrainIcon"
                      tabler="IconBrain"
                      hugeicons="AiBrainIcon"
                      phosphor="BrainIcon"
                      remixicon="RiBrainLine"
                    />
                    Deep Research
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="GlobeIcon"
                      tabler="IconGlobe"
                      hugeicons="Globe02Icon"
                      phosphor="GlobeIcon"
                      remixicon="RiGlobeLine"
                    />
                    Web Search
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconPlaceholder
                        lucide="MoreHorizontalIcon"
                        tabler="IconDots"
                        hugeicons="MoreHorizontalCircle01Icon"
                        phosphor="DotsThreeOutlineIcon"
                        remixicon="RiMoreLine"
                      />
                      More
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="BotIcon"
                          tabler="IconRobot"
                          hugeicons="RoboticIcon"
                          phosphor="RobotIcon"
                          remixicon="RiRobotLine"
                        />
                        Agent Mode
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="BookOpenIcon"
                          tabler="IconBook"
                          hugeicons="BookOpen02Icon"
                          phosphor="BookOpenIcon"
                          remixicon="RiBookOpenLine"
                        />
                        Add Sources
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="CheckIcon"
                          tabler="IconCheck"
                          hugeicons="Tick02Icon"
                          phosphor="CheckIcon"
                          remixicon="RiCheckLine"
                        />
                        Create Tasks
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              variant="default"
              size="icon-sm"
              type="submit"
              disabled={isBusy || !value?.trim()}
              className="ml-auto data-[visible=false]:hidden"
              data-visible={showSendButton}
            >
              <IconPlaceholder
                lucide="ArrowUpIcon"
                tabler="IconArrowUp"
                hugeicons="ArrowUp02Icon"
                phosphor="ArrowUpIcon"
                remixicon="RiArrowUpLine"
              />
              <span className="sr-only">Send</span>
            </InputGroupButton>
            <InputGroupButton
              size="icon-sm"
              variant="default"
              type="button"
              data-visible={showStopButton}
              className="ml-auto data-[visible=false]:hidden"
            >
              <IconPlaceholder
                lucide="SquareIcon"
                tabler="IconPlayerStop"
                hugeicons="StopCircleIcon"
                phosphor="StopCircleIcon"
                remixicon="RiStopCircleLine"
                className="fill-foreground"
              />
              <span className="sr-only">Stop</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </FieldGroup>
    </form>
  )
}
