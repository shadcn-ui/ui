"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  Upload,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Progress } from "@/registry/new-york-v4/ui/progress"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type FileStatus = "pending" | "uploading" | "complete" | "error"

export interface FileWithMeta {
  id: string
  file: File
  status: FileStatus
  progress: number
  error?: string
  thumbnail?: string
}

type FileDropZoneContextValue = {
  files: FileWithMeta[]
  disabled: boolean
  multiple: boolean
  maxFiles: number
  maxSize: number
  accept?: string
  isDragActive: boolean
  isInvalid: boolean
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  openFileBrowser: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
}

const FileDropZoneContext =
  React.createContext<FileDropZoneContextValue | null>(null)

function useFileDropZone() {
  const context = React.useContext(FileDropZoneContext)
  if (!context) {
    throw new Error("useFileDropZone must be used within a <FileDropZone />")
  }
  return context
}

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function FileTypeIcon({ file, className }: { file: File; className?: string }) {
  const type = file.type

  if (type.startsWith("image/")) {
    return <FileImage className={className} />
  }
  if (type.startsWith("video/")) {
    return <FileVideo className={className} />
  }
  if (type.startsWith("audio/")) {
    return <FileAudio className={className} />
  }
  if (
    type.startsWith("text/") ||
    type === "application/pdf" ||
    type === "application/msword" ||
    type.includes("document") ||
    type.includes("spreadsheet") ||
    type.includes("presentation")
  ) {
    return <FileText className={className} />
  }

  return <File className={className} />
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function validateFile(
  file: File,
  accept?: string,
  maxSize?: number
): string | null {
  if (maxSize && file.size > maxSize) {
    return `File size exceeds ${formatFileSize(maxSize)}`
  }

  if (accept) {
    const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase())
    const fileType = file.type.toLowerCase()
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`

    const isAccepted = acceptedTypes.some((accepted) => {
      if (accepted.startsWith(".")) {
        return fileExtension === accepted
      }
      if (accepted.endsWith("/*")) {
        return fileType.startsWith(accepted.replace("/*", "/"))
      }
      return fileType === accepted
    })

    if (!isAccepted) {
      return "File type not accepted"
    }
  }

  return null
}

// -----------------------------------------------------------------------------
// FileDropZone (Root)
// -----------------------------------------------------------------------------

export interface FileDropZoneProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  files?: FileWithMeta[]
  onFilesChange?: (files: FileWithMeta[]) => void
  disabled?: boolean
  multiple?: boolean
  maxFiles?: number
  maxSize?: number
  accept?: string
  "aria-invalid"?: boolean
}

function FileDropZone({
  className,
  children,
  files: controlledFiles,
  onFilesChange,
  disabled = false,
  multiple = true,
  maxFiles = Infinity,
  maxSize = Infinity,
  accept,
  "aria-invalid": ariaInvalid,
  ...props
}: FileDropZoneProps) {
  const [internalFiles, setInternalFiles] = React.useState<FileWithMeta[]>([])
  const [isDragActive, setIsDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isControlled = controlledFiles !== undefined
  const files = isControlled ? controlledFiles : internalFiles
  const isInvalid = ariaInvalid === true

  const updateFiles = React.useCallback(
    (newFiles: FileWithMeta[]) => {
      if (!isControlled) {
        setInternalFiles(newFiles)
      }
      onFilesChange?.(newFiles)
    },
    [isControlled, onFilesChange]
  )

  const addFiles = React.useCallback(
    (newFiles: File[]) => {
      if (disabled) return

      const availableSlots = multiple ? maxFiles - files.length : 1
      const filesToAdd = newFiles.slice(0, availableSlots)

      const newFileItems: FileWithMeta[] = filesToAdd.map((file) => {
        const validationError = validateFile(file, accept, maxSize)
        return {
          id: generateId(),
          file,
          status: validationError ? "error" : "pending",
          progress: 0,
          error: validationError ?? undefined,
        }
      })

      if (multiple) {
        updateFiles([...files, ...newFileItems])
      } else {
        updateFiles(newFileItems)
      }
    },
    [disabled, multiple, maxFiles, files, accept, maxSize, updateFiles]
  )

  const removeFile = React.useCallback(
    (id: string) => {
      if (disabled) return
      updateFiles(files.filter((f) => f.id !== id))
    },
    [disabled, files, updateFiles]
  )

  const openFileBrowser = React.useCallback(() => {
    if (disabled) return
    inputRef.current?.click()
  }, [disabled])

  const handleDragEnter = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragActive(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget === e.target) {
      setIsDragActive(false)
    }
  }, [])

  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragActive(true)
      }
    },
    [disabled]
  )

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      if (disabled) return

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles)
      }
    },
    [disabled, addFiles]
  )

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      if (selectedFiles.length > 0) {
        addFiles(selectedFiles)
      }
      // Reset input value to allow selecting the same file again
      e.target.value = ""
    },
    [addFiles]
  )

  const contextValue = React.useMemo<FileDropZoneContextValue>(
    () => ({
      files,
      disabled,
      multiple,
      maxFiles,
      maxSize,
      accept,
      isDragActive,
      isInvalid,
      addFiles,
      removeFile,
      openFileBrowser,
      inputRef,
    }),
    [
      files,
      disabled,
      multiple,
      maxFiles,
      maxSize,
      accept,
      isDragActive,
      isInvalid,
      addFiles,
      removeFile,
      openFileBrowser,
    ]
  )

  return (
    <FileDropZoneContext.Provider value={contextValue}>
      <div
        data-slot="file-drop-zone"
        data-disabled={disabled || undefined}
        data-dragging={isDragActive || undefined}
        className={cn("flex w-full flex-col gap-4", className)}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          tabIndex={-1}
        />
        {children}
      </div>
    </FileDropZoneContext.Provider>
  )
}

// -----------------------------------------------------------------------------
// FileDropZoneArea
// -----------------------------------------------------------------------------

const fileDropZoneAreaVariants = cva(
  [
    "relative flex min-h-40 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 text-center transition-all",
    "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20 dark:data-[invalid=true]:ring-destructive/40",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-input bg-background hover:border-ring hover:bg-accent/50",
          "data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5",
        ],
        ghost: [
          "border-transparent bg-muted/50 hover:bg-muted",
          "data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface FileDropZoneAreaProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof fileDropZoneAreaVariants> {}

function FileDropZoneArea({
  className,
  variant,
  children,
  ...props
}: FileDropZoneAreaProps) {
  const { disabled, isDragActive, isInvalid, openFileBrowser } =
    useFileDropZone()

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openFileBrowser()
      }
    },
    [openFileBrowser]
  )

  return (
    <div
      data-slot="file-drop-zone-area"
      data-dragging={isDragActive || undefined}
      data-invalid={isInvalid || undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : openFileBrowser}
      onKeyDown={disabled ? undefined : handleKeyDown}
      className={cn(
        fileDropZoneAreaVariants({ variant }),
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------------
// FileDropZoneContent
// -----------------------------------------------------------------------------

function FileDropZoneContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isDragActive, multiple, disabled } = useFileDropZone()

  return (
    <div
      data-slot="file-drop-zone-content"
      className={cn(
        "flex flex-col items-center gap-2 text-center",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <Upload className="text-muted-foreground size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop files here"
                : `Drag & drop ${multiple ? "files" : "a file"} here`}
            </p>
            <p className="text-muted-foreground text-xs">or click to browse</p>
          </div>
        </>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// FileDropZoneList
// -----------------------------------------------------------------------------

function FileDropZoneList({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { files } = useFileDropZone()

  if (files.length === 0 && !children) {
    return null
  }

  return (
    <div
      data-slot="file-drop-zone-list"
      role="list"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {children ??
        files.map((file) => <FileDropZoneItem key={file.id} file={file} />)}
    </div>
  )
}

// -----------------------------------------------------------------------------
// FileDropZoneItem
// -----------------------------------------------------------------------------

const fileDropZoneItemVariants = cva(
  "group/item relative flex items-center gap-3 rounded-lg border p-3 transition-all animate-in fade-in-0 slide-in-from-bottom-2 duration-200",
  {
    variants: {
      status: {
        pending: "border-input bg-background",
        uploading: "border-input bg-background",
        complete: "border-input bg-background",
        error: "border-destructive/50 bg-destructive/5",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

export interface FileDropZoneItemProps extends React.ComponentProps<"div"> {
  file: FileWithMeta
  onRemove?: (id: string) => void
}

function FileDropZoneItem({
  className,
  file,
  onRemove,
  ...props
}: FileDropZoneItemProps) {
  const { removeFile, disabled } = useFileDropZone()

  const handleRemove = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onRemove) {
        onRemove(file.id)
      } else {
        removeFile(file.id)
      }
    },
    [file.id, onRemove, removeFile]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        if (onRemove) {
          onRemove(file.id)
        } else {
          removeFile(file.id)
        }
      }
    },
    [file.id, onRemove, removeFile]
  )

  return (
    <div
      data-slot="file-drop-zone-item"
      data-status={file.status}
      role="listitem"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={disabled ? undefined : handleKeyDown}
      className={cn(
        fileDropZoneItemVariants({ status: file.status }),
        "focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {/* Thumbnail or Icon */}
      <div className="bg-muted relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
        {file.thumbnail ? (
          <img src={file.thumbnail} alt="" className="size-full object-cover" />
        ) : (
          <FileTypeIcon
            file={file.file}
            className="text-muted-foreground size-5"
          />
        )}

        {/* Spinner overlay when uploading */}
        {file.status === "uploading" && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center">
            <Loader2 className="text-primary size-5 animate-spin" />
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{file.file.name}</span>
          {file.status === "complete" && (
            <span className="text-xs text-green-600 dark:text-green-500">
              Complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {formatFileSize(file.file.size)}
          </span>
          {file.error && (
            <span className="text-destructive text-xs">{file.error}</span>
          )}
        </div>

        {/* Progress bar */}
        {file.status === "uploading" && (
          <Progress value={file.progress} className="mt-1 h-1" />
        )}
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={disabled}
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-md opacity-0 transition-opacity",
          "hover:bg-muted group-hover/item:opacity-100 focus-visible:opacity-100",
          "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        aria-label={`Remove ${file.file.name}`}
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

// -----------------------------------------------------------------------------
// FileDropZoneError
// -----------------------------------------------------------------------------

export interface FileDropZoneErrorProps extends React.ComponentProps<"div"> {
  errors?: Array<{ message?: string } | undefined>
}

function FileDropZoneError({
  className,
  children,
  errors,
  ...props
}: FileDropZoneErrorProps) {
  const content = React.useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="file-drop-zone-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export {
  FileDropZone,
  FileDropZoneArea,
  FileDropZoneContent,
  FileDropZoneList,
  FileDropZoneItem,
  FileDropZoneError,
  useFileDropZone,
}
