import * as fs from "fs"
import * as execaModule from "execa"
import { createRemoveCommand } from "../../src/commands/remove"
import prompts from "prompts"

import {getConfig} from "../../src/utils/get-config"
import * as registryModule from "../../src/utils/registry"
import * as getConfigModule from "../../src/utils/get-config"
// import {logger} from "../../src/utils/logger"
import { expect, SpyInstance, test, vi, beforeAll, beforeEach, afterEach } from "vitest"
import path from "path"
import { Command } from "commander"


vi.mock("execa")
vi.mock("../../src/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  }
}))
vi.mock("ora", () => ({
  default: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    succeed: vi.fn(),
  })
}))
vi.mock("getConfig", vi.fn())

let shadcnCli: Command

let config: Awaited<ReturnType<typeof getConfig>>
let mockGetConfig: SpyInstance<[cwd: string], Promise<typeof config | null>>

let mockProcessExit: SpyInstance<[code?: number | undefined], never>
let mockFsRm: SpyInstance<[path: fs.PathLike, options?: fs.RmOptions | undefined], Promise<void>>
let mockExeca: SpyInstance<[file: string, options?: execaModule.Options<null> | undefined], execaModule.ExecaChildProcess<Buffer>>

const COMPONENT_NOT_USED_BY_OTHER = {
    name: "alert-dialog",
    dependencies: ["@radix-ui/react-alert-dialog"],
    registryDependencies: ["button", "dialog"],
    type: "components:ui",
    files: ["alert-dialog.tsx"],
  }

const COMPONENT_WITH_DEPENDANTS = {
    name: "button",
    dependencies: ["@radix-ui/react-slot"],
    type: "components:ui",
    files: ["button.tsx"],
  }

const index = [
  COMPONENT_WITH_DEPENDANTS,
  COMPONENT_NOT_USED_BY_OTHER,
  {
    name: "dialog",
    dependencies: ["@radix-ui/react-dialog"],
    registryDependencies: ["button"],
    type: "components:ui",
    files: ["dialog.tsx"],
  },
  {
    name: "input",
    registryDependencies: ["button"],
    type: "components:ui",
    files: ["input.tsx"],
  },
  {
    name: "form",
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "@hookform/resolvers",
      "zod",
      "react-hook-form"
    ],
    registryDependencies: [
      "button",
      "label"
    ],
    files: [
      "ui/form.tsx"
    ],
    type: "components:ui"
  },
]

const fetchTreePayload = [
  {
    name: "button",
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        name: "button.tsx",
        content: "import * as React from \"react\"\nimport { Slot } from \"@radix-ui/react-slot\"\nimport { cva, type VariantProps } from \"class-variance-authority\"\n\nimport { cn } from \"@/lib/utils\"\n\nconst buttonVariants = cva(\n  \"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50\",\n  {\n    variants: {\n      variant: {\n        default:\n          \"bg-primary text-primary-foreground shadow hover:bg-primary/90\",\n        destructive:\n          \"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90\",\n        outline:\n          \"border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground\",\n        secondary:\n          \"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80\",\n        ghost: \"hover:bg-accent hover:text-accent-foreground\",\n        link: \"text-primary underline-offset-4 hover:underline\",\n      },\n      size: {\n        default: \"h-9 px-4 py-2\",\n        sm: \"h-8 rounded-md px-3 text-xs\",\n        lg: \"h-10 rounded-md px-8\",\n        icon: \"h-9 w-9\",\n      },\n    },\n    defaultVariants: {\n      variant: \"default\",\n      size: \"default\",\n    },\n  }\n)\n\nexport interface ButtonProps\n  extends React.ButtonHTMLAttributes<HTMLButtonElement>,\n    VariantProps<typeof buttonVariants> {\n  asChild?: boolean\n}\n\nconst Button = React.forwardRef<HTMLButtonElement, ButtonProps>(\n  ({ className, variant, size, asChild = false, ...props }, ref) => {\n    const Comp = asChild ? Slot : \"button\"\n    return (\n      <Comp\n        className={cn(buttonVariants({ variant, size, className }))}\n        ref={ref}\n        {...props}\n      />\n    )\n  }\n)\nButton.displayName = \"Button\"\n\nexport { Button, buttonVariants }\n"
      }
    ],
    type: "components:ui"
  },
  {
    name: "dialog",
    dependencies: ["@radix-ui/react-dialog"],
    files: [
      {
        name: "dialog.tsx",
        content: "\"use client\"\n\nimport * as React from \"react\"\nimport * as DialogPrimitive from \"@radix-ui/react-dialog\"\nimport { Cross2Icon } from \"@radix-ui/react-icons\"\n\nimport { cn } from \"@/lib/utils\"\n\nconst Dialog = DialogPrimitive.Root\n\nconst DialogTrigger = DialogPrimitive.Trigger\n\nconst DialogPortal = DialogPrimitive.Portal\n\nconst DialogClose = DialogPrimitive.Close\n\nconst DialogOverlay = React.forwardRef<\n  React.ElementRef<typeof DialogPrimitive.Overlay>,\n  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>\n>(({ className, ...props }, ref) => (\n  <DialogPrimitive.Overlay\n    ref={ref}\n    className={cn(\n      \"fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0\",\n      className\n    )}\n    {...props}\n  />\n))\nDialogOverlay.displayName = DialogPrimitive.Overlay.displayName\n\nconst DialogContent = React.forwardRef<\n  React.ElementRef<typeof DialogPrimitive.Content>,\n  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>\n>(({ className, children, ...props }, ref) => (\n  <DialogPortal>\n    <DialogOverlay />\n    <DialogPrimitive.Content\n      ref={ref}\n      className={cn(\n        \"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg\",\n        className\n      )}\n      {...props}\n    >\n      {children}\n      <DialogPrimitive.Close className=\"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground\">\n        <Cross2Icon className=\"h-4 w-4\" />\n        <span className=\"sr-only\">Close</span>\n      </DialogPrimitive.Close>\n    </DialogPrimitive.Content>\n  </DialogPortal>\n))\nDialogContent.displayName = DialogPrimitive.Content.displayName\n\nconst DialogHeader = ({\n  className,\n  ...props\n}: React.HTMLAttributes<HTMLDivElement>) => (\n  <div\n    className={cn(\n      \"flex flex-col space-y-1.5 text-center sm:text-left\",\n      className\n    )}\n    {...props}\n  />\n)\nDialogHeader.displayName = \"DialogHeader\"\n\nconst DialogFooter = ({\n  className,\n  ...props\n}: React.HTMLAttributes<HTMLDivElement>) => (\n  <div\n    className={cn(\n      \"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2\",\n      className\n    )}\n    {...props}\n  />\n)\nDialogFooter.displayName = \"DialogFooter\"\n\nconst DialogTitle = React.forwardRef<\n  React.ElementRef<typeof DialogPrimitive.Title>,\n  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>\n>(({ className, ...props }, ref) => (\n  <DialogPrimitive.Title\n    ref={ref}\n    className={cn(\n      \"text-lg font-semibold leading-none tracking-tight\",\n      className\n    )}\n    {...props}\n  />\n))\nDialogTitle.displayName = DialogPrimitive.Title.displayName\n\nconst DialogDescription = React.forwardRef<\n  React.ElementRef<typeof DialogPrimitive.Description>,\n  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>\n>(({ className, ...props }, ref) => (\n  <DialogPrimitive.Description\n    ref={ref}\n    className={cn(\"text-sm text-muted-foreground\", className)}\n    {...props}\n  />\n))\nDialogDescription.displayName = DialogPrimitive.Description.displayName\n\nexport {\n  Dialog,\n  DialogPortal,\n  DialogOverlay,\n  DialogTrigger,\n  DialogClose,\n  DialogContent,\n  DialogHeader,\n  DialogFooter,\n  DialogTitle,\n  DialogDescription,\n}\n"
      }
    ],
    type: "components:ui"
  },
  {
    name: "input",
    files: [
      {
        name: "input.tsx",
        content: "import * as React from \"react\"\n\nimport { cn } from \"@/lib/utils\"\n\nexport interface InputProps\n  extends React.InputHTMLAttributes<HTMLInputElement> {}\n\nconst Input = React.forwardRef<HTMLInputElement, InputProps>(\n  ({ className, type, ...props }, ref) => {\n    return (\n      <input\n        type={type}\n        className={cn(\n          \"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50\",\n          className\n        )}\n        ref={ref}\n        {...props}\n      />\n    )\n  }\n)\nInput.displayName = \"Input\"\n\nexport { Input }\n"
      }
    ],
    type: "components:ui"
  },
  {
    name: "alert-dialog",
    dependencies: [
      "@radix-ui/react-alert-dialog"
    ],
    registryDependencies: [
      "button"
    ],
    files: [
      {
        "name": "alert-dialog.tsx",
        "content": "\"use client\"\n\nimport * as React from \"react\"\nimport * as AlertDialogPrimitive from \"@radix-ui/react-alert-dialog\"\n\nimport { cn } from \"@/lib/utils\"\nimport { buttonVariants } from \"@/registry/new-york/ui/button\"\n\nconst AlertDialog = AlertDialogPrimitive.Root\n\nconst AlertDialogTrigger = AlertDialogPrimitive.Trigger\n\nconst AlertDialogPortal = AlertDialogPrimitive.Portal\n\nconst AlertDialogOverlay = React.forwardRef<\n  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,\n  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>\n>(({ className, ...props }, ref) => (\n  <AlertDialogPrimitive.Overlay\n    className={cn(\n      \"fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0\",\n      className\n    )}\n    {...props}\n    ref={ref}\n  />\n))\nAlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName\n\nconst AlertDialogContent = React.forwardRef<\n  React.ElementRef<typeof AlertDialogPrimitive.Content>,\n  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>\n>(({ className, ...props }, ref) => (\n  <AlertDialogPortal>\n    <AlertDialogOverlay />\n    <AlertDialogPrimitive.Content\n      ref={ref}\n      className={cn(\n        \"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg\",\n        className\n      )}\n      {...props}\n    />\n  </AlertDialogPortal>\n))\nAlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName\n\nconst AlertDialogHeader = ({\n  className,\n  ...props\n}: React.HTMLAttributes<HTMLDivElement>) => (\n  <div\n    className={cn(\n      \"flex flex-col space-y-2 text-center sm:text-left\",\n      className\n    )}\n    {...props}\n  />\n)\nAlertDialogHeader.displayName = \"AlertDialogHeader\"\n\nconst AlertDialogFooter = ({\n  className,\n  ...props\n}: React.HTMLAttributes<HTMLDivElement>) => (\n  <div\n    className={cn(\n      \"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2\",\n      className\n    )}\n    {...props}\n  />\n)\nAlertDialogFooter.displayName = \"AlertDialogFooter\"\n\nconst AlertDialogTitle = React.forwardRef<\n  React.ElementRef<typeof AlertDialogPrimitive.Title>,\n  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>\n>(({ className, ...props }, ref) => (\n  <AlertDialogPrimitive.Title\n    ref={ref}\n    className={cn(\"text-lg font-semibold\", className)}\n    {...props}\n  />\n))\nAlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName\n\nconst AlertDialogDescription = React.forwardRef<\n  React.ElementRef<typeof AlertDialogPrimitive.Description>,\n  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>\n>(({ className, ...props }, ref) => (\n  <AlertDialogPrimitive.Description\n    ref={ref}\n    className={cn(\"text-sm text-muted-foreground\", className)}\n    {...props}\n  />\n))\nAlertDialogDescription.displayName =\n  AlertDialogPrimitive.Description.displayName\n\nconst AlertDialogAction = React.forwardRef<\n  React.ElementRef<typeof AlertDialogPrimitive.Action>,\n  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>\n>(({ className, ...props }, ref) => (\n  <AlertDialogPrimitive.Action\n    ref={ref}\n    className={cn(buttonVariants(), className)}\n    {...props}\n  />\n))\nAlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName\n\nconst AlertDialogCancel = React.forwardRef<\n  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,\n  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>\n>(({ className, ...props }, ref) => (\n  <AlertDialogPrimitive.Cancel\n    ref={ref}\n    className={cn(\n      buttonVariants({ variant: \"outline\" }),\n      \"mt-2 sm:mt-0\",\n      className\n    )}\n    {...props}\n  />\n))\nAlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName\n\nexport {\n  AlertDialog,\n  AlertDialogPortal,\n  AlertDialogOverlay,\n  AlertDialogTrigger,\n  AlertDialogContent,\n  AlertDialogHeader,\n  AlertDialogFooter,\n  AlertDialogTitle,\n  AlertDialogDescription,\n  AlertDialogAction,\n  AlertDialogCancel,\n}\n"
      }
    ],
    type: "components:ui"
  },
  {
    name: "form",
    dependencies: [ "@radix-ui/react-label", "@radix-ui/react-slot", "@hookform/resolvers", "zod", "react-hook-form" ],
    registryDependencies: [ "button", "label" ],
    files: [
      {
        "name": "form.tsx",
        "content": "import * as React from \"react\"\nimport * as LabelPrimitive from \"@radix-ui/react-label\"\nimport { Slot } from \"@radix-ui/react-slot\"\nimport {\n  Controller,\n  ControllerProps,\n  FieldPath,\n  FieldValues,\n  FormProvider,\n  useFormContext,\n} from \"react-hook-form\"\n\nimport { cn } from \"@/lib/utils\"\nimport { Label } from \"@/registry/new-york/ui/label\"\n\nconst Form = FormProvider\n\ntype FormFieldContextValue<\n  TFieldValues extends FieldValues = FieldValues,\n  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>\n> = {\n  name: TName\n}\n\nconst FormFieldContext = React.createContext<FormFieldContextValue>(\n  {} as FormFieldContextValue\n)\n\nconst FormField = <\n  TFieldValues extends FieldValues = FieldValues,\n  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>\n>({\n  ...props\n}: ControllerProps<TFieldValues, TName>) => {\n  return (\n    <FormFieldContext.Provider value={{ name: props.name }}>\n      <Controller {...props} />\n    </FormFieldContext.Provider>\n  )\n}\n\nconst useFormField = () => {\n  const fieldContext = React.useContext(FormFieldContext)\n  const itemContext = React.useContext(FormItemContext)\n  const { getFieldState, formState } = useFormContext()\n\n  const fieldState = getFieldState(fieldContext.name, formState)\n\n  if (!fieldContext) {\n    throw new Error(\"useFormField should be used within <FormField>\")\n  }\n\n  const { id } = itemContext\n\n  return {\n    id,\n    name: fieldContext.name,\n    formItemId: `${id}-form-item`,\n    formDescriptionId: `${id}-form-item-description`,\n    formMessageId: `${id}-form-item-message`,\n    ...fieldState,\n  }\n}\n\ntype FormItemContextValue = {\n  id: string\n}\n\nconst FormItemContext = React.createContext<FormItemContextValue>(\n  {} as FormItemContextValue\n)\n\nconst FormItem = React.forwardRef<\n  HTMLDivElement,\n  React.HTMLAttributes<HTMLDivElement>\n>(({ className, ...props }, ref) => {\n  const id = React.useId()\n\n  return (\n    <FormItemContext.Provider value={{ id }}>\n      <div ref={ref} className={cn(\"space-y-2\", className)} {...props} />\n    </FormItemContext.Provider>\n  )\n})\nFormItem.displayName = \"FormItem\"\n\nconst FormLabel = React.forwardRef<\n  React.ElementRef<typeof LabelPrimitive.Root>,\n  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>\n>(({ className, ...props }, ref) => {\n  const { error, formItemId } = useFormField()\n\n  return (\n    <Label\n      ref={ref}\n      className={cn(error && \"text-destructive\", className)}\n      htmlFor={formItemId}\n      {...props}\n    />\n  )\n})\nFormLabel.displayName = \"FormLabel\"\n\nconst FormControl = React.forwardRef<\n  React.ElementRef<typeof Slot>,\n  React.ComponentPropsWithoutRef<typeof Slot>\n>(({ ...props }, ref) => {\n  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()\n\n  return (\n    <Slot\n      ref={ref}\n      id={formItemId}\n      aria-describedby={\n        !error\n          ? `${formDescriptionId}`\n          : `${formDescriptionId} ${formMessageId}`\n      }\n      aria-invalid={!!error}\n      {...props}\n    />\n  )\n})\nFormControl.displayName = \"FormControl\"\n\nconst FormDescription = React.forwardRef<\n  HTMLParagraphElement,\n  React.HTMLAttributes<HTMLParagraphElement>\n>(({ className, ...props }, ref) => {\n  const { formDescriptionId } = useFormField()\n\n  return (\n    <p\n      ref={ref}\n      id={formDescriptionId}\n      className={cn(\"text-[0.8rem] text-muted-foreground\", className)}\n      {...props}\n    />\n  )\n})\nFormDescription.displayName = \"FormDescription\"\n\nconst FormMessage = React.forwardRef<\n  HTMLParagraphElement,\n  React.HTMLAttributes<HTMLParagraphElement>\n>(({ className, children, ...props }, ref) => {\n  const { error, formMessageId } = useFormField()\n  const body = error ? String(error?.message) : children\n\n  if (!body) {\n    return null\n  }\n\n  return (\n    <p\n      ref={ref}\n      id={formMessageId}\n      className={cn(\"text-[0.8rem] font-medium text-destructive\", className)}\n      {...props}\n    >\n      {body}\n    </p>\n  )\n})\nFormMessage.displayName = \"FormMessage\"\n\nexport {\n  useFormField,\n  Form,\n  FormItem,\n  FormLabel,\n  FormControl,\n  FormDescription,\n  FormMessage,\n  FormField,\n}\n"
      }
    ],
    type: "components:ui"
  },
]

beforeAll(async () => {
  const targetDir = path.resolve(__dirname, "../fixtures/project-with-components")
  config = await getConfigModule.getConfig(targetDir)

  vi.spyOn(process, "cwd").mockImplementation(() => { return targetDir })
  vi.spyOn(registryModule, "getRegistryIndex").mockResolvedValue(index)
  vi.spyOn(registryModule, "fetchTree").mockResolvedValue(fetchTreePayload)
})

beforeEach(() => {
  shadcnCli = createRemoveCommand()

  mockProcessExit = vi.spyOn(process, "exit").mockImplementation((_code?: number): never => { return undefined as never})
  mockFsRm = vi.spyOn(fs.promises, "rm").mockImplementation(async (_path, _options) => { return undefined as never})
  mockExeca = vi.spyOn(execaModule, "execa").mockImplementation((_file: string, _options?: execaModule.Options<null> | undefined) => { return undefined as unknown as execaModule.ExecaChildProcess<Buffer> })
  mockGetConfig = vi.spyOn(getConfigModule, "getConfig").mockResolvedValue(config)
})

afterEach(() => {
  mockProcessExit.mockRestore()
  mockFsRm.mockRestore()
  mockExeca.mockRestore()
  mockGetConfig.mockRestore()
})

test("Should call process.exit when config not exists", async () => {
  const getConfigMock = vi.spyOn(getConfigModule, "getConfig").mockResolvedValue(null)

  await shadcnCli.parseAsync(['shadcn-ui', 'remove'])

  expect(getConfigMock).toHaveBeenCalled()
  expect(mockProcessExit).toHaveBeenCalledWith(1)

  getConfigMock.mockRestore()
})

test("Should execute process.exit when user not confirm remove components", async () => {
  const COMPONENT_TO_REMOVE = COMPONENT_NOT_USED_BY_OTHER
  prompts.inject([
    false, //confirm remove components
  ])

  await shadcnCli.parseAsync(['shadcn-ui', 'remove', COMPONENT_TO_REMOVE.name])

  expect(mockProcessExit).toHaveBeenCalledWith(0)
  expect(mockFsRm).not.toHaveBeenCalled()
  expect(mockExeca).not.toHaveBeenCalled()
})

test("Should remove component and dependency when it pass -y as argument ", async () => {
  const COMPONENT_TO_REMOVE = COMPONENT_NOT_USED_BY_OTHER

  await shadcnCli.parseAsync(['shadcn-ui', 'remove', '-y', COMPONENT_TO_REMOVE.name])

  expect(mockFsRm).toHaveBeenCalledWith(path.resolve(config!.resolvedPaths.components, `${COMPONENT_TO_REMOVE.type.split(':')[1]}`, `${COMPONENT_TO_REMOVE.name}.tsx`))
  expect(mockExeca).toHaveBeenCalledWith('pnpm', ['remove', ...(COMPONENT_TO_REMOVE.dependencies || [])], {cwd: process.cwd()})
})

test("Should remove component and dependency using prompts cli", async () => {
  const COMPONENT_TO_REMOVE = COMPONENT_NOT_USED_BY_OTHER
  prompts.inject([
    true, //confirm remove components
    true, // confirm remove dependencies
  ])

  await shadcnCli.parseAsync(['shadcn-ui', 'remove', COMPONENT_TO_REMOVE.name])

  expect(mockFsRm).toHaveBeenCalledWith(path.resolve(config!.resolvedPaths.components, `${COMPONENT_TO_REMOVE.type.split(':')[1]}`, `${COMPONENT_TO_REMOVE.name}.tsx`))
  expect(mockExeca).toHaveBeenCalledWith('pnpm', ['remove', ...(COMPONENT_TO_REMOVE.dependencies || [])], {cwd: process.cwd()})
})

test("Should remove component and dependency using -d option", async () => {
  const COMPONENT_TO_REMOVE = COMPONENT_NOT_USED_BY_OTHER
  prompts.inject([
    true, //confirm remove components
  ])

  await shadcnCli.parseAsync(['shadcn-ui', 'remove', COMPONENT_TO_REMOVE.name])

  expect(mockFsRm).toHaveBeenCalledWith(path.resolve(config!.resolvedPaths.components, `${COMPONENT_TO_REMOVE.type.split(':')[1]}`, `${COMPONENT_TO_REMOVE.name}.tsx`))
  expect(mockExeca).toHaveBeenCalledWith('pnpm', ['remove', ...(COMPONENT_TO_REMOVE.dependencies || [])], {cwd: process.cwd()})
})

test("Should remove component, but not remove dependency if user choosed not remove dependencies", async () => {
  const COMPONENT_TO_REMOVE = COMPONENT_NOT_USED_BY_OTHER
  prompts.inject([
    true, //confirm remove components
    false, //confirm remove components
  ])

  vi.spyOn(registryModule, "resolveTree").mockResolvedValue(null)

  await shadcnCli.parseAsync(['shadcn-ui', 'remove', COMPONENT_TO_REMOVE.name])

  expect(mockFsRm).toHaveBeenCalledWith(path.resolve(config!.resolvedPaths.components, `${COMPONENT_TO_REMOVE.type.split(':')[1]}`, `${COMPONENT_TO_REMOVE.name}.tsx`))
  expect(mockExeca).not.toHaveBeenCalled()
})

test("Should not remove component if is RegistryDependency of other", async () => {
  const COMPONENT_TO_REMOVE = COMPONENT_WITH_DEPENDANTS
  prompts.inject([
    true, //confirm remove components
    true, //confirm remove components
  ])

  vi.spyOn(registryModule, "resolveTree").mockResolvedValue(null)

  await shadcnCli.parseAsync(['shadcn-ui', 'remove', COMPONENT_TO_REMOVE.name])

  expect(mockFsRm).not.toHaveBeenCalled()
  expect(mockExeca).not.toHaveBeenCalled()
})
