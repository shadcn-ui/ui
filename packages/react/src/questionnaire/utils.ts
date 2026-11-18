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
}
