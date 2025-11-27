import {
  FileDropZone,
  FileDropZoneArea,
  FileDropZoneContent,
} from "@/registry/new-york-v4/ui/file-drop-zone"

export default function FileDropZoneDisabled() {
  return (
    <FileDropZone disabled className="w-full max-w-md">
      <FileDropZoneArea>
        <FileDropZoneContent />
      </FileDropZoneArea>
    </FileDropZone>
  )
}
