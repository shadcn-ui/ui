import * as React from "react"

import { composeRefs } from "../use-render"
import { getShortcutByChoiceValue } from "./collection"
import { useQuestionnaireContext } from "./context"
import type {
  AnswerControlRegistration,
  QuestionnaireItemContextValue,
  QuestionnaireItemProps,
  QuestionnaireItemState,
  QuestionnaireItemStatus,
} from "./types"
import {
  compareAnswerOrder,
  getShortcutKeys,
  isAnswerFilled,
  isEmptyNavigableInput,
  isRadioTarget,
  isTextEntryTarget,
} from "./utils"

type UseQuestionnaireItemParameters = Pick<
  QuestionnaireItemProps,
  | "aria-describedby"
  | "aria-keyshortcuts"
  | "disabled"
  | "invalid"
  | "multiple"
  | "name"
  | "onStatusChange"
  | "ref"
  | "required"
>

function useQuestionnaireItem({
  "aria-describedby": ariaDescribedBy,
  "aria-keyshortcuts": ariaKeyShortcuts,
  disabled = false,
  invalid: externallyInvalid = false,
  multiple = false,
  name,
  onStatusChange,
  ref,
  required = false,
}: UseQuestionnaireItemParameters) {
  const {
    activeItemName,
    domVersion,
    first,
    itemDefinitionByName,
    last,
    nativeValidation,
    registerItem,
    shortcuts,
  } = useQuestionnaireContext("Questionnaire.Item")
  const [element, setElement] = React.useState<HTMLFieldSetElement | null>(null)
  const [answerControlRegistrations, setAnswerControlRegistrations] =
    React.useState<AnswerControlRegistration[]>([])
  const [validationAttempted, setValidationAttempted] = React.useState(false)
  const [selectedAnswerIds, setSelectedAnswerIds] = React.useState<string[]>([])
  const [skipped, setSkipped] = React.useState(false)
  const [resetVersion, setResetVersion] = React.useState(0)
  const [descriptionIds, setDescriptionIds] = React.useState<string[]>([])
  const [errorIds, setErrorIds] = React.useState<string[]>([])
  const defaultSelectedAnswerIdsRef = React.useRef<string[]>([])
  const multipleRef = React.useRef(multiple)
  const previousMultipleRef = React.useRef(multiple)
  multipleRef.current = multiple
  const active = !disabled && activeItemName === name
  const answerControls = React.useMemo(
    () => [...answerControlRegistrations].sort(compareAnswerOrder),
    [answerControlRegistrations, domVersion]
  )
  const answers = React.useMemo(
    () => answerControls.filter((registration) => !registration.disabled),
    [answerControls]
  )
  const answered = answers.some((answer) =>
    selectedAnswerIds.includes(answer.id)
  )
  const status: QuestionnaireItemStatus = skipped
    ? "skipped"
    : answered
      ? "answered"
      : "unanswered"
  const intentionallySkipped = status === "skipped" && !required
  const valid =
    disabled ||
    intentionallySkipped ||
    (!externallyInvalid && status === "answered")
  const invalid =
    !disabled &&
    !intentionallySkipped &&
    (externallyInvalid || (validationAttempted && !valid))
  const hasInputAnswer = answers.some((answer) => answer.type === "input")
  const previousStatusRef = React.useRef(status)
  const itemDefinition = itemDefinitionByName?.get(name)
  const shortcutByChoiceValue = React.useMemo(
    () =>
      itemDefinitionByName
        ? getShortcutByChoiceValue(itemDefinition, shortcuts)
        : null,
    [itemDefinition, itemDefinitionByName, shortcuts]
  )
  const shortcutByAnswerId = React.useMemo(() => {
    if (shortcutByChoiceValue) {
      return new Map<string, string>()
    }

    const keys = getShortcutKeys(shortcuts)
    const shortcutAnswers = answers.filter((answer) => answer.type === "choice")

    return new Map(
      shortcutAnswers
        .slice(0, keys.length)
        .map((answer, index) => [answer.id, keys[index]])
    )
  }, [answers, shortcutByChoiceValue, shortcuts])

  const registerAnswerControl = React.useCallback(
    (registration: AnswerControlRegistration) => {
      setAnswerControlRegistrations((currentRegistrations) => [
        ...currentRegistrations.filter(
          (currentRegistration) =>
            currentRegistration.element !== registration.element &&
            currentRegistration.id !== registration.id
        ),
        registration,
      ])

      return () => {
        setAnswerControlRegistrations((currentRegistrations) =>
          currentRegistrations.filter(
            (currentRegistration) => currentRegistration !== registration
          )
        )
      }
    },
    []
  )

  React.useLayoutEffect(() => {
    if (previousStatusRef.current === status) {
      return
    }

    previousStatusRef.current = status

    onStatusChange?.(status)
  }, [onStatusChange, status])

  const updateAnswerSelected = React.useCallback(
    (answerId: string, selected: boolean) => {
      setSelectedAnswerIds((currentAnswerIds) => {
        if (!selected) {
          return currentAnswerIds.filter(
            (currentAnswerId) => currentAnswerId !== answerId
          )
        }

        if (!multiple) {
          return [answerId]
        }

        return currentAnswerIds.includes(answerId)
          ? currentAnswerIds
          : [...currentAnswerIds, answerId]
      })
    },
    [multiple]
  )
  const setAnswerSelectionFromInteraction = React.useCallback(
    (answerId: string, selected: boolean) => {
      setSkipped(false)
      updateAnswerSelected(answerId, selected)
    },
    [updateAnswerSelected]
  )
  const syncControlledAnswerSelection = React.useCallback(
    (answerId: string, selected: boolean) => {
      if (selected) {
        setSkipped(false)
      }

      updateAnswerSelected(answerId, selected)
    },
    [updateAnswerSelected]
  )

  const registerAnswerSelection = React.useCallback(
    (answerId: string, defaultSelected: boolean) => {
      if (defaultSelected) {
        defaultSelectedAnswerIdsRef.current = [
          ...defaultSelectedAnswerIdsRef.current.filter(
            (currentAnswerId) => currentAnswerId !== answerId
          ),
          answerId,
        ]
        setSelectedAnswerIds((currentAnswerIds) => {
          if (!multipleRef.current) {
            return currentAnswerIds.length ? currentAnswerIds : [answerId]
          }

          return currentAnswerIds.includes(answerId)
            ? currentAnswerIds
            : [...currentAnswerIds, answerId]
        })
      }

      return () => {
        defaultSelectedAnswerIdsRef.current =
          defaultSelectedAnswerIdsRef.current.filter(
            (currentAnswerId) => currentAnswerId !== answerId
          )
        setSelectedAnswerIds((currentAnswerIds) =>
          currentAnswerIds.filter(
            (currentAnswerId) => currentAnswerId !== answerId
          )
        )
      }
    },
    []
  )
  const setAnswerDefault = React.useCallback(
    (answerId: string, defaultSelected: boolean) => {
      if (defaultSelected) {
        defaultSelectedAnswerIdsRef.current =
          defaultSelectedAnswerIdsRef.current.includes(answerId)
            ? defaultSelectedAnswerIdsRef.current
            : [...defaultSelectedAnswerIdsRef.current, answerId]
        return
      }

      defaultSelectedAnswerIdsRef.current =
        defaultSelectedAnswerIdsRef.current.filter(
          (currentAnswerId) => currentAnswerId !== answerId
        )
    },
    []
  )

  const registerDescription = React.useCallback(
    (registeredDescriptionId: string) => {
      setDescriptionIds((currentDescriptionIds) =>
        currentDescriptionIds.includes(registeredDescriptionId)
          ? currentDescriptionIds
          : [...currentDescriptionIds, registeredDescriptionId]
      )

      return () => {
        setDescriptionIds((currentDescriptionIds) =>
          currentDescriptionIds.filter(
            (currentDescriptionId) =>
              currentDescriptionId !== registeredDescriptionId
          )
        )
      }
    },
    []
  )

  const registerError = React.useCallback((registeredErrorId: string) => {
    setErrorIds((currentErrorIds) =>
      currentErrorIds.includes(registeredErrorId)
        ? currentErrorIds
        : [...currentErrorIds, registeredErrorId]
    )

    return () => {
      setErrorIds((currentErrorIds) =>
        currentErrorIds.filter(
          (currentErrorId) => currentErrorId !== registeredErrorId
        )
      )
    }
  }, [])

  const validate = React.useCallback(() => {
    setValidationAttempted(true)

    if (!valid) {
      return false
    }

    if (!nativeValidation) {
      return true
    }

    const invalidAnswer = answers.find(
      (answer) =>
        isAnswerFilled(answer) &&
        answer.element.willValidate &&
        !answer.element.validity.valid
    )

    if (!invalidAnswer) {
      return true
    }

    invalidAnswer.element.focus()
    invalidAnswer.element.reportValidity()

    return false
  }, [answers, nativeValidation, valid])

  const focus = React.useCallback(() => {
    element?.focus()
  }, [element])

  const focusInvalid = React.useCallback(() => {
    const selectedInput = element?.querySelector<HTMLInputElement>(
      "input[data-filled][name]:not(:disabled)"
    )
    const firstControl = element?.querySelector<HTMLElement>(
      "input:not([type=hidden]):not(:disabled), textarea:not(:disabled)"
    )

    ;(selectedInput ?? firstControl ?? element)?.focus()
  }, [element])

  const reset = React.useCallback(() => {
    setValidationAttempted(false)
    setSkipped(false)
    setSelectedAnswerIds(
      multiple
        ? [...defaultSelectedAnswerIdsRef.current]
        : defaultSelectedAnswerIdsRef.current.slice(0, 1)
    )
    setResetVersion((version) => version + 1)
  }, [multiple])

  const skip = React.useCallback(() => {
    if (required) {
      return
    }

    setSelectedAnswerIds([])
    setSkipped(true)
  }, [required])

  React.useLayoutEffect(() => {
    const wasMultiple = previousMultipleRef.current
    previousMultipleRef.current = multiple

    if (!wasMultiple || multiple) {
      return
    }

    setSelectedAnswerIds((currentAnswerIds) => {
      const selectedAnswer = answers.find((answer) =>
        currentAnswerIds.includes(answer.id)
      )

      return selectedAnswer ? [selectedAnswer.id] : []
    })
  }, [answers, multiple])

  const getAnswerByElement = React.useCallback(
    (answerElement: Element) =>
      answers.find((answer) => answer.element === answerElement) ?? null,
    [answers]
  )
  const getAnswerByShortcut = React.useCallback(
    (shortcut: string) => {
      if (shortcutByChoiceValue) {
        const choiceValue = Array.from(shortcutByChoiceValue.entries()).find(
          ([, choiceShortcut]) => choiceShortcut === shortcut
        )?.[0]

        return (
          answers.find(
            (answer) => answer.type === "choice" && answer.value === choiceValue
          ) ?? null
        )
      }

      const answerId = Array.from(shortcutByAnswerId.entries()).find(
        ([, answerShortcut]) => answerShortcut === shortcut
      )?.[0]

      return answers.find((answer) => answer.id === answerId) ?? null
    },
    [answers, shortcutByAnswerId, shortcutByChoiceValue]
  )
  const moveAnswerFocus = React.useCallback(
    (currentElement: Element, direction: "next" | "previous") => {
      const currentIndex = answers.findIndex(
        (answer) => answer.element === currentElement
      )
      const currentAnswer =
        currentIndex < 0 ? null : (answers[currentIndex] ?? null)

      if (
        !answers.length ||
        (isTextEntryTarget(currentElement) &&
          !isEmptyNavigableInput(currentAnswer)) ||
        (currentIndex < 0 && currentElement !== element)
      ) {
        return false
      }

      const nextAnswer =
        currentIndex < 0
          ? (answers.find(isAnswerFilled) ??
            (direction === "next" ? answers[0] : answers[answers.length - 1]))
          : answers[
              (currentIndex +
                (direction === "next" ? 1 : -1) +
                answers.length) %
                answers.length
            ]

      if (!nextAnswer || nextAnswer.element === currentElement) {
        return false
      }

      if (
        currentIndex >= 0 &&
        isRadioTarget(currentElement) &&
        isRadioTarget(nextAnswer.element)
      ) {
        return false
      }

      nextAnswer.element.focus()

      if (nextAnswer.type === "choice" && isRadioTarget(nextAnswer.element)) {
        nextAnswer.element.click()
      }

      return true
    },
    [answers, element]
  )

  React.useLayoutEffect(() => {
    if (!element) {
      return
    }

    return registerItem({
      choices: answerControls.flatMap((answer) =>
        answer.type === "choice"
          ? [{ disabled: answer.ownDisabled, value: answer.value }]
          : []
      ),
      disabled,
      element,
      focus,
      focusInvalid,
      getAnswerByElement,
      getAnswerByShortcut,
      moveAnswerFocus,
      name,
      required,
      reset,
      skip,
      status,
      validate,
    })
  }, [
    answerControls,
    disabled,
    element,
    focus,
    focusInvalid,
    getAnswerByElement,
    getAnswerByShortcut,
    moveAnswerFocus,
    name,
    registerItem,
    required,
    reset,
    skip,
    status,
    validate,
  ])

  const context = React.useMemo<QuestionnaireItemContextValue>(
    () => ({
      active,
      disabled,
      hasInputAnswer,
      invalid,
      multiple,
      name,
      registerAnswerControl,
      registerAnswerSelection,
      registerDescription,
      registerError,
      required,
      resetVersion,
      selectedAnswerIds,
      setAnswerDefault,
      setAnswerSelectionFromInteraction,
      shortcutByAnswerId,
      shortcutByChoiceValue,
      shortcuts,
      status,
      syncControlledAnswerSelection,
    }),
    [
      active,
      disabled,
      hasInputAnswer,
      invalid,
      multiple,
      name,
      registerAnswerControl,
      registerAnswerSelection,
      registerDescription,
      registerError,
      required,
      resetVersion,
      selectedAnswerIds,
      setAnswerDefault,
      setAnswerSelectionFromInteraction,
      shortcutByAnswerId,
      shortcutByChoiceValue,
      shortcuts,
      status,
      syncControlledAnswerSelection,
    ]
  )
  const setItemRef = React.useCallback(
    (nextElement: HTMLFieldSetElement | null) => {
      setElement(nextElement)
      composeRefs(ref)?.(nextElement)
    },
    [ref]
  )
  const describedBy =
    [...descriptionIds, ...(invalid ? errorIds : []), ariaDescribedBy]
      .filter(Boolean)
      .join(" ") || undefined
  const keyShortcuts =
    [
      ariaKeyShortcuts,
      active ? "Meta+Enter Control+Enter" : undefined,
      active && answers.length ? "ArrowUp ArrowDown" : undefined,
      active && !first ? "ArrowLeft" : undefined,
      active && !last && status !== "unanswered" ? "ArrowRight" : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined
  const state: QuestionnaireItemState = {
    active,
    disabled,
    invalid,
    multiple,
    required,
    status,
  }

  return {
    context,
    itemProps: {
      "aria-describedby": describedBy,
      "aria-invalid": invalid || undefined,
      "aria-keyshortcuts": keyShortcuts,
      disabled,
      hidden: !active,
      inert: !active,
      ref: setItemRef,
      tabIndex: -1,
    },
    state,
  }
}

export { useQuestionnaireItem }
