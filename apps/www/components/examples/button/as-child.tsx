import Link from "next/link"

import { Button } from "@/components/ui/button"

export function ButtonAsChild() {
  return (
    <Button asChild>
      <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Login</Link>
    </Button>
  )
}
