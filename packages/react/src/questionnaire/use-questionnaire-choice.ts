import * as React from "react"

import { useQuestionnaireItemContext } from "./context"
import type {
  QuestionnaireChoiceProps,
  QuestionnaireChoiceState,
} from "./types"
import { getAnswerKeyShortcuts } from "./utils"

type UseQuestionnaireChoiceParameters = Pick<
  QuestionnaireChoiceProps,
  "checked" | "defaultChecked" | "disabled" | "onChange" | "value"
>

function useQuestionnaireChoice({
  checked: controlledChecked,
  defaultChecked = false,
  disabled: choiceDisabled = false,
  onChange,
  value,
}: UseQuestionnaireChoiceParameters) {
  const {
    disabled: itemDisabled,
    hasInputAnswer,
    invalid,
    multiple,
    name: itemName,
    registerAnswerControl,
    registerAnswerSelection,
    required,
    resetVersion,
    selectedAnswerIds,
    setAnswerDefault,
    setAnswerSelectionFromInteraction,
    shortcutByAnswerId,
    shortcutByChoiceValue,
    status,
    syncControlledAnswerSelection,
  } = useQuestionnaireItemContext("Questionnaire.Choice")
  const answerId = React.useId()
  const [inputElement, setInputElement] =
    React.useState<HTMLInputElement | null>(null)
  const initialDefaultCheckedRef = React.useRef(defaultChecked)
  const controlled = controlledChecked !== undefined
  const disabled = itemDisabled || choiceDisabled
  const selected = selectedAnswerIds.includes(answerId)
  const checked = controlled
    ? status === "skipped"
      ? false
      : controlledChecked
    : selected
  const type = multiple ? "checkbox" : "radio"
  const shortcut =
    shortcutByChoiceValue?.get(value) ??
    shortcutByAnswerId.get(answerId) ??
    null

  React.useLayoutEffect(
    () => registerAnswerSelection(answerId, initialDefaultCheckedRef.current),
    [answerId, registerAnswerSelection]
  )
  React.useLayoutEffect(
    () => setAnswerDefault(answerId, defaultChecked),
    [answerId, defaultChecked, setAnswerDefault]
  )

  React.useLayoutEffect(() => {
    if (!inputElement) {
      return
    }

    return registerAnswerControl({
      disabled,
      element: inputElement,
      id: answerId,
      ownDisabled: choiceDisabled,
      type: "choice",
      value,
    })
  }, [
    answerId,
    choiceDisabled,
    disabled,
    inputElement,
    registerAnswerControl,
    value,
  ])

  React.useLayoutEffect(() => {
    if (controlled) {
      syncControlledAnswerSelection(answerId, controlledChecked)
    }
  }, [
    answerId,
    controlled,
    controlledChecked,
    resetVersion,
    syncControlledAnswerSelection,
  ])

  React.useLayoutEffect(() => {
    if (!inputElement) {
      return
    }

    // Keep the native reset target aligned with Questionnaire's owned default,
    // including controlled choices whose checked prop remains authoritative.
    inputElement.defaultChecked = controlled
      ? controlledChecked
      : defaultChecked

    if (resetVersion > 0) {
      inputElement.checked = checked
    }
  }, [
    checked,
    controlled,
    controlledChecked,
    defaultChecked,
    inputElement,
    resetVersion,
  ])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event)

    if (event.defaultPrevented) {
      return
    }

    if (!controlled) {
      setAnswerSelectionFromInteraction(answerId, event.target.checked)
      return
    }

    if (status === "skipped" && controlledChecked === event.target.checked) {
      setAnswerSelectionFromInteraction(answerId, controlledChecked)
    }
  }

  const state: QuestionnaireChoiceState = {
    checked,
    disabled,
    invalid,
    shortcut,
    type,
  }

  return {
    inputProps: {
      ref: setInputElement,
      "aria-invalid": invalid || undefined,
      "aria-keyshortcuts": getAnswerKeyShortcuts(
        shortcut,
        !disabled && checked
      ),
      checked,
      disabled,
      id: answerId,
      name: status === "skipped" ? undefined : itemName,
      onChange: handleChange,
      required: required && !multiple && !hasInputAnswer,
      type,
      value,
    },
    state,
  }
}

export { useQuestionnaireChoice }
