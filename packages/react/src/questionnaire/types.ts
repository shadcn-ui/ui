import * as React from "react"

import type { UseRenderComponentProps } from "../use-render"

type QuestionnaireItemStatus = "unanswered" | "answered" | "skipped"
type QuestionnaireShortcutMode = "letters" | "numbers"

type QuestionnaireChoiceDefinition = {
  disabled?: boolean
  value: string
}

type QuestionnaireItemDefinition = {
  choices?: readonly QuestionnaireChoiceDefinition[]
  disabled?: boolean
  name: string
  required?: boolean
}

type QuestionnaireRootState = {
  current: number
  first: boolean
  last: boolean
  total: number
}

type QuestionnaireRootProps = Omit<
  React.ComponentPropsWithRef<"form">,
  "defaultValue" | "value"
> & {
  defaultItem?: string
  item?: string
  items?: readonly QuestionnaireItemDefinition[]
  onItemChange?: (item: string) => void
  shortcuts?: QuestionnaireShortcutMode
}

type QuestionnaireProgressState = QuestionnaireRootState

type QuestionnaireProgressProps = UseRenderComponentProps<
  "div",
  QuestionnaireProgressState
>

type QuestionnaireItemState = {
  active: boolean
  disabled: boolean
  invalid: boolean
  multiple: boolean
  required: boolean
  status: QuestionnaireItemStatus
}

type QuestionnaireItemProps = Omit<
  React.ComponentPropsWithRef<"fieldset">,
  "name" | "value"
> & {
  invalid?: boolean
  name: string
  multiple?: boolean
  onStatusChange?: (status: QuestionnaireItemStatus) => void
  required?: boolean
}

type QuestionnaireTitleProps = UseRenderComponentProps<"legend">
type QuestionnaireDescriptionProps = UseRenderComponentProps<"p">
type QuestionnaireChoicesState = {
  shortcuts: QuestionnaireShortcutMode | null
}

type QuestionnaireChoicesProps = UseRenderComponentProps<
  "div",
  QuestionnaireChoicesState
>
type QuestionnaireErrorProps = UseRenderComponentProps<
  "p",
  Pick<QuestionnaireItemState, "invalid">
>

type QuestionnaireChoiceState = {
  checked: boolean
  disabled: boolean
  invalid: boolean
  shortcut: string | null
  type: "checkbox" | "radio"
}

type QuestionnaireChoiceContextValue = {
  inputProps: React.ComponentPropsWithRef<"input">
  state: QuestionnaireChoiceState
}

type QuestionnaireChoiceProps = Omit<
  UseRenderComponentProps<"label", QuestionnaireChoiceState>,
  "onChange"
> & {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

type QuestionnaireChoiceInputProps = Omit<
  UseRenderComponentProps<"input", QuestionnaireChoiceState>,
  | "checked"
  | "defaultChecked"
  | "disabled"
  | "name"
  | "onChange"
  | "required"
  | "type"
  | "value"
>

type QuestionnaireChoiceLabelProps = UseRenderComponentProps<"span">

type QuestionnaireChoiceShortcutState = Pick<
  QuestionnaireChoiceState,
  "shortcut"
>

type QuestionnaireChoiceShortcutProps = UseRenderComponentProps<
  "span",
  QuestionnaireChoiceShortcutState
>

type QuestionnaireInputState = {
  disabled: boolean
  filled: boolean
  invalid: boolean
}

type QuestionnaireInputType =
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"

type QuestionnaireInputProps = Omit<
  UseRenderComponentProps<"input", QuestionnaireInputState>,
  "form" | "name" | "type"
> & {
  type?: QuestionnaireInputType
}

type QuestionnaireNavigationState = {
  disabled: boolean
  shortcut: "Enter" | null
  status: QuestionnaireItemStatus | null
  visible: boolean
}

type QuestionnairePreviousProps = UseRenderComponentProps<
  "button",
  QuestionnaireNavigationState
>

type QuestionnaireSkipProps = UseRenderComponentProps<
  "button",
  QuestionnaireNavigationState
>

type QuestionnaireNextProps = UseRenderComponentProps<
  "button",
  QuestionnaireNavigationState
>

type QuestionnaireSubmitProps = UseRenderComponentProps<
  "button",
  QuestionnaireNavigationState
>

type AnswerControlRegistration = {
  disabled: boolean
  element: HTMLInputElement
  id: string
} & (
  | {
      ownDisabled: boolean
      type: "choice"
      value: string
    }
  | {
      type: "input"
    }
)

type ChoiceRegistration = {
  disabled: boolean
  value: string
}

type ItemRegistration = {
  choices: readonly ChoiceRegistration[]
  disabled: boolean
  element: HTMLFieldSetElement
  focus: () => void
  focusInvalid: () => void
  getAnswerByElement: (element: Element) => AnswerControlRegistration | null
  getAnswerByShortcut: (shortcut: string) => AnswerControlRegistration | null
  moveAnswerFocus: (element: Element, direction: "next" | "previous") => boolean
  name: string
  required: boolean
  reset: () => void
  skip: () => void
  status: QuestionnaireItemStatus
  validate: () => boolean
}

type PendingFocus = {
  name: string
  target: "invalid" | "item"
}

type QuestionnaireContextValue = QuestionnaireRootState & {
  activeItem: ItemRegistration | null
  activeItemName: string | null
  activeItemRequired: boolean | null
  activeItemStatus: QuestionnaireItemStatus | null
  domVersion: number
  goNext: () => void
  goPrevious: () => void
  nativeValidation: boolean
  itemDefinitionByName: ReadonlyMap<string, QuestionnaireItemDefinition> | null
  registerItem: (registration: ItemRegistration) => () => void
  shortcuts: QuestionnaireShortcutMode | null
  skipCurrent: () => void
}

type QuestionnaireItemContextValue = {
  active: boolean
  disabled: boolean
  hasInputAnswer: boolean
  invalid: boolean
  multiple: boolean
  name: string
  registerAnswerControl: (registration: AnswerControlRegistration) => () => void
  registerAnswerSelection: (
    answerId: string,
    defaultSelected: boolean
  ) => () => void
  registerDescription: (descriptionId: string) => () => void
  registerError: (errorId: string) => () => void
  required: boolean
  resetVersion: number
  selectedAnswerIds: string[]
  setAnswerDefault: (answerId: string, defaultSelected: boolean) => void
  setAnswerSelectionFromInteraction: (
    answerId: string,
    selected: boolean
  ) => void
  shortcutByAnswerId: ReadonlyMap<string, string>
  shortcutByChoiceValue: ReadonlyMap<string, string> | null
  shortcuts: QuestionnaireShortcutMode | null
  status: QuestionnaireItemStatus
  syncControlledAnswerSelection: (answerId: string, selected: boolean) => void
}

export type {
  AnswerControlRegistration,
  ChoiceRegistration,
  ItemRegistration,
  PendingFocus,
  QuestionnaireChoiceContextValue,
  QuestionnaireChoiceDefinition,
  QuestionnaireChoiceInputProps,
  QuestionnaireChoiceLabelProps,
  QuestionnaireChoiceProps,
  QuestionnaireChoiceShortcutProps,
  QuestionnaireChoiceShortcutState,
  QuestionnaireChoiceState,
  QuestionnaireChoicesProps,
  QuestionnaireChoicesState,
  QuestionnaireContextValue,
  QuestionnaireDescriptionProps,
  QuestionnaireErrorProps,
  QuestionnaireInputProps,
  QuestionnaireInputState,
  QuestionnaireInputType,
  QuestionnaireItemContextValue,
  QuestionnaireItemDefinition,
  QuestionnaireItemProps,
  QuestionnaireItemState,
  QuestionnaireItemStatus,
  QuestionnaireNavigationState,
  QuestionnaireNextProps,
  QuestionnairePreviousProps,
  QuestionnaireProgressProps,
  QuestionnaireProgressState,
  QuestionnaireRootProps,
  QuestionnaireRootState,
  QuestionnaireShortcutMode,
  QuestionnaireSkipProps,
  QuestionnaireSubmitProps,
  QuestionnaireTitleProps,
}
