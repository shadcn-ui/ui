import { Text } from "@/registry/new-york-v4/ui/text"

export default function TextDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Text size="xl">Extra Large</Text>
        <Text size="lg">Large</Text>
        <Text>Default</Text>
        <Text size="sm">Small</Text>
        <Text size="xs">Extra Small</Text>
      </div>
      <div className="flex flex-col gap-1">
        <Text variant="default">Default variant</Text>
        <Text variant="primary">Primary variant</Text>
        <Text variant="secondary">Secondary variant</Text>
        <Text variant="muted">Muted variant</Text>
        <Text variant="destructive">Destructive variant</Text>
        <Text variant="accent">Accent variant</Text>
      </div>
    </div>
  )
}
