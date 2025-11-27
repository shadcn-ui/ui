import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { Field, FieldLabel } from "@/registry/bases/radix/ui/field"
import { Progress } from "@/registry/bases/radix/ui/progress"

export default function ProgressExample() {
  return (
    <ExampleWrapper>
      <ProgressValues />
      <ProgressWithLabel />
    </ExampleWrapper>
  )
}

function ProgressValues() {
  return (
    <Example title="Progress Bar">
      <div className="flex w-full flex-col gap-4">
        <Progress value={0} className="w-full" />
        <Progress value={25} className="w-full" />
        <Progress value={50} className="w-full" />
        <Progress value={75} className="w-full" />
        <Progress value={100} className="w-full" />
      </div>
    </Example>
  )
}

function ProgressWithLabel() {
  return (
    <Example title="With Label">
      <Field>
        <FieldLabel htmlFor="progress-upload">
          <span>Upload progress</span>
          <span className="ml-auto">66%</span>
        </FieldLabel>
        <Progress value={66} className="w-full" id="progress-upload" />
      </Field>
    </Example>
  )
}
