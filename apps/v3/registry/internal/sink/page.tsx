import ModeToggle from "@/components/mode-toggle"
import { AccordionDemo } from "@/registry/internal/sink/components/accordion-demo"
import { AlertDemo } from "@/registry/internal/sink/components/alert-demo"
import { AlertDialogDemo } from "@/registry/internal/sink/components/alert-dialog-demo"
import { AppSidebar } from "@/registry/internal/sink/components/app-sidebar"
import { AspectRatioDemo } from "@/registry/internal/sink/components/aspect-ratio-demo"
import { AvatarDemo } from "@/registry/internal/sink/components/avatar-demo"
import { BadgeDemo } from "@/registry/internal/sink/components/badge-demo"
import { BreadcrumbDemo } from "@/registry/internal/sink/components/breadcrumb-demo"
import { ButtonDemo } from "@/registry/internal/sink/components/button-demo"
import { CalendarDemo } from "@/registry/internal/sink/components/calendar-demo"
import { CardDemo } from "@/registry/internal/sink/components/card-demo"
import { CarouselDemo } from "@/registry/internal/sink/components/carousel-demo"
import { CheckboxDemo } from "@/registry/internal/sink/components/checkbox-demo"
import { CollapsibleDemo } from "@/registry/internal/sink/components/collapsible-demo"
import { ComboboxDemo } from "@/registry/internal/sink/components/combobox-demo"
import { CommandDemo } from "@/registry/internal/sink/components/command-demo"
import { ComponentWrapper } from "@/registry/internal/sink/components/component-wrapper"
import { ContextMenuDemo } from "@/registry/internal/sink/components/context-menu-demo"
import { DatePickerDemo } from "@/registry/internal/sink/components/date-picker-demo"
import { DialogDemo } from "@/registry/internal/sink/components/dialog-demo"
import { DrawerDemo } from "@/registry/internal/sink/components/drawer-demo"
import { DropdownMenuDemo } from "@/registry/internal/sink/components/dropdown-menu-demo"
import { HoverCardDemo } from "@/registry/internal/sink/components/hover-card-demo"
import { InputDemo } from "@/registry/internal/sink/components/input-demo"
import { InputOTPDemo } from "@/registry/internal/sink/components/input-otp-demo"
import { LabelDemo } from "@/registry/internal/sink/components/label-demo"
import { MenubarDemo } from "@/registry/internal/sink/components/menubar-demo"
import { NavigationMenuDemo } from "@/registry/internal/sink/components/navigation-menu-demo"
import { PaginationDemo } from "@/registry/internal/sink/components/pagination-demo"
import { PopoverDemo } from "@/registry/internal/sink/components/popover-demo"
import { ProgressDemo } from "@/registry/internal/sink/components/progress-demo"
import { RadioGroupDemo } from "@/registry/internal/sink/components/radio-group-demo"
import { ResizableDemo } from "@/registry/internal/sink/components/resizable-demo"
import { ScrollAreaDemo } from "@/registry/internal/sink/components/scroll-area-demo"
import { SelectDemo } from "@/registry/internal/sink/components/select-demo"
import { SeparatorDemo } from "@/registry/internal/sink/components/separator-demo"
import { SheetDemo } from "@/registry/internal/sink/components/sheet-demo"
import { SkeletonDemo } from "@/registry/internal/sink/components/skeleton-demo"
import { SliderDemo } from "@/registry/internal/sink/components/slider-demo"
import { SonnerDemo } from "@/registry/internal/sink/components/sonner-demo"
import { SwitchDemo } from "@/registry/internal/sink/components/switch-demo"
import { TableDemo } from "@/registry/internal/sink/components/table-demo"
import { TabsDemo } from "@/registry/internal/sink/components/tabs-demo"
import { TextareaDemo } from "@/registry/internal/sink/components/textarea-demo"
import { ToggleDemo } from "@/registry/internal/sink/components/toggle-demo"
import { ToggleGroupDemo } from "@/registry/internal/sink/components/toggle-group-demo"
import { TooltipDemo } from "@/registry/internal/sink/components/tooltip-demo"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/ui/breadcrumb"
import { Separator } from "@/registry/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ui/sidebar"

export default function SinkPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="pb-[20vh]">
        <header className="bg-background sticky top-0 isolate z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4">
            <ComponentWrapper name="Accordion">
              <AccordionDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Alert">
              <AlertDemo />
            </ComponentWrapper>
            <ComponentWrapper name="AlertDialog">
              <AlertDialogDemo />
            </ComponentWrapper>
            <ComponentWrapper name="AspectRatio">
              <AspectRatioDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Avatar">
              <AvatarDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Badge">
              <BadgeDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Breadcrumb">
              <BreadcrumbDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Button">
              <ButtonDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Calendar">
              <CalendarDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Card">
              <CardDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Carousel">
              <CarouselDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Checkbox">
              <CheckboxDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Collapsible">
              <CollapsibleDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Combobox">
              <ComboboxDemo />
            </ComponentWrapper>
            {/* <ComponentWrapper name="Command">
              <CommandDemo />
            </ComponentWrapper> */}
            <ComponentWrapper name="ContextMenu">
              <ContextMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name="DatePicker">
              <DatePickerDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Dialog">
              <DialogDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Drawer">
              <DrawerDemo />
            </ComponentWrapper>
            <ComponentWrapper name="DropdownMenu">
              <DropdownMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name="HoverCard">
              <HoverCardDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Input">
              <InputDemo />
            </ComponentWrapper>
            <ComponentWrapper name="InputOTP">
              <InputOTPDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Label">
              <LabelDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Menubar">
              <MenubarDemo />
            </ComponentWrapper>
            <ComponentWrapper name="NavigationMenu">
              <NavigationMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Pagination">
              <PaginationDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Popover">
              <PopoverDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Progress">
              <ProgressDemo />
            </ComponentWrapper>
            <ComponentWrapper name="RadioGroup">
              <RadioGroupDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Resizable">
              <ResizableDemo />
            </ComponentWrapper>
            <ComponentWrapper name="ScrollArea">
              <ScrollAreaDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Select">
              <SelectDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Separator">
              <SeparatorDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Sheet">
              <SheetDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Skeleton">
              <SkeletonDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Slider">
              <SliderDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Sonner">
              <SonnerDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Switch">
              <SwitchDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Table">
              <TableDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Tabs">
              <TabsDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Textarea">
              <TextareaDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Toggle">
              <ToggleDemo />
            </ComponentWrapper>
            <ComponentWrapper name="ToggleGroup">
              <ToggleGroupDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Tooltip">
              <TooltipDemo />
            </ComponentWrapper>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
