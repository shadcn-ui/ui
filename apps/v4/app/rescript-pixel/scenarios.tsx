"use client"

// @ts-nocheck
import * as React from "react"

import * as TsxAccordion from "@/examples/base/ui/accordion"
import * as TsxAlertDialog from "@/examples/base/ui/alert-dialog"
import * as TsxAvatar from "@/examples/base/ui/avatar"
import * as TsxBadge from "@/examples/base/ui/badge"
import * as TsxBreadcrumb from "@/examples/base/ui/breadcrumb"
import * as TsxButton from "@/examples/base/ui/button"
import * as TsxButtonGroup from "@/examples/base/ui/button-group"
import * as TsxCheckbox from "@/examples/base/ui/checkbox"
import * as TsxCollapsible from "@/examples/base/ui/collapsible"
import * as TsxCombobox from "@/examples/base/ui/combobox"
import * as TsxContextMenu from "@/examples/base/ui/context-menu"
import * as TsxDialog from "@/examples/base/ui/dialog"
import * as TsxDirection from "@/examples/base/ui/direction"
import * as TsxDropdownMenu from "@/examples/base/ui/dropdown-menu"
import * as TsxHoverCard from "@/examples/base/ui/hover-card"
import * as TsxInput from "@/examples/base/ui/input"
import * as TsxItem from "@/examples/base/ui/item"
import * as TsxMenubar from "@/examples/base/ui/menubar"
import * as TsxNavigationMenu from "@/examples/base/ui/navigation-menu"
import * as TsxPopover from "@/examples/base/ui/popover"
import * as TsxProgress from "@/examples/base/ui/progress"
import * as TsxRadioGroup from "@/examples/base/ui/radio-group"
import * as TsxScrollArea from "@/examples/base/ui/scroll-area"
import * as TsxSelect from "@/examples/base/ui/select"
import * as TsxSeparator from "@/examples/base/ui/separator"
import * as TsxSheet from "@/examples/base/ui/sheet"
import * as TsxSidebar from "@/examples/base/ui/sidebar"
import * as TsxSlider from "@/examples/base/ui/slider"
import * as TsxSwitch from "@/examples/base/ui/switch"
import * as TsxTabs from "@/examples/base/ui/tabs"
import * as TsxToggle from "@/examples/base/ui/toggle"
import * as TsxToggleGroup from "@/examples/base/ui/toggle-group"
import * as TsxTooltip from "@/examples/base/ui/tooltip"

import * as RsAccordion from "../../../../packages/shadcn/rescript/Accordion.res.mjs"
import * as RsAlertDialog from "../../../../packages/shadcn/rescript/AlertDialog.res.mjs"
import * as RsAvatar from "../../../../packages/shadcn/rescript/Avatar.res.mjs"
import * as RsBadge from "../../../../packages/shadcn/rescript/Badge.res.mjs"
import * as RsBreadcrumb from "../../../../packages/shadcn/rescript/Breadcrumb.res.mjs"
import * as RsButton from "../../../../packages/shadcn/rescript/Button.res.mjs"
import * as RsButtonGroup from "../../../../packages/shadcn/rescript/ButtonGroup.res.mjs"
import * as RsCheckbox from "../../../../packages/shadcn/rescript/Checkbox.res.mjs"
import * as RsCollapsible from "../../../../packages/shadcn/rescript/Collapsible.res.mjs"
import * as RsCombobox from "../../../../packages/shadcn/rescript/Combobox.res.mjs"
import * as RsContextMenu from "../../../../packages/shadcn/rescript/ContextMenu.res.mjs"
import * as RsDialog from "../../../../packages/shadcn/rescript/Dialog.res.mjs"
import * as RsDirection from "../../../../packages/shadcn/rescript/Direction.res.mjs"
import * as RsDropdownMenu from "../../../../packages/shadcn/rescript/DropdownMenu.res.mjs"
import * as RsHoverCard from "../../../../packages/shadcn/rescript/HoverCard.res.mjs"
import * as RsInput from "../../../../packages/shadcn/rescript/Input.res.mjs"
import * as RsItem from "../../../../packages/shadcn/rescript/Item.res.mjs"
import * as RsMenubar from "../../../../packages/shadcn/rescript/Menubar.res.mjs"
import * as RsNavigationMenu from "../../../../packages/shadcn/rescript/NavigationMenu.res.mjs"
import * as RsPopover from "../../../../packages/shadcn/rescript/Popover.res.mjs"
import * as RsProgress from "../../../../packages/shadcn/rescript/Progress.res.mjs"
import * as RsRadioGroup from "../../../../packages/shadcn/rescript/RadioGroup.res.mjs"
import * as RsScrollArea from "../../../../packages/shadcn/rescript/ScrollArea.res.mjs"
import * as RsSelect from "../../../../packages/shadcn/rescript/Select.res.mjs"
import * as RsSeparator from "../../../../packages/shadcn/rescript/Separator.res.mjs"
import * as RsSheet from "../../../../packages/shadcn/rescript/Sheet.res.mjs"
import * as RsSidebar from "../../../../packages/shadcn/rescript/Sidebar.res.mjs"
import * as RsSlider from "../../../../packages/shadcn/rescript/Slider.res.mjs"
import * as RsSwitch from "../../../../packages/shadcn/rescript/Switch.res.mjs"
import * as RsTabs from "../../../../packages/shadcn/rescript/Tabs.res.mjs"
import * as RsToggle from "../../../../packages/shadcn/rescript/Toggle.res.mjs"
import * as RsToggleGroup from "../../../../packages/shadcn/rescript/ToggleGroup.res.mjs"
import * as RsTooltip from "../../../../packages/shadcn/rescript/Tooltip.res.mjs"

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
  "alert-dialog",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "checkbox",
  "collapsible",
  "combobox",
  "context-menu",
  "dialog",
  "direction",
  "dropdown-menu",
  "hover-card",
  "input",
  "item",
  "menubar",
  "navigation-menu",
  "popover",
  "progress",
  "radio-group",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "slider",
  "switch",
  "tabs",
  "toggle",
  "toggle-group",
  "tooltip",
] as const

const scenarios: Record<(typeof scenarioIds)[number], Scenario> = {
  accordion: {
    renderTsx: () =>
      panel(
        <TsxAccordion.Accordion defaultValue="item-1">
          <TsxAccordion.AccordionItem value="item-1">
            <TsxAccordion.AccordionTrigger>Section</TsxAccordion.AccordionTrigger>
            <TsxAccordion.AccordionContent>
              Panel content
            </TsxAccordion.AccordionContent>
          </TsxAccordion.AccordionItem>
        </TsxAccordion.Accordion>
      ),
    renderRescript: () =>
      panel(
        <RsAccordion.make defaultValue="item-1">
          <RsAccordion.Item.make value="item-1">
            <RsAccordion.Trigger.make>Section</RsAccordion.Trigger.make>
            <RsAccordion.Content.make>Panel content</RsAccordion.Content.make>
          </RsAccordion.Item.make>
        </RsAccordion.make>
      ),
  },
  "alert-dialog": {
    renderTsx: () =>
      panel(
        <TsxAlertDialog.AlertDialog open>
          <TsxAlertDialog.AlertDialogTrigger>
            Open alert
          </TsxAlertDialog.AlertDialogTrigger>
          <TsxAlertDialog.AlertDialogContent>
            <TsxAlertDialog.AlertDialogHeader>
              <TsxAlertDialog.AlertDialogTitle>
                Confirm action
              </TsxAlertDialog.AlertDialogTitle>
              <TsxAlertDialog.AlertDialogDescription>
                This action cannot be undone.
              </TsxAlertDialog.AlertDialogDescription>
            </TsxAlertDialog.AlertDialogHeader>
            <TsxAlertDialog.AlertDialogFooter>
              <TsxAlertDialog.AlertDialogCancel>
                Cancel
              </TsxAlertDialog.AlertDialogCancel>
              <TsxAlertDialog.AlertDialogAction>
                Continue
              </TsxAlertDialog.AlertDialogAction>
            </TsxAlertDialog.AlertDialogFooter>
          </TsxAlertDialog.AlertDialogContent>
        </TsxAlertDialog.AlertDialog>
      ),
    renderRescript: () =>
      panel(
        <RsAlertDialog.make open>
          <RsAlertDialog.Trigger.make>Open alert</RsAlertDialog.Trigger.make>
          <RsAlertDialog.Content.make>
            <RsAlertDialog.Header.make>
              <RsAlertDialog.Title.make>Confirm action</RsAlertDialog.Title.make>
              <RsAlertDialog.Description.make>
                This action cannot be undone.
              </RsAlertDialog.Description.make>
            </RsAlertDialog.Header.make>
            <RsAlertDialog.Footer.make>
              <RsAlertDialog.Cancel.make>Cancel</RsAlertDialog.Cancel.make>
              <RsAlertDialog.Action.make>Continue</RsAlertDialog.Action.make>
            </RsAlertDialog.Footer.make>
          </RsAlertDialog.Content.make>
        </RsAlertDialog.make>
      ),
  },
  avatar: {
    renderTsx: () =>
      panel(
        <TsxAvatar.Avatar>
          <TsxAvatar.AvatarFallback>AB</TsxAvatar.AvatarFallback>
        </TsxAvatar.Avatar>
      ),
    renderRescript: () =>
      panel(
        <RsAvatar.make>
          <RsAvatar.Fallback.make>AB</RsAvatar.Fallback.make>
        </RsAvatar.make>
      ),
  },
  badge: {
    renderTsx: () => panel(<TsxBadge.Badge>Badge</TsxBadge.Badge>),
    renderRescript: () => panel(<RsBadge.make>Badge</RsBadge.make>),
  },
  breadcrumb: {
    renderTsx: () =>
      panel(
        <TsxBreadcrumb.Breadcrumb>
          <TsxBreadcrumb.BreadcrumbList>
            <TsxBreadcrumb.BreadcrumbItem>
              <TsxBreadcrumb.BreadcrumbLink href="#">
                Docs
              </TsxBreadcrumb.BreadcrumbLink>
            </TsxBreadcrumb.BreadcrumbItem>
            <TsxBreadcrumb.BreadcrumbSeparator />
            <TsxBreadcrumb.BreadcrumbItem>
              <TsxBreadcrumb.BreadcrumbPage>API</TsxBreadcrumb.BreadcrumbPage>
            </TsxBreadcrumb.BreadcrumbItem>
          </TsxBreadcrumb.BreadcrumbList>
        </TsxBreadcrumb.Breadcrumb>
      ),
    renderRescript: () =>
      panel(
        <RsBreadcrumb.make>
          <RsBreadcrumb.List.make>
            <RsBreadcrumb.Item.make>
              <RsBreadcrumb.Link.make href="#">Docs</RsBreadcrumb.Link.make>
            </RsBreadcrumb.Item.make>
            <RsBreadcrumb.Separator.make />
            <RsBreadcrumb.Item.make>
              <RsBreadcrumb.Page.make>API</RsBreadcrumb.Page.make>
            </RsBreadcrumb.Item.make>
          </RsBreadcrumb.List.make>
        </RsBreadcrumb.make>
      ),
  },
  button: {
    renderTsx: () => panel(<TsxButton.Button>Press</TsxButton.Button>),
    renderRescript: () => panel(<RsButton.make>Press</RsButton.make>),
  },
  "button-group": {
    renderTsx: () =>
      panel(
        <TsxButtonGroup.ButtonGroup>
          <TsxButton.Button>Left</TsxButton.Button>
          <TsxButtonGroup.ButtonGroupSeparator />
          <TsxButton.Button>Right</TsxButton.Button>
        </TsxButtonGroup.ButtonGroup>
      ),
    renderRescript: () =>
      panel(
        <RsButtonGroup.make>
          <RsButton.make>Left</RsButton.make>
          <RsButtonGroup.Separator.make />
          <RsButton.make>Right</RsButton.make>
        </RsButtonGroup.make>
      ),
  },
  checkbox: {
    renderTsx: () => panel(<TsxCheckbox.Checkbox defaultChecked />),
    renderRescript: () => panel(<RsCheckbox.make defaultChecked />),
  },
  collapsible: {
    renderTsx: () =>
      panel(
        <TsxCollapsible.Collapsible defaultOpen>
          <TsxCollapsible.CollapsibleTrigger>
            Toggle
          </TsxCollapsible.CollapsibleTrigger>
          <TsxCollapsible.CollapsibleContent>
            Collapsible content
          </TsxCollapsible.CollapsibleContent>
        </TsxCollapsible.Collapsible>
      ),
    renderRescript: () =>
      panel(
        <RsCollapsible.make defaultOpen>
          <RsCollapsible.Trigger.make>Toggle</RsCollapsible.Trigger.make>
          <RsCollapsible.Content.make>Collapsible content</RsCollapsible.Content.make>
        </RsCollapsible.make>
      ),
  },
  combobox: {
    renderTsx: () =>
      panel(
        <TsxCombobox.Combobox defaultValue="apple" open>
          <TsxCombobox.ComboboxInput placeholder="Select fruit" />
          <TsxCombobox.ComboboxContent>
            <TsxCombobox.ComboboxList>
              <TsxCombobox.ComboboxItem value="apple">
                Apple
              </TsxCombobox.ComboboxItem>
              <TsxCombobox.ComboboxItem value="orange">
                Orange
              </TsxCombobox.ComboboxItem>
            </TsxCombobox.ComboboxList>
          </TsxCombobox.ComboboxContent>
        </TsxCombobox.Combobox>
      ),
    renderRescript: () =>
      panel(
        <RsCombobox.make defaultValue="apple" open>
          <RsCombobox.Input.make placeholder="Select fruit" />
          <RsCombobox.Content.make>
            <RsCombobox.List.make>
              <RsCombobox.Item.make value="apple">Apple</RsCombobox.Item.make>
              <RsCombobox.Item.make value="orange">
                Orange
              </RsCombobox.Item.make>
            </RsCombobox.List.make>
          </RsCombobox.Content.make>
        </RsCombobox.make>
      ),
  },
  "context-menu": {
    renderTsx: () =>
      panel(
        <TsxContextMenu.ContextMenu open>
          <TsxContextMenu.ContextMenuTrigger className="inline-flex rounded-md border px-3 py-2 text-sm">
            Target
          </TsxContextMenu.ContextMenuTrigger>
          <TsxContextMenu.ContextMenuContent>
            <TsxContextMenu.ContextMenuItem>Copy</TsxContextMenu.ContextMenuItem>
          </TsxContextMenu.ContextMenuContent>
        </TsxContextMenu.ContextMenu>
      ),
    renderRescript: () =>
      panel(
        <RsContextMenu.make open>
          <RsContextMenu.Trigger.make className="inline-flex rounded-md border px-3 py-2 text-sm">
            Target
          </RsContextMenu.Trigger.make>
          <RsContextMenu.Content.make>
            <RsContextMenu.Item.make>Copy</RsContextMenu.Item.make>
          </RsContextMenu.Content.make>
        </RsContextMenu.make>
      ),
  },
  dialog: {
    renderTsx: () =>
      panel(
        <TsxDialog.Dialog open>
          <TsxDialog.DialogTrigger>Open dialog</TsxDialog.DialogTrigger>
          <TsxDialog.DialogContent>
            <TsxDialog.DialogHeader>
              <TsxDialog.DialogTitle>Dialog title</TsxDialog.DialogTitle>
              <TsxDialog.DialogDescription>
                Dialog description
              </TsxDialog.DialogDescription>
            </TsxDialog.DialogHeader>
          </TsxDialog.DialogContent>
        </TsxDialog.Dialog>
      ),
    renderRescript: () =>
      panel(
        <RsDialog.make open>
          <RsDialog.Trigger.make>Open dialog</RsDialog.Trigger.make>
          <RsDialog.Content.make>
            <RsDialog.Header.make>
              <RsDialog.Title.make>Dialog title</RsDialog.Title.make>
              <RsDialog.Description.make>Dialog description</RsDialog.Description.make>
            </RsDialog.Header.make>
          </RsDialog.Content.make>
        </RsDialog.make>
      ),
  },
  direction: {
    renderTsx: () =>
      panel(
        <TsxDirection.DirectionProvider direction="ltr">
          <div className="rounded-md border px-3 py-2">Direction context</div>
        </TsxDirection.DirectionProvider>
      ),
    renderRescript: () =>
      panel(
        <RsDirection.DirectionProvider.make direction="ltr">
          <div className="rounded-md border px-3 py-2">Direction context</div>
        </RsDirection.DirectionProvider.make>
      ),
  },
  "dropdown-menu": {
    renderTsx: () =>
      panel(
        <TsxDropdownMenu.DropdownMenu open>
          <TsxDropdownMenu.DropdownMenuTrigger className="inline-flex rounded-md border px-3 py-2 text-sm">
            Open
          </TsxDropdownMenu.DropdownMenuTrigger>
          <TsxDropdownMenu.DropdownMenuContent>
            <TsxDropdownMenu.DropdownMenuItem>
              Profile
            </TsxDropdownMenu.DropdownMenuItem>
          </TsxDropdownMenu.DropdownMenuContent>
        </TsxDropdownMenu.DropdownMenu>
      ),
    renderRescript: () =>
      panel(
        <RsDropdownMenu.make open>
          <RsDropdownMenu.Trigger.make className="inline-flex rounded-md border px-3 py-2 text-sm">
            Open
          </RsDropdownMenu.Trigger.make>
          <RsDropdownMenu.Content.make>
            <RsDropdownMenu.Item.make>Profile</RsDropdownMenu.Item.make>
          </RsDropdownMenu.Content.make>
        </RsDropdownMenu.make>
      ),
  },
  "hover-card": {
    renderTsx: () =>
      panel(
        <TsxHoverCard.HoverCard open>
          <TsxHoverCard.HoverCardTrigger className="underline">
            Hover target
          </TsxHoverCard.HoverCardTrigger>
          <TsxHoverCard.HoverCardContent>
            Hover card content
          </TsxHoverCard.HoverCardContent>
        </TsxHoverCard.HoverCard>
      ),
    renderRescript: () =>
      panel(
        <RsHoverCard.make open>
          <RsHoverCard.Trigger.make className="underline">
            Hover target
          </RsHoverCard.Trigger.make>
          <RsHoverCard.Content.make>Hover card content</RsHoverCard.Content.make>
        </RsHoverCard.make>
      ),
  },
  input: {
    renderTsx: () => panel(<TsxInput.Input defaultValue="hello" />),
    renderRescript: () => panel(<RsInput.make defaultValue="hello" />),
  },
  item: {
    renderTsx: () =>
      panel(
        <TsxItem.Item>
          <TsxItem.ItemMedia>
            <div className="size-6 rounded bg-muted" />
          </TsxItem.ItemMedia>
          <TsxItem.ItemContent>
            <TsxItem.ItemTitle>Item title</TsxItem.ItemTitle>
            <TsxItem.ItemDescription>Description</TsxItem.ItemDescription>
          </TsxItem.ItemContent>
        </TsxItem.Item>
      ),
    renderRescript: () =>
      panel(
        <RsItem.make>
          <RsItem.Media.make>
            <div className="size-6 rounded bg-muted" />
          </RsItem.Media.make>
          <RsItem.Content.make>
            <RsItem.Title.make>Item title</RsItem.Title.make>
            <RsItem.Description.make>Description</RsItem.Description.make>
          </RsItem.Content.make>
        </RsItem.make>
      ),
  },
  menubar: {
    renderTsx: () =>
      panel(
        <TsxMenubar.Menubar>
          <TsxMenubar.MenubarMenu>
            <TsxMenubar.MenubarTrigger>File</TsxMenubar.MenubarTrigger>
            <TsxMenubar.MenubarContent>
              <TsxMenubar.MenubarItem>New</TsxMenubar.MenubarItem>
            </TsxMenubar.MenubarContent>
          </TsxMenubar.MenubarMenu>
        </TsxMenubar.Menubar>
      ),
    renderRescript: () =>
      panel(
        <RsMenubar.make>
          <RsMenubar.Menu.make>
            <RsMenubar.Trigger.make>File</RsMenubar.Trigger.make>
            <RsMenubar.Content.make>
              <RsMenubar.Item.make>New</RsMenubar.Item.make>
            </RsMenubar.Content.make>
          </RsMenubar.Menu.make>
        </RsMenubar.make>
      ),
  },
  "navigation-menu": {
    renderTsx: () =>
      panel(
        <TsxNavigationMenu.NavigationMenu>
          <TsxNavigationMenu.NavigationMenuList>
            <TsxNavigationMenu.NavigationMenuItem>
              <TsxNavigationMenu.NavigationMenuTrigger>
                Docs
              </TsxNavigationMenu.NavigationMenuTrigger>
              <TsxNavigationMenu.NavigationMenuContent>
                <div className="p-4 text-sm">Navigation content</div>
              </TsxNavigationMenu.NavigationMenuContent>
            </TsxNavigationMenu.NavigationMenuItem>
          </TsxNavigationMenu.NavigationMenuList>
        </TsxNavigationMenu.NavigationMenu>
      ),
    renderRescript: () =>
      panel(
        <RsNavigationMenu.make>
          <RsNavigationMenu.List.make>
            <RsNavigationMenu.Item.make>
              <RsNavigationMenu.Trigger.make>Docs</RsNavigationMenu.Trigger.make>
              <RsNavigationMenu.Content.make>
                <div className="p-4 text-sm">Navigation content</div>
              </RsNavigationMenu.Content.make>
            </RsNavigationMenu.Item.make>
          </RsNavigationMenu.List.make>
        </RsNavigationMenu.make>
      ),
  },
  popover: {
    renderTsx: () =>
      panel(
        <TsxPopover.Popover open>
          <TsxPopover.PopoverTrigger className="inline-flex rounded-md border px-3 py-2 text-sm">
            Open
          </TsxPopover.PopoverTrigger>
          <TsxPopover.PopoverContent>
            <TsxPopover.PopoverHeader>
              <TsxPopover.PopoverTitle>Popover</TsxPopover.PopoverTitle>
              <TsxPopover.PopoverDescription>
                Details
              </TsxPopover.PopoverDescription>
            </TsxPopover.PopoverHeader>
          </TsxPopover.PopoverContent>
        </TsxPopover.Popover>
      ),
    renderRescript: () =>
      panel(
        <RsPopover.make open>
          <RsPopover.Trigger.make className="inline-flex rounded-md border px-3 py-2 text-sm">
            Open
          </RsPopover.Trigger.make>
          <RsPopover.Content.make>
            <RsPopover.Header.make>
              <RsPopover.Title.make>Popover</RsPopover.Title.make>
              <RsPopover.Description.make>Details</RsPopover.Description.make>
            </RsPopover.Header.make>
          </RsPopover.Content.make>
        </RsPopover.make>
      ),
  },
  progress: {
    renderTsx: () =>
      panel(
        <TsxProgress.Progress value={42} locale="en-US">
          <TsxProgress.ProgressLabel>Progress</TsxProgress.ProgressLabel>
          <TsxProgress.ProgressTrack>
            <TsxProgress.ProgressIndicator />
          </TsxProgress.ProgressTrack>
          <TsxProgress.ProgressValue />
        </TsxProgress.Progress>
      ),
    renderRescript: () =>
      panel(
        <RsProgress.make value={42} locale="en-US">
          <RsProgress.Label.make>Progress</RsProgress.Label.make>
          <RsProgress.Track.make>
            <RsProgress.Indicator.make />
          </RsProgress.Track.make>
          <RsProgress.Value.make />
        </RsProgress.make>
      ),
  },
  "radio-group": {
    renderTsx: () =>
      panel(
        <TsxRadioGroup.RadioGroup defaultValue="a">
          <TsxRadioGroup.RadioGroupItem value="a" />
          <TsxRadioGroup.RadioGroupItem value="b" />
        </TsxRadioGroup.RadioGroup>
      ),
    renderRescript: () =>
      panel(
        <RsRadioGroup.make defaultValue="a">
          <RsRadioGroup.Item.make value="a" />
          <RsRadioGroup.Item.make value="b" />
        </RsRadioGroup.make>
      ),
  },
  "scroll-area": {
    renderTsx: () =>
      panel(
        <TsxScrollArea.ScrollArea className="h-28 w-64 rounded-md border">
          <div className="space-y-2 p-2 text-sm">
            <div>Line 1</div>
            <div>Line 2</div>
            <div>Line 3</div>
            <div>Line 4</div>
            <div>Line 5</div>
            <div>Line 6</div>
          </div>
          <TsxScrollArea.ScrollBar />
        </TsxScrollArea.ScrollArea>
      ),
    renderRescript: () =>
      panel(
        <RsScrollArea.make className="h-28 w-64 rounded-md border">
          <div className="space-y-2 p-2 text-sm">
            <div>Line 1</div>
            <div>Line 2</div>
            <div>Line 3</div>
            <div>Line 4</div>
            <div>Line 5</div>
            <div>Line 6</div>
          </div>
          <RsScrollArea.ScrollBar.make />
        </RsScrollArea.make>
      ),
  },
  select: {
    renderTsx: () =>
      panel(
        <TsxSelect.Select defaultValue="apple" open>
          <TsxSelect.SelectTrigger className="w-56">
            <TsxSelect.SelectValue />
          </TsxSelect.SelectTrigger>
          <TsxSelect.SelectContent>
            <TsxSelect.SelectItem value="apple">Apple</TsxSelect.SelectItem>
            <TsxSelect.SelectItem value="orange">Orange</TsxSelect.SelectItem>
          </TsxSelect.SelectContent>
        </TsxSelect.Select>
      ),
    renderRescript: () =>
      panel(
        <RsSelect.make defaultValue="apple" open>
          <RsSelect.Trigger.make className="w-56">
            <RsSelect.Value.make />
          </RsSelect.Trigger.make>
          <RsSelect.Content.make>
            <RsSelect.Item.make value="apple">Apple</RsSelect.Item.make>
            <RsSelect.Item.make value="orange">Orange</RsSelect.Item.make>
          </RsSelect.Content.make>
        </RsSelect.make>
      ),
  },
  separator: {
    renderTsx: () => panel(<TsxSeparator.Separator />),
    renderRescript: () => panel(<RsSeparator.make />),
  },
  sheet: {
    renderTsx: () =>
      panel(
        <TsxSheet.Sheet open>
          <TsxSheet.SheetTrigger>Open sheet</TsxSheet.SheetTrigger>
          <TsxSheet.SheetContent side="right">
            <TsxSheet.SheetHeader>
              <TsxSheet.SheetTitle>Sheet title</TsxSheet.SheetTitle>
              <TsxSheet.SheetDescription>Description</TsxSheet.SheetDescription>
            </TsxSheet.SheetHeader>
          </TsxSheet.SheetContent>
        </TsxSheet.Sheet>
      ),
    renderRescript: () =>
      panel(
        <RsSheet.make open>
          <RsSheet.Trigger.make>Open sheet</RsSheet.Trigger.make>
          <RsSheet.Content.make side="right">
            <RsSheet.Header.make>
              <RsSheet.Title.make>Sheet title</RsSheet.Title.make>
              <RsSheet.Description.make>Description</RsSheet.Description.make>
            </RsSheet.Header.make>
          </RsSheet.Content.make>
        </RsSheet.make>
      ),
  },
  sidebar: {
    renderTsx: () =>
      panel(
        <TsxSidebar.SidebarProvider defaultOpen>
          <div className="flex h-64 w-[480px] overflow-hidden rounded-lg border">
            <TsxSidebar.Sidebar collapsible="none">
              <TsxSidebar.SidebarContent>
                <TsxSidebar.SidebarGroup>
                  <TsxSidebar.SidebarGroupLabel>
                    Main
                  </TsxSidebar.SidebarGroupLabel>
                  <TsxSidebar.SidebarGroupContent>
                    <TsxSidebar.SidebarMenu>
                      <TsxSidebar.SidebarMenuItem>
                        <TsxSidebar.SidebarMenuButton>
                          Dashboard
                        </TsxSidebar.SidebarMenuButton>
                      </TsxSidebar.SidebarMenuItem>
                    </TsxSidebar.SidebarMenu>
                  </TsxSidebar.SidebarGroupContent>
                </TsxSidebar.SidebarGroup>
              </TsxSidebar.SidebarContent>
            </TsxSidebar.Sidebar>
          </div>
        </TsxSidebar.SidebarProvider>
      ),
    renderRescript: () =>
      panel(
        <RsSidebar.Provider.make defaultOpen>
          <div className="flex h-64 w-[480px] overflow-hidden rounded-lg border">
            <RsSidebar.make collapsible="none">
              <RsSidebar.Content.make>
                <RsSidebar.Group.make>
                  <RsSidebar.GroupLabel.make>Main</RsSidebar.GroupLabel.make>
                  <RsSidebar.GroupContent.make>
                    <RsSidebar.Menu.make>
                      <RsSidebar.MenuItem.make>
                        <RsSidebar.MenuButton.make>
                          Dashboard
                        </RsSidebar.MenuButton.make>
                      </RsSidebar.MenuItem.make>
                    </RsSidebar.Menu.make>
                  </RsSidebar.GroupContent.make>
                </RsSidebar.Group.make>
              </RsSidebar.Content.make>
            </RsSidebar.make>
          </div>
        </RsSidebar.Provider.make>
      ),
  },
  slider: {
    renderTsx: () => panel(<TsxSlider.Slider defaultValue={[40]} />),
    renderRescript: () => panel(<RsSlider.make defaultValue={[40]} />),
  },
  switch: {
    renderTsx: () => panel(<TsxSwitch.Switch defaultChecked />),
    renderRescript: () => panel(<RsSwitch.make defaultChecked />),
  },
  tabs: {
    renderTsx: () =>
      panel(
        <TsxTabs.Tabs defaultValue="account" className="w-80">
          <TsxTabs.TabsList>
            <TsxTabs.TabsTrigger value="account">Account</TsxTabs.TabsTrigger>
            <TsxTabs.TabsTrigger value="password">Password</TsxTabs.TabsTrigger>
          </TsxTabs.TabsList>
          <TsxTabs.TabsContent value="account">Account tab</TsxTabs.TabsContent>
          <TsxTabs.TabsContent value="password">
            Password tab
          </TsxTabs.TabsContent>
        </TsxTabs.Tabs>
      ),
    renderRescript: () =>
      panel(
        <RsTabs.make defaultValue="account" className="w-80">
          <RsTabs.List.make>
            <RsTabs.Trigger.make value="account">Account</RsTabs.Trigger.make>
            <RsTabs.Trigger.make value="password">Password</RsTabs.Trigger.make>
          </RsTabs.List.make>
          <RsTabs.Content.make value="account">Account tab</RsTabs.Content.make>
          <RsTabs.Content.make value="password">Password tab</RsTabs.Content.make>
        </RsTabs.make>
      ),
  },
  toggle: {
    renderTsx: () => panel(<TsxToggle.Toggle defaultPressed>Bold</TsxToggle.Toggle>),
    renderRescript: () => panel(<RsToggle.make defaultPressed>Bold</RsToggle.make>),
  },
  "toggle-group": {
    renderTsx: () =>
      panel(
        <TsxToggleGroup.ToggleGroup defaultValue="left">
          <TsxToggleGroup.ToggleGroupItem value="left">
            Left
          </TsxToggleGroup.ToggleGroupItem>
          <TsxToggleGroup.ToggleGroupItem value="center">
            Center
          </TsxToggleGroup.ToggleGroupItem>
          <TsxToggleGroup.ToggleGroupItem value="right">
            Right
          </TsxToggleGroup.ToggleGroupItem>
        </TsxToggleGroup.ToggleGroup>
      ),
    renderRescript: () =>
      panel(
        <RsToggleGroup.make defaultValue="left">
          <RsToggleGroup.Item.make value="left">Left</RsToggleGroup.Item.make>
          <RsToggleGroup.Item.make value="center">Center</RsToggleGroup.Item.make>
          <RsToggleGroup.Item.make value="right">Right</RsToggleGroup.Item.make>
        </RsToggleGroup.make>
      ),
  },
  tooltip: {
    renderTsx: () =>
      panel(
        <TsxTooltip.TooltipProvider>
          <TsxTooltip.Tooltip open>
            <TsxTooltip.TooltipTrigger className="inline-flex rounded-md border px-3 py-2 text-sm">
              Hover
            </TsxTooltip.TooltipTrigger>
            <TsxTooltip.TooltipContent>Tooltip content</TsxTooltip.TooltipContent>
          </TsxTooltip.Tooltip>
        </TsxTooltip.TooltipProvider>
      ),
    renderRescript: () =>
      panel(
        <RsTooltip.Provider.make>
          <RsTooltip.make open>
            <RsTooltip.Trigger.make className="inline-flex rounded-md border px-3 py-2 text-sm">
              Hover
            </RsTooltip.Trigger.make>
            <RsTooltip.Content.make>Tooltip content</RsTooltip.Content.make>
          </RsTooltip.make>
        </RsTooltip.Provider.make>
      ),
  },
}

export function getScenario(id: string): Scenario | null {
  if (id in scenarios) {
    return scenarios[id as (typeof scenarioIds)[number]]
  }

  return null
}
