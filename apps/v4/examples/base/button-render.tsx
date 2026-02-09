import { Button } from "@/examples/base/ui/button"

export default function ButtonRender() {
  return (
    <Button nativeButton={false} render={<a href="#" />}>
      Login
    </Button>
  )
}
