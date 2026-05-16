"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import {
  ImageUpload,
  ImageUploadPreview,
} from "@/registry/new-york-v4/ui/image-upload"

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

export default function TestImageUploadPage() {
  const [controlled, setControlled] = React.useState<File[]>([])

  return (
    <div className="mx-auto max-w-xl p-10 flex flex-col gap-12">
      {/* 1. Default */}
      <Section title="Default" description="No restrictions.">
        <ImageUpload />
      </Section>

      {/* 2. File type restriction */}
      <Section
        title="PNG only"
        description="accept={['image/png']} — uploading a JPEG or WebP shows an error."
      >
        <ImageUpload accept={["image/png"]} />
      </Section>

      {/* 3. Max file size */}
      <Section
        title="Max size — 500 KB per file"
        description="maxSize={500 * 1024} — files over the limit are rejected with a reason."
      >
        <ImageUpload maxSize={500 * 1024} />
      </Section>

      {/* 4. Max files limit */}
      <Section
        title="Max 3 images"
        description="maxFiles={3} — the drop zone disappears once the limit is reached."
      >
        <ImageUpload maxFiles={3} />
      </Section>

      {/* 5. All constraints combined */}
      <Section
        title="Combined — max 4 · PNG/JPEG · 1 MB"
        description="maxFiles={4} + maxSize={1 MB} + accept PNG/JPEG."
      >
        <ImageUpload
          maxFiles={4}
          maxSize={1 * 1024 * 1024}
          accept={["image/png", "image/jpeg"]}
        />
      </Section>

      {/* 6. Controlled */}
      <Section
        title="Controlled"
        description={`value + onChange — ${controlled.length} file(s) selected.`}
      >
        <ImageUpload value={controlled} onChange={setControlled} />
      </Section>

      {/* 7. Custom renderPreview — horizontal list */}
      <Section
        title="Custom preview — list layout"
        description="renderPreview renders a compact list instead of the default grid."
      >
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
                    <span className="truncate text-xs font-medium">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    disabled={disabled}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground disabled:pointer-events-none"
                  >
                    <XIcon className="size-3.5" />
                    <span className="sr-only">Remove</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        />
      </Section>

      {/* 8. Custom renderPreview — reusing ImageUploadPreview */}
      <Section
        title="Custom preview — reusing ImageUploadPreview"
        description="renderPreview wraps the default grid with extra info below."
      >
        <ImageUpload
          renderPreview={(props) => (
            <div className="flex flex-col gap-1">
              <ImageUploadPreview {...props} />
              <p className="text-right text-xs text-muted-foreground">
                {props.files.length} file(s) ·{" "}
                {(
                  props.files.reduce((acc, f) => acc + f.size, 0) /
                  1024
                ).toFixed(0)}{" "}
                KB total
              </p>
            </div>
          )}
        />
      </Section>

      {/* 9. Disabled */}
      <Section title="Disabled" description="disabled — no interaction possible.">
        <ImageUpload disabled />
      </Section>
    </div>
  )
}
