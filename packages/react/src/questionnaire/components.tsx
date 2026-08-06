import * as React from "react"

import { mergeProps, useRender } from "../use-render"
import {
  QuestionnaireChoiceContext,
  QuestionnaireContext,
  QuestionnaireItemContext,
  useQuestionnaireChoiceContext,
  useQuestionnaireContext,
  useQuestionnaireItemContext,
} from "./context"
import type {
  QuestionnaireChoiceInputProps,
  QuestionnaireChoiceLabelProps,
  QuestionnaireChoiceProps,
  QuestionnaireChoiceShortcutProps,
  QuestionnaireChoicesProps,
  QuestionnaireDescriptionProps,
  QuestionnaireErrorProps,
  QuestionnaireInputProps,
  QuestionnaireItemProps,
  QuestionnaireNavigationState,
  QuestionnaireNextProps,
  QuestionnairePreviousProps,
  QuestionnaireProgressProps,
  QuestionnaireRootProps,
  QuestionnaireSkipProps,
  QuestionnaireSubmitProps,
  QuestionnaireTitleProps,
} from "./types"
import { useQuestionnaireChoice } from "./use-questionnaire-choice"
import { useQuestionnaireInput } from "./use-questionnaire-input"
import { useQuestionnaireItem } from "./use-questionnaire-item"
import { useQuestionnaireRoot } from "./use-questionnaire-root"

function QuestionnaireRoot({
  defaultItem,
  item,
  items,
  noValidate = true,
  onItemChange,
  onReset,
  onSubmit,
  ref,
  shortcuts,
  ...props
}: QuestionnaireRootProps) {
  const { context, rootProps, state } = useQuestionnaireRoot({
    defaultItem,
    item,
    items,
    noValidate,
    onItemChange,
    onReset,
    onSubmit,
    ref,
    shortcuts,
  })
  const element = useRender({
    defaultTagName: "form",
    props: mergeProps<"form">({ ...rootProps, noValidate }, props),
    state,
  })

  return (
    <QuestionnaireContext.Provider value={context}>
      {element}
    </QuestionnaireContext.Provider>
  )
}

function QuestionnaireProgress({
  children,
  render,
  ...props
}: QuestionnaireProgressProps) {
  const { current, first, last, total } = useQuestionnaireContext(
    "Questionnaire.Progress"
  )
  const label = total ? `Question ${current} of ${total}` : undefined

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "aria-label": "Questionnaire progress",
        "aria-live": "polite",
        "aria-valuemax": total || undefined,
        "aria-valuemin": total ? 1 : undefined,
        "aria-valuenow": total ? current : undefined,
        "aria-valuetext": label,
        children: children ?? label,
        role: "progressbar",
      },
      props
    ),
    render,
    state: { current, first, last, total },
  })
}

function QuestionnaireItem({
  "aria-describedby": ariaDescribedBy,
  "aria-keyshortcuts": ariaKeyShortcuts,
  children,
  disabled = false,
  invalid = false,
  multiple = false,
  name,
  onStatusChange,
  ref,
  required = false,
  ...props
}: QuestionnaireItemProps) {
  const { context, itemProps, state } = useQuestionnaireItem({
    "aria-describedby": ariaDescribedBy,
    "aria-keyshortcuts": ariaKeyShortcuts,
    disabled,
    invalid,
    multiple,
    name,
    onStatusChange,
    ref,
    required,
  })
  const element = useRender({
    defaultTagName: "fieldset",
    props: mergeProps<"fieldset">({ ...itemProps, children }, props),
    state,
    stateAttributesMapping: {
      active: (isActive) => ({
        "data-active": isActive ? "" : undefined,
      }),
    },
  })

  return (
    <QuestionnaireItemContext.Provider value={context}>
      {element}
    </QuestionnaireItemContext.Provider>
  )
}

function QuestionnaireTitle({ render, ...props }: QuestionnaireTitleProps) {
  useQuestionnaireItemContext("Questionnaire.Title")

  return useRender({
    defaultTagName: "legend",
    props,
    render,
  })
}

function QuestionnaireDescription({
  id,
  render,
  ...props
}: QuestionnaireDescriptionProps) {
  const { registerDescription } = useQuestionnaireItemContext(
    "Questionnaire.Description"
  )
  const generatedId = React.useId()
  const descriptionId = id ?? generatedId

  React.useLayoutEffect(
    () => registerDescription(descriptionId),
    [descriptionId, registerDescription]
  )

  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">({ id: descriptionId }, props),
    render,
  })
}

function QuestionnaireChoices({ render, ...props }: QuestionnaireChoicesProps) {
  const { shortcuts } = useQuestionnaireItemContext("Questionnaire.Choices")

  return useRender({
    defaultTagName: "div",
    props,
    render,
    state: { shortcuts },
  })
}

function QuestionnaireChoice({
  checked,
  children,
  defaultChecked = false,
  disabled = false,
  onChange,
  render,
  value,
  ...props
}: QuestionnaireChoiceProps) {
  const { inputProps, state } = useQuestionnaireChoice({
    checked,
    defaultChecked,
    disabled,
    onChange,
    value,
  })
  const element = useRender({
    defaultTagName: "label",
    props: mergeProps<"label">({ children }, props),
    render,
    state,
    stateAttributesMapping: {
      checked: (isChecked) => ({
        "data-checked": isChecked ? "" : undefined,
        "data-unchecked": isChecked ? undefined : "",
      }),
    },
  })

  return (
    <QuestionnaireChoiceContext.Provider value={{ inputProps, state }}>
      {element}
    </QuestionnaireChoiceContext.Provider>
  )
}

function QuestionnaireChoiceInput({
  render,
  ...props
}: QuestionnaireChoiceInputProps) {
  const { inputProps, state } = useQuestionnaireChoiceContext(
    "Questionnaire.ChoiceInput"
  )

  return useRender({
    defaultTagName: "input",
    props: mergeProps<"input">(inputProps, props),
    render,
    state,
    stateAttributesMapping: {
      checked: (isChecked) => ({
        "data-checked": isChecked ? "" : undefined,
        "data-unchecked": isChecked ? undefined : "",
      }),
    },
  })
}

function QuestionnaireChoiceLabel({
  render,
  ...props
}: QuestionnaireChoiceLabelProps) {
  useQuestionnaireChoiceContext("Questionnaire.ChoiceLabel")

  return useRender({
    defaultTagName: "span",
    props,
    render,
  })
}

function QuestionnaireChoiceShortcut({
  children,
  render,
  ...props
}: QuestionnaireChoiceShortcutProps) {
  const { state } = useQuestionnaireChoiceContext(
    "Questionnaire.ChoiceShortcut"
  )
  const shortcutState = { shortcut: state.shortcut }

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        "aria-hidden": true,
        children: children ?? state.shortcut,
        hidden: state.shortcut === null,
      },
      props
    ),
    render,
    state: shortcutState,
  })
}

function QuestionnaireInput({
  defaultValue,
  disabled = false,
  onChange,
  ref,
  render,
  type = "text",
  value,
  ...props
}: QuestionnaireInputProps) {
  const { inputProps, state } = useQuestionnaireInput({
    defaultValue,
    disabled,
    onChange,
    ref,
    type,
    value,
  })

  return useRender({
    defaultTagName: "input",
    props: mergeProps<"input">(inputProps, props),
    render,
    state,
    stateAttributesMapping: {
      filled: (isFilled) => ({
        "data-empty": isFilled ? undefined : "",
        "data-filled": isFilled ? "" : undefined,
      }),
    },
  })
}

function QuestionnaireError({
  children,
  id,
  render,
  ...props
}: QuestionnaireErrorProps) {
  const { invalid, registerError, required } = useQuestionnaireItemContext(
    "Questionnaire.Error"
  )
  const generatedId = React.useId()
  const errorId = id ?? generatedId

  React.useLayoutEffect(() => registerError(errorId), [errorId, registerError])

  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      {
        children:
          children ??
          (required
            ? "Choose an answer to continue."
            : "Choose an answer or skip this question."),
        hidden: !invalid,
        id: errorId,
        role: invalid ? "alert" : undefined,
      },
      props
    ),
    render,
    state: { invalid },
  })
}

function QuestionnairePrevious({
  children,
  disabled: disabledProp = false,
  onClick,
  render,
  tabIndex,
  type = "button",
  ...props
}: QuestionnairePreviousProps) {
  const context = useQuestionnaireContext("Questionnaire.Previous")
  const visible = context.total > 1 && !context.first

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)

    if (!event.defaultPrevented) {
      context.goPrevious()
    }
  }

  return useRenderNavigationButton({
    children: children ?? "Previous",
    disabled: disabledProp,
    onClick: handleClick,
    props,
    render,
    status: context.activeItemStatus,
    tabIndex,
    type,
    visible,
  })
}

function QuestionnaireSkip({
  children,
  disabled: disabledProp = false,
  onClick,
  render,
  tabIndex,
  type = "button",
  ...props
}: QuestionnaireSkipProps) {
  const context = useQuestionnaireContext("Questionnaire.Skip")
  const visible = context.activeItemRequired === false

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)

    if (!event.defaultPrevented) {
      context.skipCurrent()
    }
  }

  return useRenderNavigationButton({
    children: children ?? "Skip",
    disabled: disabledProp,
    onClick: handleClick,
    props,
    render,
    status: context.activeItemStatus,
    tabIndex,
    type,
    visible,
  })
}

function QuestionnaireNext({
  children,
  disabled: disabledProp = false,
  onClick,
  render,
  tabIndex,
  type = "button",
  ...props
}: QuestionnaireNextProps) {
  const context = useQuestionnaireContext("Questionnaire.Next")
  const visible = context.total > 1 && !context.last

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)

    if (!event.defaultPrevented) {
      context.goNext()
    }
  }

  return useRenderNavigationButton({
    children: children ?? "Next",
    disabled: disabledProp,
    onClick: handleClick,
    props,
    render,
    shortcut: "Enter",
    status: context.activeItemStatus,
    tabIndex,
    type,
    visible,
  })
}

function QuestionnaireSubmit({
  children,
  disabled: disabledProp = false,
  render,
  tabIndex,
  type = "submit",
  ...props
}: QuestionnaireSubmitProps) {
  const context = useQuestionnaireContext("Questionnaire.Submit")
  const visible = context.total > 0 && context.last

  return useRenderNavigationButton({
    children: children ?? "Submit",
    disabled: disabledProp,
    props,
    render,
    shortcut: "Enter",
    status: context.activeItemStatus,
    tabIndex,
    type,
    visible,
  })
}

function useRenderNavigationButton({
  children,
  disabled,
  onClick,
  props,
  render,
  shortcut,
  status,
  tabIndex,
  type,
  visible,
}: {
  children: React.ReactNode
  disabled: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  props: React.ComponentPropsWithRef<"button">
  render: QuestionnaireNextProps["render"]
  shortcut?: "Enter"
  status: QuestionnaireNavigationState["status"]
  tabIndex: number | undefined
  type: "button" | "reset" | "submit"
  visible: boolean
}) {
  const activeShortcut = visible && !disabled ? (shortcut ?? null) : null
  const state: QuestionnaireNavigationState = {
    disabled,
    shortcut: activeShortcut,
    status,
    visible,
  }

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        "aria-hidden": !visible || undefined,
        "aria-keyshortcuts": activeShortcut ?? undefined,
        children,
        disabled,
        hidden: !visible,
        inert: !visible,
        onClick,
        tabIndex: visible ? tabIndex : -1,
        type,
      },
      props
    ),
    render,
    state,
    stateAttributesMapping: {
      visible: (isVisible) => ({
        "data-hidden": isVisible ? undefined : "",
        "data-visible": isVisible ? "" : undefined,
      }),
    },
  })
}

export {
  QuestionnaireChoice,
  QuestionnaireChoiceInput,
  QuestionnaireChoiceLabel,
  QuestionnaireChoiceShortcut,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireRoot,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
}
