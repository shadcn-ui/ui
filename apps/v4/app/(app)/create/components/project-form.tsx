"use client"

import * as React from "react"
import {
  Copy01Icon,
  Globe02Icon,
  HandPointingRight04Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { BASES, type BaseName } from "@/registry/config"
import { Badge } from "@/styles/base-nova/ui/badge"
import { Button } from "@/styles/base-nova/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/styles/base-nova/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/styles/base-nova/ui/field"
import { RadioGroup, RadioGroupItem } from "@/styles/base-nova/ui/radio-group"
import { Switch } from "@/styles/base-nova/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/styles/base-nova/ui/tabs"
import { usePresetCode } from "@/app/(app)/create/hooks/use-design-system"
import {
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(app)/create/lib/search-params"
import {
  getFramework,
  getTemplateValue,
  NO_MONOREPO_FRAMEWORKS,
  TEMPLATES,
} from "@/app/(app)/create/lib/templates"

const TURBOREPO_LOGO =
  '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Turborepo</title><path d="M11.9906 4.1957c-4.2998 0-7.7981 3.501-7.7981 7.8043s3.4983 7.8043 7.7981 7.8043c4.2999 0 7.7982-3.501 7.7982-7.8043s-3.4983-7.8043-7.7982-7.8043m0 11.843c-2.229 0-4.0356-1.8079-4.0356-4.0387s1.8065-4.0387 4.0356-4.0387S16.0262 9.7692 16.0262 12s-1.8065 4.0388-4.0356 4.0388m.6534-13.1249V0C18.9726.3386 24 5.5822 24 12s-5.0274 11.66-11.356 12v-2.9139c4.7167-.3372 8.4516-4.2814 8.4516-9.0861s-3.735-8.749-8.4516-9.0861M5.113 17.9586c-1.2502-1.4446-2.0562-3.2845-2.2-5.3046H0c.151 2.8266 1.2808 5.3917 3.051 7.3668l2.0606-2.0622zM11.3372 24v-2.9139c-2.02-.1439-3.8584-.949-5.3019-2.2018l-2.0606 2.0623c1.975 1.773 4.538 2.9022 7.361 3.0534z"/></svg>'
const ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"
const IS_LOCAL_DEV = ORIGIN.includes("localhost")
const SHADCN_VERSION = process.env.NEXT_PUBLIC_RC ? "@rc" : "@latest"
const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const
type PackageManager = (typeof PACKAGE_MANAGERS)[number]

const APPLY_MODES = [
  {
    value: "full",
    title: "Full preset",
    description:
      "Everything from the preset, including components, theme, and fonts.",
    flag: null,
    label: "full preset",
  },
  {
    value: "theme",
    title: "Theme only",
    description:
      "Theme tokens only, like colors, radii, and shadows. Components stay as they are.",
    flag: "--only theme",
    label: "--only theme",
  },
  {
    value: "font",
    title: "Fonts only",
    description:
      "Only preset fonts for body and headings. Components stay as they are.",
    flag: "--only font",
    label: "--only font",
  },
] as const
type ApplyMode = (typeof APPLY_MODES)[number]["value"]

export function ProjectForm({
  className,
}: React.ComponentProps<typeof Button>) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useDesignSystemSearchParams()
  const presetCode = usePresetCode()
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)
  const [applyMode, setApplyMode] = React.useState<ApplyMode>("full")

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
    const pointerFlag = params.pointer ? " --pointer" : ""
    const flags = `${presetFlag}${baseFlag}${templateFlag}${monorepoFlag}${rtlFlag}${pointerFlag}`

    return IS_LOCAL_DEV
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
  }, [
    framework,
    isMonorepo,
    params.base,
    params.pointer,
    params.rtl,
    presetCode,
  ])

  const command = commands[packageManager]

  const applyCommands = React.useMemo(() => {
    const presetFlag = ` --preset ${presetCode}`
    const onlyFlag =
      applyMode === "theme"
        ? " --only theme"
        : applyMode === "font"
          ? " --only font"
          : ""
    const flags = `${presetFlag}${onlyFlag}`

    return IS_LOCAL_DEV
      ? {
          pnpm: `shadcn apply${flags}`,
          npm: `shadcn apply${flags}`,
          yarn: `shadcn apply${flags}`,
          bun: `shadcn apply${flags}`,
        }
      : {
          pnpm: `pnpm dlx shadcn${SHADCN_VERSION} apply${flags}`,
          npm: `npx shadcn${SHADCN_VERSION} apply${flags}`,
          yarn: `yarn dlx shadcn${SHADCN_VERSION} apply${flags}`,
          bun: `bunx --bun shadcn${SHADCN_VERSION} apply${flags}`,
        }
  }, [applyMode, presetCode])

  const applyCommand = applyCommands[packageManager]
  const currentApplyMode = APPLY_MODES.find((m) => m.value === applyMode)

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

  const handleCopyApply = React.useCallback(() => {
    copyToClipboardWithMeta(applyCommand, {
      name: "copy_apply_command",
      properties: {
        command: applyCommand,
        applyMode,
      },
    })
    setHasCopied(true)
  }, [applyCommand, applyMode])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className={cn(className)} />}>
        Get Code
      </DialogTrigger>
      <DialogContent className="dark top-[64px] no-scrollbar flex max-h-[calc(100svh-2rem)] translate-y-0 flex-col rounded-2xl p-0 shadow-xl **:data-[slot=dialog-close]:top-4.5 **:data-[slot=dialog-close]:right-4 **:data-[slot=field-separator]:h-2 sm:max-w-sm">
        <Tabs className="min-w-0 flex-1 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="border-b px-6 py-4">
            <TabsList>
              <TabsTrigger value="new-project">New Project</TabsTrigger>
              <TabsTrigger value="existing-project">
                Existing Project
              </TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent
            value="new-project"
            className="no-scrollbar overflow-y-auto"
          >
            <FieldGroup className="px-6 py-4">
              <Field className="gap-3">
                <FieldLabel>Template</FieldLabel>
                <TemplateGrid
                  template={params.template}
                  setParams={setParams}
                />
              </Field>
              <FieldSeparator className="-mx-6" />
              <Field>
                <FieldLabel>Base</FieldLabel>
                <BaseGrid base={params.base} setParams={setParams} />
              </Field>
              <FieldSeparator className="-mx-6" />
              <FieldSet>
                <FieldLegend variant="label" className="sr-only">
                  Options
                </FieldLegend>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="pointer">
                    <HugeiconsIcon
                      icon={HandPointingRight04Icon}
                      className="size-4 -rotate-90"
                    />
                    Use pointer on buttons
                  </FieldLabel>
                  <Switch
                    id="pointer"
                    checked={params.pointer}
                    onCheckedChange={(checked) =>
                      setParams({ pointer: checked === true })
                    }
                  />
                </Field>
                <FieldSeparator className="-mx-6" />
                <Field
                  orientation="horizontal"
                  data-disabled={hasMonorepo ? undefined : "true"}
                >
                  <FieldLabel htmlFor="monorepo">
                    <span
                      className="size-4 text-neutral-100 [&_svg]:size-4 [&_svg]:fill-current"
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
                <FieldSeparator className="-mx-6" />
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
            <DialogFooter className="m-0 min-w-0 p-6">
              <div className="flex w-full min-w-0 flex-col gap-3">
                <Tabs
                  value={packageManager}
                  onValueChange={(value) => {
                    setConfig((prev) => ({
                      ...prev,
                      packageManager: value as PackageManager,
                    }))
                  }}
                  className="min-w-0 gap-0 overflow-hidden rounded-xl border-0 ring-1 ring-border"
                >
                  <div className="flex items-center gap-2 py-1 pr-1.5 pl-1">
                    <TabsList className="bg-transparent font-mono">
                      {PACKAGE_MANAGERS.map((manager) => {
                        return (
                          <TabsTrigger
                            key={manager}
                            value={manager}
                            className="py-0 leading-none data-[state=active]:shadow-none"
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
                        <div className="relative overflow-hidden border-t bg-popover p-3">
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
          </TabsContent>
          <TabsContent
            value="existing-project"
            className="no-scrollbar overflow-y-auto"
          >
            <FieldGroup className="px-6 py-4">
              <FieldSet className="gap-3">
                <FieldLegend variant="label">Apply Preset</FieldLegend>
                <FieldDescription>
                  Pick which parts of the preset to apply.
                </FieldDescription>
                <ApplyModeGrid mode={applyMode} setMode={setApplyMode} />
              </FieldSet>
            </FieldGroup>
            <DialogFooter className="m-0 min-w-0 p-6">
              <div className="flex w-full min-w-0 flex-col gap-3">
                <Tabs
                  value={packageManager}
                  onValueChange={(value) => {
                    setConfig((prev) => ({
                      ...prev,
                      packageManager: value as PackageManager,
                    }))
                  }}
                  className="min-w-0 gap-0 overflow-hidden rounded-xl border-0 ring-1 ring-border"
                >
                  <div className="flex items-center gap-2 py-1 pr-1.5 pl-1">
                    <TabsList className="bg-transparent font-mono">
                      {PACKAGE_MANAGERS.map((manager) => {
                        return (
                          <TabsTrigger
                            key={manager}
                            value={manager}
                            className="py-0 leading-none data-[state=active]:shadow-none"
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
                      onClick={handleCopyApply}
                    >
                      {hasCopied ? (
                        <HugeiconsIcon icon={Tick02Icon} />
                      ) : (
                        <HugeiconsIcon icon={Copy01Icon} />
                      )}
                      <span className="sr-only">Copy command</span>
                    </Button>
                  </div>
                  {Object.entries(applyCommands).map(([key, cmd]) => {
                    return (
                      <TabsContent key={key} value={key}>
                        <div className="relative overflow-hidden border-t bg-popover p-3">
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
                <Button onClick={handleCopyApply} className="h-9 w-full">
                  {hasCopied ? "Copied" : "Copy Command"}
                </Button>
              </div>
            </DialogFooter>
          </TabsContent>
        </Tabs>
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
      className="grid grid-cols-2 gap-2"
    >
      {TEMPLATES.map((item) => (
        <FieldLabel
          key={item.value}
          htmlFor={`template-${item.value}`}
          className="block w-full"
        >
          <Field
            orientation="horizontal"
            className="w-full rounded-md transition-colors duration-150 hover:bg-neutral-700/45"
          >
            <FieldContent className="flex flex-row items-center gap-2 px-2.5 py-1.5">
              <div
                className="size-4 text-neutral-100 [&_svg]:size-4 *:[svg]:text-neutral-100!"
                dangerouslySetInnerHTML={{
                  __html: item.logo,
                }}
              ></div>
              <FieldTitle>{item.title}</FieldTitle>
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

const ApplyModeGrid = React.memo(function ApplyModeGrid({
  mode,
  setMode,
}: {
  mode: ApplyMode
  setMode: (mode: ApplyMode) => void
}) {
  return (
    <RadioGroup
      value={mode}
      onValueChange={(value) => setMode(value as ApplyMode)}
      aria-label="Apply"
    >
      {APPLY_MODES.map((option) => (
        <FieldLabel key={option.value} htmlFor={`apply-${option.value}`}>
          <Field orientation="horizontal">
            <RadioGroupItem value={option.value} id={`apply-${option.value}`} />
            <FieldContent>
              <FieldTitle>{option.title}</FieldTitle>
              <FieldDescription>{option.description}</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
})

const BaseGrid = React.memo(function BaseGrid({
  base,
  setParams,
}: {
  base: DesignSystemSearchParams["base"]
  setParams: ReturnType<typeof useDesignSystemSearchParams>[1]
}) {
  const handleBaseChange = React.useCallback(
    (value: string) => {
      setParams({ base: value as BaseName })
    },
    [setParams]
  )

  return (
    <RadioGroup
      value={base}
      onValueChange={handleBaseChange}
      aria-label="Base"
      className="grid grid-cols-2 gap-2"
    >
      {BASES.map((item) => (
        <FieldLabel
          key={item.name}
          htmlFor={`base-${item.name}`}
          className="block w-full"
        >
          <Field
            orientation="horizontal"
            className="w-full rounded-md transition-colors duration-150 hover:bg-neutral-700/45"
          >
            <FieldContent className="flex flex-row items-center gap-2 px-2.5 py-1.5">
              <div
                className="size-4 text-neutral-100 [&_svg]:size-4 *:[svg]:text-neutral-100!"
                dangerouslySetInnerHTML={{
                  __html: item.meta?.logo ?? "",
                }}
              />
              <FieldTitle>{item.title}</FieldTitle>
            </FieldContent>
            <RadioGroupItem
              value={item.name}
              id={`base-${item.name}`}
              className="sr-only absolute"
            />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
})
