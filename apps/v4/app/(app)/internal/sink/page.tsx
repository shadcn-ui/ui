import { AccordionDemo } from "@/app/(app)/internal/sink/components/accordion-demo"
import { AlertDemo } from "@/app/(app)/internal/sink/components/alert-demo"
import { AlertDialogDemo } from "@/app/(app)/internal/sink/components/alert-dialog-demo"
import { AspectRatioDemo } from "@/app/(app)/internal/sink/components/aspect-ratio-demo"
import { AvatarDemo } from "@/app/(app)/internal/sink/components/avatar-demo"
import { BadgeDemo } from "@/app/(app)/internal/sink/components/badge-demo"
import { BreadcrumbDemo } from "@/app/(app)/internal/sink/components/breadcrumb-demo"
import { ButtonDemo } from "@/app/(app)/internal/sink/components/button-demo"
import { CalendarDemo } from "@/app/(app)/internal/sink/components/calendar-demo"
import { CardDemo } from "@/app/(app)/internal/sink/components/card-demo"
import { CarouselDemo } from "@/app/(app)/internal/sink/components/carousel-demo"
import { ChartDemo } from "@/app/(app)/internal/sink/components/chart-demo"
import { CheckboxDemo } from "@/app/(app)/internal/sink/components/checkbox-demo"
import { CollapsibleDemo } from "@/app/(app)/internal/sink/components/collapsible-demo"
import { ComboboxDemo } from "@/app/(app)/internal/sink/components/combobox-demo"
import { CommandDemo } from "@/app/(app)/internal/sink/components/command-demo"
import { ComponentWrapper } from "@/app/(app)/internal/sink/components/component-wrapper"
import { ContextMenuDemo } from "@/app/(app)/internal/sink/components/context-menu-demo"
import { DatePickerDemo } from "@/app/(app)/internal/sink/components/date-picker-demo"
import { DialogDemo } from "@/app/(app)/internal/sink/components/dialog-demo"
import { DrawerDemo } from "@/app/(app)/internal/sink/components/drawer-demo"
import { DropdownMenuDemo } from "@/app/(app)/internal/sink/components/dropdown-menu-demo"
import { FormDemo } from "@/app/(app)/internal/sink/components/form-demo"
import { HoverCardDemo } from "@/app/(app)/internal/sink/components/hover-card-demo"
import { InputDemo } from "@/app/(app)/internal/sink/components/input-demo"
import { InputOTPDemo } from "@/app/(app)/internal/sink/components/input-otp-demo"
import { LabelDemo } from "@/app/(app)/internal/sink/components/label-demo"
import { MenubarDemo } from "@/app/(app)/internal/sink/components/menubar-demo"
import { NavigationMenuDemo } from "@/app/(app)/internal/sink/components/navigation-menu-demo"
import { PaginationDemo } from "@/app/(app)/internal/sink/components/pagination-demo"
import { PopoverDemo } from "@/app/(app)/internal/sink/components/popover-demo"
import { ProgressDemo } from "@/app/(app)/internal/sink/components/progress-demo"
import { RadioGroupDemo } from "@/app/(app)/internal/sink/components/radio-group-demo"
import { ResizableDemo } from "@/app/(app)/internal/sink/components/resizable-demo"
import { ScrollAreaDemo } from "@/app/(app)/internal/sink/components/scroll-area-demo"
import { SelectDemo } from "@/app/(app)/internal/sink/components/select-demo"
import { SeparatorDemo } from "@/app/(app)/internal/sink/components/separator-demo"
import { SheetDemo } from "@/app/(app)/internal/sink/components/sheet-demo"
import { SkeletonDemo } from "@/app/(app)/internal/sink/components/skeleton-demo"
import { SliderDemo } from "@/app/(app)/internal/sink/components/slider-demo"
import { SonnerDemo } from "@/app/(app)/internal/sink/components/sonner-demo"
import { SwitchDemo } from "@/app/(app)/internal/sink/components/switch-demo"
import { TableDemo } from "@/app/(app)/internal/sink/components/table-demo"
import { TabsDemo } from "@/app/(app)/internal/sink/components/tabs-demo"
import { TextareaDemo } from "@/app/(app)/internal/sink/components/textarea-demo"
import { ToggleDemo } from "@/app/(app)/internal/sink/components/toggle-demo"
import { ToggleGroupDemo } from "@/app/(app)/internal/sink/components/toggle-group-demo"
import { TooltipDemo } from "@/app/(app)/internal/sink/components/tooltip-demo"

export default function SinkPage() {
  return (
    <div className="@container grid flex-1 gap-4 p-4">
      <ComponentWrapper name="chart" className="w-full">
        <ChartDemo />
      </ComponentWrapper>
      <ComponentWrapper name="accordion">
        <AccordionDemo />
      </ComponentWrapper>
      <ComponentWrapper name="alert">
        <AlertDemo />
      </ComponentWrapper>
      <ComponentWrapper name="alert-dialog">
        <AlertDialogDemo />
      </ComponentWrapper>
      <ComponentWrapper name="aspect-ratio">
        <AspectRatioDemo />
      </ComponentWrapper>
      <ComponentWrapper name="avatar">
        <AvatarDemo />
      </ComponentWrapper>
      <ComponentWrapper name="badge">
        <BadgeDemo />
      </ComponentWrapper>
      <ComponentWrapper name="breadcrumb">
        <BreadcrumbDemo />
      </ComponentWrapper>
      <ComponentWrapper name="button">
        <ButtonDemo />
      </ComponentWrapper>
      <ComponentWrapper name="calendar">
        <CalendarDemo />
      </ComponentWrapper>
      <ComponentWrapper name="card">
        <CardDemo />
      </ComponentWrapper>
      <ComponentWrapper name="carousel">
        <CarouselDemo />
      </ComponentWrapper>
      <ComponentWrapper name="checkbox">
        <CheckboxDemo />
      </ComponentWrapper>
      <ComponentWrapper name="collapsible">
        <CollapsibleDemo />
      </ComponentWrapper>
      <ComponentWrapper name="combobox">
        <ComboboxDemo />
      </ComponentWrapper>
      <ComponentWrapper name="command">
        <CommandDemo />
      </ComponentWrapper>
      <ComponentWrapper name="context-menu">
        <ContextMenuDemo />
      </ComponentWrapper>
      <ComponentWrapper name="date-picker">
        <DatePickerDemo />
      </ComponentWrapper>
      <ComponentWrapper name="dialog">
        <DialogDemo />
      </ComponentWrapper>
      <ComponentWrapper name="drawer">
        <DrawerDemo />
      </ComponentWrapper>
      <ComponentWrapper name="dropdown-menu">
        <DropdownMenuDemo />
      </ComponentWrapper>
      <ComponentWrapper name="form">
        <FormDemo />
      </ComponentWrapper>
      <ComponentWrapper name="hover-card">
        <HoverCardDemo />
      </ComponentWrapper>
      <ComponentWrapper name="input">
        <InputDemo />
      </ComponentWrapper>
      <ComponentWrapper name="input-otp">
        <InputOTPDemo />
      </ComponentWrapper>
      <ComponentWrapper name="label">
        <LabelDemo />
      </ComponentWrapper>
      <ComponentWrapper name="menubar">
        <MenubarDemo />
      </ComponentWrapper>
      <ComponentWrapper name="navigation-menu">
        <NavigationMenuDemo />
      </ComponentWrapper>
      <ComponentWrapper name="pagination">
        <PaginationDemo />
      </ComponentWrapper>
      <ComponentWrapper name="popover">
        <PopoverDemo />
      </ComponentWrapper>
      <ComponentWrapper name="progress">
        <ProgressDemo />
      </ComponentWrapper>
      <ComponentWrapper name="radio-group">
        <RadioGroupDemo />
      </ComponentWrapper>
      <ComponentWrapper name="resizable">
        <ResizableDemo />
      </ComponentWrapper>
      <ComponentWrapper name="scroll-area">
        <ScrollAreaDemo />
      </ComponentWrapper>
      <ComponentWrapper name="select">
        <SelectDemo />
      </ComponentWrapper>
      <ComponentWrapper name="separator">
        <SeparatorDemo />
      </ComponentWrapper>
      <ComponentWrapper name="sheet">
        <SheetDemo />
      </ComponentWrapper>
      <ComponentWrapper name="skeleton">
        <SkeletonDemo />
      </ComponentWrapper>
      <ComponentWrapper name="slider">
        <SliderDemo />
      </ComponentWrapper>
      <ComponentWrapper name="sonner">
        <SonnerDemo />
      </ComponentWrapper>
      <ComponentWrapper name="switch">
        <SwitchDemo />
      </ComponentWrapper>
      <ComponentWrapper name="table">
        <TableDemo />
      </ComponentWrapper>
      <ComponentWrapper name="tabs">
        <TabsDemo />
      </ComponentWrapper>
      <ComponentWrapper name="textarea">
        <TextareaDemo />
      </ComponentWrapper>
      <ComponentWrapper name="toggle">
        <ToggleDemo />
      </ComponentWrapper>
      <ComponentWrapper name="toggle-group">
        <ToggleGroupDemo />
      </ComponentWrapper>
      <ComponentWrapper name="tooltip">
        <TooltipDemo />
      </ComponentWrapper>
    </div>
  )
}
