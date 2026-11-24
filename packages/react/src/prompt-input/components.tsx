"use client"

import * as React from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"
import {
  $getSelection,
  $isRangeSelection,
  CLEAR_HISTORY_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_NORMAL,
  HISTORIC_TAG,
  HISTORY_PUSH_TAG,
  KEY_ENTER_COMMAND,
} from "lexical"
import { createPortal } from "react-dom"

import { $createTokenNode, TokenNode, TokenRendererContext } from "./token-node"
import type { PromptInputSuggestion, PromptInputValue } from "./types"
import { getTokens } from "./utils"
import { $readValue, $writeValue } from "./value"

const emptyValue: PromptInputValue = { text: "", tokens: [] }
const defaultRenderToken = (token: PromptInputSuggestion) =>
  token.trigger + token.label

type EditorProps = Omit<
  React.ComponentProps<"div">,
  | "onChange"
  | "onSubmit"
  | "defaultValue"
  | "children"
  | "contentEditable"
  | "dangerouslySetInnerHTML"
  | "aria-placeholder"
> & {
  value?: PromptInputValue
  defaultValue?: PromptInputValue
  onValueChange?: (value: PromptInputValue) => void
  suggestions?: PromptInputSuggestion[]
  renderToken?: (token: PromptInputSuggestion) => React.ReactNode
  placeholder?: string
  onSubmit?: () => void
  disabled?: boolean
  readOnly?: boolean
  menuClassName?: string
  optionClassName?: string
}

export function PromptInputEditor({
  value,
  defaultValue = emptyValue,
  onValueChange,
  suggestions = [],
  renderToken = defaultRenderToken,
  onSubmit,
  disabled = false,
  readOnly = false,
  placeholder,
  menuClassName,
  optionClassName,
  ...props
}: EditorProps) {
  const [initialConfig] = React.useState(() => ({
    namespace: "prompt-input",
    editable: !disabled && !readOnly,
    nodes: [TokenNode],
    editorState: () => $writeValue(value ?? defaultValue),
    onError: (error: Error) => {
      throw error
    },
  }))

  return (
    <TokenRendererContext.Provider value={renderToken}>
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              data-slot="prompt-input-editor"
              aria-autocomplete={
                !disabled && !readOnly && suggestions.length ? "list" : "none"
              }
              aria-multiline="true"
              aria-placeholder={placeholder ?? ""}
              placeholder={
                placeholder ? (
                  <span data-slot="prompt-input-placeholder" aria-hidden="true">
                    {placeholder}
                  </span>
                ) : (
                  () => null
                )
              }
              aria-disabled={disabled || undefined}
              aria-readonly={readOnly || undefined}
              tabIndex={disabled ? -1 : 0}
              {...props}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ValuePlugin
          value={value}
          onValueChange={onValueChange}
          onSubmit={onSubmit}
          editable={!disabled && !readOnly}
        />
        {!disabled && !readOnly && (
          <SuggestionsPlugin
            suggestions={suggestions}
            menuClassName={menuClassName}
            optionClassName={optionClassName}
          />
        )}
      </LexicalComposer>
    </TokenRendererContext.Provider>
  )
}

function ValuePlugin({
  value,
  onValueChange,
  onSubmit,
  editable,
}: {
  value?: PromptInputValue
  onValueChange?: (value: PromptInputValue) => void
  onSubmit?: () => void
  editable: boolean
}) {
  const [editor] = useLexicalComposerContext()
  const current = React.useRef<PromptInputValue | undefined>(undefined)

  React.useEffect(() => {
    editor.setEditable(editable)
  }, [editor, editable])

  React.useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(current.current)) {
      editor.update(
        () => {
          $writeValue(value)
          current.current = $readValue()
        },
        { tag: ["prompt-input-value", HISTORIC_TAG] }
      )
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
    }
  }, [editor, value])

  React.useEffect(
    () =>
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          if (
            !onSubmit ||
            !event ||
            event.shiftKey ||
            editor.isComposing() ||
            !editor.isEditable()
          ) {
            return false
          }
          event.preventDefault()
          onSubmit()
          return true
        },
        COMMAND_PRIORITY_LOW
      ),
    [editor, onSubmit]
  )

  return (
    <OnChangePlugin
      ignoreSelectionChange
      onChange={(state, _editor, tags) => {
        const next = state.read($readValue)
        current.current = next
        if (!tags.has("prompt-input-value")) onValueChange?.(next)
      }}
    />
  )
}

class SuggestionOption extends MenuOption {
  constructor(public suggestion: PromptInputSuggestion) {
    super(JSON.stringify([suggestion.type, suggestion.id, suggestion.trigger]))
  }
}

function SuggestionsPlugin({
  suggestions,
  menuClassName,
  optionClassName,
}: {
  suggestions: PromptInputSuggestion[]
  menuClassName?: string
  optionClassName?: string
}) {
  const [editor] = useLexicalComposerContext()
  const [match, setMatch] = React.useState({ trigger: "", query: "" })
  const triggerRef = React.useRef("")
  const triggers = React.useMemo(
    () =>
      Array.from(new Set(suggestions.map((item) => item.trigger)))
        .filter(Boolean)
        .sort((a, b) => b.length - a.length),
    [suggestions]
  )
  const options = React.useMemo(
    () =>
      suggestions
        .filter(
          (item) =>
            item.trigger === match.trigger &&
            item.label
              .toLocaleLowerCase()
              .includes(match.query.toLocaleLowerCase())
        )
        .map((item) => new SuggestionOption(item)),
    [suggestions, match]
  )

  const onQueryChange = React.useCallback((query: string | null) => {
    const trigger = triggerRef.current
    setMatch((current) =>
      current.trigger === trigger && current.query === (query ?? "")
        ? current
        : { trigger, query: query ?? "" }
    )
  }, [])

  return (
    <LexicalTypeaheadMenuPlugin<SuggestionOption>
      commandPriority={COMMAND_PRIORITY_NORMAL}
      onQueryChange={onQueryChange}
      options={options}
      triggerFn={(text) => {
        if (editor.isComposing()) return null
        const word = /(?:^|\s)(\S*)$/.exec(text)?.[1]
        if (word === undefined) return null
        const trigger = triggers.find((item) => word.startsWith(item))
        if (!trigger) return null
        triggerRef.current = trigger
        const query = word.slice(trigger.length)
        if (
          !suggestions.some(
            (item) =>
              item.trigger === trigger &&
              item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
          )
        )
          return null
        return {
          leadOffset: text.length - word.length,
          matchingString: word.slice(trigger.length),
          replaceableString: word,
        }
      }}
      onSelectOption={(option, node, close) => {
        editor.update(
          () => {
            if (!node) return
            const token = $createTokenNode(option.suggestion)
            node.replace(token)
            token.selectNext(0, 0)
            const selection = $getSelection()
            if ($isRangeSelection(selection)) selection.insertText(" ")
          },
          { tag: HISTORY_PUSH_TAG }
        )
        close()
      }}
      menuRenderFn={(
        anchorRef,
        { selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorRef.current && options.length
          ? createPortal(
              <div
                role="presentation"
                data-slot="prompt-input-list"
                className={menuClassName}
              >
                {options.map((option, index) => (
                  <div
                    key={option.key}
                    ref={option.setRefElement}
                    id={`typeahead-item-${index}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    data-slot="prompt-input-option"
                    data-highlighted={selectedIndex === index ? "" : undefined}
                    className={optionClassName}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => selectOptionAndCleanUp(option)}
                  >
                    {option.suggestion.trigger}
                    {option.suggestion.label}
                  </div>
                ))}
              </div>,
              anchorRef.current
            )
          : null
      }
    />
  )
}

export function PromptInputContent({
  value,
  renderToken = defaultRenderToken,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  value: PromptInputValue
  renderToken?: (token: PromptInputSuggestion) => React.ReactNode
}) {
  let start = 0
  const children: React.ReactNode[] = []
  for (const token of getTokens(value)) {
    children.push(value.text.slice(start, token.start))
    children.push(
      <React.Fragment key={token.start}>{renderToken(token)}</React.Fragment>
    )
    start = token.end
  }
  children.push(value.text.slice(start))
  return (
    <span data-slot="prompt-input-content" {...props}>
      {children}
    </span>
  )
}
