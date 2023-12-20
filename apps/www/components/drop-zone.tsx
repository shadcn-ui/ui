import { useMemo, useState } from "react"
import { FileX, Files } from "lucide-react"
import {
  DropzoneInputProps,
  DropzoneProps,
  FileWithPath,
  useDropzone,
} from "react-dropzone"

import { Button } from "@/registry/new-york/ui/button"
import { Card, CardContent } from "@/registry/new-york/ui/card"

interface DropzoneContainerProps extends DropzoneProps {
  multiple?: boolean
  inputProps?: DropzoneInputProps
}
const directoryZone = {
  directory: "",
  webkitdirectory: "",
}

const dropZoneConfig = {
  noKeyboard: true,
  multiple: true,
  accept: {
    "text/*": [".js", ".css", ".md", ".html", ".txt", ".sass", ".scss"],
    "image/svg+xml": [],
    "video/mp2t": [".ts", ".tsx"],
    "application/json": [],
  },
}

const focusedStyle = {
  borderColor: "#020617",
}

const acceptStyle = {
  borderColor: "black",
}

const rejectStyle = {
  borderColor: "yellow",
}

export const Dropzone = ({
  multiple,
  inputProps,
  onDrop: dropDrop,
  ...rest
}: DropzoneContainerProps) => {
  const [files, setFiles] = useState<Pretty<FileWithPath>[]>([])

  const onDrop = async (
    acceptedFiles: FileWithPath[],
    reject: any,
    event: any
  ) => {
    setFiles(acceptedFiles)
    dropDrop && dropDrop(acceptedFiles, reject, event)
  }
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      multiple,
      onDrop,
      ...rest,
    })

  const style = useMemo(
    () => ({
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  )

  return (
    <div className="mt-10">
      <Card
        className="border-2 border-dashed p-3 shadow-none transition-colors"
        {...getRootProps({ style })}
      >
        <input {...directoryZone} {...getInputProps({ ...inputProps })} />
        <div className="min-h-fit rounded-md bg-zinc-950 p-5 font-mono text-white dark:bg-white dark:text-black">
          {!files.length ? (
            <div className="flex gap-2">
              <Files />
              Drop your component files here
            </div>
          ) : (
            <>
              <Button
                onClick={() => onDrop([], null, null)}
                variant={"destructive"}
                className="mb-5 flex gap-2"
              >
                <FileX />
                Remove folder
              </Button>
              <div className="grid min-h-fit grid-rows-2">
                {files.map((file) => (
                  <p key={file.path}>{file.path}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
