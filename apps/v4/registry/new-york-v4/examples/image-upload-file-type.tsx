import { ImageUpload } from "@/registry/new-york-v4/ui/image-upload"

export default function ImageUploadFileType() {
  return <ImageUpload accept={["image/png"]} />
}
