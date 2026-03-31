import type { Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "accordion-example",
    title: "Accordion",
    type: "registry:example",
    files: [
      {
        path: "examples/accordion/AccordionDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "accordion",
    ],
    dependencies: [],
  },
  {
    name: "alert-example",
    title: "Alert",
    type: "registry:example",
    files: [
      {
        path: "examples/alert/AlertDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert/AlertDestructive.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "alert",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "alert-dialog-example",
    title: "Alert Dialog",
    type: "registry:example",
    files: [
      {
        path: "examples/alert-dialog/AlertDialogDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "alert-dialog",
      "button",
    ],
    dependencies: [],
  },
  {
    name: "aspect-ratio-example",
    title: "Aspect Ratio",
    type: "registry:example",
    files: [
      {
        path: "examples/aspect-ratio/AspectRatioDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "aspect-ratio",
    ],
    dependencies: [],
  },
  {
    name: "avatar-example",
    title: "Avatar",
    type: "registry:example",
    files: [
      {
        path: "examples/avatar/AvatarDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "avatar",
    ],
    dependencies: [],
  },
  {
    name: "badge-example",
    title: "Badge",
    type: "registry:example",
    files: [
      {
        path: "examples/badge/BadgeDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeDestructive.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeOutline.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeSecondary.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "badge",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "breadcrumb-example",
    title: "Breadcrumb",
    type: "registry:example",
    files: [
      {
        path: "examples/breadcrumb/BreadcrumbCollapsedDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/breadcrumb/BreadcrumbCustomSeparatorDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/breadcrumb/BreadcrumbDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/breadcrumb/BreadcrumbDropdownDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/breadcrumb/BreadcrumbLinkDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/breadcrumb/BreadcrumbResponsiveDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "breadcrumb",
      "button",
      "drawer",
      "dropdown-menu",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "button-example",
    title: "Button",
    type: "registry:example",
    files: [
      {
        path: "examples/button/ButtonDefault.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonDestructive.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonGhost.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonIcon.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonLink.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonLoading.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonOutline.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonRounded.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonSecondary.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonSize.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonWithIcon.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "spinner",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "button-group-example",
    title: "Button Group",
    type: "registry:example",
    files: [
      {
        path: "examples/button-group/ButtonGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupInputGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupNestedDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupOrientationDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupSeparatorDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupSizeDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupSplitDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithDropdownMenuDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithInputDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithPopoverDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithSelectDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "button-group",
      "dropdown-menu",
      "input",
      "input-group",
      "popover",
      "select",
      "separator",
      "textarea",
      "tooltip",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "calendar-example",
    title: "Calendar",
    type: "registry:example",
    files: [
      {
        path: "examples/calendar/CalendarCustomCellSize.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarDateAndTimePicker.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarDateBirth.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarNaturalLanguagePicker.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarPersianDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarRangeDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarSystems.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarYearAndMonthSelector.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "calendar",
      "input",
      "label",
      "popover",
      "range-calendar",
      "select",
    ],
    dependencies: [
      "chrono-node",
      "lucide-vue-next",
      "reka-ui",
      "reka-ui/date",
    ],
  },
  {
    name: "card-example",
    title: "Card",
    type: "registry:example",
    files: [
      {
        path: "examples/card/CardDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "card",
      "input",
      "label",
    ],
    dependencies: [],
  },
  {
    name: "carousel-example",
    title: "Carousel",
    type: "registry:example",
    files: [
      {
        path: "examples/carousel/CarouselApi.vue",
        type: "registry:example",
      },
      {
        path: "examples/carousel/CarouselDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/carousel/CarouselOrientation.vue",
        type: "registry:example",
      },
      {
        path: "examples/carousel/CarouselPlugin.vue",
        type: "registry:example",
      },
      {
        path: "examples/carousel/CarouselSize.vue",
        type: "registry:example",
      },
      {
        path: "examples/carousel/CarouselSpacing.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "card",
      "carousel",
    ],
    dependencies: [
      "embla-carousel-autoplay",
    ],
  },
  {
    name: "chart-example",
    title: "Chart",
    type: "registry:example",
    files: [
      {
        path: "examples/chart/ChartBarDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/chart/ChartBarDemoAxis.vue",
        type: "registry:example",
      },
      {
        path: "examples/chart/ChartBarDemoLegend.vue",
        type: "registry:example",
      },
      {
        path: "examples/chart/ChartBarDemoTooltip.vue",
        type: "registry:example",
      },
      {
        path: "examples/chart/ChartDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "card",
      "chart",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "checkbox-example",
    title: "Checkbox",
    type: "registry:example",
    files: [
      {
        path: "examples/checkbox/CheckboxDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/checkbox/CheckboxDisabled.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "checkbox",
      "label",
    ],
    dependencies: [],
  },
  {
    name: "collapsible-example",
    title: "Collapsible",
    type: "registry:example",
    files: [
      {
        path: "examples/collapsible/CollapsibleDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "collapsible",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "combobox-example",
    title: "Combobox",
    type: "registry:example",
    files: [
      {
        path: "examples/combobox/ComboboxDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "command",
      "popover",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "command-example",
    title: "Command",
    type: "registry:example",
    files: [
      {
        path: "examples/command/CommandDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "command",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "context-menu-example",
    title: "Context Menu",
    type: "registry:example",
    files: [
      {
        path: "examples/context-menu/ContextMenuDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "context-menu",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "data-table-example",
    title: "Data Table",
    type: "registry:example",
    files: [
      {
        path: "examples/data-table/DataTableDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "checkbox",
      "dropdown-menu",
      "input",
      "table",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "date-picker-example",
    title: "Date Picker",
    type: "registry:example",
    files: [
      {
        path: "examples/date-picker/DatePickerDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "calendar",
      "popover",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "dialog-example",
    title: "Dialog",
    type: "registry:example",
    files: [
      {
        path: "examples/dialog/DialogCloseButton.vue",
        type: "registry:example",
      },
      {
        path: "examples/dialog/DialogDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/dialog/DialogForm.vue",
        type: "registry:example",
      },
      {
        path: "examples/dialog/DialogResponsive.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "dialog",
      "drawer",
      "field",
      "input",
      "label",
    ],
    dependencies: [
      "vee-validate",
      "vue-sonner",
      "zod",
    ],
  },
  {
    name: "drawer-example",
    title: "Drawer",
    type: "registry:example",
    files: [
      {
        path: "examples/drawer/DrawerDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "drawer",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "dropdown-menu-example",
    title: "Dropdown Menu",
    type: "registry:example",
    files: [
      {
        path: "examples/dropdown-menu/DropdownMenuDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "dropdown-menu",
    ],
    dependencies: [],
  },
  {
    name: "empty-example",
    title: "Empty",
    type: "registry:example",
    files: [
      {
        path: "examples/empty/EmptyAvatarDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyAvatarGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyBackgroundDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyInputGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyOutlineDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "avatar",
      "button",
      "empty",
      "input-group",
      "kbd",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "field-example",
    title: "Field",
    type: "registry:example",
    files: [
      {
        path: "examples/field/FieldCheckboxDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldChoiceCardDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldFieldsetDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldInputDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldRadioDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldResponsiveDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldSelectDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldSliderDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldSwitchDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldTextareaDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "checkbox",
      "field",
      "input",
      "radio-group",
      "select",
      "slider",
      "switch",
      "textarea",
    ],
    dependencies: [],
  },
  {
    name: "form-example",
    title: "Form",
    type: "registry:example",
    files: [
      {
        path: "examples/form/FormDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "form",
      "input",
      "textarea",
    ],
    dependencies: [
      "vee-validate",
      "zod",
    ],
  },
  {
    name: "hover-card-example",
    title: "Hover Card",
    type: "registry:example",
    files: [
      {
        path: "examples/hover-card/HoverCardDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "avatar",
      "button",
      "hover-card",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "input-example",
    title: "Input",
    type: "registry:example",
    files: [
      {
        path: "examples/input/InputDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputFile.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputForm.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputFormAutoAnimate.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputWithButton.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputWithLabel.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputWithText.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "form",
      "input",
      "label",
    ],
    dependencies: [
      "vee-validate",
      "zod",
    ],
  },
  {
    name: "input-group-example",
    title: "Input Group",
    type: "registry:example",
    files: [
      {
        path: "examples/input-group/InputGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithButton.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithButtonGroup.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithCustomInput.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithDropdown.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithIcon.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithLabel.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithSpinner.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithText.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithTextarea.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithTooltip.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button-group",
      "dropdown-menu",
      "input-group",
      "label",
      "popover",
      "separator",
      "spinner",
      "tooltip",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "input-otp-example",
    title: "Input Otp",
    type: "registry:example",
    files: [
      {
        path: "examples/input-otp/InputOTPControlledDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-otp/InputOTPDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-otp/InputOTPFormDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-otp/InputOTPPatternDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-otp/InputOTPSeparatorDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "field",
      "input-otp",
    ],
    dependencies: [
      "vee-validate",
      "vue-input-otp",
      "vue-sonner",
      "zod",
    ],
  },
  {
    name: "item-example",
    title: "Item",
    type: "registry:example",
    files: [
      {
        path: "examples/item/ItemAvatarDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemDropdownDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemHeaderDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemIconDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemImageDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemLinkDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemSizeDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemVariantDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "avatar",
      "button",
      "dropdown-menu",
      "item",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "kbd-example",
    title: "Kbd",
    type: "registry:example",
    files: [
      {
        path: "examples/kbd/KbdDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/kbd/KbdGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/kbd/KbdWithButton.vue",
        type: "registry:example",
      },
      {
        path: "examples/kbd/KbdWithInputGroup.vue",
        type: "registry:example",
      },
      {
        path: "examples/kbd/KbdWithTooltip.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "button-group",
      "input-group",
      "kbd",
      "tooltip",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "label-example",
    title: "Label",
    type: "registry:example",
    files: [
      {
        path: "examples/label/LabelDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "checkbox",
      "label",
    ],
    dependencies: [],
  },
  {
    name: "menubar-example",
    title: "Menubar",
    type: "registry:example",
    files: [
      {
        path: "examples/menubar/MenubarDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "menubar",
    ],
    dependencies: [],
  },
  {
    name: "native-select-example",
    title: "Native Select",
    type: "registry:example",
    files: [
      {
        path: "examples/native-select/NativeSelectDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/native-select/NativeSelectDisabledDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/native-select/NativeSelectFormDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/native-select/NativeSelectGroupsDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/native-select/NativeSelectInputGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/native-select/NativeSelectInvalidDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "form",
      "native-select",
    ],
    dependencies: [
      "vee-validate",
      "vue-sonner",
      "zod",
    ],
  },
  {
    name: "navigation-menu-example",
    title: "Navigation Menu",
    type: "registry:example",
    files: [
      {
        path: "examples/navigation-menu/NavigationMenuDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/navigation-menu/NavigationMenuItem.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "navigation-menu",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "number-field-example",
    title: "Number Field",
    type: "registry:example",
    files: [
      {
        path: "examples/number-field/NumberFieldCurrencyDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/number-field/NumberFieldDecimalDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/number-field/NumberFieldDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/number-field/NumberFieldDisabledDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/number-field/NumberFieldFormDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/number-field/NumberFieldPercentageDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "field",
      "label",
      "number-field",
    ],
    dependencies: [
      "vee-validate",
      "vue-sonner",
      "zod",
    ],
  },
  {
    name: "pagination-example",
    title: "Pagination",
    type: "registry:example",
    files: [
      {
        path: "examples/pagination/PaginationDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "pagination",
    ],
    dependencies: [],
  },
  {
    name: "pin-input-example",
    title: "Pin Input",
    type: "registry:example",
    files: [
      {
        path: "examples/pin-input/PinInputDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "pin-input",
    ],
    dependencies: [],
  },
  {
    name: "popover-example",
    title: "Popover",
    type: "registry:example",
    files: [
      {
        path: "examples/popover/PopoverDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "input",
      "label",
      "popover",
    ],
    dependencies: [],
  },
  {
    name: "progress-example",
    title: "Progress",
    type: "registry:example",
    files: [
      {
        path: "examples/progress/ProgressDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "progress",
    ],
    dependencies: [],
  },
  {
    name: "radio-group-example",
    title: "Radio Group",
    type: "registry:example",
    files: [
      {
        path: "examples/radio-group/RadioGroupDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "label",
      "radio-group",
    ],
    dependencies: [],
  },
  {
    name: "resizable-example",
    title: "Resizable",
    type: "registry:example",
    files: [
      {
        path: "examples/resizable/ResizableDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "resizable",
    ],
    dependencies: [],
  },
  {
    name: "scroll-area-example",
    title: "Scroll Area",
    type: "registry:example",
    files: [
      {
        path: "examples/scroll-area/ScrollAreaDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "scroll-area",
      "separator",
    ],
    dependencies: [],
  },
  {
    name: "select-example",
    title: "Select",
    type: "registry:example",
    files: [
      {
        path: "examples/select/SelectDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectMultipleDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectScrollable.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "select",
    ],
    dependencies: [],
  },
  {
    name: "separator-example",
    title: "Separator",
    type: "registry:example",
    files: [
      {
        path: "examples/separator/SeparatorDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "separator",
    ],
    dependencies: [],
  },
  {
    name: "sheet-example",
    title: "Sheet",
    type: "registry:example",
    files: [
      {
        path: "examples/sheet/SheetDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "input",
      "label",
      "sheet",
    ],
    dependencies: [],
  },
  {
    name: "sidebar-example",
    title: "Sidebar",
    type: "registry:example",
    files: [
      {
        path: "examples/sidebar/SidebarDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "sidebar",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "skeleton-example",
    title: "Skeleton",
    type: "registry:example",
    files: [
      {
        path: "examples/skeleton/SkeletonDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "skeleton",
    ],
    dependencies: [],
  },
  {
    name: "slider-example",
    title: "Slider",
    type: "registry:example",
    files: [
      {
        path: "examples/slider/SliderDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "slider",
    ],
    dependencies: [],
  },
  {
    name: "sonner-example",
    title: "Sonner",
    type: "registry:example",
    files: [
      {
        path: "examples/sonner/SonnerDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/sonner/SonnerTypesDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/sonner/SonnerWithDialogDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "dialog",
    ],
    dependencies: [
      "vue-sonner",
    ],
  },
  {
    name: "spinner-example",
    title: "Spinner",
    type: "registry:example",
    files: [
      {
        path: "examples/spinner/SpinnerBadgeDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerButtonDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerColorDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerCustomDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerEmptyDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerInputGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerItemDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerSizeDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "badge",
      "button",
      "empty",
      "input-group",
      "item",
      "progress",
      "spinner",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "stepper-example",
    title: "Stepper",
    type: "registry:example",
    files: [
      {
        path: "examples/stepper/StepperDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/stepper/StepperForm.vue",
        type: "registry:example",
      },
      {
        path: "examples/stepper/StepperHorizental.vue",
        type: "registry:example",
      },
      {
        path: "examples/stepper/StepperVertical.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "form",
      "input",
      "select",
      "stepper",
    ],
    dependencies: [
      "lucide-vue-next",
      "vue-sonner",
      "zod",
    ],
  },
  {
    name: "switch-example",
    title: "Switch",
    type: "registry:example",
    files: [
      {
        path: "examples/switch/SwitchDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "label",
      "switch",
    ],
    dependencies: [],
  },
  {
    name: "table-example",
    title: "Table",
    type: "registry:example",
    files: [
      {
        path: "examples/table/TableDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "table",
    ],
    dependencies: [],
  },
  {
    name: "tabs-example",
    title: "Tabs",
    type: "registry:example",
    files: [
      {
        path: "examples/tabs/TabsDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "card",
      "input",
      "label",
      "tabs",
    ],
    dependencies: [],
  },
  {
    name: "tags-input-example",
    title: "Tags Input",
    type: "registry:example",
    files: [
      {
        path: "examples/tags-input/TagsInputDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/tags-input/TagsInputWithListbox.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "popover",
      "tags-input",
    ],
    dependencies: [
      "lucide-vue-next",
      "reka-ui",
    ],
  },
  {
    name: "tanstack-form-example",
    title: "Tanstack Form",
    type: "registry:example",
    files: [
      {
        path: "examples/tanstack-form/TanStackFormArray.vue",
        type: "registry:example",
      },
      {
        path: "examples/tanstack-form/TanStackFormCheckbox.vue",
        type: "registry:example",
      },
      {
        path: "examples/tanstack-form/TanStackFormComplex.vue",
        type: "registry:example",
      },
      {
        path: "examples/tanstack-form/TanStackFormDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/tanstack-form/TanStackFormInput.vue",
        type: "registry:example",
      },
      {
        path: "examples/tanstack-form/TanStackFormRadioGroup.vue",
        type: "registry:example",
      },
      {
        path: "examples/tanstack-form/TanStackFormSelect.vue",
        type: "registry:example",
      },
      {
        path: "examples/tanstack-form/TanStackFormSwitch.vue",
        type: "registry:example",
      },
      {
        path: "examples/tanstack-form/TanStackFormTextarea.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "card",
      "checkbox",
      "field",
      "input",
      "input-group",
      "radio-group",
      "select",
      "switch",
      "textarea",
    ],
    dependencies: [
      "lucide-vue-next",
      "vue-sonner",
      "zod",
    ],
  },
  {
    name: "textarea-example",
    title: "Textarea",
    type: "registry:example",
    files: [
      {
        path: "examples/textarea/TextareaDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/textarea/TextareaDisabled.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "textarea",
    ],
    dependencies: [],
  },
  {
    name: "toggle-example",
    title: "Toggle",
    type: "registry:example",
    files: [
      {
        path: "examples/toggle/ToggleDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleDisabledDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleLargeDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleOutlineDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleSmallDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleTextDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "toggle",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "toggle-group-example",
    title: "Toggle Group",
    type: "registry:example",
    files: [
      {
        path: "examples/toggle-group/ToggleGroupDefaultDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupDisabledDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupLargeDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupSingleDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupSmallDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "toggle-group",
    ],
    dependencies: [
      "lucide-vue-next",
    ],
  },
  {
    name: "tooltip-example",
    title: "Tooltip",
    type: "registry:example",
    files: [
      {
        path: "examples/tooltip/TooltipDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "tooltip",
    ],
    dependencies: [],
  },
  {
    name: "typography-example",
    title: "Typography",
    type: "registry:example",
    files: [
      {
        path: "examples/typography/TypographyBlockquote.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyH1.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyH2.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyH3.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyH4.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyInlineCode.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyLarge.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyLead.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyList.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyMuted.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyP.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographySmall.vue",
        type: "registry:example",
      },
      {
        path: "examples/typography/TypographyTable.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "vee-validate-example",
    title: "Vee Validate",
    type: "registry:example",
    files: [
      {
        path: "examples/vee-validate/VeeValidateArrayDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidateCheckboxDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidateComplexDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidateDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidateInputDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidatePasswordDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidateRadioGroupDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidateSelectDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidateSwitchDemo.vue",
        type: "registry:example",
      },
      {
        path: "examples/vee-validate/VeeValidateTextareaDemo.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "card",
      "checkbox",
      "field",
      "input",
      "input-group",
      "progress",
      "radio-group",
      "select",
      "switch",
      "textarea",
    ],
    dependencies: [
      "lucide-vue-next",
      "vee-validate",
      "vue-sonner",
      "zod",
    ],
  },
]
