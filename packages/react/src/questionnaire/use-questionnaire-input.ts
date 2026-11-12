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
    maxReached,
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
  const disabledRef = React.useRef(disabled)
  disabledRef.current = disabled
  const filled = controlled ? controlledFilled : uncontrolledFilled
  const selected = selectedAnswerIds.includes(answerId)
  const controlledOverMax =
    controlled && controlledFilled && maxReached && !selected
  const warnedControlledOverMaxRef = React.useRef(false)

  React.useEffect(() => {
    if (!controlledOverMax) {
      warnedControlledOverMaxRef.current = false
      return
    }

    if (
      process.env.NODE_ENV !== "production" &&
      !warnedControlledOverMaxRef.current
    ) {
      console.warn(
        "[Questionnaire] Questionnaire.Input: controlled value is filled but blocked because the item is at max; keep controlled values within the item's max."
      )
      warnedControlledOverMaxRef.current = true
    }
  }, [controlledOverMax])

  React.useLayoutEffect(
    () =>
      registerAnswerSelection(
        answerId,
        initialDefaultFilledRef.current,
        disabledRef.current
      ),
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

  const previousControlledValueRef = React.useRef(controlledValue)

  React.useLayoutEffect(() => {
    if (controlled) {
      const valueChanged =
        previousControlledValueRef.current !== controlledValue
      previousControlledValueRef.current = controlledValue

      if (status === "skipped" && !valueChanged) {
        return
      }

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
    status,
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
    if (maxReached && !selected && event.target.value.trim().length > 0) {
      return
    }

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
      "aria-disabled":
        maxReached && !selected && !filled ? true : undefined,
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
      readOnly: maxReached && !selected && !filled,
      type,
      value: controlled ? controlledValue : undefined,
    },
    state,
  }
}

export { useQuestionnaireInput }
