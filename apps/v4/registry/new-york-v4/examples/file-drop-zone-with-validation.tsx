"use client"

import * as React from "react"

import {
  FileDropZone,
  FileDropZoneArea,
  FileDropZoneContent,
  FileDropZoneError,
  FileDropZoneList,
  type FileWithMeta,
} from "@/registry/new-york-v4/ui/file-drop-zone"

export default function FileDropZoneWithValidation() {
  const [files, setFiles] = React.useState<FileWithMeta[]>([])

  const errors = React.useMemo(() => {
    return files
      .filter((f) => f.status === "error" && f.error)
      .map((f) => ({ message: `${f.file.name}: ${f.error}` }))
  }, [files])

  const hasErrors = errors.length > 0

  return (
    <FileDropZone
      files={files}
      onFilesChange={setFiles}
      maxFiles={3}
      maxSize={1 * 1024 * 1024}
      accept="image/png,image/jpeg"
      aria-invalid={hasErrors}
      className="w-full max-w-md"
    >
      <FileDropZoneArea>
        <FileDropZoneContent />
      </FileDropZoneArea>
      <FileDropZoneList />
      <FileDropZoneError errors={errors} />
    </FileDropZone>
  )
}
