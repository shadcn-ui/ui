import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

export default function SelectDemo() {
  return (
    <div className="space-y-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="long-text">
              ThisIsAnExtremelyLongTextWithoutSpacesToTestTheBreakWordsClassForOverflowPreventionAndWrappingFunctionalityThatShouldWrapToMultipleLines
            </SelectItem>
            <SelectItem value="url-like">
              https://verylongdomainname.example.com/very/long/path/to/demonstrate/word/breaking/functionality
            </SelectItem>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Select>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select with wider trigger" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Wider Options</SelectLabel>
            <SelectItem value="long-text-wide">
              This is an extremely long text that should wrap properly within the wider select content area and demonstrate the text wrapping functionality
            </SelectItem>
            <SelectItem value="medium">Medium length option text</SelectItem>
            <SelectItem value="short">Short</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
