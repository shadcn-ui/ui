"use client"

// @ts-nocheck
import * as React from "react"

import * as TsxAccordionDemo from "@/examples/base/accordion-demo"
import * as TsxAlertDemo from "@/examples/base/alert-demo"
import * as TsxAlertDialogDemo from "@/examples/base/alert-dialog-demo"
import * as TsxAspectRatioDemo from "@/examples/base/aspect-ratio-demo"
import * as TsxAvatarDemo from "@/examples/base/avatar-demo"
import * as TsxBadgeDemo from "@/examples/base/badge-demo"
import * as TsxBreadcrumbDemo from "@/examples/base/breadcrumb-demo"
import * as TsxButtonDemo from "@/examples/base/button-demo"
import * as TsxButtonGroupDemo from "@/examples/base/button-group-demo"
import * as TsxCalendarDemo from "@/examples/base/calendar-demo"
import * as TsxCardDemo from "@/examples/base/card-demo"
import * as TsxCarouselDemo from "@/examples/base/carousel-demo"
import * as TsxChartDemo from "@/examples/base/chart-demo"
import * as TsxCheckboxDemo from "@/examples/base/checkbox-demo"
import * as TsxCollapsibleDemo from "@/examples/base/collapsible-demo"
import * as TsxComboboxDemo from "@/examples/base/combobox-demo"
import * as TsxCommandDemo from "@/examples/base/command-demo"
import * as TsxContextMenuDemo from "@/examples/base/context-menu-demo"
import * as TsxDialogDemo from "@/examples/base/dialog-demo"
import * as TsxDirectionDemo from "@/examples/base/direction-demo"
import * as TsxDrawerDemo from "@/examples/base/drawer-demo"
import * as TsxDropdownMenuDemo from "@/examples/base/dropdown-menu-demo"
import * as TsxEmptyDemo from "@/examples/base/empty-demo"
import * as TsxFieldDemo from "@/examples/base/field-demo"
import * as TsxHoverCardDemo from "@/examples/base/hover-card-demo"
import * as TsxInputDemo from "@/examples/base/input-demo"
import * as TsxInputGroupDemo from "@/examples/base/input-group-demo"
import * as TsxInputOtpDemo from "@/examples/base/input-otp-demo"
import * as TsxItemDemo from "@/examples/base/item-demo"
import * as TsxKbdDemo from "@/examples/base/kbd-demo"
import * as TsxLabelDemo from "@/examples/base/label-demo"
import * as TsxMenubarDemo from "@/examples/base/menubar-demo"
import * as TsxNativeSelectDemo from "@/examples/base/native-select-demo"
import * as TsxNavigationMenuDemo from "@/examples/base/navigation-menu-demo"
import * as TsxPaginationDemo from "@/examples/base/pagination-demo"
import * as TsxPopoverDemo from "@/examples/base/popover-demo"
import * as TsxProgressDemo from "@/examples/base/progress-demo"
import * as TsxRadioGroupDemo from "@/examples/base/radio-group-demo"
import * as TsxResizableDemo from "@/examples/base/resizable-demo"
import * as TsxScrollAreaDemo from "@/examples/base/scroll-area-demo"
import * as TsxSelectDemo from "@/examples/base/select-demo"
import * as TsxSeparatorDemo from "@/examples/base/separator-demo"
import * as TsxSheetDemo from "@/examples/base/sheet-demo"
import * as TsxSidebarDemo from "@/examples/base/sidebar-demo"
import * as TsxSkeletonDemo from "@/examples/base/skeleton-demo"
import * as TsxSliderDemo from "@/examples/base/slider-demo"
import * as TsxSonnerDemo from "@/examples/base/sonner-demo"
import * as TsxSpinnerDemo from "@/examples/base/spinner-demo"
import * as TsxSwitchDemo from "@/examples/base/switch-demo"
import * as TsxTableDemo from "@/examples/base/table-demo"
import * as TsxTabsDemo from "@/examples/base/tabs-demo"
import * as TsxTextareaDemo from "@/examples/base/textarea-demo"
import * as TsxToggleDemo from "@/examples/base/toggle-demo"
import * as TsxToggleGroupDemo from "@/examples/base/toggle-group-demo"
import * as TsxTooltipDemo from "@/examples/base/tooltip-demo"

import * as RsAccordionDemo from "../../../../packages/shadcn/rescript/demo/AccordionDemo.res.mjs"
import * as RsAlertDemo from "../../../../packages/shadcn/rescript/demo/AlertDemo.res.mjs"
import * as RsAlertDialogDemo from "../../../../packages/shadcn/rescript/demo/AlertDialogDemo.res.mjs"
import * as RsAspectRatioDemo from "../../../../packages/shadcn/rescript/demo/AspectRatioDemo.res.mjs"
import * as RsAvatarDemo from "../../../../packages/shadcn/rescript/demo/AvatarDemo.res.mjs"
import * as RsBadgeDemo from "../../../../packages/shadcn/rescript/demo/BadgeDemo.res.mjs"
import * as RsBreadcrumbDemo from "../../../../packages/shadcn/rescript/demo/BreadcrumbDemo.res.mjs"
import * as RsButtonDemo from "../../../../packages/shadcn/rescript/demo/ButtonDemo.res.mjs"
import * as RsButtonGroupDemo from "../../../../packages/shadcn/rescript/demo/ButtonGroupDemo.res.mjs"
import * as RsCalendarDemo from "../../../../packages/shadcn/rescript/demo/CalendarDemo.res.mjs"
import * as RsCardDemo from "../../../../packages/shadcn/rescript/demo/CardDemo.res.mjs"
import * as RsCarouselDemo from "../../../../packages/shadcn/rescript/demo/CarouselDemo.res.mjs"
import * as RsChartDemo from "../../../../packages/shadcn/rescript/demo/ChartDemo.res.mjs"
import * as RsCheckboxDemo from "../../../../packages/shadcn/rescript/demo/CheckboxDemo.res.mjs"
import * as RsCollapsibleDemo from "../../../../packages/shadcn/rescript/demo/CollapsibleDemo.res.mjs"
import * as RsComboboxDemo from "../../../../packages/shadcn/rescript/demo/ComboboxDemo.res.mjs"
import * as RsCommandDemo from "../../../../packages/shadcn/rescript/demo/CommandDemo.res.mjs"
import * as RsContextMenuDemo from "../../../../packages/shadcn/rescript/demo/ContextMenuDemo.res.mjs"
import * as RsDialogDemo from "../../../../packages/shadcn/rescript/demo/DialogDemo.res.mjs"
import * as RsDirectionDemo from "../../../../packages/shadcn/rescript/demo/DirectionDemo.res.mjs"
import * as RsDrawerDemo from "../../../../packages/shadcn/rescript/demo/DrawerDemo.res.mjs"
import * as RsDropdownMenuDemo from "../../../../packages/shadcn/rescript/demo/DropdownMenuDemo.res.mjs"
import * as RsEmptyDemo from "../../../../packages/shadcn/rescript/demo/EmptyDemo.res.mjs"
import * as RsFieldDemo from "../../../../packages/shadcn/rescript/demo/FieldDemo.res.mjs"
import * as RsHoverCardDemo from "../../../../packages/shadcn/rescript/demo/HoverCardDemo.res.mjs"
import * as RsInputDemo from "../../../../packages/shadcn/rescript/demo/InputDemo.res.mjs"
import * as RsInputGroupDemo from "../../../../packages/shadcn/rescript/demo/InputGroupDemo.res.mjs"
import * as RsInputOtpDemo from "../../../../packages/shadcn/rescript/demo/InputOtpDemo.res.mjs"
import * as RsItemDemo from "../../../../packages/shadcn/rescript/demo/ItemDemo.res.mjs"
import * as RsKbdDemo from "../../../../packages/shadcn/rescript/demo/KbdDemo.res.mjs"
import * as RsLabelDemo from "../../../../packages/shadcn/rescript/demo/LabelDemo.res.mjs"
import * as RsMenubarDemo from "../../../../packages/shadcn/rescript/demo/MenubarDemo.res.mjs"
import * as RsNativeSelectDemo from "../../../../packages/shadcn/rescript/demo/NativeSelectDemo.res.mjs"
import * as RsNavigationMenuDemo from "../../../../packages/shadcn/rescript/demo/NavigationMenuDemo.res.mjs"
import * as RsPaginationDemo from "../../../../packages/shadcn/rescript/demo/PaginationDemo.res.mjs"
import * as RsPopoverDemo from "../../../../packages/shadcn/rescript/demo/PopoverDemo.res.mjs"
import * as RsProgressDemo from "../../../../packages/shadcn/rescript/demo/ProgressDemo.res.mjs"
import * as RsRadioGroupDemo from "../../../../packages/shadcn/rescript/demo/RadioGroupDemo.res.mjs"
import * as RsResizableDemo from "../../../../packages/shadcn/rescript/demo/ResizableDemo.res.mjs"
import * as RsScrollAreaDemo from "../../../../packages/shadcn/rescript/demo/ScrollAreaDemo.res.mjs"
import * as RsSelectDemo from "../../../../packages/shadcn/rescript/demo/SelectDemo.res.mjs"
import * as RsSeparatorDemo from "../../../../packages/shadcn/rescript/demo/SeparatorDemo.res.mjs"
import * as RsSheetDemo from "../../../../packages/shadcn/rescript/demo/SheetDemo.res.mjs"
import * as RsSidebarDemo from "../../../../packages/shadcn/rescript/demo/SidebarDemo.res.mjs"
import * as RsSkeletonDemo from "../../../../packages/shadcn/rescript/demo/SkeletonDemo.res.mjs"
import * as RsSliderDemo from "../../../../packages/shadcn/rescript/demo/SliderDemo.res.mjs"
import * as RsSonnerDemo from "../../../../packages/shadcn/rescript/demo/SonnerDemo.res.mjs"
import * as RsSpinnerDemo from "../../../../packages/shadcn/rescript/demo/SpinnerDemo.res.mjs"
import * as RsSwitchDemo from "../../../../packages/shadcn/rescript/demo/SwitchDemo.res.mjs"
import * as RsTableDemo from "../../../../packages/shadcn/rescript/demo/TableDemo.res.mjs"
import * as RsTabsDemo from "../../../../packages/shadcn/rescript/demo/TabsDemo.res.mjs"
import * as RsTextareaDemo from "../../../../packages/shadcn/rescript/demo/TextareaDemo.res.mjs"
import * as RsToggleDemo from "../../../../packages/shadcn/rescript/demo/ToggleDemo.res.mjs"
import * as RsToggleGroupDemo from "../../../../packages/shadcn/rescript/demo/ToggleGroupDemo.res.mjs"
import * as RsTooltipDemo from "../../../../packages/shadcn/rescript/demo/TooltipDemo.res.mjs"

export type Impl = "tsx" | "rescript"

type Scenario = {
  renderTsx: () => React.ReactElement
  renderRescript: () => React.ReactElement
}

const panelClass = "w-[620px] max-w-full"

function panel(children: React.ReactNode) {
  return <div className={panelClass}>{children}</div>
}

export const scenarioIds = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "dialog",
  "direction",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "menubar",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
] as const

function resolveTsxDemo(module: Record<string, unknown>, id: string): React.ComponentType {
  if (typeof module.default === "function") {
    return module.default as React.ComponentType
  }

  const namedKey = Object.keys(module).find((key) =>
    key.endsWith("Demo") && typeof module[key] === "function"
  )

  if (namedKey) {
    return module[namedKey] as React.ComponentType
  }

  throw new Error("TSX demo module for \"" + id + "\" has no demo component export")
}

function resolveRescriptDemo(module: Record<string, unknown>, id: string): React.ComponentType {
  if (typeof module.make === "function") {
    return module.make as React.ComponentType
  }

  throw new Error("ReScript demo module for \"" + id + "\" has no make export")
}

const tsxDemoModules: Record<(typeof scenarioIds)[number], Record<string, unknown>> = {
  "accordion": TsxAccordionDemo,
  "alert": TsxAlertDemo,
  "alert-dialog": TsxAlertDialogDemo,
  "aspect-ratio": TsxAspectRatioDemo,
  "avatar": TsxAvatarDemo,
  "badge": TsxBadgeDemo,
  "breadcrumb": TsxBreadcrumbDemo,
  "button": TsxButtonDemo,
  "button-group": TsxButtonGroupDemo,
  "calendar": TsxCalendarDemo,
  "card": TsxCardDemo,
  "carousel": TsxCarouselDemo,
  "chart": TsxChartDemo,
  "checkbox": TsxCheckboxDemo,
  "collapsible": TsxCollapsibleDemo,
  "combobox": TsxComboboxDemo,
  "command": TsxCommandDemo,
  "context-menu": TsxContextMenuDemo,
  "dialog": TsxDialogDemo,
  "direction": TsxDirectionDemo,
  "drawer": TsxDrawerDemo,
  "dropdown-menu": TsxDropdownMenuDemo,
  "empty": TsxEmptyDemo,
  "field": TsxFieldDemo,
  "hover-card": TsxHoverCardDemo,
  "input": TsxInputDemo,
  "input-group": TsxInputGroupDemo,
  "input-otp": TsxInputOtpDemo,
  "item": TsxItemDemo,
  "kbd": TsxKbdDemo,
  "label": TsxLabelDemo,
  "menubar": TsxMenubarDemo,
  "native-select": TsxNativeSelectDemo,
  "navigation-menu": TsxNavigationMenuDemo,
  "pagination": TsxPaginationDemo,
  "popover": TsxPopoverDemo,
  "progress": TsxProgressDemo,
  "radio-group": TsxRadioGroupDemo,
  "resizable": TsxResizableDemo,
  "scroll-area": TsxScrollAreaDemo,
  "select": TsxSelectDemo,
  "separator": TsxSeparatorDemo,
  "sheet": TsxSheetDemo,
  "sidebar": TsxSidebarDemo,
  "skeleton": TsxSkeletonDemo,
  "slider": TsxSliderDemo,
  "sonner": TsxSonnerDemo,
  "spinner": TsxSpinnerDemo,
  "switch": TsxSwitchDemo,
  "table": TsxTableDemo,
  "tabs": TsxTabsDemo,
  "textarea": TsxTextareaDemo,
  "toggle": TsxToggleDemo,
  "toggle-group": TsxToggleGroupDemo,
  "tooltip": TsxTooltipDemo,
}

const rescriptDemoModules: Record<(typeof scenarioIds)[number], Record<string, unknown>> = {
  "accordion": RsAccordionDemo,
  "alert": RsAlertDemo,
  "alert-dialog": RsAlertDialogDemo,
  "aspect-ratio": RsAspectRatioDemo,
  "avatar": RsAvatarDemo,
  "badge": RsBadgeDemo,
  "breadcrumb": RsBreadcrumbDemo,
  "button": RsButtonDemo,
  "button-group": RsButtonGroupDemo,
  "calendar": RsCalendarDemo,
  "card": RsCardDemo,
  "carousel": RsCarouselDemo,
  "chart": RsChartDemo,
  "checkbox": RsCheckboxDemo,
  "collapsible": RsCollapsibleDemo,
  "combobox": RsComboboxDemo,
  "command": RsCommandDemo,
  "context-menu": RsContextMenuDemo,
  "dialog": RsDialogDemo,
  "direction": RsDirectionDemo,
  "drawer": RsDrawerDemo,
  "dropdown-menu": RsDropdownMenuDemo,
  "empty": RsEmptyDemo,
  "field": RsFieldDemo,
  "hover-card": RsHoverCardDemo,
  "input": RsInputDemo,
  "input-group": RsInputGroupDemo,
  "input-otp": RsInputOtpDemo,
  "item": RsItemDemo,
  "kbd": RsKbdDemo,
  "label": RsLabelDemo,
  "menubar": RsMenubarDemo,
  "native-select": RsNativeSelectDemo,
  "navigation-menu": RsNavigationMenuDemo,
  "pagination": RsPaginationDemo,
  "popover": RsPopoverDemo,
  "progress": RsProgressDemo,
  "radio-group": RsRadioGroupDemo,
  "resizable": RsResizableDemo,
  "scroll-area": RsScrollAreaDemo,
  "select": RsSelectDemo,
  "separator": RsSeparatorDemo,
  "sheet": RsSheetDemo,
  "sidebar": RsSidebarDemo,
  "skeleton": RsSkeletonDemo,
  "slider": RsSliderDemo,
  "sonner": RsSonnerDemo,
  "spinner": RsSpinnerDemo,
  "switch": RsSwitchDemo,
  "table": RsTableDemo,
  "tabs": RsTabsDemo,
  "textarea": RsTextareaDemo,
  "toggle": RsToggleDemo,
  "toggle-group": RsToggleGroupDemo,
  "tooltip": RsTooltipDemo,
}

const scenarios = scenarioIds.reduce(
  (acc, id) => {
    acc[id] = {
      renderTsx: () => panel(React.createElement(resolveTsxDemo(tsxDemoModules[id], id))),
      renderRescript: () => panel(React.createElement(resolveRescriptDemo(rescriptDemoModules[id], id))),
    }

    return acc
  },
  {} as Record<(typeof scenarioIds)[number], Scenario>
)

export function getScenario(id: string): Scenario | null {
  if (id in scenarios) {
    return scenarios[id as (typeof scenarioIds)[number]]
  }

  return null
}
