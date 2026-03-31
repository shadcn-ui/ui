import type { Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
  {
    name: "accordion",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/accordion/Accordion.vue",
        type: "registry:ui",
      },
      {
        path: "ui/accordion/AccordionContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/accordion/AccordionItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/accordion/AccordionTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/accordion/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "alert",
    type: "registry:ui",
    files: [
      {
        path: "ui/alert/Alert.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert/AlertAction.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert/AlertDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert/AlertTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "alert-dialog",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "button",
    ],
    files: [
      {
        path: "ui/alert-dialog/AlertDialog.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogAction.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogCancel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogFooter.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogMedia.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/AlertDialogTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "aspect-ratio",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
    ],
    files: [
      {
        path: "ui/aspect-ratio/AspectRatio.vue",
        type: "registry:ui",
      },
      {
        path: "ui/aspect-ratio/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "avatar",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/avatar/Avatar.vue",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/AvatarBadge.vue",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/AvatarFallback.vue",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/AvatarGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/AvatarGroupCount.vue",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/AvatarImage.vue",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "badge",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/badge/Badge.vue",
        type: "registry:ui",
      },
      {
        path: "ui/badge/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
    ],
    files: [
      {
        path: "ui/breadcrumb/Breadcrumb.vue",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/BreadcrumbEllipsis.vue",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/BreadcrumbItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/BreadcrumbLink.vue",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/BreadcrumbList.vue",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/BreadcrumbPage.vue",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/BreadcrumbSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
    ],
    files: [
      {
        path: "ui/button/Button.vue",
        type: "registry:ui",
      },
      {
        path: "ui/button/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "button-group",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "separator",
    ],
    files: [
      {
        path: "ui/button-group/ButtonGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/button-group/ButtonGroupSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/button-group/ButtonGroupText.vue",
        type: "registry:ui",
      },
      {
        path: "ui/button-group/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "calendar",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "native-select",
      "button",
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/calendar/Calendar.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarCell.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarCellTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarGrid.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarGridBody.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarGridHead.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarGridRow.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarHeadCell.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarHeading.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarNextButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/CalendarPrevButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "card",
    type: "registry:ui",
    files: [
      {
        path: "ui/card/Card.vue",
        type: "registry:ui",
      },
      {
        path: "ui/card/CardAction.vue",
        type: "registry:ui",
      },
      {
        path: "ui/card/CardContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/card/CardDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/card/CardFooter.vue",
        type: "registry:ui",
      },
      {
        path: "ui/card/CardHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/card/CardTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/card/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "carousel",
    type: "registry:ui",
    dependencies: [
      "embla-carousel-vue",
      "@vueuse/core",
    ],
    registryDependencies: [
      "button",
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/carousel/Carousel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/CarouselContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/CarouselItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/CarouselNext.vue",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/CarouselPrevious.vue",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/interface.ts",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/useCarousel.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "chart",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/chart/ChartContainer.vue",
        type: "registry:ui",
      },
      {
        path: "ui/chart/ChartLegendContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/chart/ChartStyle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/chart/ChartTooltipContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/chart/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/chart/utils.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/checkbox/Checkbox.vue",
        type: "registry:ui",
      },
      {
        path: "ui/checkbox/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "collapsible",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
    ],
    files: [
      {
        path: "ui/collapsible/Collapsible.vue",
        type: "registry:ui",
      },
      {
        path: "ui/collapsible/CollapsibleContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/collapsible/CollapsibleTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/collapsible/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "combobox",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/combobox/Combobox.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxAnchor.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxEmpty.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxInput.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxItemIndicator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxList.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/ComboboxViewport.vue",
        type: "registry:ui",
      },
      {
        path: "ui/combobox/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "command",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "dialog",
      "input-group",
    ],
    files: [
      {
        path: "ui/command/Command.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/CommandDialog.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/CommandEmpty.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/CommandGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/CommandInput.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/CommandItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/CommandList.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/CommandSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/CommandShortcut.vue",
        type: "registry:ui",
      },
      {
        path: "ui/command/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "context-menu",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/context-menu/ContextMenu.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuCheckboxItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuLabel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuPortal.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuRadioGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuRadioItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuShortcut.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuSub.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuSubContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuSubTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/ContextMenuTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "dialog",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "button",
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/dialog/Dialog.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogClose.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogFooter.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogOverlay.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogScrollContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/DialogTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "drawer",
    type: "registry:ui",
    dependencies: [
      "vaul-vue",
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/drawer/Drawer.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/DrawerClose.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/DrawerContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/DrawerDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/DrawerFooter.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/DrawerHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/DrawerOverlay.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/DrawerTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/DrawerTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/dropdown-menu/DropdownMenu.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuCheckboxItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuLabel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuRadioGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuRadioItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuShortcut.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuSub.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuSubContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuSubTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/DropdownMenuTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "empty",
    type: "registry:ui",
    files: [
      {
        path: "ui/empty/Empty.vue",
        type: "registry:ui",
      },
      {
        path: "ui/empty/EmptyContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/empty/EmptyDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/empty/EmptyHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/empty/EmptyMedia.vue",
        type: "registry:ui",
      },
      {
        path: "ui/empty/EmptyTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/empty/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "field",
    type: "registry:ui",
    registryDependencies: [
      "label",
      "separator",
    ],
    files: [
      {
        path: "ui/field/Field.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldError.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldLabel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldLegend.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldSet.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/FieldTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/field/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "form",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "vee-validate",
      "@vee-validate/zod",
      "zod@3.25.76",
    ],
    registryDependencies: [
      "label",
    ],
    files: [
      {
        path: "ui/form/FormControl.vue",
        type: "registry:ui",
      },
      {
        path: "ui/form/FormDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/form/FormItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/form/FormLabel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/form/FormMessage.vue",
        type: "registry:ui",
      },
      {
        path: "ui/form/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/form/injectionKeys.ts",
        type: "registry:ui",
      },
      {
        path: "ui/form/useFormField.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "hover-card",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/hover-card/HoverCard.vue",
        type: "registry:ui",
      },
      {
        path: "ui/hover-card/HoverCardContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/hover-card/HoverCardTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/hover-card/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    dependencies: [
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/input/Input.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input-group",
    type: "registry:ui",
    registryDependencies: [
      "button",
      "input",
      "textarea",
    ],
    files: [
      {
        path: "ui/input-group/InputGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/InputGroupAddon.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/InputGroupButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/InputGroupInput.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/InputGroupText.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/InputGroupTextarea.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input-otp",
    type: "registry:ui",
    dependencies: [
      "vue-input-otp",
      "@vueuse/core",
      "reka-ui",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/input-otp/InputOTP.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-otp/InputOTPGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-otp/InputOTPSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-otp/InputOTPSlot.vue",
        type: "registry:ui",
      },
      {
        path: "ui/input-otp/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "item",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
    ],
    registryDependencies: [
      "separator",
    ],
    files: [
      {
        path: "ui/item/Item.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemActions.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemFooter.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemMedia.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/ItemTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/item/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "kbd",
    type: "registry:ui",
    files: [
      {
        path: "ui/kbd/Kbd.vue",
        type: "registry:ui",
      },
      {
        path: "ui/kbd/KbdGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/kbd/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "label",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/label/Label.vue",
        type: "registry:ui",
      },
      {
        path: "ui/label/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "menubar",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/menubar/Menubar.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarCheckboxItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarLabel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarMenu.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarRadioGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarRadioItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarShortcut.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarSub.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarSubContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarSubTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/MenubarTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "native-select",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/native-select/NativeSelect.vue",
        type: "registry:ui",
      },
      {
        path: "ui/native-select/NativeSelectOptGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/native-select/NativeSelectOption.vue",
        type: "registry:ui",
      },
      {
        path: "ui/native-select/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "navigation-menu",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/navigation-menu/NavigationMenu.vue",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/NavigationMenuContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/NavigationMenuIndicator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/NavigationMenuItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/NavigationMenuLink.vue",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/NavigationMenuList.vue",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/NavigationMenuTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/NavigationMenuViewport.vue",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "number-field",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/number-field/NumberField.vue",
        type: "registry:ui",
      },
      {
        path: "ui/number-field/NumberFieldContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/number-field/NumberFieldDecrement.vue",
        type: "registry:ui",
      },
      {
        path: "ui/number-field/NumberFieldIncrement.vue",
        type: "registry:ui",
      },
      {
        path: "ui/number-field/NumberFieldInput.vue",
        type: "registry:ui",
      },
      {
        path: "ui/number-field/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "pagination",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "button",
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/pagination/Pagination.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/PaginationContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/PaginationEllipsis.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/PaginationFirst.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/PaginationItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/PaginationLast.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/PaginationLink.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/PaginationNext.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/PaginationPrevious.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "pin-input",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/pin-input/PinInput.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pin-input/PinInputGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pin-input/PinInputSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pin-input/PinInputSlot.vue",
        type: "registry:ui",
      },
      {
        path: "ui/pin-input/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "popover",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/popover/Popover.vue",
        type: "registry:ui",
      },
      {
        path: "ui/popover/PopoverAnchor.vue",
        type: "registry:ui",
      },
      {
        path: "ui/popover/PopoverContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/popover/PopoverDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/popover/PopoverHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/popover/PopoverTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/popover/PopoverTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/popover/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "progress",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/progress/Progress.vue",
        type: "registry:ui",
      },
      {
        path: "ui/progress/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/radio-group/RadioGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/radio-group/RadioGroupItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/radio-group/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "range-calendar",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "button",
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/range-calendar/RangeCalendar.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarCell.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarCellTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarGrid.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarGridBody.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarGridHead.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarGridRow.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarHeadCell.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarHeading.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarNextButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/RangeCalendarPrevButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "resizable",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/resizable/ResizableHandle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/resizable/ResizablePanel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/resizable/ResizablePanelGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/resizable/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/scroll-area/ScrollArea.vue",
        type: "registry:ui",
      },
      {
        path: "ui/scroll-area/ScrollBar.vue",
        type: "registry:ui",
      },
      {
        path: "ui/scroll-area/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/select/Select.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectItemText.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectLabel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectScrollDownButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectScrollUpButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/SelectValue.vue",
        type: "registry:ui",
      },
      {
        path: "ui/select/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/separator/Separator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/separator/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "sheet",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "button",
    ],
    files: [
      {
        path: "ui/sheet/Sheet.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/SheetClose.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/SheetContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/SheetDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/SheetFooter.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/SheetHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/SheetOverlay.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/SheetTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/SheetTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "sidebar",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "sheet",
      "input",
      "tooltip",
      "skeleton",
      "separator",
      "icon-placeholder",
      "button",
    ],
    files: [
      {
        path: "ui/sidebar/Sidebar.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarFooter.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarGroupAction.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarGroupContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarGroupLabel.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarInput.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarInset.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenu.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuAction.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuBadge.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuButtonChild.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuSkeleton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuSub.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuSubButton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarMenuSubItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarProvider.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarRail.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/SidebarTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/utils.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    files: [
      {
        path: "ui/skeleton/Skeleton.vue",
        type: "registry:ui",
      },
      {
        path: "ui/skeleton/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "slider",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/slider/Slider.vue",
        type: "registry:ui",
      },
      {
        path: "ui/slider/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "sonner",
    type: "registry:ui",
    dependencies: [
      "vue-sonner",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/sonner/Sonner.vue",
        type: "registry:ui",
      },
      {
        path: "ui/sonner/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "spinner",
    type: "registry:ui",
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/spinner/Spinner.vue",
        type: "registry:ui",
      },
      {
        path: "ui/spinner/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "stepper",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/stepper/Stepper.vue",
        type: "registry:ui",
      },
      {
        path: "ui/stepper/StepperDescription.vue",
        type: "registry:ui",
      },
      {
        path: "ui/stepper/StepperIndicator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/stepper/StepperItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/stepper/StepperSeparator.vue",
        type: "registry:ui",
      },
      {
        path: "ui/stepper/StepperTitle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/stepper/StepperTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/stepper/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/switch/Switch.vue",
        type: "registry:ui",
      },
      {
        path: "ui/switch/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "table",
    type: "registry:ui",
    dependencies: [
      "@vueuse/core",
      "@tanstack/vue-table",
    ],
    files: [
      {
        path: "ui/table/Table.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/TableBody.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/TableCaption.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/TableCell.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/TableEmpty.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/TableFooter.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/TableHead.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/TableHeader.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/TableRow.vue",
        type: "registry:ui",
      },
      {
        path: "ui/table/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/table/utils.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/tabs/Tabs.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tabs/TabsContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tabs/TabsList.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tabs/TabsTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tabs/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tags-input",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "icon-placeholder",
    ],
    files: [
      {
        path: "ui/tags-input/TagsInput.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tags-input/TagsInputInput.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tags-input/TagsInputItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tags-input/TagsInputItemDelete.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tags-input/TagsInputItemText.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tags-input/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "textarea",
    type: "registry:ui",
    dependencies: [
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/textarea/Textarea.vue",
        type: "registry:ui",
      },
      {
        path: "ui/textarea/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toggle",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/toggle/Toggle.vue",
        type: "registry:ui",
      },
      {
        path: "ui/toggle/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toggle-group",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    registryDependencies: [
      "toggle",
    ],
    files: [
      {
        path: "ui/toggle-group/ToggleGroup.vue",
        type: "registry:ui",
      },
      {
        path: "ui/toggle-group/ToggleGroupItem.vue",
        type: "registry:ui",
      },
      {
        path: "ui/toggle-group/index.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    dependencies: [
      "reka-ui",
      "@vueuse/core",
    ],
    files: [
      {
        path: "ui/tooltip/Tooltip.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/TooltipContent.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/TooltipProvider.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/TooltipTrigger.vue",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/index.ts",
        type: "registry:ui",
      },
    ],
  },
]
