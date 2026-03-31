import type { Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "accordion-example",
    title: "Accordion",
    type: "registry:example",
    files: [
      {
        path: "examples/accordion/AccordionBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/accordion/AccordionExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/accordion/AccordionInCard.vue",
        type: "registry:example",
      },
      {
        path: "examples/accordion/AccordionMultiple.vue",
        type: "registry:example",
      },
      {
        path: "examples/accordion/AccordionWithBorders.vue",
        type: "registry:example",
      },
      {
        path: "examples/accordion/AccordionWithDisabled.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "accordion",
      "example",
      "button",
      "card",
    ],
    dependencies: [],
  },
  {
    name: "alert-example",
    title: "Alert",
    type: "registry:example",
    files: [
      {
        path: "examples/alert/AlertBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert/AlertDestructive.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert/AlertExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert/AlertWithActions.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert/AlertWithIcons.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "alert",
      "example",
      "badge",
      "button",
    ],
    dependencies: [],
  },
  {
    name: "alert-dialog-example",
    title: "Alert Dialog",
    type: "registry:example",
    files: [
      {
        path: "examples/alert-dialog/AlertDialogBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert-dialog/AlertDialogDestructive.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert-dialog/AlertDialogExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert-dialog/AlertDialogInDialog.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert-dialog/AlertDialogSmall.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert-dialog/AlertDialogSmallWithMedia.vue",
        type: "registry:example",
      },
      {
        path: "examples/alert-dialog/AlertDialogWithMedia.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "alert-dialog",
      "button",
      "example",
      "dialog",
    ],
    dependencies: [],
  },
  {
    name: "aspect-ratio-example",
    title: "Aspect Ratio",
    type: "registry:example",
    files: [
      {
        path: "examples/aspect-ratio/AspectRatio16x9.vue",
        type: "registry:example",
      },
      {
        path: "examples/aspect-ratio/AspectRatio1x1.vue",
        type: "registry:example",
      },
      {
        path: "examples/aspect-ratio/AspectRatio21x9.vue",
        type: "registry:example",
      },
      {
        path: "examples/aspect-ratio/AspectRatio9x16.vue",
        type: "registry:example",
      },
      {
        path: "examples/aspect-ratio/AspectRatioExample.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "aspect-ratio",
      "example",
    ],
    dependencies: [],
  },
  {
    name: "avatar-example",
    title: "Avatar",
    type: "registry:example",
    files: [
      {
        path: "examples/avatar/AvatarExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/avatar/AvatarGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/avatar/AvatarGroupWithCount.vue",
        type: "registry:example",
      },
      {
        path: "examples/avatar/AvatarGroupWithIconCount.vue",
        type: "registry:example",
      },
      {
        path: "examples/avatar/AvatarInEmpty.vue",
        type: "registry:example",
      },
      {
        path: "examples/avatar/AvatarSizes.vue",
        type: "registry:example",
      },
      {
        path: "examples/avatar/AvatarWithBadge.vue",
        type: "registry:example",
      },
      {
        path: "examples/avatar/AvatarWithBadgeIcon.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "avatar",
      "button",
      "empty",
    ],
    dependencies: [],
  },
  {
    name: "badge-example",
    title: "Badge",
    type: "registry:example",
    files: [
      {
        path: "examples/badge/BadgeAsLink.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeCustomColors.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeLongText.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeVariants.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeWithIconLeft.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeWithIconRight.vue",
        type: "registry:example",
      },
      {
        path: "examples/badge/BadgeWithSpinner.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "badge",
      "example",
      "spinner",
    ],
    dependencies: [],
  },
  {
    name: "breadcrumb-example",
    title: "Breadcrumb",
    type: "registry:example",
    files: [
      {
        path: "examples/breadcrumb/BreadcrumbBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/breadcrumb/BreadcrumbExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/breadcrumb/BreadcrumbWithDropdown.vue",
        type: "registry:example",
      },
      {
        path: "examples/breadcrumb/BreadcrumbWithLink.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "breadcrumb",
      "example",
      "button",
      "dropdown-menu",
    ],
    dependencies: [],
  },
  {
    name: "button-example",
    title: "Button",
    type: "registry:example",
    files: [
      {
        path: "examples/button/ButtonExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonExamples.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonIconLeft.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonIconOnly.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonIconRight.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonInvalidStates.vue",
        type: "registry:example",
      },
      {
        path: "examples/button/ButtonVariantsAndSizes.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
    ],
    dependencies: [],
  },
  {
    name: "button-group-example",
    title: "Button Group",
    type: "registry:example",
    files: [
      {
        path: "examples/button-group/ButtonGroupBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupNavigation.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupNested.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupPagination.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupPaginationSplit.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupTextAlignment.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupVertical.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupVerticalNested.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithDropdown.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithInput.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithInputGroup.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithLike.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithSelect.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithSelectAndInput.vue",
        type: "registry:example",
      },
      {
        path: "examples/button-group/ButtonGroupWithText.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "button-group",
      "example",
      "input-group",
      "tooltip",
      "field",
      "label",
      "dropdown-menu",
      "input",
      "select",
    ],
    dependencies: [],
  },
  {
    name: "calendar-example",
    title: "Calendar",
    type: "registry:example",
    files: [
      {
        path: "examples/calendar/CalendarBookedDates.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarCustomDays.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarMultiple.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarRange.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarRangeMultipleMonths.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarSingle.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarWeekNumbers.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarWithPresets.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/CalendarWithTime.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/DatePickerSimple.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/DatePickerWithDropdowns.vue",
        type: "registry:example",
      },
      {
        path: "examples/calendar/DatePickerWithRange.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "calendar",
      "card",
      "range-calendar",
      "example",
      "button",
      "field",
      "input-group",
      "popover",
    ],
    dependencies: [
      "reka-ui",
    ],
  },
  {
    name: "card-example",
    title: "Card",
    type: "registry:example",
    files: [
      {
        path: "examples/card/CardDefault.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardFooterWithBorder.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardFooterWithBorderSmall.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardHeaderWithBorder.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardHeaderWithBorderSmall.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardLogin.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardMeetingNotes.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardSmall.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardWithImage.vue",
        type: "registry:example",
      },
      {
        path: "examples/card/CardWithImageSmall.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "card",
      "example",
      "field",
      "input",
      "avatar",
    ],
    dependencies: [],
  },
  {
    name: "carousel-example",
    title: "Carousel",
    type: "registry:example",
    files: [
      {
        path: "examples/carousel/CarouselBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/carousel/CarouselExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/carousel/CarouselMultiple.vue",
        type: "registry:example",
      },
      {
        path: "examples/carousel/CarouselWithGap.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "card",
      "carousel",
      "example",
    ],
    dependencies: [],
  },
  {
    name: "chart-example",
    title: "Chart",
    type: "registry:example",
    files: [
      {
        path: "examples/chart/ChartAreaExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/chart/ChartBarExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/chart/ChartExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/chart/ChartLineExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/chart/ChartRadialExample.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "chart",
      "example",
      "card",
    ],
    dependencies: [
      "@unovis/vue",
      "@unovis/ts",
    ],
  },
  {
    name: "checkbox-example",
    title: "Checkbox",
    type: "registry:example",
    files: [
      {
        path: "examples/checkbox/CheckboxBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/checkbox/CheckboxDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/checkbox/CheckboxExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/checkbox/CheckboxGroup.vue",
        type: "registry:example",
      },
      {
        path: "examples/checkbox/CheckboxInTable.vue",
        type: "registry:example",
      },
      {
        path: "examples/checkbox/CheckboxInvalid.vue",
        type: "registry:example",
      },
      {
        path: "examples/checkbox/CheckboxWithDescription.vue",
        type: "registry:example",
      },
      {
        path: "examples/checkbox/CheckboxWithTitle.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "checkbox",
      "field",
      "example",
      "table",
    ],
    dependencies: [],
  },
  {
    name: "collapsible-example",
    title: "Collapsible",
    type: "registry:example",
    files: [
      {
        path: "examples/collapsible/CollapsibleExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/collapsible/CollapsibleFileTree.vue",
        type: "registry:example",
      },
      {
        path: "examples/collapsible/CollapsibleSettings.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "card",
      "collapsible",
      "tabs",
      "field",
      "input",
    ],
    dependencies: [],
  },
  {
    name: "combobox-example",
    title: "Combobox",
    type: "registry:example",
    files: [
      {
        path: "examples/combobox/ComboboxAutoHighlight.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxInDialog.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxInPopup.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxInputAddon.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxInvalid.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxLargeList.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxWithClear.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxWithForm.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxWithGroups.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxWithGroupsAndSeparator.vue",
        type: "registry:example",
      },
      {
        path: "examples/combobox/ComboboxWithOtherInputs.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "combobox",
      "button",
      "dialog",
      "field",
      "input-group",
      "card",
      "input",
      "select",
    ],
    dependencies: [
      "vue-sonner",
    ],
  },
  {
    name: "command-example",
    title: "Command",
    type: "registry:example",
    files: [
      {
        path: "examples/command/CommandBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/command/CommandExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/command/CommandManyItems.vue",
        type: "registry:example",
      },
      {
        path: "examples/command/CommandWithGroups.vue",
        type: "registry:example",
      },
      {
        path: "examples/command/CommandWithShortcuts.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "command",
    ],
    dependencies: [],
  },
  {
    name: "context-menu-example",
    title: "Context Menu",
    type: "registry:example",
    files: [
      {
        path: "examples/context-menu/ContextMenuBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuInDialog.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuWithCheckboxes.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuWithDestructive.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuWithGroups.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuWithRadio.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuWithShortcuts.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuWithSides.vue",
        type: "registry:example",
      },
      {
        path: "examples/context-menu/ContextMenuWithSubmenu.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "context-menu",
      "example",
      "button",
      "dialog",
    ],
    dependencies: [],
  },
  {
    name: "dialog-example",
    title: "Dialog",
    type: "registry:example",
    files: [
      {
        path: "examples/dialog/DialogChatSettings.vue",
        type: "registry:example",
      },
      {
        path: "examples/dialog/DialogExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/dialog/DialogNoCloseButton.vue",
        type: "registry:example",
      },
      {
        path: "examples/dialog/DialogScrollableContent.vue",
        type: "registry:example",
      },
      {
        path: "examples/dialog/DialogWithForm.vue",
        type: "registry:example",
      },
      {
        path: "examples/dialog/DialogWithStickyFooter.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "checkbox",
      "dialog",
      "field",
      "input-group",
      "kbd",
      "native-select",
      "select",
      "switch",
      "tabs",
      "textarea",
      "tooltip",
      "example",
      "input",
    ],
    dependencies: [],
  },
  {
    name: "drawer-example",
    title: "Drawer",
    type: "registry:example",
    files: [
      {
        path: "examples/drawer/DrawerExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/drawer/DrawerScrollableContent.vue",
        type: "registry:example",
      },
      {
        path: "examples/drawer/DrawerWithSides.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "drawer",
    ],
    dependencies: [],
  },
  {
    name: "dropdown-menu-example",
    title: "Dropdown Menu",
    type: "registry:example",
    files: [
      {
        path: "examples/dropdown-menu/DropdownMenuBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuComplex.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuInDialog.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithAvatar.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithCheckboxes.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithCheckboxesIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithDestructive.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithRadio.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithRadioIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithShortcuts.vue",
        type: "registry:example",
      },
      {
        path: "examples/dropdown-menu/DropdownMenuWithSubmenu.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "dropdown-menu",
      "dialog",
      "avatar",
    ],
    dependencies: [],
  },
  {
    name: "empty-example",
    title: "Empty",
    type: "registry:example",
    files: [
      {
        path: "examples/empty/EmptyBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyInCard.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyWithBorder.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyWithIcon.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyWithMutedBackground.vue",
        type: "registry:example",
      },
      {
        path: "examples/empty/EmptyWithMutedBackgroundAlt.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "empty",
      "input-group",
      "kbd",
    ],
    dependencies: [],
  },
  {
    name: "field-example",
    title: "Field",
    type: "registry:example",
    files: [
      {
        path: "examples/field/CheckboxFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/FieldExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/InputFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/InputOTPFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/NativeSelectFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/RadioFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/SelectFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/SliderFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/SwitchFields.vue",
        type: "registry:example",
      },
      {
        path: "examples/field/TextareaFields.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "checkbox",
      "field",
      "badge",
      "input",
      "input-otp",
      "native-select",
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
        path: "examples/form/FormBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/form/FormExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/form/FormWithCheckbox.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "form",
      "input",
      "checkbox",
    ],
    dependencies: [
      "vee-validate",
      "@vee-validate/zod",
      "zod@3.25.76",
    ],
  },
  {
    name: "hover-card-example",
    title: "Hover Card",
    type: "registry:example",
    files: [
      {
        path: "examples/hover-card/HoverCardExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/hover-card/HoverCardInDialog.vue",
        type: "registry:example",
      },
      {
        path: "examples/hover-card/HoverCardSides.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "dialog",
      "hover-card",
    ],
    dependencies: [],
  },
  {
    name: "input-example",
    title: "Input",
    type: "registry:example",
    files: [
      {
        path: "examples/input/InputBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputForm.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputInvalid.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputTypes.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputWithButton.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputWithDescription.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputWithLabel.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputWithNativeSelect.vue",
        type: "registry:example",
      },
      {
        path: "examples/input/InputWithSelect.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "input",
      "field",
      "example",
      "button",
      "select",
      "native-select",
    ],
    dependencies: [],
  },
  {
    name: "input-group-example",
    title: "Input Group",
    type: "registry:example",
    files: [
      {
        path: "examples/input-group/InputGroupBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithButton.vue",
        type: "registry:example",
      },
      {
        path: "examples/input-group/InputGroupWithTextarea.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "input-group",
      "button",
    ],
    dependencies: [],
  },
  {
    name: "input-otp-example",
    title: "Input Otp",
    type: "registry:example",
    files: [
      {
        path: "examples/input-otp/InputOTPExample.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "card",
      "field",
      "input-otp",
    ],
    dependencies: [],
  },
  {
    name: "item-example",
    title: "Item",
    type: "registry:example",
    files: [
      {
        path: "examples/item/ItemBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/item/ItemWithActions.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "item",
      "button",
    ],
    dependencies: [],
  },
  {
    name: "kbd-example",
    title: "Kbd",
    type: "registry:example",
    files: [
      {
        path: "examples/kbd/KbdBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/kbd/KbdExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/kbd/KbdWithGroup.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "kbd",
    ],
    dependencies: [],
  },
  {
    name: "label-example",
    title: "Label",
    type: "registry:example",
    files: [
      {
        path: "examples/label/LabelDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/label/LabelExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/label/LabelWithCheckbox.vue",
        type: "registry:example",
      },
      {
        path: "examples/label/LabelWithInput.vue",
        type: "registry:example",
      },
      {
        path: "examples/label/LabelWithTextarea.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "field",
      "input",
      "label",
      "checkbox",
      "textarea",
    ],
    dependencies: [],
  },
  {
    name: "menubar-example",
    title: "Menubar",
    type: "registry:example",
    files: [
      {
        path: "examples/menubar/MenubarBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/menubar/MenubarExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/menubar/MenubarWithCheckboxes.vue",
        type: "registry:example",
      },
      {
        path: "examples/menubar/MenubarWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/menubar/MenubarWithRadio.vue",
        type: "registry:example",
      },
      {
        path: "examples/menubar/MenubarWithSubmenu.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "menubar",
      "example",
    ],
    dependencies: [],
  },
  {
    name: "native-select-example",
    title: "Native Select",
    type: "registry:example",
    files: [
      {
        path: "examples/native-select/NativeSelectBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/native-select/NativeSelectExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/native-select/NativeSelectWithOptGroup.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "native-select",
    ],
    dependencies: [],
  },
  {
    name: "navigation-menu-example",
    title: "Navigation Menu",
    type: "registry:example",
    files: [
      {
        path: "examples/navigation-menu/NavigationMenuBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/navigation-menu/NavigationMenuExample.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "navigation-menu",
    ],
    dependencies: [],
  },
  {
    name: "number-field-example",
    title: "Number Field",
    type: "registry:example",
    files: [
      {
        path: "examples/number-field/NumberFieldBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/number-field/NumberFieldDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/number-field/NumberFieldExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/number-field/NumberFieldWithLabel.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "number-field",
      "label",
    ],
    dependencies: [],
  },
  {
    name: "pagination-example",
    title: "Pagination",
    type: "registry:example",
    files: [
      {
        path: "examples/pagination/PaginationBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/pagination/PaginationExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/pagination/PaginationSimple.vue",
        type: "registry:example",
      },
      {
        path: "examples/pagination/PaginationWithSelect.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "pagination",
      "example",
      "field",
      "select",
    ],
    dependencies: [],
  },
  {
    name: "pin-input-example",
    title: "Pin Input",
    type: "registry:example",
    files: [
      {
        path: "examples/pin-input/PinInputBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/pin-input/PinInputExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/pin-input/PinInputMasked.vue",
        type: "registry:example",
      },
      {
        path: "examples/pin-input/PinInputWithSeparator.vue",
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
        path: "examples/popover/PopoverAlignments.vue",
        type: "registry:example",
      },
      {
        path: "examples/popover/PopoverBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/popover/PopoverExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/popover/PopoverInDialog.vue",
        type: "registry:example",
      },
      {
        path: "examples/popover/PopoverWithForm.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "button",
      "popover",
      "example",
      "dialog",
      "field",
      "input",
    ],
    dependencies: [],
  },
  {
    name: "progress-example",
    title: "Progress",
    type: "registry:example",
    files: [
      {
        path: "examples/progress/FileUploadList.vue",
        type: "registry:example",
      },
      {
        path: "examples/progress/ProgressControlled.vue",
        type: "registry:example",
      },
      {
        path: "examples/progress/ProgressExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/progress/ProgressValues.vue",
        type: "registry:example",
      },
      {
        path: "examples/progress/ProgressWithLabel.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "item",
      "progress",
      "slider",
      "field",
    ],
    dependencies: [],
  },
  {
    name: "radio-group-example",
    title: "Radio Group",
    type: "registry:example",
    files: [
      {
        path: "examples/radio-group/RadioGroupBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/radio-group/RadioGroupDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/radio-group/RadioGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/radio-group/RadioGroupGrid.vue",
        type: "registry:example",
      },
      {
        path: "examples/radio-group/RadioGroupInvalid.vue",
        type: "registry:example",
      },
      {
        path: "examples/radio-group/RadioGroupWithDescriptions.vue",
        type: "registry:example",
      },
      {
        path: "examples/radio-group/RadioGroupWithFieldSet.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "field",
      "radio-group",
      "example",
    ],
    dependencies: [],
  },
  {
    name: "range-calendar-example",
    title: "Range Calendar",
    type: "registry:example",
    files: [
      {
        path: "examples/range-calendar/RangeCalendarBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/range-calendar/RangeCalendarExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/range-calendar/RangeCalendarMultipleMonths.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "range-calendar",
    ],
    dependencies: [
      "reka-ui",
    ],
  },
  {
    name: "resizable-example",
    title: "Resizable",
    type: "registry:example",
    files: [
      {
        path: "examples/resizable/ResizableExample.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
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
        path: "examples/scroll-area/ScrollAreaExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/scroll-area/ScrollAreaHorizontal.vue",
        type: "registry:example",
      },
      {
        path: "examples/scroll-area/ScrollAreaVertical.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
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
        path: "examples/select/SelectBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectInDialog.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectInline.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectInvalid.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectLargeList.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectPlan.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectPopper.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectSizes.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectWithButton.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectWithField.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectWithGroups.vue",
        type: "registry:example",
      },
      {
        path: "examples/select/SelectWithIcons.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "select",
      "example",
      "button",
      "dialog",
      "input",
      "native-select",
      "field",
      "item",
    ],
    dependencies: [],
  },
  {
    name: "separator-example",
    title: "Separator",
    type: "registry:example",
    files: [
      {
        path: "examples/separator/SeparatorExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/separator/SeparatorHorizontal.vue",
        type: "registry:example",
      },
      {
        path: "examples/separator/SeparatorInList.vue",
        type: "registry:example",
      },
      {
        path: "examples/separator/SeparatorVertical.vue",
        type: "registry:example",
      },
      {
        path: "examples/separator/SeparatorVerticalMenu.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
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
        path: "examples/sheet/SheetExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/sheet/SheetWithForm.vue",
        type: "registry:example",
      },
      {
        path: "examples/sheet/SheetWithSides.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "field",
      "input",
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
        path: "examples/sidebar/SidebarBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/sidebar/SidebarCollapsible.vue",
        type: "registry:example",
      },
      {
        path: "examples/sidebar/SidebarExample.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "sidebar",
    ],
    dependencies: [],
  },
  {
    name: "skeleton-example",
    title: "Skeleton",
    type: "registry:example",
    files: [
      {
        path: "examples/skeleton/SkeletonAvatar.vue",
        type: "registry:example",
      },
      {
        path: "examples/skeleton/SkeletonCard.vue",
        type: "registry:example",
      },
      {
        path: "examples/skeleton/SkeletonExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/skeleton/SkeletonForm.vue",
        type: "registry:example",
      },
      {
        path: "examples/skeleton/SkeletonTable.vue",
        type: "registry:example",
      },
      {
        path: "examples/skeleton/SkeletonText.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "skeleton",
      "card",
    ],
    dependencies: [],
  },
  {
    name: "slider-example",
    title: "Slider",
    type: "registry:example",
    files: [
      {
        path: "examples/slider/SliderBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/slider/SliderControlled.vue",
        type: "registry:example",
      },
      {
        path: "examples/slider/SliderDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/slider/SliderExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/slider/SliderMultiple.vue",
        type: "registry:example",
      },
      {
        path: "examples/slider/SliderRange.vue",
        type: "registry:example",
      },
      {
        path: "examples/slider/SliderVertical.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "slider",
      "label",
      "example",
    ],
    dependencies: [],
  },
  {
    name: "sonner-example",
    title: "Sonner",
    type: "registry:example",
    files: [
      {
        path: "examples/sonner/SonnerExample.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
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
        path: "examples/spinner/SpinnerBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerInBadges.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerInButtons.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerInEmpty.vue",
        type: "registry:example",
      },
      {
        path: "examples/spinner/SpinnerInInputGroup.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "spinner",
      "badge",
      "button",
      "empty",
      "field",
      "input-group",
    ],
    dependencies: [],
  },
  {
    name: "stepper-example",
    title: "Stepper",
    type: "registry:example",
    files: [
      {
        path: "examples/stepper/StepperBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/stepper/StepperExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/stepper/StepperVertical.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "stepper",
    ],
    dependencies: [],
  },
  {
    name: "switch-example",
    title: "Switch",
    type: "registry:example",
    files: [
      {
        path: "examples/switch/SwitchBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/switch/SwitchDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/switch/SwitchExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/switch/SwitchSizes.vue",
        type: "registry:example",
      },
      {
        path: "examples/switch/SwitchWithDescription.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "field",
      "switch",
      "label",
      "example",
    ],
    dependencies: [],
  },
  {
    name: "table-example",
    title: "Table",
    type: "registry:example",
    files: [
      {
        path: "examples/table/TableBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/table/TableExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/table/TableSimple.vue",
        type: "registry:example",
      },
      {
        path: "examples/table/TableWithActions.vue",
        type: "registry:example",
      },
      {
        path: "examples/table/TableWithBadges.vue",
        type: "registry:example",
      },
      {
        path: "examples/table/TableWithFooter.vue",
        type: "registry:example",
      },
      {
        path: "examples/table/TableWithInput.vue",
        type: "registry:example",
      },
      {
        path: "examples/table/TableWithSelect.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "table",
      "example",
      "button",
      "dropdown-menu",
      "input",
      "select",
    ],
    dependencies: [],
  },
  {
    name: "tabs-example",
    title: "Tabs",
    type: "registry:example",
    files: [
      {
        path: "examples/tabs/TabsBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsIconOnly.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsLine.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsLineDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsLineWithContent.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsMultiple.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsVariantsComparison.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsVertical.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsWithContent.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsWithDropdown.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/tabs/TabsWithInputAndButton.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "tabs",
      "example",
      "button",
      "dropdown-menu",
      "input",
    ],
    dependencies: [],
  },
  {
    name: "tags-input-example",
    title: "Tags Input",
    type: "registry:example",
    files: [
      {
        path: "examples/tags-input/TagsInputBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/tags-input/TagsInputExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/tags-input/TagsInputWithLabel.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "tags-input",
      "label",
    ],
    dependencies: [],
  },
  {
    name: "textarea-example",
    title: "Textarea",
    type: "registry:example",
    files: [
      {
        path: "examples/textarea/TextareaBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/textarea/TextareaDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/textarea/TextareaExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/textarea/TextareaInvalid.vue",
        type: "registry:example",
      },
      {
        path: "examples/textarea/TextareaWithDescription.vue",
        type: "registry:example",
      },
      {
        path: "examples/textarea/TextareaWithLabel.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "textarea",
      "field",
      "example",
    ],
    dependencies: [],
  },
  {
    name: "toggle-example",
    title: "Toggle",
    type: "registry:example",
    files: [
      {
        path: "examples/toggle/ToggleBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleOutline.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleSizes.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleWithButtonIcon.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleWithButtonIconText.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleWithButtonText.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle/ToggleWithIcon.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "toggle",
      "example",
      "button",
    ],
    dependencies: [],
  },
  {
    name: "toggle-group-example",
    title: "Toggle Group",
    type: "registry:example",
    files: [
      {
        path: "examples/toggle-group/ToggleGroupBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupDateRange.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupFilter.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupOutline.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupOutlineWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupSizes.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupSort.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupSpacing.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupVertical.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupVerticalOutline.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupVerticalOutlineWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupVerticalWithSpacing.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "examples/toggle-group/ToggleGroupWithInputAndSelect.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "toggle-group",
      "example",
      "input",
      "select",
    ],
    dependencies: [],
  },
  {
    name: "tooltip-example",
    title: "Tooltip",
    type: "registry:example",
    files: [
      {
        path: "examples/tooltip/TooltipBasic.vue",
        type: "registry:example",
      },
      {
        path: "examples/tooltip/TooltipDisabled.vue",
        type: "registry:example",
      },
      {
        path: "examples/tooltip/TooltipExample.vue",
        type: "registry:example",
      },
      {
        path: "examples/tooltip/TooltipFormatted.vue",
        type: "registry:example",
      },
      {
        path: "examples/tooltip/TooltipLongContent.vue",
        type: "registry:example",
      },
      {
        path: "examples/tooltip/TooltipOnLink.vue",
        type: "registry:example",
      },
      {
        path: "examples/tooltip/TooltipSides.vue",
        type: "registry:example",
      },
      {
        path: "examples/tooltip/TooltipWithIcon.vue",
        type: "registry:example",
      },
      {
        path: "examples/tooltip/TooltipWithKeyboard.vue",
        type: "registry:example",
      },
    ],
    registryDependencies: [
      "example",
      "button",
      "tooltip",
      "kbd",
    ],
    dependencies: [],
  },
]
