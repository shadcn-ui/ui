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
            <SelectItem value="long-sentence">
              This is an extremely long sentence without spaces to test the break words class for overflow prevention and wrapping functionality that should wrap to multiple lines.
            </SelectItem>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
    </div>
  )
}
