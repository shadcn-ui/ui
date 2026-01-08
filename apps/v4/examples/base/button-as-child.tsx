import Link from "next/link"
import { Button } from "@/examples/base/ui/button"

export default function ButtonAsChild() {
  return <Button render={<Link href="/login" />}>Login</Button>
}
