import { AccordionDemo } from "./components/accordion-demo"
import { AlertDemo } from "./components/alert-demo"
import { AlertDialogDemo } from "./components/alert-dialog-demo"
import { AspectRatioDemo } from "./components/aspect-ratio-demo"
import { AvatarDemo } from "./components/avatar-demo"
import { BadgeDemo } from "./components/badge-demo"
import { BreadcrumbDemo } from "./components/breadcrumb-demo"
import { ButtonDemo } from "./components/button-demo"
import { ButtonGroupDemo } from "./components/button-group-demo"
import { CalendarDemo } from "./components/calendar-demo"
import { CardDemo } from "./components/card-demo"
import { CarouselDemo } from "./components/carousel-demo"
import { ChartDemo } from "./components/chart-demo"
import { CheckboxDemo } from "./components/checkbox-demo"
import { CollapsibleDemo } from "./components/collapsible-demo"
import { ComboboxDemo } from "./components/combobox-demo"
import { CommandDemo } from "./components/command-demo"
import { ContextMenuDemo } from "./components/context-menu-demo"
import { DatePickerDemo } from "./components/date-picker-demo"
import { DialogDemo } from "./components/dialog-demo"
import { DrawerDemo } from "./components/drawer-demo"
import { DropdownMenuDemo } from "./components/dropdown-menu-demo"
import { FieldDemo } from "./components/field-demo"
import { FormDemo } from "./components/form-demo"
import { HoverCardDemo } from "./components/hover-card-demo"
import { InputDemo } from "./components/input-demo"
import { InputGroupDemo } from "./components/input-group-demo"
import { InputOTPDemo } from "./components/input-otp-demo"
import { LabelDemo } from "./components/label-demo"
import { MenubarDemo } from "./components/menubar-demo"
import { NavigationMenuDemo } from "./components/navigation-menu-demo"
import { OptionDemo } from "./components/option-demo"
import { PaginationDemo } from "./components/pagination-demo"
import { PopoverDemo } from "./components/popover-demo"
import { ProgressDemo } from "./components/progress-demo"
import { RadioGroupDemo } from "./components/radio-group-demo"
import { ResizableDemo } from "./components/resizable-demo"
import { ScrollAreaDemo } from "./components/scroll-area-demo"
import { SelectDemo } from "./components/select-demo"
import { SeparatorDemo } from "./components/separator-demo"
import { SheetDemo } from "./components/sheet-demo"
import { SkeletonDemo } from "./components/skeleton-demo"
import { SliderDemo } from "./components/slider-demo"
import { SonnerDemo } from "./components/sonner-demo"
import { SwitchDemo } from "./components/switch-demo"
import { TableDemo } from "./components/table-demo"
import { TabsDemo } from "./components/tabs-demo"
import { TextareaDemo } from "./components/textarea-demo"
import { ToggleDemo } from "./components/toggle-demo"
import { ToggleGroupDemo } from "./components/toggle-group-demo"
import { TooltipDemo } from "./components/tooltip-demo"

type ComponentConfig = {
  name: string
  component: React.ComponentType
  className?: string
}

export const componentRegistry: Record<string, ComponentConfig> = {
  accordion: {
    name: "Accordion",
    component: AccordionDemo,
  },
  alert: {
    name: "Alert",
    component: AlertDemo,
  },
  "alert-dialog": {
    name: "Alert Dialog",
    component: AlertDialogDemo,
  },
  "aspect-ratio": {
    name: "Aspect Ratio",
    component: AspectRatioDemo,
  },
  avatar: {
    name: "Avatar",
    component: AvatarDemo,
  },
  badge: {
    name: "Badge",
    component: BadgeDemo,
  },
  breadcrumb: {
    name: "Breadcrumb",
    component: BreadcrumbDemo,
  },
  button: {
    name: "Button",
    component: ButtonDemo,
  },
  "button-group": {
    name: "Button Group",
    component: ButtonGroupDemo,
  },
  calendar: {
    name: "Calendar",
    component: CalendarDemo,
  },
  card: {
    name: "Card",
    component: CardDemo,
  },
  carousel: {
    name: "Carousel",
    component: CarouselDemo,
  },
  chart: {
    name: "Chart",
    component: ChartDemo,
    className: "w-full",
  },
  checkbox: {
    name: "Checkbox",
    component: CheckboxDemo,
  },
  collapsible: {
    name: "Collapsible",
    component: CollapsibleDemo,
  },
  combobox: {
    name: "Combobox",
    component: ComboboxDemo,
  },
  command: {
    name: "Command",
    component: CommandDemo,
  },
  "context-menu": {
    name: "Context Menu",
    component: ContextMenuDemo,
  },
  "date-picker": {
    name: "Date Picker",
    component: DatePickerDemo,
  },
  dialog: {
    name: "Dialog",
    component: DialogDemo,
  },
  drawer: {
    name: "Drawer",
    component: DrawerDemo,
  },
  "dropdown-menu": {
    name: "Dropdown Menu",
    component: DropdownMenuDemo,
  },
  field: {
    name: "Field",
    component: FieldDemo,
  },
  form: {
    name: "Form",
    component: FormDemo,
  },
  "hover-card": {
    name: "Hover Card",
    component: HoverCardDemo,
  },
  input: {
    name: "Input",
    component: InputDemo,
  },
  "input-group": {
    name: "Input Group",
    component: InputGroupDemo,
  },
  "input-otp": {
    name: "Input OTP",
    component: InputOTPDemo,
  },
  label: {
    name: "Label",
    component: LabelDemo,
  },
  menubar: {
    name: "Menubar",
    component: MenubarDemo,
  },
  "navigation-menu": {
    name: "Navigation Menu",
    component: NavigationMenuDemo,
  },
  option: {
    name: "Option",
    component: OptionDemo,
  },
  pagination: {
    name: "Pagination",
    component: PaginationDemo,
  },
  popover: {
    name: "Popover",
    component: PopoverDemo,
  },
  progress: {
    name: "Progress",
    component: ProgressDemo,
  },
  "radio-group": {
    name: "Radio Group",
    component: RadioGroupDemo,
  },
  resizable: {
    name: "Resizable",
    component: ResizableDemo,
  },
  "scroll-area": {
    name: "Scroll Area",
    component: ScrollAreaDemo,
  },
  select: {
    name: "Select",
    component: SelectDemo,
  },
  separator: {
    name: "Separator",
    component: SeparatorDemo,
  },
  sheet: {
    name: "Sheet",
    component: SheetDemo,
  },
  skeleton: {
    name: "Skeleton",
    component: SkeletonDemo,
  },
  slider: {
    name: "Slider",
    component: SliderDemo,
  },
  sonner: {
    name: "Sonner",
    component: SonnerDemo,
  },
  switch: {
    name: "Switch",
    component: SwitchDemo,
  },
  table: {
    name: "Table",
    component: TableDemo,
  },
  tabs: {
    name: "Tabs",
    component: TabsDemo,
  },
  textarea: {
    name: "Textarea",
    component: TextareaDemo,
  },
  toggle: {
    name: "Toggle",
    component: ToggleDemo,
  },
  "toggle-group": {
    name: "Toggle Group",
    component: ToggleGroupDemo,
  },
  tooltip: {
    name: "Tooltip",
    component: TooltipDemo,
  },
}

export type ComponentKey = keyof typeof componentRegistry
