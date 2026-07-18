import Link from "next/link"

import { Button } from "@/styles/radix-nova/ui/button"

export default function ButtonAsChild() {
  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  )
}
