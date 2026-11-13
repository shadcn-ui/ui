import * as React from "react"

import { composeRefs } from "../use-render"
import {
  createQuestionnaireCollection,
  getCollectionDefinitionWarnings,
  getCollectionRegistrationWarnings,
  getInitialItemName,
} from "./collection"
import type {
  ItemRegistration,
  PendingFocus,
  QuestionnaireContextValue,
  QuestionnaireRootProps,
  QuestionnaireRootState,
} from "./types"
import {
  compareItemOrder,
  getShortcutFromKey,
  isAnswerFilled,
  isRadioTarget,
  isTextEntryTarget,
} from "./utils"

type UseQuestionnaireRootParameters = Pick<
  QuestionnaireRootProps,
  | "defaultItem"
  | "item"
  | "items"
  | "noValidate"
  | "onItemChange"
  | "onReset"
  | "onSubmit"
  | "ref"
  | "shortcuts"
>

function useQuestionnaireRoot({
  defaultItem,
  item: controlledItem,
  items: itemDefinitions,
  noValidate,
  onItemChange,
  onReset,
  onSubmit,
  ref,
  shortcuts: shortcutMode,
}: UseQuestionnaireRootParameters) {
  const collection = React.useMemo(
    () => createQuestionnaireCollection(itemDefinitions),
    [itemDefinitions]
  )
  const [registrations, setRegistrations] = React.useState<ItemRegistration[]>(
    []
  )
  const [uncontrolledItem, setUncontrolledItem] = React.useState<string | null>(
    () => getInitialItemName(collection, defaultItem)
  )
  const [rootElement, setRootElement] = React.useState<HTMLFormElement | null>(
    null
  )
  const [domVersion, setDomVersion] = React.useState(0)
  const pendingFocusRef = React.useRef<PendingFocus | null>(null)
  const controlled = controlledItem !== undefined
  const activeItemName = controlled ? controlledItem : uncontrolledItem
  const previousActiveItemNameRef = React.useRef(activeItemName)
  const nativeValidation = noValidate === false
  const shortcuts = shortcutMode ?? null

  const activeWarningsRef = React.useRef(new Set<string>())

  React.useLayoutEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return
    }

    if (!collection || !rootElement) {
      activeWarningsRef.current.clear()
      return
    }

    let cancelled = false

    queueMicrotask(() => {
      if (cancelled) {
        return
      }

      const warnings = [
        ...getCollectionDefinitionWarnings(collection, defaultItem),
        ...getCollectionRegistrationWarnings(
          collection,
          registrations,
          shortcuts
        ),
      ]
      const activeWarnings = new Set(warnings)

      activeWarnings.forEach((warning) => {
        if (!activeWarningsRef.current.has(warning)) {
          console.warn(`[Questionnaire] ${warning}`)
        }
      })

      activeWarningsRef.current = activeWarnings
    })

    return () => {
      cancelled = true
    }
  }, [collection, defaultItem, registrations, rootElement, shortcuts])

  React.useLayoutEffect(() => {
    if (!rootElement || typeof MutationObserver === "undefined") {
      return
    }

    const observer = new MutationObserver(() => {
      setDomVersion((version) => version + 1)
    })

    observer.observe(rootElement, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [rootElement])

  const runtimeItems = React.useMemo(
    () =>
      registrations
        .filter((registration) => !registration.disabled)
        .sort(compareItemOrder),
    [domVersion, registrations]
  )
  const runtimeItemByName = React.useMemo(
    () =>
      new Map(
        runtimeItems.map((runtimeItem) => [runtimeItem.name, runtimeItem])
      ),
    [runtimeItems]
  )
  const logicalItems = collection?.enabledItems ?? runtimeItems
  const currentIndex = logicalItems.findIndex(
    (logicalItem) => logicalItem.name === activeItemName
  )
  const activeItem =
    currentIndex < 0 || !activeItemName
      ? null
      : (runtimeItemByName.get(activeItemName) ?? null)
  const activeDefinition = activeItemName
    ? collection?.itemByName.get(activeItemName)
    : undefined
  const activeItemRequired =
    currentIndex < 0
      ? null
      : activeDefinition
        ? Boolean(activeDefinition.required)
        : (activeItem?.required ?? false)
  const activeItemStatus =
    currentIndex < 0
      ? null
      : (activeItem?.status ?? (activeItemName ? "unanswered" : null))
  const orderedRegistrations = React.useMemo(
    () =>
      collection
        ? collection.enabledItems.flatMap((definition) => {
            const registration = runtimeItemByName.get(definition.name)

            return registration ? [registration] : []
          })
        : runtimeItems,
    [collection, runtimeItemByName, runtimeItems]
  )
  const total = logicalItems.length
  const current = currentIndex < 0 ? 0 : currentIndex + 1
  const first = total > 0 && currentIndex === 0
  const last = total > 0 && currentIndex === total - 1

  const setItem = React.useCallback(
    (nextItem: string, focusTarget: PendingFocus["target"] = "item") => {
      if (nextItem === activeItemName) {
        return
      }

      pendingFocusRef.current = {
        name: nextItem,
        target: focusTarget,
      }

      if (!controlled) {
        setUncontrolledItem(nextItem)
      }

      onItemChange?.(nextItem)
    },
    [activeItemName, controlled, onItemChange]
  )

  React.useLayoutEffect(() => {
    if (total === 0) {
      return
    }

    if (currentIndex < 0) {
      if (!controlled && activeItemName === null) {
        setUncontrolledItem(logicalItems[0].name)
        return
      }

      setItem(logicalItems[0].name)
      return
    }

    const pendingFocus = pendingFocusRef.current
    const activeItemChanged =
      previousActiveItemNameRef.current !== activeItemName

    previousActiveItemNameRef.current = activeItemName

    if (!pendingFocus || pendingFocus.name !== activeItemName) {
      if (controlled && activeItemChanged) {
        pendingFocusRef.current = null
        activeItem?.focus()
      }

      return
    }

    if (pendingFocus.target === "invalid") {
      activeItem?.focusInvalid()
    } else {
      activeItem?.focus()
    }

    pendingFocusRef.current = null
  }, [
    activeItem,
    activeItemName,
    controlled,
    currentIndex,
    logicalItems,
    setItem,
    total,
  ])

  const registerItem = React.useCallback((registration: ItemRegistration) => {
    setRegistrations((currentRegistrations) => [
      ...currentRegistrations.filter(
        (currentRegistration) =>
          currentRegistration.element !== registration.element &&
          currentRegistration.name !== registration.name
      ),
      registration,
    ])

    return () => {
      setRegistrations((currentRegistrations) =>
        currentRegistrations.filter(
          (currentRegistration) => currentRegistration !== registration
        )
      )
    }
  }, [])

  const goPrevious = React.useCallback(() => {
    if (currentIndex <= 0) {
      return
    }

    setItem(logicalItems[currentIndex - 1].name)
  }, [currentIndex, logicalItems, setItem])

  const goNext = React.useCallback(() => {
    if (!activeItem || currentIndex >= total - 1) {
      return
    }

    if (!activeItem.validate()) {
      activeItem.focusInvalid()
      return
    }

    setItem(logicalItems[currentIndex + 1].name)
  }, [activeItem, currentIndex, logicalItems, setItem, total])

  const confirmCurrent = React.useCallback(() => {
    if (!activeItem) {
      return
    }

    if (!activeItem.validate()) {
      activeItem.focusInvalid()
      return
    }

    if (last) {
      rootElement?.requestSubmit()
      return
    }

    setItem(logicalItems[currentIndex + 1].name)
  }, [activeItem, currentIndex, last, logicalItems, rootElement, setItem])

  const skipCurrent = React.useCallback(() => {
    if (!activeItem || activeItem.required) {
      return
    }

    activeItem.skip()

    if (!last) {
      setItem(logicalItems[currentIndex + 1].name)
      return
    }

    queueMicrotask(() => {
      rootElement?.requestSubmit()
    })
  }, [activeItem, currentIndex, last, logicalItems, rootElement, setItem])

  function handleReset(event: React.FormEvent<HTMLFormElement>) {
    onReset?.(event)

    if (event.defaultPrevented) {
      return
    }

    for (const registration of registrations) {
      registration.reset()
    }

    const resetItemName = collection
      ? getInitialItemName(collection, defaultItem)
      : (runtimeItems.find((registration) => registration.name === defaultItem)
          ?.name ?? runtimeItems[0]?.name)

    if (resetItemName) {
      setItem(resetItemName)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const firstInvalidItem = orderedRegistrations.find(
      (registration) => !registration.validate()
    )

    if (firstInvalidItem) {
      event.preventDefault()
      setItem(firstInvalidItem.name, "invalid")

      if (firstInvalidItem.name === activeItemName) {
        firstInvalidItem.focusInvalid()
        pendingFocusRef.current = null
      }

      return
    }

    onSubmit?.(event)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.keyCode === 229 ||
      !activeItem ||
      !(event.target instanceof Element)
    ) {
      return
    }

    if (
      event.key === "Enter" &&
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey
    ) {
      event.preventDefault()

      if (!event.repeat) {
        confirmCurrent()
      }

      return
    }

    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const moved = activeItem.moveAnswerFocus(
        event.target,
        event.key === "ArrowDown" ? "next" : "previous"
      )

      if (moved) {
        event.preventDefault()
        return
      }
    }

    if (
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      !isTextEntryTarget(event.target) &&
      !isRadioTarget(event.target)
    ) {
      event.preventDefault()

      if (event.repeat) {
        return
      }

      if (event.key === "ArrowLeft") {
        goPrevious()
      } else if (activeItem.status !== "unanswered") {
        goNext()
      }

      return
    }

    if (event.key === "Enter") {
      const answer = activeItem.getAnswerByElement(event.target)

      if (!answer) {
        return
      }

      event.preventDefault()

      if (!event.repeat && isAnswerFilled(answer)) {
        confirmCurrent()
      }

      return
    }

    if (!shortcuts || isTextEntryTarget(event.target)) {
      return
    }

    const shortcut = getShortcutFromKey(event.key, shortcuts)
    const answer = shortcut ? activeItem.getAnswerByShortcut(shortcut) : null

    if (!answer) {
      return
    }

    event.preventDefault()

    if (event.repeat) {
      return
    }

    answer.element.focus()

    if (answer.type === "choice") {
      answer.element.click()
    }
  }

  const state: QuestionnaireRootState = {
    current,
    first,
    last,
    total,
  }
  const context = React.useMemo<QuestionnaireContextValue>(
    () => ({
      ...state,
      activeItem,
      activeItemName,
      activeItemRequired,
      activeItemStatus,
      domVersion,
      goNext,
      goPrevious,
      itemDefinitionByName: collection?.itemByName ?? null,
      nativeValidation,
      registerItem,
      shortcuts,
      skipCurrent,
    }),
    [
      activeItem,
      activeItemName,
      activeItemRequired,
      activeItemStatus,
      collection,
      current,
      domVersion,
      first,
      goNext,
      goPrevious,
      last,
      nativeValidation,
      registerItem,
      shortcuts,
      skipCurrent,
      total,
    ]
  )
  const setRootRef = React.useCallback(
    (element: HTMLFormElement | null) => {
      setRootElement(element)
      composeRefs(ref)?.(element)
    },
    [ref]
  )

  return {
    context,
    rootProps: {
      "data-shortcuts": shortcuts ?? undefined,
      onKeyDown: handleKeyDown,
      onReset: handleReset,
      onSubmit: handleSubmit,
      ref: setRootRef,
    },
    state,
  }
}

export { useQuestionnaireRoot }
