import { AccordionDemo } from "@/components/accordion-demo"
import { AlertDemo } from "@/components/alert-demo"
import { AlertDialogDemo } from "@/components/alert-dialog-demo"
import { AppSidebar } from "@/components/app-sidebar"
import { AspectRatioDemo } from "@/components/aspect-ratio-demo"
import { AvatarDemo } from "@/components/avatar-demo"
import { BadgeDemo } from "@/components/badge-demo"
import { BreadcrumbDemo } from "@/components/breadcrumb-demo"
import { ButtonDemo } from "@/components/button-demo"
import { CalendarDemo } from "@/components/calendar-demo"
import { CardDemo } from "@/components/card-demo"
import { CarouselDemo } from "@/components/carousel-demo"
import { CheckboxDemo } from "@/components/checkbox-demo"
import { CollapsibleDemo } from "@/components/collapsible-demo"
import { ComboboxDemo } from "@/components/combobox-demo"
import { CommandDemo } from "@/components/command-demo"
import { ComponentWrapper } from "@/components/component-wrapper"
import { ContextMenuDemo } from "@/components/context-menu-demo"
import { DatePickerDemo } from "@/components/date-picker-demo"
import { DialogDemo } from "@/components/dialog-demo"
import { DrawerDemo } from "@/components/drawer-demo"
import { DropdownMenuDemo } from "@/components/dropdown-menu-demo"
import { HoverCardDemo } from "@/components/hover-card-demo"
import { InputDemo } from "@/components/input-demo"
import { InputOTPDemo } from "@/components/input-otp-demo"
import { LabelDemo } from "@/components/label-demo"
import { MenubarDemo } from "@/components/menubar-demo"
import ModeToggle from "@/components/mode-toggle"
import { NavigationMenuDemo } from "@/components/navigation-menu-demo"
import { PaginationDemo } from "@/components/pagination-demo"
import { PopoverDemo } from "@/components/popover-demo"
import { ProgressDemo } from "@/components/progress-demo"
import { RadioGroupDemo } from "@/components/radio-group-demo"
import { ResizableDemo } from "@/components/resizable-demo"
import { ScrollAreaDemo } from "@/components/scroll-area-demo"
import { SelectDemo } from "@/components/select-demo"
import { SeparatorDemo } from "@/components/separator-demo"
import { SheetDemo } from "@/components/sheet-demo"
import { SkeletonDemo } from "@/components/skeleton-demo"
import { SliderDemo } from "@/components/slider-demo"
import { SonnerDemo } from "@/components/sonner-demo"
import { SwitchDemo } from "@/components/switch-demo"
import { TableDemo } from "@/components/table-demo"
import { TabsDemo } from "@/components/tabs-demo"
import { TextareaDemo } from "@/components/textarea-demo"
import { ToggleDemo } from "@/components/toggle-demo"
import { ToggleGroupDemo } from "@/components/toggle-group-demo"
import { TooltipDemo } from "@/components/tooltip-demo"
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
        <header className="bg-background sticky top-0 isolate z-10 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
