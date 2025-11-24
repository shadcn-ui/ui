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

export function FileDropZoneDemo() {
  const [files, setFiles] = React.useState<FileWithMeta[]>([])
  const [singleFile, setSingleFile] = React.useState<FileWithMeta[]>([])
  const [validationFiles, setValidationFiles] = React.useState<FileWithMeta[]>(
    []
  )

  // Simulate upload progress for the main demo
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

  const validationErrors = React.useMemo(() => {
    return validationFiles
      .filter((f) => f.status === "error" && f.error)
      .map((f) => ({ message: `${f.file.name}: ${f.error}` }))
  }, [validationFiles])

  return (
    <div className="grid w-full gap-12">
      {/* Basic Demo with Upload Simulation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default (Multiple Files)</h3>
        <p className="text-muted-foreground text-sm">
          Drop files or click to browse. Accepts all file types.
        </p>
        <FileDropZone
          files={files}
          onFilesChange={setFiles}
          className="max-w-md"
        >
          <FileDropZoneArea>
            <FileDropZoneContent />
          </FileDropZoneArea>
          <FileDropZoneList />
        </FileDropZone>
      </div>

      {/* Single File Mode */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Single File Mode</h3>
        <p className="text-muted-foreground text-sm">
          Only one file allowed. New file replaces existing.
        </p>
        <FileDropZone
          files={singleFile}
          onFilesChange={setSingleFile}
          multiple={false}
          accept="image/*"
          className="max-w-md"
        >
          <FileDropZoneArea>
            <FileDropZoneContent />
          </FileDropZoneArea>
          <FileDropZoneList />
        </FileDropZone>
      </div>

      {/* With Validation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Validation</h3>
        <p className="text-muted-foreground text-sm">
          Max 1MB, PNG/JPEG only. Try uploading invalid files.
        </p>
        <FileDropZone
          files={validationFiles}
          onFilesChange={setValidationFiles}
          maxFiles={3}
          maxSize={1 * 1024 * 1024}
          accept="image/png,image/jpeg"
          aria-invalid={validationErrors.length > 0}
          className="max-w-md"
        >
          <FileDropZoneArea>
            <FileDropZoneContent />
          </FileDropZoneArea>
          <FileDropZoneList />
          <FileDropZoneError errors={validationErrors} />
        </FileDropZone>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled</h3>
        <p className="text-muted-foreground text-sm">
          Drop zone is disabled and non-interactive.
        </p>
        <FileDropZone disabled className="max-w-md">
          <FileDropZoneArea>
            <FileDropZoneContent />
          </FileDropZoneArea>
        </FileDropZone>
      </div>

      {/* Ghost Variant */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ghost Variant</h3>
        <p className="text-muted-foreground text-sm">
          Alternative styling with transparent border.
        </p>
        <FileDropZone className="max-w-md">
          <FileDropZoneArea variant="ghost">
            <FileDropZoneContent />
          </FileDropZoneArea>
        </FileDropZone>
      </div>
    </div>
  )
}
