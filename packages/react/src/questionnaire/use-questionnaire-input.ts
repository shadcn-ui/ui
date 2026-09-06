import * as React from "react"

import { composeRefs } from "../use-render"
import { useQuestionnaireItemContext } from "./context"
import type { QuestionnaireInputProps, QuestionnaireInputState } from "./types"
import { getAnswerKeyShortcuts, hasInputValue } from "./utils"

type UseQuestionnaireInputParameters = Pick<
  QuestionnaireInputProps,
  "defaultValue" | "disabled" | "onChange" | "ref" | "type" | "value"
>

function useQuestionnaireInput({
  defaultValue,
  disabled: inputDisabled = false,
  onChange,
  ref,
  type = "text",
  value: controlledValue,
}: UseQuestionnaireInputParameters) {
  const {
    disabled: itemDisabled,
    invalid,
    name: itemName,
    registerAnswerControl,
    registerAnswerSelection,
    resetVersion,
    selectedAnswerIds,
    setAnswerDefault,
    setAnswerSelectionFromInteraction,
    syncControlledAnswerSelection,
  } = useQuestionnaireItemContext("Questionnaire.Input")
  const answerId = React.useId()
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const initialDefaultFilledRef = React.useRef(hasInputValue(defaultValue))
  const controlled = controlledValue !== undefined
  const defaultFilled = hasInputValue(defaultValue)
  const controlledFilled = hasInputValue(controlledValue)
  const [uncontrolledFilled, setUncontrolledFilled] =
    React.useState(defaultFilled)
  const disabled = itemDisabled || inputDisabled
  const filled = controlled ? controlledFilled : uncontrolledFilled
  const selected = selectedAnswerIds.includes(answerId)

  React.useLayoutEffect(
    () => registerAnswerSelection(answerId, initialDefaultFilledRef.current),
    [answerId, registerAnswerSelection]
  )
  React.useLayoutEffect(
    () => setAnswerDefault(answerId, defaultFilled),
    [defaultFilled, answerId, setAnswerDefault]
  )

  React.useLayoutEffect(() => {
    const input = inputRef.current

    if (!input) {
      return
    }

    return registerAnswerControl({
      disabled,
      element: input,
      id: answerId,
      type: "input",
    })
  }, [disabled, answerId, registerAnswerControl])

  React.useLayoutEffect(() => {
    if (controlled) {
      syncControlledAnswerSelection(answerId, controlledFilled)
      return
    }

    if (resetVersion > 0) {
      setUncontrolledFilled(defaultFilled)
    }
  }, [
    controlled,
    controlledFilled,
    controlledValue,
    defaultFilled,
    answerId,
    resetVersion,
    syncControlledAnswerSelection,
  ])

  React.useLayoutEffect(() => {
    const input = inputRef.current

    if (!input || !controlled) {
      return
    }

    input.defaultValue = String(controlledValue)
  }, [controlled, controlledValue])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event)

    if (event.defaultPrevented) {
      return
    }

    const nextFilled = event.target.value.trim().length > 0

    if (controlled) {
      return
    }

    setUncontrolledFilled(nextFilled)
    setAnswerSelectionFromInteraction(answerId, nextFilled)
  }

  const state: QuestionnaireInputState = {
    disabled,
    filled,
    invalid,
  }
  const setInputRef = React.useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element
      composeRefs(ref)?.(element)
    },
    [ref]
  )

  return {
    inputProps: {
      "aria-invalid": invalid || undefined,
      "aria-keyshortcuts": getAnswerKeyShortcuts(
        null,
        !disabled && filled && selected
      ),
      defaultValue: controlled ? undefined : defaultValue,
      disabled,
      form: selected ? undefined : "",
      id: answerId,
      name: selected ? itemName : undefined,
      onChange: handleChange,
      ref: setInputRef,
      type,
      value: controlled ? controlledValue : undefined,
    },
    state,
  }
}

export { useQuestionnaireInput }
