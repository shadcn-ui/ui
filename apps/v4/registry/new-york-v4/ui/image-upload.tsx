"use client"

import * as React from "react"
import { ImageIcon, UploadCloudIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface ImageUploadPreviewProps {
  files: File[]
  previews: string[]
  onRemove: (index: number) => void
  disabled: boolean
}

interface ImageUploadProps {
  maxFiles?: number
  maxSize?: number
  accept?: string[]
  value?: File[]
  onChange?: (files: File[]) => void
  className?: string
  disabled?: boolean
  renderPreview?: (props: ImageUploadPreviewProps) => React.ReactNode
}

interface RejectedFile {
  file: File
  reason: string
}

function ImageUpload({
  maxFiles,
  maxSize,
  accept = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  value,
  onChange,
  className,
  disabled = false,
  renderPreview,
}: ImageUploadProps) {
  const [internalFiles, setInternalFiles] = React.useState<File[]>([])
  const [rejected, setRejected] = React.useState<RejectedFile[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const files = value ?? internalFiles

  const previews = React.useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  )

  React.useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previews])

  function validate(incoming: File[]): {
    accepted: File[]
    rejected: RejectedFile[]
  } {
    const accepted: File[] = []
    const rejected: RejectedFile[] = []
    const remaining = maxFiles ? maxFiles - files.length : Infinity

    for (const file of incoming) {
      if (!accept.includes(file.type)) {
        rejected.push({
          file,
          reason: `Type not allowed. Accepted: ${accept.map((t) => t.replace("image/", "")).join(", ")}`,
        })
        continue
      }
      if (maxSize && file.size > maxSize) {
        rejected.push({
          file,
          reason: `Exceeds ${formatBytes(maxSize)} limit (file is ${formatBytes(file.size)})`,
        })
        continue
      }
      if (accepted.length >= remaining) {
        rejected.push({ file, reason: `Max ${maxFiles} image(s) allowed` })
        continue
      }
      accepted.push(file)
    }

    return { accepted, rejected }
  }

  function addFiles(incoming: FileList | null) {
    if (!incoming || disabled) return
    const { accepted, rejected } = validate(Array.from(incoming))
    setRejected(rejected)
    if (accepted.length === 0) return
    const next = [...files, ...accepted]
    if (onChange) {
      onChange(next)
    } else {
      setInternalFiles(next)
    }
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index)
    if (onChange) {
      onChange(next)
    } else {
      setInternalFiles(next)
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files)
    e.target.value = ""
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  function onDragLeave() {
    setIsDragging(false)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const isAtLimit = maxFiles !== undefined && files.length >= maxFiles

  return (
    <div
      data-slot="image-upload"
      className={cn("flex flex-col gap-3", className)}
    >
      {/* Drop zone */}
      {!isAtLimit && (
        <button
          type="button"
          data-slot="image-upload-dropzone"
          data-dragging={isDragging || undefined}
          data-disabled={disabled || undefined}
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          disabled={disabled}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-transparent px-6 py-10 text-center transition-colors",
            "hover:border-ring hover:bg-accent/50",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            "disabled:pointer-events-none disabled:opacity-50",
            "data-[dragging]:border-ring data-[dragging]:bg-accent/50"
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <UploadCloudIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {accept
                .map((t) => t.replace("image/", "").toUpperCase())
                .join(", ")}
              {maxSize ? ` · Max ${formatBytes(maxSize)}` : ""}
              {maxFiles
                ? ` · Up to ${maxFiles} image${maxFiles > 1 ? "s" : ""}`
                : ""}
            </p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        multiple={!maxFiles || maxFiles > 1}
        className="sr-only"
        onChange={onInputChange}
        disabled={disabled}
      />

      {/* Preview grid */}
      {files.length > 0 &&
        (renderPreview ? (
          renderPreview({ files, previews, onRemove: removeFile, disabled })
        ) : (
          <ImageUploadPreview
            files={files}
            previews={previews}
            onRemove={removeFile}
            disabled={disabled}
          />
        ))}

      {/* Rejection errors */}
      {rejected.length > 0 && (
        <ul data-slot="image-upload-errors" className="flex flex-col gap-1">
          {rejected.map(({ file, reason }, i) => (
            <li key={i} className="text-xs text-destructive">
              <span className="font-medium">{file.name}:</span> {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ImageUploadPreview({
  files,
  previews,
  onRemove,
  disabled,
}: ImageUploadPreviewProps) {
  return (
    <div
      data-slot="image-upload-preview"
      className="grid grid-cols-3 gap-2 sm:grid-cols-4"
    >
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          data-slot="image-upload-item"
          className="group/item relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previews[index]}
            alt={file.name}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 flex items-start justify-end bg-black/0 transition-colors group-hover/item:bg-black/20">
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={disabled}
              className={cn(
                "m-1 flex size-5 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow-sm transition-opacity",
                "group-hover/item:opacity-100 hover:bg-background",
                "focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                "disabled:pointer-events-none"
              )}
            >
              <XIcon className="size-3" />
              <span className="sr-only">Remove {file.name}</span>
            </button>
          </div>
          <div className="absolute right-0 bottom-0 left-0 flex items-center gap-1 bg-background/70 px-1.5 py-1 opacity-0 transition-opacity group-hover/item:opacity-100">
            <ImageIcon className="size-3 shrink-0 text-muted-foreground" />
            <span className="truncate text-[10px] text-muted-foreground">
              {file.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export { ImageUpload, ImageUploadPreview }
export type { ImageUploadProps, ImageUploadPreviewProps }
