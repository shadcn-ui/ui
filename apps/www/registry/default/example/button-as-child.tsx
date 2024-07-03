import Link from "next/link"

import { Button } from "@/registry/default/ui/button"

export default function ButtonAsChild() {
  return (
    <Button asChild>
      <Link href="#as-child">Login</Link>
    </Button>
  )
}
