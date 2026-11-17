import type {
  AnswerControlRegistration,
  ItemRegistration,
  QuestionnaireShortcutMode,
} from "./types"

function hasInputValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.some((item) => String(item).trim().length > 0)
  }

  return (
    value !== undefined && value !== null && String(value).trim().length > 0
  )
}

function getShortcutKeys(shortcuts: QuestionnaireShortcutMode | null) {
  if (shortcuts === "letters") {
    return Array.from({ length: 26 }, (_, index) =>
      String.fromCharCode(65 + index)
    )
  }

  if (shortcuts === "numbers") {
    return Array.from({ length: 9 }, (_, index) => String(index + 1))
  }

  return []
}

function getShortcutFromKey(key: string, shortcuts: QuestionnaireShortcutMode) {
  const normalizedKey = shortcuts === "letters" ? key.toUpperCase() : key

  return getShortcutKeys(shortcuts).includes(normalizedKey)
    ? normalizedKey
    : null
}

function getAnswerKeyShortcuts(shortcut: string | null, filled: boolean) {
  return (
    [shortcut, filled ? "Enter" : null].filter(Boolean).join(" ") || undefined
  )
}

function isAnswerFilled(answer: AnswerControlRegistration) {
  if (answer.type === "choice") {
    return answer.element.checked
  }

  return (
    answer.element.hasAttribute("name") && hasInputValue(answer.element.value)
  )
}

function isEmptyNavigableInput(answer: AnswerControlRegistration | null) {
  return (
    answer?.type === "input" &&
    ["email", "password", "search", "tel", "text", "url"].includes(
      answer.element.type
    ) &&
    !hasInputValue(answer.element.value)
  )
}

function isTextEntryTarget(element: Element) {
  if (
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    return true
  }

  if (element instanceof HTMLInputElement) {
    return !["button", "checkbox", "radio", "reset", "submit"].includes(
      element.type
    )
  }

  return element instanceof HTMLElement && element.isContentEditable
}

function isRadioTarget(element: Element) {
  return element instanceof HTMLInputElement && element.type === "radio"
}

function compareItemOrder(
  firstItem: ItemRegistration,
  secondItem: ItemRegistration
) {
  if (firstItem.element === secondItem.element) {
    return 0
  }

  const position = firstItem.element.compareDocumentPosition(secondItem.element)

  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1
  }

  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1
  }

  return 0
}

function compareAnswerOrder(
  firstAnswer: AnswerControlRegistration,
  secondAnswer: AnswerControlRegistration
) {
  if (firstAnswer.element === secondAnswer.element) {
    return 0
  }

  const position = firstAnswer.element.compareDocumentPosition(
    secondAnswer.element
  )

  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1
  }

  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1
  }

  return 0
}

function resolveQuestionnaireConstraints({
  max,
  min,
  multiple,
  required = false,
}: {
  max?: number
  min?: number
  multiple?: boolean
  required?: boolean
}) {
  const warnings: string[] = []

  const isMinInteger = min !== undefined && Number.isInteger(min)
  const isMaxInteger = max !== undefined && Number.isInteger(max)

  if (min !== undefined) {
    if (!isMinInteger) {
      warnings.push(`min (${min}) must be an integer.`)
    }
    if (min < 0) {
      warnings.push(`min (${min}) cannot be negative.`)
    }
  }

  if (max !== undefined) {
    if (!isMaxInteger) {
      warnings.push(`max (${max}) must be an integer.`)
    }
    if (max <= 0) {
      warnings.push(`max (${max}) must be greater than 0.`)
    }
  }

  let validMin =
    min !== undefined && isMinInteger && min >= 0 ? min : undefined
  let validMax =
    max !== undefined && isMaxInteger && max >= 1 ? max : undefined

  if (validMin !== undefined && validMax !== undefined && validMin > validMax) {
    warnings.push(`min (${min}) cannot be greater than max (${max}).`)
    validMin = undefined
    validMax = undefined
  }

  if (
    multiple === false &&
    ((validMin !== undefined && validMin > 1) ||
      (validMax !== undefined && validMax > 1))
  ) {
    warnings.push(
      `multiple={false} cannot be used with min > 1 or max > 1.`
    )

    if (validMin !== undefined && validMin > 1) {
      validMin = undefined
    }

    if (validMax !== undefined && validMax > 1) {
      validMax = undefined
    }
  }

  const isMultiple =
    multiple ??
    ((validMax !== undefined && validMax > 1) ||
      (validMin !== undefined && validMin > 1))

  const effectiveMax = isMultiple ? validMax : 1
  const effectiveMin = required ? Math.max(1, validMin ?? 1) : (validMin ?? 0)
  const effectiveRequired = required || effectiveMin > 0

  return {
    effectiveMax,
    effectiveMin,
    effectiveRequired,
    isMultiple,
    warnings,
  }
}

export {
  compareAnswerOrder,
  compareItemOrder,
  getAnswerKeyShortcuts,
  getShortcutFromKey,
  getShortcutKeys,
  hasInputValue,
  isAnswerFilled,
  isEmptyNavigableInput,
  isRadioTarget,
  isTextEntryTarget,
  resolveQuestionnaireConstraints,
}
