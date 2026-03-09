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
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/examples/base/ui/field"
import { RadioGroup, RadioGroupItem } from "@/examples/base/ui/radio-group"
import { Switch } from "@/examples/base/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/base/ui/tabs"
import { Copy01Icon, Globe02Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { usePresetCode } from "@/app/(create)/hooks/use-design-system"
import {
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"
import {
  getFramework,
  getTemplateValue,
  NO_MONOREPO_FRAMEWORKS,
  TEMPLATES,
} from "@/app/(create)/lib/templates"

const TURBOREPO_LOGO =
  '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Turborepo</title><path d="M11.9906 4.1957c-4.2998 0-7.7981 3.501-7.7981 7.8043s3.4983 7.8043 7.7981 7.8043c4.2999 0 7.7982-3.501 7.7982-7.8043s-3.4983-7.8043-7.7982-7.8043m0 11.843c-2.229 0-4.0356-1.8079-4.0356-4.0387s1.8065-4.0387 4.0356-4.0387S16.0262 9.7692 16.0262 12s-1.8065 4.0388-4.0356 4.0388m.6534-13.1249V0C18.9726.3386 24 5.5822 24 12s-5.0274 11.66-11.356 12v-2.9139c4.7167-.3372 8.4516-4.2814 8.4516-9.0861s-3.735-8.749-8.4516-9.0861M5.113 17.9586c-1.2502-1.4446-2.0562-3.2845-2.2-5.3046H0c.151 2.8266 1.2808 5.3917 3.051 7.3668l2.0606-2.0622zM11.3372 24v-2.9139c-2.02-.1439-3.8584-.949-5.3019-2.2018l-2.0606 2.0623c1.975 1.773 4.538 2.9022 7.361 3.0534z"/></svg>'
const ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"
const IS_LOCAL_DEV = ORIGIN.includes("localhost")
const SHADCN_VERSION = process.env.NEXT_PUBLIC_RC ? "@rc" : "@latest"
const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const
type PackageManager = (typeof PACKAGE_MANAGERS)[number]

export function ProjectForm({
  className,
}: React.ComponentProps<typeof Button>) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useDesignSystemSearchParams()
  const presetCode = usePresetCode()
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  const packageManager = (config.packageManager || "pnpm") as PackageManager
  const framework = React.useMemo(
    () => getFramework(params.template ?? "next"),
    [params.template]
  )
  const isMonorepo = React.useMemo(
    () => params.template?.endsWith("-monorepo") ?? false,
    [params.template]
  )

  const hasMonorepo = !NO_MONOREPO_FRAMEWORKS.includes(
    framework as (typeof NO_MONOREPO_FRAMEWORKS)[number]
  )

  const commands = React.useMemo(() => {
    const presetFlag = ` --preset ${presetCode}`
    const baseFlag = params.base !== "radix" ? ` --base ${params.base}` : ""
    const templateFlag = ` --template ${framework}`
    const monorepoFlag = isMonorepo ? " --monorepo" : ""
    const rtlFlag = params.rtl ? " --rtl" : ""
    const flags = `${presetFlag}${baseFlag}${templateFlag}${monorepoFlag}${rtlFlag}`

    return IS_LOCAL_DEV && !process.env.NEXT_PUBLIC_RC
      ? {
          pnpm: `shadcn init${flags}`,
          npm: `shadcn init${flags}`,
          yarn: `shadcn init${flags}`,
          bun: `shadcn init${flags}`,
        }
      : {
          pnpm: `pnpm dlx shadcn${SHADCN_VERSION} init${flags}`,
          npm: `npx shadcn${SHADCN_VERSION} init${flags}`,
          yarn: `yarn dlx shadcn${SHADCN_VERSION} init${flags}`,
          bun: `bunx --bun shadcn${SHADCN_VERSION} init${flags}`,
        }
  }, [framework, isMonorepo, params.base, params.rtl, presetCode])

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className={cn(className)} />}>
        Create Project
      </DialogTrigger>
      <DialogContent className="min-w-0 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Pick a template and configure your project. Available for all major
            React frameworks.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel className="sr-only">Template</FieldLabel>
            <TemplateGrid template={params.template} setParams={setParams} />
          </Field>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend variant="label" className="sr-only">
              Options
            </FieldLegend>
            <Field
              orientation="horizontal"
              data-disabled={hasMonorepo ? undefined : "true"}
            >
              <FieldLabel htmlFor="monorepo">
                <span
                  className="size-4 text-foreground [&_svg]:size-4 [&_svg]:fill-current"
                  dangerouslySetInnerHTML={{
                    __html: TURBOREPO_LOGO,
                  }}
                />
                Create a monorepo
              </FieldLabel>
              <Switch
                id="monorepo"
                checked={params.template?.endsWith("-monorepo") ?? false}
                disabled={!hasMonorepo}
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
            <FieldSeparator />
            <Field orientation="horizontal">
              <FieldLabel htmlFor="rtl">
                <HugeiconsIcon icon={Globe02Icon} className="size-4" />
                Enable RTL support
              </FieldLabel>
              <Switch
                id="rtl"
                checked={params.rtl}
                onCheckedChange={(checked) =>
                  setParams({ rtl: checked === true })
                }
              />
            </Field>
          </FieldSet>
        </FieldGroup>
        <DialogFooter className="min-w-0">
          <div className="flex w-full min-w-0 flex-col gap-3">
            <Tabs
              value={packageManager}
              onValueChange={(value) => {
                setConfig((prev) => ({
                  ...prev,
                  packageManager: value as PackageManager,
                }))
              }}
              className="min-w-0 gap-0 overflow-hidden rounded-lg border bg-surface"
            >
              <div className="flex items-center gap-2 px-1 py-1">
                <TabsList className="font-mono">
                  {PACKAGE_MANAGERS.map((manager) => {
                    return (
                      <TabsTrigger
                        key={manager}
                        value={manager}
                        className="data-[state=active]:shadow-none"
                      >
                        {manager}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="ml-auto"
                  onClick={handleCopy}
                >
                  {hasCopied ? (
                    <HugeiconsIcon icon={Tick02Icon} />
                  ) : (
                    <HugeiconsIcon icon={Copy01Icon} />
                  )}
                  <span className="sr-only">Copy command</span>
                </Button>
              </div>
              {Object.entries(commands).map(([key, cmd]) => {
                return (
                  <TabsContent key={key} value={key}>
                    <div className="relative overflow-hidden border-t border-border/50 bg-surface px-3 py-3 text-surface-foreground">
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
              {hasCopied ? "Copied" : "Copy Command"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const TemplateGrid = React.memo(function TemplateGrid({
  template,
  setParams,
}: {
  template: DesignSystemSearchParams["template"]
  setParams: ReturnType<typeof useDesignSystemSearchParams>[1]
}) {
  const isMonorepo = template?.endsWith("-monorepo") ?? false
  const framework = getFramework(template ?? "next")

  const handleTemplateChange = React.useCallback(
    (value: string) => {
      setParams({
        template: getTemplateValue(
          value,
          isMonorepo
        ) as DesignSystemSearchParams["template"],
      })
    },
    [isMonorepo, setParams]
  )

  return (
    <RadioGroup
      value={framework}
      onValueChange={handleTemplateChange}
      className="grid grid-cols-3 gap-2"
    >
      {TEMPLATES.map((item) => (
        <FieldLabel
          key={item.value}
          htmlFor={`template-${item.value}`}
          className="py-1"
        >
          <Field className="gap-0" orientation="horizontal">
            <FieldContent className="flex flex-col items-center justify-center gap-2">
              <div
                className="size-6 text-foreground [&_svg]:size-6 *:[svg]:text-foreground!"
                dangerouslySetInnerHTML={{
                  __html: item.logo,
                }}
              ></div>
              <FieldTitle className="text-xs">{item.title}</FieldTitle>
            </FieldContent>
            <RadioGroupItem
              value={item.value}
              id={`template-${item.value}`}
              className="sr-only absolute"
            />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
})
