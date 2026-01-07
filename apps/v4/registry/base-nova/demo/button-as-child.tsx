import Link from "next/link"

import { Button } from "@/registry/base-nova/ui/button"

export default function ButtonAsChild() {
  return (
    <Button render={<Link href="/login" />}>Login</Button>
  )
}
