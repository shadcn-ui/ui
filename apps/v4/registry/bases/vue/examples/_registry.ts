import type { Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "accordion-example",
    title: "Accordion",
    type: "registry:example",
    files: [
      {
        path: "accordion/AccordionBasic.vue",
        type: "registry:example",
      },
      {
        path: "accordion/AccordionExample.vue",
        type: "registry:example",
      },
      {
        path: "accordion/AccordionInCard.vue",
        type: "registry:example",
      },
      {
        path: "accordion/AccordionMultiple.vue",
        type: "registry:example",
      },
      {
        path: "accordion/AccordionWithBorders.vue",
        type: "registry:example",
      },
      {
        path: "accordion/AccordionWithDisabled.vue",
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
        path: "alert/AlertBasic.vue",
        type: "registry:example",
      },
      {
        path: "alert/AlertDestructive.vue",
        type: "registry:example",
      },
      {
        path: "alert/AlertExample.vue",
        type: "registry:example",
      },
      {
        path: "alert/AlertWithActions.vue",
        type: "registry:example",
      },
      {
        path: "alert/AlertWithIcons.vue",
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
        path: "alert-dialog/AlertDialogBasic.vue",
        type: "registry:example",
      },
      {
        path: "alert-dialog/AlertDialogDestructive.vue",
        type: "registry:example",
      },
      {
        path: "alert-dialog/AlertDialogExample.vue",
        type: "registry:example",
      },
      {
        path: "alert-dialog/AlertDialogInDialog.vue",
        type: "registry:example",
      },
      {
        path: "alert-dialog/AlertDialogSmall.vue",
        type: "registry:example",
      },
      {
        path: "alert-dialog/AlertDialogSmallWithMedia.vue",
        type: "registry:example",
      },
      {
        path: "alert-dialog/AlertDialogWithMedia.vue",
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
        path: "aspect-ratio/AspectRatio16x9.vue",
        type: "registry:example",
      },
      {
        path: "aspect-ratio/AspectRatio1x1.vue",
        type: "registry:example",
      },
      {
        path: "aspect-ratio/AspectRatio21x9.vue",
        type: "registry:example",
      },
      {
        path: "aspect-ratio/AspectRatio9x16.vue",
        type: "registry:example",
      },
      {
        path: "aspect-ratio/AspectRatioExample.vue",
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
        path: "avatar/AvatarExample.vue",
        type: "registry:example",
      },
      {
        path: "avatar/AvatarGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "avatar/AvatarGroupWithCount.vue",
        type: "registry:example",
      },
      {
        path: "avatar/AvatarGroupWithIconCount.vue",
        type: "registry:example",
      },
      {
        path: "avatar/AvatarInEmpty.vue",
        type: "registry:example",
      },
      {
        path: "avatar/AvatarSizes.vue",
        type: "registry:example",
      },
      {
        path: "avatar/AvatarWithBadge.vue",
        type: "registry:example",
      },
      {
        path: "avatar/AvatarWithBadgeIcon.vue",
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
        path: "badge/BadgeAsLink.vue",
        type: "registry:example",
      },
      {
        path: "badge/BadgeCustomColors.vue",
        type: "registry:example",
      },
      {
        path: "badge/BadgeExample.vue",
        type: "registry:example",
      },
      {
        path: "badge/BadgeLongText.vue",
        type: "registry:example",
      },
      {
        path: "badge/BadgeVariants.vue",
        type: "registry:example",
      },
      {
        path: "badge/BadgeWithIconLeft.vue",
        type: "registry:example",
      },
      {
        path: "badge/BadgeWithIconRight.vue",
        type: "registry:example",
      },
      {
        path: "badge/BadgeWithSpinner.vue",
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
        path: "breadcrumb/BreadcrumbBasic.vue",
        type: "registry:example",
      },
      {
        path: "breadcrumb/BreadcrumbExample.vue",
        type: "registry:example",
      },
      {
        path: "breadcrumb/BreadcrumbWithDropdown.vue",
        type: "registry:example",
      },
      {
        path: "breadcrumb/BreadcrumbWithLink.vue",
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
        path: "button/ButtonExample.vue",
        type: "registry:example",
      },
      {
        path: "button/ButtonExamples.vue",
        type: "registry:example",
      },
      {
        path: "button/ButtonIconLeft.vue",
        type: "registry:example",
      },
      {
        path: "button/ButtonIconOnly.vue",
        type: "registry:example",
      },
      {
        path: "button/ButtonIconRight.vue",
        type: "registry:example",
      },
      {
        path: "button/ButtonInvalidStates.vue",
        type: "registry:example",
      },
      {
        path: "button/ButtonVariantsAndSizes.vue",
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
        path: "button-group/ButtonGroupBasic.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupNavigation.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupNested.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupPagination.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupPaginationSplit.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupTextAlignment.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupVertical.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupVerticalNested.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithDropdown.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithFields.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithInput.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithInputGroup.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithLike.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithSelect.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithSelectAndInput.vue",
        type: "registry:example",
      },
      {
        path: "button-group/ButtonGroupWithText.vue",
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
        path: "calendar/CalendarBookedDates.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarCustomDays.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarExample.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarMultiple.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarRange.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarRangeMultipleMonths.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarSingle.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarWeekNumbers.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarWithPresets.vue",
        type: "registry:example",
      },
      {
        path: "calendar/CalendarWithTime.vue",
        type: "registry:example",
      },
      {
        path: "calendar/DatePickerSimple.vue",
        type: "registry:example",
      },
      {
        path: "calendar/DatePickerWithDropdowns.vue",
        type: "registry:example",
      },
      {
        path: "calendar/DatePickerWithRange.vue",
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
        path: "card/CardDefault.vue",
        type: "registry:example",
      },
      {
        path: "card/CardExample.vue",
        type: "registry:example",
      },
      {
        path: "card/CardFooterWithBorder.vue",
        type: "registry:example",
      },
      {
        path: "card/CardFooterWithBorderSmall.vue",
        type: "registry:example",
      },
      {
        path: "card/CardHeaderWithBorder.vue",
        type: "registry:example",
      },
      {
        path: "card/CardHeaderWithBorderSmall.vue",
        type: "registry:example",
      },
      {
        path: "card/CardLogin.vue",
        type: "registry:example",
      },
      {
        path: "card/CardMeetingNotes.vue",
        type: "registry:example",
      },
      {
        path: "card/CardSmall.vue",
        type: "registry:example",
      },
      {
        path: "card/CardWithImage.vue",
        type: "registry:example",
      },
      {
        path: "card/CardWithImageSmall.vue",
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
        path: "carousel/CarouselBasic.vue",
        type: "registry:example",
      },
      {
        path: "carousel/CarouselExample.vue",
        type: "registry:example",
      },
      {
        path: "carousel/CarouselMultiple.vue",
        type: "registry:example",
      },
      {
        path: "carousel/CarouselWithGap.vue",
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
        path: "chart/ChartAreaExample.vue",
        type: "registry:example",
      },
      {
        path: "chart/ChartBarExample.vue",
        type: "registry:example",
      },
      {
        path: "chart/ChartExample.vue",
        type: "registry:example",
      },
      {
        path: "chart/ChartLineExample.vue",
        type: "registry:example",
      },
      {
        path: "chart/ChartRadialExample.vue",
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
        path: "checkbox/CheckboxBasic.vue",
        type: "registry:example",
      },
      {
        path: "checkbox/CheckboxDisabled.vue",
        type: "registry:example",
      },
      {
        path: "checkbox/CheckboxExample.vue",
        type: "registry:example",
      },
      {
        path: "checkbox/CheckboxGroup.vue",
        type: "registry:example",
      },
      {
        path: "checkbox/CheckboxInTable.vue",
        type: "registry:example",
      },
      {
        path: "checkbox/CheckboxInvalid.vue",
        type: "registry:example",
      },
      {
        path: "checkbox/CheckboxWithDescription.vue",
        type: "registry:example",
      },
      {
        path: "checkbox/CheckboxWithTitle.vue",
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
        path: "collapsible/CollapsibleExample.vue",
        type: "registry:example",
      },
      {
        path: "collapsible/CollapsibleFileTree.vue",
        type: "registry:example",
      },
      {
        path: "collapsible/CollapsibleSettings.vue",
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
        path: "combobox/ComboboxAutoHighlight.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxBasic.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxDisabled.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxExample.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxInDialog.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxInPopup.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxInputAddon.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxInvalid.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxLargeList.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxWithClear.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxWithForm.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxWithGroups.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxWithGroupsAndSeparator.vue",
        type: "registry:example",
      },
      {
        path: "combobox/ComboboxWithOtherInputs.vue",
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
        path: "command/CommandBasic.vue",
        type: "registry:example",
      },
      {
        path: "command/CommandExample.vue",
        type: "registry:example",
      },
      {
        path: "command/CommandManyItems.vue",
        type: "registry:example",
      },
      {
        path: "command/CommandWithGroups.vue",
        type: "registry:example",
      },
      {
        path: "command/CommandWithShortcuts.vue",
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
        path: "context-menu/ContextMenuBasic.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuExample.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuInDialog.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuWithCheckboxes.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuWithDestructive.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuWithGroups.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuWithRadio.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuWithShortcuts.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuWithSides.vue",
        type: "registry:example",
      },
      {
        path: "context-menu/ContextMenuWithSubmenu.vue",
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
        path: "dialog/DialogChatSettings.vue",
        type: "registry:example",
      },
      {
        path: "dialog/DialogExample.vue",
        type: "registry:example",
      },
      {
        path: "dialog/DialogNoCloseButton.vue",
        type: "registry:example",
      },
      {
        path: "dialog/DialogScrollableContent.vue",
        type: "registry:example",
      },
      {
        path: "dialog/DialogWithForm.vue",
        type: "registry:example",
      },
      {
        path: "dialog/DialogWithStickyFooter.vue",
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
        path: "drawer/DrawerExample.vue",
        type: "registry:example",
      },
      {
        path: "drawer/DrawerScrollableContent.vue",
        type: "registry:example",
      },
      {
        path: "drawer/DrawerWithSides.vue",
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
        path: "dropdown-menu/DropdownMenuBasic.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuComplex.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuExample.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuInDialog.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithAvatar.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithCheckboxes.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithCheckboxesIcons.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithDestructive.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithRadio.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithRadioIcons.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithShortcuts.vue",
        type: "registry:example",
      },
      {
        path: "dropdown-menu/DropdownMenuWithSubmenu.vue",
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
        path: "empty/EmptyBasic.vue",
        type: "registry:example",
      },
      {
        path: "empty/EmptyExample.vue",
        type: "registry:example",
      },
      {
        path: "empty/EmptyInCard.vue",
        type: "registry:example",
      },
      {
        path: "empty/EmptyWithBorder.vue",
        type: "registry:example",
      },
      {
        path: "empty/EmptyWithIcon.vue",
        type: "registry:example",
      },
      {
        path: "empty/EmptyWithMutedBackground.vue",
        type: "registry:example",
      },
      {
        path: "empty/EmptyWithMutedBackgroundAlt.vue",
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
        path: "field/CheckboxFields.vue",
        type: "registry:example",
      },
      {
        path: "field/FieldExample.vue",
        type: "registry:example",
      },
      {
        path: "field/InputFields.vue",
        type: "registry:example",
      },
      {
        path: "field/InputOTPFields.vue",
        type: "registry:example",
      },
      {
        path: "field/NativeSelectFields.vue",
        type: "registry:example",
      },
      {
        path: "field/RadioFields.vue",
        type: "registry:example",
      },
      {
        path: "field/SelectFields.vue",
        type: "registry:example",
      },
      {
        path: "field/SliderFields.vue",
        type: "registry:example",
      },
      {
        path: "field/SwitchFields.vue",
        type: "registry:example",
      },
      {
        path: "field/TextareaFields.vue",
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
        path: "form/FormBasic.vue",
        type: "registry:example",
      },
      {
        path: "form/FormExample.vue",
        type: "registry:example",
      },
      {
        path: "form/FormWithCheckbox.vue",
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
        path: "hover-card/HoverCardExample.vue",
        type: "registry:example",
      },
      {
        path: "hover-card/HoverCardInDialog.vue",
        type: "registry:example",
      },
      {
        path: "hover-card/HoverCardSides.vue",
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
        path: "input/InputBasic.vue",
        type: "registry:example",
      },
      {
        path: "input/InputDisabled.vue",
        type: "registry:example",
      },
      {
        path: "input/InputExample.vue",
        type: "registry:example",
      },
      {
        path: "input/InputForm.vue",
        type: "registry:example",
      },
      {
        path: "input/InputInvalid.vue",
        type: "registry:example",
      },
      {
        path: "input/InputTypes.vue",
        type: "registry:example",
      },
      {
        path: "input/InputWithButton.vue",
        type: "registry:example",
      },
      {
        path: "input/InputWithDescription.vue",
        type: "registry:example",
      },
      {
        path: "input/InputWithLabel.vue",
        type: "registry:example",
      },
      {
        path: "input/InputWithNativeSelect.vue",
        type: "registry:example",
      },
      {
        path: "input/InputWithSelect.vue",
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
        path: "input-group/InputGroupBasic.vue",
        type: "registry:example",
      },
      {
        path: "input-group/InputGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "input-group/InputGroupWithButton.vue",
        type: "registry:example",
      },
      {
        path: "input-group/InputGroupWithTextarea.vue",
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
        path: "input-otp/InputOTPExample.vue",
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
        path: "item/ItemBasic.vue",
        type: "registry:example",
      },
      {
        path: "item/ItemExample.vue",
        type: "registry:example",
      },
      {
        path: "item/ItemWithActions.vue",
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
        path: "kbd/KbdBasic.vue",
        type: "registry:example",
      },
      {
        path: "kbd/KbdExample.vue",
        type: "registry:example",
      },
      {
        path: "kbd/KbdWithGroup.vue",
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
        path: "label/LabelDisabled.vue",
        type: "registry:example",
      },
      {
        path: "label/LabelExample.vue",
        type: "registry:example",
      },
      {
        path: "label/LabelWithCheckbox.vue",
        type: "registry:example",
      },
      {
        path: "label/LabelWithInput.vue",
        type: "registry:example",
      },
      {
        path: "label/LabelWithTextarea.vue",
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
        path: "menubar/MenubarBasic.vue",
        type: "registry:example",
      },
      {
        path: "menubar/MenubarExample.vue",
        type: "registry:example",
      },
      {
        path: "menubar/MenubarWithCheckboxes.vue",
        type: "registry:example",
      },
      {
        path: "menubar/MenubarWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "menubar/MenubarWithRadio.vue",
        type: "registry:example",
      },
      {
        path: "menubar/MenubarWithSubmenu.vue",
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
        path: "native-select/NativeSelectBasic.vue",
        type: "registry:example",
      },
      {
        path: "native-select/NativeSelectExample.vue",
        type: "registry:example",
      },
      {
        path: "native-select/NativeSelectWithOptGroup.vue",
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
        path: "navigation-menu/NavigationMenuBasic.vue",
        type: "registry:example",
      },
      {
        path: "navigation-menu/NavigationMenuExample.vue",
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
        path: "number-field/NumberFieldBasic.vue",
        type: "registry:example",
      },
      {
        path: "number-field/NumberFieldDisabled.vue",
        type: "registry:example",
      },
      {
        path: "number-field/NumberFieldExample.vue",
        type: "registry:example",
      },
      {
        path: "number-field/NumberFieldWithLabel.vue",
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
        path: "pagination/PaginationBasic.vue",
        type: "registry:example",
      },
      {
        path: "pagination/PaginationExample.vue",
        type: "registry:example",
      },
      {
        path: "pagination/PaginationSimple.vue",
        type: "registry:example",
      },
      {
        path: "pagination/PaginationWithSelect.vue",
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
        path: "pin-input/PinInputBasic.vue",
        type: "registry:example",
      },
      {
        path: "pin-input/PinInputExample.vue",
        type: "registry:example",
      },
      {
        path: "pin-input/PinInputMasked.vue",
        type: "registry:example",
      },
      {
        path: "pin-input/PinInputWithSeparator.vue",
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
        path: "popover/PopoverAlignments.vue",
        type: "registry:example",
      },
      {
        path: "popover/PopoverBasic.vue",
        type: "registry:example",
      },
      {
        path: "popover/PopoverExample.vue",
        type: "registry:example",
      },
      {
        path: "popover/PopoverInDialog.vue",
        type: "registry:example",
      },
      {
        path: "popover/PopoverWithForm.vue",
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
        path: "progress/FileUploadList.vue",
        type: "registry:example",
      },
      {
        path: "progress/ProgressControlled.vue",
        type: "registry:example",
      },
      {
        path: "progress/ProgressExample.vue",
        type: "registry:example",
      },
      {
        path: "progress/ProgressValues.vue",
        type: "registry:example",
      },
      {
        path: "progress/ProgressWithLabel.vue",
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
        path: "radio-group/RadioGroupBasic.vue",
        type: "registry:example",
      },
      {
        path: "radio-group/RadioGroupDisabled.vue",
        type: "registry:example",
      },
      {
        path: "radio-group/RadioGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "radio-group/RadioGroupGrid.vue",
        type: "registry:example",
      },
      {
        path: "radio-group/RadioGroupInvalid.vue",
        type: "registry:example",
      },
      {
        path: "radio-group/RadioGroupWithDescriptions.vue",
        type: "registry:example",
      },
      {
        path: "radio-group/RadioGroupWithFieldSet.vue",
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
        path: "range-calendar/RangeCalendarBasic.vue",
        type: "registry:example",
      },
      {
        path: "range-calendar/RangeCalendarExample.vue",
        type: "registry:example",
      },
      {
        path: "range-calendar/RangeCalendarMultipleMonths.vue",
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
        path: "resizable/ResizableExample.vue",
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
        path: "scroll-area/ScrollAreaExample.vue",
        type: "registry:example",
      },
      {
        path: "scroll-area/ScrollAreaHorizontal.vue",
        type: "registry:example",
      },
      {
        path: "scroll-area/ScrollAreaVertical.vue",
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
        path: "select/SelectBasic.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectDisabled.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectExample.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectInDialog.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectInline.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectInvalid.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectLargeList.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectPlan.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectPopper.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectSizes.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectWithButton.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectWithField.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectWithGroups.vue",
        type: "registry:example",
      },
      {
        path: "select/SelectWithIcons.vue",
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
        path: "separator/SeparatorExample.vue",
        type: "registry:example",
      },
      {
        path: "separator/SeparatorHorizontal.vue",
        type: "registry:example",
      },
      {
        path: "separator/SeparatorInList.vue",
        type: "registry:example",
      },
      {
        path: "separator/SeparatorVertical.vue",
        type: "registry:example",
      },
      {
        path: "separator/SeparatorVerticalMenu.vue",
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
        path: "sheet/SheetExample.vue",
        type: "registry:example",
      },
      {
        path: "sheet/SheetWithForm.vue",
        type: "registry:example",
      },
      {
        path: "sheet/SheetWithSides.vue",
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
        path: "sidebar/SidebarBasic.vue",
        type: "registry:example",
      },
      {
        path: "sidebar/SidebarCollapsible.vue",
        type: "registry:example",
      },
      {
        path: "sidebar/SidebarExample.vue",
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
        path: "skeleton/SkeletonAvatar.vue",
        type: "registry:example",
      },
      {
        path: "skeleton/SkeletonCard.vue",
        type: "registry:example",
      },
      {
        path: "skeleton/SkeletonExample.vue",
        type: "registry:example",
      },
      {
        path: "skeleton/SkeletonForm.vue",
        type: "registry:example",
      },
      {
        path: "skeleton/SkeletonTable.vue",
        type: "registry:example",
      },
      {
        path: "skeleton/SkeletonText.vue",
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
        path: "slider/SliderBasic.vue",
        type: "registry:example",
      },
      {
        path: "slider/SliderControlled.vue",
        type: "registry:example",
      },
      {
        path: "slider/SliderDisabled.vue",
        type: "registry:example",
      },
      {
        path: "slider/SliderExample.vue",
        type: "registry:example",
      },
      {
        path: "slider/SliderMultiple.vue",
        type: "registry:example",
      },
      {
        path: "slider/SliderRange.vue",
        type: "registry:example",
      },
      {
        path: "slider/SliderVertical.vue",
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
        path: "sonner/SonnerExample.vue",
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
        path: "spinner/SpinnerBasic.vue",
        type: "registry:example",
      },
      {
        path: "spinner/SpinnerExample.vue",
        type: "registry:example",
      },
      {
        path: "spinner/SpinnerInBadges.vue",
        type: "registry:example",
      },
      {
        path: "spinner/SpinnerInButtons.vue",
        type: "registry:example",
      },
      {
        path: "spinner/SpinnerInEmpty.vue",
        type: "registry:example",
      },
      {
        path: "spinner/SpinnerInInputGroup.vue",
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
        path: "stepper/StepperBasic.vue",
        type: "registry:example",
      },
      {
        path: "stepper/StepperExample.vue",
        type: "registry:example",
      },
      {
        path: "stepper/StepperVertical.vue",
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
        path: "switch/SwitchBasic.vue",
        type: "registry:example",
      },
      {
        path: "switch/SwitchDisabled.vue",
        type: "registry:example",
      },
      {
        path: "switch/SwitchExample.vue",
        type: "registry:example",
      },
      {
        path: "switch/SwitchSizes.vue",
        type: "registry:example",
      },
      {
        path: "switch/SwitchWithDescription.vue",
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
        path: "table/TableBasic.vue",
        type: "registry:example",
      },
      {
        path: "table/TableExample.vue",
        type: "registry:example",
      },
      {
        path: "table/TableSimple.vue",
        type: "registry:example",
      },
      {
        path: "table/TableWithActions.vue",
        type: "registry:example",
      },
      {
        path: "table/TableWithBadges.vue",
        type: "registry:example",
      },
      {
        path: "table/TableWithFooter.vue",
        type: "registry:example",
      },
      {
        path: "table/TableWithInput.vue",
        type: "registry:example",
      },
      {
        path: "table/TableWithSelect.vue",
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
        path: "tabs/TabsBasic.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsDisabled.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsExample.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsIconOnly.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsLine.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsLineDisabled.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsLineWithContent.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsMultiple.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsVariantsComparison.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsVertical.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsWithContent.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsWithDropdown.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "tabs/TabsWithInputAndButton.vue",
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
        path: "tags-input/TagsInputBasic.vue",
        type: "registry:example",
      },
      {
        path: "tags-input/TagsInputExample.vue",
        type: "registry:example",
      },
      {
        path: "tags-input/TagsInputWithLabel.vue",
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
        path: "textarea/TextareaBasic.vue",
        type: "registry:example",
      },
      {
        path: "textarea/TextareaDisabled.vue",
        type: "registry:example",
      },
      {
        path: "textarea/TextareaExample.vue",
        type: "registry:example",
      },
      {
        path: "textarea/TextareaInvalid.vue",
        type: "registry:example",
      },
      {
        path: "textarea/TextareaWithDescription.vue",
        type: "registry:example",
      },
      {
        path: "textarea/TextareaWithLabel.vue",
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
        path: "toggle/ToggleBasic.vue",
        type: "registry:example",
      },
      {
        path: "toggle/ToggleDisabled.vue",
        type: "registry:example",
      },
      {
        path: "toggle/ToggleExample.vue",
        type: "registry:example",
      },
      {
        path: "toggle/ToggleOutline.vue",
        type: "registry:example",
      },
      {
        path: "toggle/ToggleSizes.vue",
        type: "registry:example",
      },
      {
        path: "toggle/ToggleWithButtonIcon.vue",
        type: "registry:example",
      },
      {
        path: "toggle/ToggleWithButtonIconText.vue",
        type: "registry:example",
      },
      {
        path: "toggle/ToggleWithButtonText.vue",
        type: "registry:example",
      },
      {
        path: "toggle/ToggleWithIcon.vue",
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
        path: "toggle-group/ToggleGroupBasic.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupDateRange.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupExample.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupFilter.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupOutline.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupOutlineWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupSizes.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupSort.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupSpacing.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupVertical.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupVerticalOutline.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupVerticalOutlineWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupVerticalWithSpacing.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupWithIcons.vue",
        type: "registry:example",
      },
      {
        path: "toggle-group/ToggleGroupWithInputAndSelect.vue",
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
        path: "tooltip/TooltipBasic.vue",
        type: "registry:example",
      },
      {
        path: "tooltip/TooltipDisabled.vue",
        type: "registry:example",
      },
      {
        path: "tooltip/TooltipExample.vue",
        type: "registry:example",
      },
      {
        path: "tooltip/TooltipFormatted.vue",
        type: "registry:example",
      },
      {
        path: "tooltip/TooltipLongContent.vue",
        type: "registry:example",
      },
      {
        path: "tooltip/TooltipOnLink.vue",
        type: "registry:example",
      },
      {
        path: "tooltip/TooltipSides.vue",
        type: "registry:example",
      },
      {
        path: "tooltip/TooltipWithIcon.vue",
        type: "registry:example",
      },
      {
        path: "tooltip/TooltipWithKeyboard.vue",
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
