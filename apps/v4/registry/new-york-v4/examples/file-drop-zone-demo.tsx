"use client"

import * as React from "react"

import {
  FileDropZone,
  FileDropZoneArea,
  FileDropZoneContent,
  FileDropZoneList,
  type FileWithMeta,
} from "@/registry/new-york-v4/ui/file-drop-zone"

export default function FileDropZoneDemo() {
  const [files, setFiles] = React.useState<FileWithMeta[]>([])

  // Simulate upload progress
  React.useEffect(() => {
    const pendingFiles = files.filter((f) => f.status === "pending")
    if (pendingFiles.length === 0) return

    // Start uploading pending files
    setFiles((prev) =>
      prev.map((f) =>
        f.status === "pending" ? { ...f, status: "uploading" as const } : f
      )
    )

    // Simulate progress
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.status !== "uploading") return f
          const newProgress = Math.min(f.progress + 10, 100)
          if (newProgress === 100) {
            return { ...f, status: "complete" as const, progress: 100 }
          }
          return { ...f, progress: newProgress }
        })
      )
    }, 200)

    return () => clearInterval(interval)
  }, [files])

  return (
    <FileDropZone
      files={files}
      onFilesChange={setFiles}
      className="w-full max-w-md"
    >
      <FileDropZoneArea>
        <FileDropZoneContent />
      </FileDropZoneArea>
      <FileDropZoneList />
    </FileDropZone>
  )
}
