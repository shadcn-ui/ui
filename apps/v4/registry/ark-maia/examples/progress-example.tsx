"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/ark-maia/components/example"
import { Field, FieldLabel } from "@/registry/ark-maia/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/ark-maia/ui/item"
import {
  Progress,
  ProgressRange,
  ProgressTrack,
} from "@/registry/ark-maia/ui/progress"
import {
  Slider,
  SliderControl,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/registry/ark-maia/ui/slider"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function ProgressExample() {
  return (
    <ExampleWrapper>
      <ProgressValues />
      <ProgressWithLabel />
      <ProgressControlled />
      <FileUploadList />
    </ExampleWrapper>
  )
}

function ProgressValues() {
  return (
    <Example title="Progress Bar">
      <div className="flex w-full flex-col gap-4">
        <Progress value={0}>
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
        <Progress value={25} className="w-full">
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
        <Progress value={50}>
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
        <Progress value={75}>
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
        <Progress value={100}>
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
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
        <Progress value={66} className="w-full" id="progress-upload">
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
      </Field>
    </Example>
  )
}

function ProgressControlled() {
  const [value, setValue] = React.useState([50])

  return (
    <Example title="Controlled">
      <div className="flex w-full flex-col gap-4">
        <Progress value={value[0]} className="w-full">
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
        <Slider
          value={value}
          onValueChange={(details) => setValue(details.value)}
          min={0}
          max={100}
          step={1}
        >
          <SliderControl>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb index={0} />
          </SliderControl>
        </Slider>
      </div>
    </Example>
  )
}

function FileUploadList() {
  const files = React.useMemo(
    () => [
      {
        id: "1",
        name: "document.pdf",
        progress: 45,
        timeRemaining: "2m 30s",
      },
      {
        id: "2",
        name: "presentation.pptx",
        progress: 78,
        timeRemaining: "45s",
      },
      {
        id: "3",
        name: "spreadsheet.xlsx",
        progress: 12,
        timeRemaining: "5m 12s",
      },
      {
        id: "4",
        name: "image.jpg",
        progress: 100,
        timeRemaining: "Complete",
      },
    ],
    []
  )

  return (
    <Example title="File Upload List">
      <ItemGroup>
        {files.map((file) => (
          <Item key={file.id} size="xs" className="px-0">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="FileIcon"
                tabler="IconFile"
                hugeicons="FileIcon"
                phosphor="FileIcon"
                remixicon="RiFileLine"
                className="size-5"
              />
            </ItemMedia>
            <ItemContent className="inline-block truncate">
              <ItemTitle className="inline">{file.name}</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Progress value={file.progress} className="w-32">
                <ProgressTrack>
                  <ProgressRange />
                </ProgressTrack>
              </Progress>
            </ItemContent>
            <ItemActions className="w-16 justify-end">
              <span className="text-sm text-muted-foreground">
                {file.timeRemaining}
              </span>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </Example>
  )
}
