"use client"

import * as React from "react"

import {
  FileDropZone,
  FileDropZoneArea,
  FileDropZoneContent,
  FileDropZoneList,
  type FileWithMeta,
} from "@/registry/new-york-v4/ui/file-drop-zone"

export default function FileDropZoneSingle() {
  const [files, setFiles] = React.useState<FileWithMeta[]>([])

  return (
    <FileDropZone
      files={files}
      onFilesChange={setFiles}
      multiple={false}
      accept="image/*"
      className="w-full max-w-md"
    >
      <FileDropZoneArea>
        <FileDropZoneContent />
      </FileDropZoneArea>
      <FileDropZoneList />
    </FileDropZone>
  )
}
