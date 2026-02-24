"use client"

import * as React from "react"
import {
  ComputerTerminal01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { BASES } from "@/registry/config"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/new-york-v4/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import { usePresetCode } from "@/app/(create)/hooks/use-design-system"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

const TEMPLATES = [
  { value: "next", title: "Next.js" },
  { value: "start", title: "TanStack Start" },
  { value: "react-router", title: "React Router" },
  { value: "vite", title: "Vite" },
  { value: "next-monorepo", title: "Next.js (Monorepo)" },
] as const

export function ProjectForm() {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useDesignSystemSearchParams()
  const presetCode = usePresetCode()
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  const packageManager = config.packageManager || "pnpm"

  const commands = React.useMemo(() => {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"
    const isLocalDev = origin.includes("localhost")
    const baseFlag = params.base ? ` --base ${params.base}` : ""
    const rtlFlag = params.rtl ? " --rtl" : ""
    const templateFlag =
      params.template && params.template !== "existing"
        ? ` --template ${params.template}`
        : ""
    const flags = `${baseFlag}${rtlFlag}`

    return isLocalDev
      ? {
          pnpm: `shadcn init${flags} --preset ${presetCode}${templateFlag}`,
          npm: `shadcn init${flags} --preset ${presetCode}${templateFlag}`,
          yarn: `shadcn init${flags} --preset ${presetCode}${templateFlag}`,
          bun: `shadcn init${flags} --preset ${presetCode}${templateFlag}`,
        }
      : {
          pnpm: `pnpm dlx shadcn@latest init${flags} --preset ${presetCode}${templateFlag}`,
          npm: `npx shadcn@latest init${flags} --preset ${presetCode}${templateFlag}`,
          yarn: `yarn dlx shadcn@latest init${flags} --preset ${presetCode}${templateFlag}`,
          bun: `bunx --bun shadcn@latest init${flags} --preset ${presetCode}${templateFlag}`,
        }
  }, [presetCode, params.base, params.rtl, params.template])

  const command = commands[packageManager]

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const handleCopy = React.useCallback(() => {
    const properties: Record<string, string> = {
      command,
    }
    if (params.template) {
      properties.template = params.template
    }
    copyToClipboardWithMeta(command, {
      name: "copy_npm_command",
      properties,
    })
    setHasCopied(true)
  }, [command, params.template])

  const selectedTemplate = TEMPLATES.find(
    (template) => template.value === params.template
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="hidden h-[31px] rounded-lg pl-2 md:flex">
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="dialog-ring min-w-0 overflow-hidden rounded-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription className="text-balance">
            Configure your project to use shadcn/ui.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="template">Template</FieldLabel>
            <Select
              value={params.template ?? ""}
              onValueChange={(value) => {
                setParams({
                  template: (value || null) as typeof params.template,
                })
              }}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="existing">Existing project</SelectItem>
                  {TEMPLATES.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              See the{" "}
              <a
                href="/docs/installation"
                className="text-foreground underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                installation guides
              </a>{" "}
              for more templates and frameworks.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="base">Component Library</FieldLabel>
            <Select
              value={params.base}
              onValueChange={(value) => {
                setParams({
                  base: value as "radix" | "base",
                })
              }}
            >
              <SelectTrigger id="base">
                <SelectValue placeholder="Select a component library" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {BASES.map((base) => (
                    <SelectItem key={base.name} value={base.name}>
                      {base.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field orientation="horizontal" className="items-center">
            <FieldContent className="gap-0.5">
              <FieldLabel htmlFor="rtl">Enable RTL</FieldLabel>
              <FieldDescription className="text-balance">
                Enable right-to-left support.
                {selectedTemplate && (
                  <>
                    {" "}
                    See the{" "}
                    <a
                      href={`/docs/rtl/${params.template === "next-monorepo" ? "next" : params.template}`}
                      className="text-foreground underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      RTL setup guide
                    </a>{" "}
                    for {selectedTemplate.title}.
                  </>
                )}
              </FieldDescription>
            </FieldContent>
            <Switch
              id="rtl"
              checked={params.rtl}
              onCheckedChange={(checked) =>
                setParams({ rtl: checked === true })
              }
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="bg-muted/30 -mx-6 mt-2 -mb-6 flex min-w-0 flex-col gap-3 border-t p-6 sm:flex-col">
          <Tabs
            value={packageManager}
            onValueChange={(value) => {
              setConfig({
                ...config,
                packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
              })
            }}
            className="bg-surface min-w-0 gap-0 overflow-hidden rounded-lg border"
          >
            <div className="flex items-center gap-2 px-1.5 py-1">
              <TabsList className="*:data-[slot=tabs-trigger]:data-[state=active]:border-input h-auto rounded-none bg-transparent p-0 font-mono group-data-[orientation=horizontal]/tabs:h-8 *:data-[slot=tabs-trigger]:h-7 *:data-[slot=tabs-trigger]:border *:data-[slot=tabs-trigger]:border-transparent *:data-[slot=tabs-trigger]:pt-0.5 *:data-[slot=tabs-trigger]:shadow-none!">
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
                <TabsTrigger value="bun">bun</TabsTrigger>
              </TabsList>
              <Button
                size="icon-sm"
                variant="ghost"
                className="ml-auto size-7 rounded-lg"
                onClick={handleCopy}
              >
                {hasCopied ? (
                  <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                ) : (
                  <HugeiconsIcon icon={Copy01Icon} className="size-4" />
                )}
                <span className="sr-only">Copy command</span>
              </Button>
            </div>
            {Object.entries(commands).map(([key, cmd]) => {
              return (
                <TabsContent key={key} value={key}>
                  <div className="bg-surface border-border/50 text-surface-foreground relative overflow-hidden border-t px-3 py-3">
                    <div className="no-scrollbar overflow-x-auto">
                      <code className="font-mono text-sm whitespace-nowrap">
                        {cmd}
                      </code>
                    </div>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
          <Button
            size="sm"
            onClick={handleCopy}
            className="h-9 w-full rounded-lg"
          >
            Copy Command
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
