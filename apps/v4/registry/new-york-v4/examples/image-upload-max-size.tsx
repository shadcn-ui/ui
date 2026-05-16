import { ImageUpload } from "@/registry/new-york-v4/ui/image-upload"

export default function ImageUploadMaxSize() {
  return <ImageUpload maxSize={1 * 1024 * 1024} />
}
