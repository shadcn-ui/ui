import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { v4 as uuid } from "uuid"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york/ui/command"
import { Input } from "@/registry/new-york/ui/input"
import { toast } from "@/registry/new-york/ui/use-toast"

export const tagVariants = cva(
  "inline-flex items-center rounded-md border pl-2 text-sm transition-all",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-7 text-xs",
        md: "h-8 text-sm",
        lg: "h-9 text-base",
        xl: "h-10 text-lg",
      },
      shape: {
        default: "rounded-sm",
        rounded: "rounded-lg",
        square: "rounded-none",
        pill: "rounded-full",
      },
      borderStyle: {
        default: "border-solid",
        none: "border-none",
      },
      textCase: {
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
      },
      interaction: {
        clickable: "cursor-pointer hover:shadow-md",
        nonClickable: "cursor-default",
      },
      animation: {
        none: "",
        fadeIn: "animate-fadeIn",
        slideIn: "animate-slideIn",
        bounce: "animate-bounce",
      },
      textStyle: {
        normal: "font-normal",
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        lineThrough: "line-through",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "default",
      borderStyle: "default",
      textCase: "capitalize",
      interaction: "nonClickable",
      animation: "fadeIn",
      textStyle: "normal",
    },
  }
)

const tagInputVariants = cva("flex flex-wrap gap-2 rounded-md border", {
  variants: {
    inputFieldPostion: {
      bottom: "border-secondary",
      top: "border-primary",
      inline: "border-destructive",
    },
  },
  defaultVariants: {
    inputFieldPostion: "bottom",
  },
})

export enum Delimiter {
  Comma = ",",
  Enter = "Enter",
  Space = " ",
}

type OmittedInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value"
>

export type Tag = {
  id: string
  text: string
}

export interface TagInputProps
  extends OmittedInputProps,
    VariantProps<typeof tagVariants> {
  placeholder?: string
  tags: Tag[]
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
  enableAutocomplete?: boolean
  autocompleteOptions?: Tag[]
  maxTags?: number
  minTags?: number
  readOnly?: boolean
  disabled?: boolean
  onTagAdd?: (tag: string) => void
  onTagRemove?: (tag: string) => void
  allowDuplicates?: boolean
  validateTag?: (tag: string) => boolean
  delimiter?: Delimiter
  showCount?: boolean
  placeholderWhenFull?: string
  sortTags?: boolean
  delimiterList?: string[]
  truncate?: number
  minLength?: number
  maxLength?: number
  value?: string | number | readonly string[] | { id: string; text: string }[]
  autocompleteFilter?: (option: string) => boolean
  direction?: "row" | "column"
  onInputChange?: (value: string) => void
  customTagRenderer?: (tag: Tag, action: () => void) => React.ReactElement
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onTagClick?: (tag: Tag) => void
  draggable?: boolean
  inputFieldPostion?: "bottom" | "top" | "inline"
  clearAll?: boolean
  onClearAll?: () => void
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (props, ref) => {
    const {
      id,
      placeholder,
      tags,
      setTags,
      variant,
      size,
      shape,
      className,
      enableAutocomplete,
      autocompleteOptions,
      maxTags,
      delimiter = Delimiter.Comma,
      onTagAdd,
      onTagRemove,
      allowDuplicates,
      showCount,
      validateTag,
      placeholderWhenFull = "Max tags reached",
      sortTags,
      delimiterList,
      truncate,
      autocompleteFilter,
      borderStyle,
      textCase,
      interaction,
      animation,
      textStyle,
      minLength,
      maxLength,
      direction = "row",
      onInputChange,
      customTagRenderer,
      onFocus,
      onBlur,
      onTagClick,
      draggable = false,
      inputFieldPostion = "bottom",
      clearAll = false,
      onClearAll,
      inputProps = {},
    } = props

    const [inputValue, setInputValue] = React.useState("")
    const [tagCount, setTagCount] = React.useState(Math.max(0, tags.length))
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [draggedTagId, setDraggedTagId] = React.useState<string | null>(null)

    if (
      (maxTags !== undefined && maxTags < 0) ||
      (props.minTags !== undefined && props.minTags < 0)
    ) {
      console.warn("maxTags and minTags cannot be less than 0")
      toast({
        title: "maxTags and minTags cannot be less than 0",
        description:
          "Please set maxTags and minTags to a value greater than or equal to 0",
        variant: "destructive",
      })
      return null
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onInputChange?.(newValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        delimiterList
          ? delimiterList.includes(e.key)
          : e.key === delimiter || e.key === Delimiter.Enter
      ) {
        e.preventDefault()
        const newTagText = inputValue.trim()

        if (validateTag && !validateTag(newTagText)) {
          return
        }

        if (minLength && newTagText.length < minLength) {
          console.warn("Tag is too short")
          toast({
            title: "Tag is too short",
            description: "Please enter a tag with more characters",
            variant: "destructive",
          })
          return
        }

        // Validate maxLength
        if (maxLength && newTagText.length > maxLength) {
          toast({
            title: "Tag is too long",
            description: "Please enter a tag with less characters",
            variant: "destructive",
          })
          console.warn("Tag is too long")
          return
        }

        const newTagId = uuid()

        if (
          newTagText &&
          (allowDuplicates || !tags.some((tag) => tag.text === newTagText)) &&
          (maxTags === undefined || tags.length < maxTags)
        ) {
          setTags([...tags, { id: newTagId, text: newTagText }])
          onTagAdd?.(newTagText)
          setTagCount((prevTagCount) => prevTagCount + 1)
        }
        setInputValue("")
      }
    }

    const removeTag = (idToRemove: string) => {
      setTags(tags.filter((tag) => tag.id !== idToRemove))
      onTagRemove?.(tags.find((tag) => tag.id === idToRemove)?.text || "")
      setTagCount((prevTagCount) => prevTagCount - 1)
    }

    const handleDragStart = (id: string) => {
      setDraggedTagId(id)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault() // Necessary to allow dropping
    }

    const handleDrop = (id: string) => {
      if (draggedTagId === null) return

      const draggedTagIndex = tags.findIndex((tag) => tag.id === draggedTagId)
      const dropTargetIndex = tags.findIndex((tag) => tag.id === id)

      if (draggedTagIndex === dropTargetIndex) return

      const newTags = [...tags]
      const [reorderedTag] = newTags.splice(draggedTagIndex, 1)
      newTags.splice(dropTargetIndex, 0, reorderedTag)

      setTags(newTags)
      setDraggedTagId(null)
    }

    const handleClearAll = () => {
      onClearAll?.()
    }

    const filteredAutocompleteOptions = autocompleteFilter
      ? autocompleteOptions?.filter((option) => autocompleteFilter(option.text))
      : autocompleteOptions

    const displayedTags = sortTags ? [...tags].sort() : tags

    const truncatedTags = truncate
      ? tags.map((tag) => ({
          id: tag.id,
          text:
            tag.text?.length > truncate
              ? `${tag.text.substring(0, truncate)}...`
              : tag.text,
        }))
      : displayedTags

    return (
      <div
        className={`flex w-full gap-3 ${
          inputFieldPostion === "bottom"
            ? "flex-col"
            : inputFieldPostion === "top"
            ? "flex-col-reverse"
            : "flex-row"
        }`}
      >
        <div
          className={cn(
            "rounded-md",
            {
              "flex flex-wrap gap-2": direction === "row",
              "flex flex-col gap-2": direction === "column",
            }
            // { "mb-3": tags.length !== 0 }
          )}
        >
          {truncatedTags.map((tagObj) => 
            customTagRenderer ? (
              customTagRenderer(tagObj, ()=>removeTag(tagObj.id))
            ) : (
              <span
                key={tagObj.id}
                draggable={draggable}
                onDragStart={() => handleDragStart(tagObj.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(tagObj.id)}
                className={cn(
                  tagVariants({
                    variant,
                    size,
                    shape,
                    borderStyle,
                    textCase,
                    interaction,
                    animation,
                    textStyle,
                  }),
                  {
                    "justify-between": direction === "column",
                    "cursor-pointer": draggable,
                  }
                )}
                onClick={() => onTagClick?.(tagObj)}
              >
                {tagObj.text}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent event from bubbling up to the tag span
                    removeTag(tagObj.id)
                  }}
                  className={cn("h-full px-3 py-1 hover:bg-transparent")}
                >
                  <X size={14} />
                </Button>
              </span>
            )
          )}
        </div>
        {enableAutocomplete ? (
          <div className="w-full">
            <Command className="mt-2 border sm:min-w-[450px]">
              <CommandInput
                placeholder={
                  maxTags !== undefined && tags.length >= maxTags
                    ? placeholderWhenFull
                    : placeholder
                }
                disabled={maxTags !== undefined && tags.length >= maxTags}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {filteredAutocompleteOptions?.map((optionObj) => (
                    <CommandItem
                      key={uuid()}
                      className={`${
                        maxTags !== undefined && tags.length >= maxTags
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onSelect={() => {
                        if (
                          optionObj.text &&
                          (allowDuplicates ||
                            !tags.some(
                              (tag) => tag.text === optionObj.text
                            )) &&
                          (maxTags === undefined || tags.length < maxTags)
                        ) {
                          setTags([...tags, optionObj])
                          onTagAdd?.(optionObj.text)
                          setTagCount((prevTagCount) => prevTagCount + 1)
                        }
                      }}
                    >
                      <div
                        className={`w-full ${
                          maxTags !== undefined && tags.length >= maxTags
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        {optionObj.text}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            {maxTags && (
              <div className="flex">
                <span className="ml-auto mt-1 text-sm text-muted-foreground">
                  {`${tagCount}`}/{`${maxTags}`}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <Input
              ref={inputRef}
              id={id}
              type="text"
              placeholder={
                maxTags !== undefined && tags.length >= maxTags
                  ? placeholderWhenFull
                  : placeholder
              }
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              {...inputProps}
              className={className}
              autoComplete={enableAutocomplete ? "on" : "off"}
              list={enableAutocomplete ? "autocomplete-options" : undefined}
              disabled={maxTags !== undefined && tags.length >= maxTags}
            />
            {showCount && maxTags && (
              <div className="flex">
                <span className="ml-auto mt-1 text-sm text-muted-foreground">
                  {`${tagCount}`}/{`${maxTags}`}
                </span>
              </div>
            )}
          </div>
        )}
        {clearAll && (
          <Button type="button" onClick={handleClearAll} className="mt-2">
            Clear All
          </Button>
        )}
      </div>
    )
  }
)

TagInput.displayName = "TagInput"

export { TagInput }
