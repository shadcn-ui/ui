"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/base/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/examples/base/ui/field"
import { Switch } from "@/examples/base/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/base/ui/tabs"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import {
  ALL_TEMPLATES,
  getFramework,
  getTemplateValue,
  NO_MONOREPO_FRAMEWORKS,
  TEMPLATES,
} from "@/app/(create)/components/template-picker"
import { usePresetCode } from "@/app/(create)/hooks/use-design-system"
import {
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

export function ProjectForm() {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useDesignSystemSearchParams()
  const presetCode = usePresetCode()
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)
  const [hasCopiedLaravel, setHasCopiedLaravel] = React.useState(false)

  const packageManager = config.packageManager || "pnpm"

  const isLaravel = getFramework(params.template ?? "next") === "laravel"

  const commands = React.useMemo(() => {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"
    const isLocalDev = origin.includes("localhost")
    const presetFlag = ` --preset ${presetCode}`
    const framework = getFramework(params.template ?? "next")
    const isMonorepo = params.template?.endsWith("-monorepo") ?? false
    // Laravel doesn't use --template since it has its own scaffolding.
    const templateFlag =
      params.template && !isLaravel ? ` --template ${framework}` : ""
    const monorepoFlag = isMonorepo ? " --monorepo" : ""
    const rtlFlag = params.rtl ? " --rtl" : ""
    const flags = `${presetFlag}${templateFlag}${monorepoFlag}${rtlFlag}`

    return isLocalDev
      ? {
          pnpm: `shadcn init${flags}`,
          npm: `shadcn init${flags}`,
          yarn: `shadcn init${flags}`,
          bun: `shadcn init${flags}`,
        }
      : {
          pnpm: `pnpm dlx shadcn@latest init${flags}`,
          npm: `npx shadcn@latest init${flags}`,
          yarn: `yarn dlx shadcn@latest init${flags}`,
          bun: `bunx --bun shadcn@latest init${flags}`,
        }
  }, [presetCode, params.rtl, params.template, isLaravel])

  const command = commands[packageManager]

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  React.useEffect(() => {
    if (hasCopiedLaravel) {
      const timer = setTimeout(() => setHasCopiedLaravel(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopiedLaravel])

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        Create Project
      </DialogTrigger>
      <DialogContent className="min-w-0 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Configure your project to use shadcn/ui.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Template</FieldLabel>
            <TemplateGrid params={params} setParams={setParams} />
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
          {!isLaravel && (
            <FieldLabel htmlFor="monorepo">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Monorepo</FieldTitle>
                  <FieldDescription>
                    Use a Turborepo monorepo with a shared UI package.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="monorepo"
                  checked={params.template?.endsWith("-monorepo") ?? false}
                  onCheckedChange={(checked) => {
                    const framework = getFramework(params.template ?? "next")
                    setParams({
                      template: getTemplateValue(
                        framework,
                        checked === true
                      ) as typeof params.template,
                    })
                  }}
                />
              </Field>
            </FieldLabel>
          )}
          <FieldLabel htmlFor="rtl">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Enable RTL</FieldTitle>
                <FieldDescription>
                  Add right-to-left support for your project.
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
          </FieldLabel>
        </FieldGroup>
        <DialogFooter className="bg-muted/30 -mx-6 mt-2 -mb-6 flex min-w-0 flex-col gap-3 border-t p-6 sm:flex-col">
          {isLaravel && (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">
                <a
                  href="https://laravel.com/docs#creating-a-laravel-project"
                  className="text-foreground underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create a new Laravel project
                </a>
                , then run the following command.
              </p>
              <div className="bg-surface min-w-0 overflow-hidden rounded-lg border">
                <div className="flex items-center py-1.5 pr-1.5 pl-3">
                  <div className="no-scrollbar min-w-0 flex-1 overflow-x-auto">
                    <code className="font-mono text-sm whitespace-nowrap">
                      laravel new example-app
                    </code>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="ml-2 size-7 shrink-0"
                    onClick={() => {
                      copyToClipboardWithMeta("laravel new example-app", {
                        name: "copy_npm_command",
                        properties: { command: "laravel new example-app" },
                      })
                      setHasCopiedLaravel(true)
                    }}
                  >
                    {hasCopiedLaravel ? (
                      <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                    ) : (
                      <HugeiconsIcon icon={Copy01Icon} className="size-4" />
                    )}
                    <span className="sr-only">Copy command</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
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
                className="ml-auto size-7"
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
          <Button onClick={handleCopy} className="h-9 w-full">
            Copy Command
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TemplateGrid({
  params,
  setParams,
}: {
  params: DesignSystemSearchParams
  setParams: ReturnType<typeof useDesignSystemSearchParams>[1]
}) {
  const isMonorepo = params.template?.endsWith("-monorepo") ?? false
  const framework = getFramework(params.template ?? "next")

  return (
    <div className="flex flex-col gap-2">
      {TEMPLATES.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
        >
          {row.map((template) => (
            <button
              key={template.value}
              type="button"
              onClick={() =>
                setParams({
                  template: getTemplateValue(
                    template.value,
                    isMonorepo
                  ) as typeof params.template,
                })
              }
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                framework === template.value
                  ? "border-foreground bg-muted"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <div
                className="text-foreground *:[svg]:text-foreground! size-5 *:[svg]:size-5"
                dangerouslySetInnerHTML={{
                  __html: template.logo,
                }}
              />
              <span className="text-foreground text-xs font-medium">
                {template.title}
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
