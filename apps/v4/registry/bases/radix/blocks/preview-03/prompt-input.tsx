"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/radix/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/registry/bases/radix/ui/input-group"
import { Separator } from "@/registry/bases/radix/ui/separator"
import { Switch } from "@/registry/bases/radix/ui/switch"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type Branch = { value: string; label: string }

const branches: Branch[] = [
  { value: "main", label: "main" },
  { value: "style-new", label: "style-new" },
  { value: "shadcn/init-preset", label: "shadcn/init-preset" },
  { value: "shadcn/radio-group-icon", label: "shadcn/radio-group-icon" },
  { value: "shadcn/v4-explore", label: "shadcn/v4-explore" },
  { value: "shadcn/v4-preset-code", label: "shadcn/v4-preset-code" },
  { value: "shadcn/combobox-fix", label: "shadcn/combobox-fix" },
  { value: "shadcn/sidebar-nav", label: "shadcn/sidebar-nav" },
  { value: "shadcn/dialog-stack", label: "shadcn/dialog-stack" },
  { value: "shadcn/toast-redesign", label: "shadcn/toast-redesign" },
  { value: "shadcn/table-virtualized", label: "shadcn/table-virtualized" },
  { value: "shadcn/date-picker-range", label: "shadcn/date-picker-range" },
  { value: "fix/button-focus-ring", label: "fix/button-focus-ring" },
  { value: "fix/select-overflow", label: "fix/select-overflow" },
  { value: "feat/command-palette", label: "feat/command-palette" },
  { value: "feat/theme-switcher", label: "feat/theme-switcher" },
]

const createBranchItem: Branch = {
  value: "__create-branch__",
  label: "Create and checkout new branch…",
}

const branchComboboxGroups = [
  { value: "branches", items: branches },
  { value: "actions", items: [createBranchItem] },
] as const

const reasoningLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "extra-high", label: "Extra High" },
]

const models = [
  { value: "gpt-5.3-codex", label: "GPT-5.3-Codex" },
  { value: "gpt-5.2-codex", label: "GPT-5.2-Codex" },
  { value: "gpt-5.1-codex-max", label: "GPT-5.1-Codex-Max" },
  { value: "gpt-5.2", label: "GPT-5.2" },
  { value: "gpt-5.1-codex", label: "GPT-5.1-Codex" },
]

export function PromptInput() {
  const [selectedModel, setSelectedModel] = React.useState("gpt-5.3-codex")
  const [selectedReasoning, setSelectedReasoning] = React.useState("extra-high")
  const [planMode, setPlanMode] = React.useState(false)

  const modelLabel = models.find((m) => {
    return m.value === selectedModel
  })?.label
  const reasoningLabel = reasoningLevels.find((r) => {
    return r.value === selectedReasoning
  })?.label

  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <InputGroup className="rounded-2xl bg-background ring-1 ring-black/10">
        <InputGroupTextarea
          placeholder="Ask Codex anything, @ to add files, / for commands"
          className="p-4"
        />
        <InputGroupAddon align="block-end">
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  size="icon-sm"
                  className="rounded-full"
                  type="button"
                >
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="Add01Icon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                  />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="ImageIcon"
                      tabler="IconPhoto"
                      hugeicons="Image01Icon"
                      phosphor="ImageIcon"
                      remixicon="RiImageLine"
                    />
                    Add photos & files
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                    }}
                    onClick={() => {
                      setPlanMode((prev) => {
                        return !prev
                      })
                    }}
                  >
                    <IconPlaceholder
                      lucide="Settings2Icon"
                      tabler="IconSettings"
                      hugeicons="Settings05Icon"
                      phosphor="GearIcon"
                      remixicon="RiSettingsLine"
                    />
                    Plan mode
                    <span className="pointer-events-none ml-auto">
                      <Switch checked={planMode} tabIndex={-1} size="sm" />
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton size="sm" type="button">
                  {modelLabel}{" "}
                  <IconPlaceholder
                    lucide="ChevronDownIcon"
                    tabler="IconChevronDown"
                    hugeicons="ArrowDown01Icon"
                    phosphor="CaretDownIcon"
                    remixicon="RiArrowDownSLine"
                    data-icon="inline-end"
                  />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Select model</DropdownMenuLabel>
                  {models.map((model) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={model.value}
                        checked={model.value === selectedModel}
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            setSelectedModel(model.value)
                          }
                        }}
                      >
                        {model.label}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton size="sm" type="button">
                  {reasoningLabel}{" "}
                  <IconPlaceholder
                    lucide="ChevronDownIcon"
                    tabler="IconChevronDown"
                    hugeicons="ArrowDown01Icon"
                    phosphor="CaretDownIcon"
                    remixicon="RiArrowDownSLine"
                    data-icon="inline-end"
                  />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Select reasoning</DropdownMenuLabel>
                  {reasoningLevels.map((level) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={level.value}
                        checked={level.value === selectedReasoning}
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            setSelectedReasoning(level.value)
                          }
                        }}
                      >
                        {level.label}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {planMode ? (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-2 data-vertical:h-4 data-vertical:self-auto"
                />
                <InputGroupButton
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setPlanMode(false)
                  }}
                >
                  <IconPlaceholder
                    lucide="Settings2Icon"
                    tabler="IconSettings"
                    hugeicons="Settings05Icon"
                    phosphor="GearIcon"
                    remixicon="RiSettingsLine"
                    className="group-hover/button:hidden"
                  />
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="Cancel01Icon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                    className="hidden group-hover/button:block"
                  />
                  Plan
                </InputGroupButton>
              </>
            ) : null}
          </div>
          <InputGroupButton
            size="icon-sm"
            variant="default"
            className="ml-auto rounded-full"
            type="submit"
          >
            <IconPlaceholder
              lucide="ArrowUpIcon"
              tabler="IconArrowUp"
              hugeicons="ArrowUpIcon"
              phosphor="ArrowUpIcon"
              remixicon="RiArrowUpLine"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton size="sm" type="button">
              <IconPlaceholder
                lucide="TerminalIcon"
                tabler="IconTerminal"
                hugeicons="ComputerTerminal01Icon"
                phosphor="TerminalIcon"
                remixicon="RiTerminalBoxLine"
              />
              Local
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                data-icon="inline-end"
              />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Continue in</DropdownMenuLabel>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="TerminalIcon"
                  tabler="IconTerminal"
                  hugeicons="ComputerTerminal01Icon"
                  phosphor="TerminalIcon"
                  remixicon="RiTerminalBoxLine"
                />
                Local project
                <DropdownMenuShortcut>
                  <IconPlaceholder
                    lucide="CheckIcon"
                    tabler="IconCheck"
                    hugeicons="Tick02Icon"
                    phosphor="CheckIcon"
                    remixicon="RiCheckLine"
                  />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ShareIcon"
                  tabler="IconShare"
                  hugeicons="Share01Icon"
                  phosphor="ShareFatIcon"
                  remixicon="RiShareLine"
                />
                New worktree
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="GlobeIcon"
                  tabler="IconWorld"
                  hugeicons="Globe02Icon"
                  phosphor="GlobeIcon"
                  remixicon="RiGlobalLine"
                />
                Connect Codex web
                <DropdownMenuShortcut>
                  <IconPlaceholder
                    lucide="ArrowUpRightIcon"
                    tabler="IconArrowUpRight"
                    hugeicons="ArrowUpRight01Icon"
                    phosphor="ArrowUpRightIcon"
                    remixicon="RiArrowRightUpLine"
                  />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="UploadCloudIcon"
                  tabler="IconCloudUpload"
                  hugeicons="CloudUploadIcon"
                  phosphor="CloudArrowUpIcon"
                  remixicon="RiUploadCloudLine"
                />
                Send to cloud
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="Settings2Icon"
                  tabler="IconSettings"
                  hugeicons="Settings05Icon"
                  phosphor="GearIcon"
                  remixicon="RiSettingsLine"
                />
                Rate limits remaining
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton size="sm" type="button">
              <IconPlaceholder
                lucide="Settings2Icon"
                tabler="IconSettings"
                hugeicons="Settings05Icon"
                phosphor="GearIcon"
                remixicon="RiSettingsLine"
              />
              Default
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                data-icon="inline-end"
              />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="Settings2Icon"
                  tabler="IconSettings"
                  hugeicons="Settings05Icon"
                  phosphor="GearIcon"
                  remixicon="RiSettingsLine"
                />
                Default
                <DropdownMenuShortcut>
                  <IconPlaceholder
                    lucide="CheckIcon"
                    tabler="IconCheck"
                    hugeicons="Tick02Icon"
                    phosphor="CheckIcon"
                    remixicon="RiCheckLine"
                  />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="InfoIcon"
                  tabler="IconInfoCircle"
                  hugeicons="InformationCircleIcon"
                  phosphor="InfoIcon"
                  remixicon="RiInformationLine"
                />
                Full access
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Combobox
            items={branchComboboxGroups}
            autoHighlight
            defaultValue={branches[0]}
            itemToStringValue={(branch: Branch) => {
              return branch.label
            }}
          >
            <ComboboxTrigger
              render={<InputGroupButton size="sm" type="button" />}
            >
              <IconPlaceholder
                lucide="CodeIcon"
                tabler="IconCode"
                hugeicons="CodeIcon"
                phosphor="CodeIcon"
                remixicon="RiCodeLine"
              />
              <span className="max-w-32 truncate">
                <ComboboxValue />
              </span>
            </ComboboxTrigger>
            <ComboboxContent className="w-fit" align="end">
              <ComboboxInput
                placeholder="Search branches"
                showTrigger={false}
              />
              <ComboboxEmpty>No branches found.</ComboboxEmpty>
              <ComboboxList className="max-h-72">
                <ComboboxGroup>
                  <ComboboxItem>
                    <IconPlaceholder
                      lucide="PlusIcon"
                      tabler="IconPlus"
                      hugeicons="Add01Icon"
                      phosphor="PlusIcon"
                      remixicon="RiAddLine"
                    />
                    Create and checkout new branch…
                  </ComboboxItem>
                </ComboboxGroup>
                <ComboboxSeparator />
                <ComboboxGroup items={branches}>
                  <ComboboxLabel className="sr-only">Branches</ComboboxLabel>
                  <ComboboxCollection>
                    {(item: Branch) => {
                      return (
                        <ComboboxItem key={item.value} value={item}>
                          <IconPlaceholder
                            lucide="GitBranchIcon"
                            tabler="IconCode"
                            hugeicons="GitBranchIcon"
                            phosphor="GitBranchIcon"
                            remixicon="RiGitBranchLine"
                          />
                          {item.label}
                        </ComboboxItem>
                      )
                    }}
                  </ComboboxCollection>
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    </form>
  )
}
