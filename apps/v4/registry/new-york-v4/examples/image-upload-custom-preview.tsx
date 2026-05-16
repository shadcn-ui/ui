"use client"

import { XIcon } from "lucide-react"

import { ImageUpload } from "@/registry/new-york-v4/ui/image-upload"

export default function ImageUploadCustomPreview() {
  return (
    <ImageUpload
      renderPreview={({ files, previews, onRemove, disabled }) => (
        <ul className="flex flex-col gap-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
            >
              <img
                src={previews[i]}
                alt={file.name}
                className="size-10 shrink-0 rounded object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-medium">{file.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                disabled={disabled}
                className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
              >
                <XIcon className="size-3.5" />
                <span className="sr-only">Remove {file.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    />
  )
}
