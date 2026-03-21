"use client"

import * as React from "react"
import {
  ComputerTerminal01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
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
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/registry/new-york-v4/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

const TEMPLATES = [
  {
    value: "next",
    title: "Next.js",
    logo: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Next.js</title><path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" fill="currentColor"/></svg>',
  },
  {
    value: "start",
    title: "TanStack Start",
    logo: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>TanStack</title><path d="M11.078.042c.316-.042.65-.014.97-.014 1.181 0 2.341.184 3.472.532a12.3 12.3 0 0 1 3.973 2.086 11.9 11.9 0 0 1 3.432 4.33c1.446 3.15 1.436 6.97-.046 10.107-.958 2.029-2.495 3.727-4.356 4.965-1.518 1.01-3.293 1.629-5.1 1.848-2.298.279-4.784-.129-6.85-1.188-3.88-1.99-6.518-5.994-6.57-10.382-.01-.846.003-1.697.17-2.534.273-1.365.748-2.683 1.463-3.88a12 12 0 0 1 2.966-3.36A12.3 12.3 0 0 1 9.357.3a12 12 0 0 1 1.255-.2l.133-.016zM7.064 19.99c-.535.057-1.098.154-1.557.454.103.025.222 0 .33 0 .258 0 .52-.01.778.002.647.028 1.32.131 1.945.303.8.22 1.505.65 2.275.942.813.307 1.622.402 2.484.402.435 0 .866-.001 1.287-.12-.22-.117-.534-.095-.778-.144a11 11 0 0 1-1.556-.416 12 12 0 0 1-1.093-.467l-.23-.108a15 15 0 0 0-1.012-.44c-.905-.343-1.908-.512-2.873-.408m.808-2.274c-1.059 0-2.13.187-3.083.667q-.346.177-.659.41c-.063.046-.175.106-.199.188s.061.151.11.204c.238-.127.464-.261.718-.357 1.64-.624 3.63-.493 5.268.078.817.285 1.569.712 2.365 1.046.89.374 1.798.616 2.753.74 1.127.147 2.412.028 3.442-.48.362-.179.865-.451 1.018-.847-.189.017-.36.098-.539.154a9 9 0 0 1-.868.222c-.994.2-2.052.24-3.053.06-.943-.17-1.82-.513-2.693-.873l-.111-.046-.223-.092-.112-.046a26 26 0 0 0-1.35-.527c-.89-.31-1.842-.5-2.784-.5M9.728 1.452c-1.27.28-2.407.826-3.502 1.514-.637.4-1.245.81-1.796 1.323-.82.765-1.447 1.695-1.993 2.666-.563 1-.924 2.166-1.098 3.297-.172 1.11-.2 2.277-.004 3.388.245 1.388.712 2.691 1.448 3.897.248-.116.424-.38.629-.557.414-.359.85-.691 1.317-.978a3.5 3.5 0 0 1 .539-.264c.07-.029.187-.055.22-.132.053-.124-.045-.34-.062-.468a7 7 0 0 1-.068-1.109 9.7 9.7 0 0 1 .61-3.177c.29-.76.73-1.45 1.254-2.069.177-.21.365-.405.56-.6.115-.114.258-.212.33-.359-.376 0-.751.108-1.108.218-.769.237-1.518.588-2.155 1.084-.291.226-.504.522-.779.76-.084.073-.235.17-.352.116-.176-.083-.149-.43-.169-.59-.078-.612.154-1.387.45-1.918.473-.852 1.348-1.58 2.376-1.555.444.011.833.166 1.257.266-.107-.153-.252-.264-.389-.39a5.4 5.4 0 0 0-1.107-.8c-.163-.085-.338-.136-.509-.2-.086-.03-.195-.074-.227-.17-.06-.177.26-.342.377-.417.453-.289 1.01-.527 1.556-.54.854-.021 1.688.452 2.04 1.258.123.284.16.583.184.885l.004.057.006.085.002.029.005.057.004.056c.268-.218.457-.54.718-.774.612-.547 1.45-.79 2.245-.544a2.97 2.97 0 0 1 1.71 1.378c.097.173.365.595.171.767-.152.134-.344.03-.504-.026a3 3 0 0 0-.372-.094l-.068-.014-.069-.013a3.9 3.9 0 0 0-1.377-.002c-.282.05-.557.15-.838.192v.06c.768.006 1.51.444 1.89 1.109.157.275.235.59.295.9.075.38.022.796-.082 1.168-.035.125-.098.336-.247.365-.106.02-.195-.085-.256-.155a4.6 4.6 0 0 0-.492-.522 20 20 0 0 0-1.467-1.14c-.267-.19-.56-.44-.868-.556.087.208.171.402.2.63.088.667-.192 1.296-.612 1.798a2.6 2.6 0 0 1-.426.427c-.067.05-.151.114-.24.1-.277-.044-.31-.463-.353-.677-.144-.726-.086-1.447.114-2.158-.178.09-.307.287-.418.45a5.3 5.3 0 0 0-.612 1.138c-.61 1.617-.604 3.51.186 5.066.088.174.221.15.395.15h.157a3 3 0 0 1 .472.018c.08.01.193 0 .257.06.077.072.036.194.018.282-.05.246-.066.469-.066.72.328-.051.419-.576.535-.84.131-.298.265-.597.387-.9.06-.148.14-.314.119-.479-.024-.185-.157-.381-.25-.54-.177-.298-.378-.606-.508-.929-.104-.258-.007-.58.286-.672.161-.05.334.049.439.166.22.244.363.609.523.896l1.249 2.248q.159.286.32.57c.043.074.086.188.173.219.077.028.182-.012.26-.027.198-.04.398-.083.598-.12.24-.043.605-.035.778-.222-.253-.08-.545-.075-.808-.057-.158.01-.333.067-.479-.025-.216-.137-.36-.455-.492-.667-.326-.525-.633-1.057-.945-1.59l-.05-.084-.1-.17q-.075-.126-.149-.255c-.037-.066-.092-.153-.039-.227.056-.076.179-.08.29-.081h.021q.066.001.117-.004a10 10 0 0 1 1.347-.107c-.035-.122-.135-.26-.103-.39.071-.292.49-.383.686-.174.131.14.207.334.292.504.113.223.24.44.361.66.211.383.441.757.658 1.138l.055.094.028.047c.093.156.187.314.238.489-.753-.035-1.318-.909-1.646-1.499-.027.095.016.179.05.27q.103.282.262.54c.152.244.326.495.556.673.408.315.945.317 1.436.283.315-.022.708-.165 1.018-.068s.434.438.25.7c-.138.196-.321.27-.55.3.162.346.373.667.527 1.02.064.146.13.37.283.448.102.051.248.003.358 0-.11-.292-.317-.54-.419-.839.31.015.61.176.898.28.567.202 1.128.424 1.687.648l.258.104c.23.092.462.183.689.283.083.037.198.123.29.07.074-.043.123-.146.169-.215a10.3 10.3 0 0 0 1.393-3.208c.75-2.989.106-6.287-1.695-8.783-.692-.96-1.562-1.789-2.522-2.476-2.401-1.718-5.551-2.407-8.44-1.768m4.908 14.904c-.636.166-1.292.317-1.945.401.086.293.296.577.45.84.059.101.122.237.24.281.132.05.292-.03.417-.072-.058-.158-.155-.3-.235-.45-.033-.06-.084-.133-.056-.206.05-.137.263-.13.381-.153.31-.063.617-.142.928-.204.114-.023.274-.085.389-.047.086.03.138.1.187.174l.022.033q.043.07.097.122c.125.113.313.13.472.162-.097-.219-.259-.41-.362-.63-.06-.127-.11-.315-.242-.388-.182-.102-.557.089-.743.137m-4.01-1.457c-.03.38-.147.689-.33 1.019.21.026.423.036.629.087.154.038.296.11.449.153-.082-.224-.233-.423-.35-.63-.12-.208-.226-.462-.398-.63" fill="currentColor"/></svg>',
  },
  {
    value: "vite",
    title: "Vite",
    logo: '<svg xmlns="http://www.w3.org/2000/svg" width="410" height="404" fill="none" viewBox="0 0 410 404"><path fill="var(--foreground)" d="m399.641 59.525-183.998 329.02c-3.799 6.793-13.559 6.833-17.415.073L10.582 59.556C6.38 52.19 12.68 43.266 21.028 44.76l184.195 32.923c1.175.21 2.378.208 3.553-.006l180.343-32.87c8.32-1.517 14.649 7.337 10.522 14.719"/><path fill="var(--background)" d="M292.965 1.574 156.801 28.255a5 5 0 0 0-4.03 4.611l-8.376 141.464c-.197 3.332 2.863 5.918 6.115 5.168l37.91-8.749c3.547-.818 6.752 2.306 6.023 5.873l-11.263 55.153c-.758 3.712 2.727 6.886 6.352 5.785l23.415-7.114c3.63-1.102 7.118 2.081 6.35 5.796l-17.899 86.633c-1.12 5.419 6.088 8.374 9.094 3.728l2.008-3.103 110.954-221.428c1.858-3.707-1.346-7.935-5.418-7.15l-39.022 7.532c-3.667.707-6.787-2.708-5.752-6.296l25.469-88.291c1.036-3.594-2.095-7.012-5.766-6.293"/></svg>',
  },
] as const

export function ToolbarControls() {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useDesignSystemSearchParams()
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  const packageManager = config.packageManager || "pnpm"

  const commands = React.useMemo(() => {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const url = `${origin}/init?base=${params.base}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&radius=${params.radius}&template=${params.template}`
    const templateFlag = params.template ? ` --template ${params.template}` : ""
    return {
      pnpm: `pnpm dlx shadcn@latest create --preset "${url}"${templateFlag}`,
      npm: `npx shadcn@latest create --preset "${url}"${templateFlag}`,
      yarn: `yarn dlx shadcn@latest create --preset "${url}"${templateFlag}`,
      bun: `bunx --bun shadcn@latest create --preset "${url}"${templateFlag}`,
    }
  }, [
    params.base,
    params.style,
    params.baseColor,
    params.theme,
    params.iconLibrary,
    params.font,
    params.menuAccent,
    params.menuColor,
    params.radius,
    params.template,
  ])

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
    setOpen(false)
    setHasCopied(true)
    toast("Command copied to clipboard.", {
      description:
        "Paste and run the command in your terminal to create a new shadcn/ui project.",
      position: "bottom-center",
      classNames: {
        content: "rounded-xl",
        toast: "rounded-xl!",
        description: "text-sm/leading-normal!",
      },
    })
  }, [command, params.template, setOpen])

  const handleCopyFromTabs = React.useCallback(() => {
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
          <HugeiconsIcon
            icon={ComputerTerminal01Icon}
            className="hidden xl:flex"
          />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="dialog-ring min-w-0 overflow-hidden rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription className="text-balance">
            Select a template and run this command to create a{" "}
            {selectedTemplate?.title} + shadcn/ui project.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="template" className="sr-only">
              Template
            </FieldLabel>
            <RadioGroup
              id="template"
              value={params.template}
              onValueChange={(value) => {
                setParams({
                  template: value as "next" | "start" | "vite",
                })
              }}
              className="grid grid-cols-3 gap-2"
            >
              {TEMPLATES.map((template) => (
                <FieldLabel
                  key={template.value}
                  htmlFor={template.value}
                  className="rounded-lg!"
                >
                  <Field className="flex min-w-0 flex-col items-center justify-center gap-2 p-3! text-center *:w-auto!">
                    <RadioGroupItem
                      value={template.value}
                      id={template.value}
                      className="sr-only"
                    />
                    {template.logo && (
                      <div
                        className="text-foreground *:[svg]:text-foreground! size-6 [&_svg]:size-6"
                        dangerouslySetInnerHTML={{
                          __html: template.logo,
                        }}
                      />
                    )}
                    <FieldTitle>{template.title}</FieldTitle>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </Field>
        </FieldGroup>
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
          <div className="flex items-center gap-2 p-2">
            <TabsList className="*:data-[slot=tabs-trigger]:data-[state=active]:border-input h-auto rounded-none bg-transparent p-0 font-mono *:data-[slot=tabs-trigger]:border *:data-[slot=tabs-trigger]:border-transparent *:data-[slot=tabs-trigger]:pt-0.5 *:data-[slot=tabs-trigger]:shadow-none!">
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
              <TabsTrigger value="npm">npm</TabsTrigger>
              <TabsTrigger value="yarn">yarn</TabsTrigger>
              <TabsTrigger value="bun">bun</TabsTrigger>
            </TabsList>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="ml-auto size-7 rounded-lg"
                  onClick={handleCopyFromTabs}
                >
                  {hasCopied ? (
                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                  ) : (
                    <HugeiconsIcon icon={Copy01Icon} className="size-4" />
                  )}
                  <span className="sr-only">Copy command</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasCopied ? "Copied!" : "Copy command"}
              </TooltipContent>
            </Tooltip>
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
        <DialogFooter className="bg-muted/50 -mx-6 mt-2 -mb-6 flex flex-col gap-2 border-t p-6 sm:flex-col">
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
