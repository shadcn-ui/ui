"use client"

import * as React from "react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/examples/base/ui/item"
import { Progress } from "@/examples/base/ui/progress"
import { FileIcon } from "lucide-react"

export function FileUploadList() {
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
    <ItemGroup>
      {files.map((file) => (
        <Item key={file.id} size="xs" className="px-0">
          <ItemMedia variant="icon">
            <FileIcon className="size-5" />
          </ItemMedia>
          <ItemContent className="inline-block truncate">
            <ItemTitle className="inline">{file.name}</ItemTitle>
          </ItemContent>
          <ItemContent>
            <Progress value={file.progress} className="w-32" />
          </ItemContent>
          <ItemActions className="w-16 justify-end">
            <span className="text-muted-foreground text-sm">
              {file.timeRemaining}
            </span>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
