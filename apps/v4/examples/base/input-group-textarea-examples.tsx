import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/examples/base/ui/input-group"
import { Textarea } from "@/examples/base/ui/textarea"
import {
  ArrowUpIcon,
  CodeIcon,
  CopyIcon,
  InfoIcon,
  RefreshCwIcon,
} from "lucide-react"

export function InputGroupTextareaExamples() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="textarea-header-footer-12">
          Default Textarea (No Input Group)
        </FieldLabel>
        <Textarea
          id="textarea-header-footer-12"
          placeholder="Enter your text here..."
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="textarea-header-footer-13">Input Group</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="textarea-header-footer-13"
            placeholder="Enter your text here..."
          />
        </InputGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="textarea-header-footer-14">Invalid</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="textarea-header-footer-14"
            placeholder="Enter your text here..."
            aria-invalid="true"
          />
        </InputGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
      <Field data-disabled="true">
        <FieldLabel htmlFor="textarea-header-footer-15">Disabled</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="textarea-header-footer-15"
            placeholder="Enter your text here..."
            disabled
          />
        </InputGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="prompt-31">Addon (block-start)</FieldLabel>
        <InputGroup>
          <InputGroupTextarea id="prompt-31" />
          <InputGroupAddon align="block-start">
            <InputGroupText>Ask, Search or Chat...</InputGroupText>
            <InfoIcon className="text-muted-foreground ml-auto" />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="textarea-header-footer-30">
          Addon (block-end)
        </FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="textarea-header-footer-30"
            placeholder="Enter your text here..."
          />
          <InputGroupAddon align="block-end">
            <InputGroupText>0/280 characters</InputGroupText>
            <InputGroupButton
              variant="default"
              size="icon-xs"
              className="ml-auto rounded-full"
            >
              <ArrowUpIcon />
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="textarea-comment-31">Addon (Buttons)</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="textarea-comment-31"
            placeholder="Share your thoughts..."
            className="min-h-[120px]"
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton variant="ghost" className="ml-auto" size="sm">
              Cancel
            </InputGroupButton>
            <InputGroupButton variant="default" size="sm">
              Post Comment
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="textarea-code-32">Code Editor</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="textarea-code-32"
            placeholder="console.log('Hello, world!');"
            className="min-h-[300px] py-3"
          />
          <InputGroupAddon align="block-start" className="border-b">
            <InputGroupText className="font-mono font-medium">
              <CodeIcon />
              script.js
            </InputGroupText>
            <InputGroupButton size="icon-xs" className="ml-auto">
              <RefreshCwIcon />
            </InputGroupButton>
            <InputGroupButton size="icon-xs" variant="ghost">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupText>Line 1, Column 1</InputGroupText>
            <InputGroupText className="ml-auto">JavaScript</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  )
}
