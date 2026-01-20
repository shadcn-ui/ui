import Link from "next/link"
import { Button } from "@/examples/base/ui/button"

export default function ButtonRender() {
  return <Button render={<Link href="#" />}>Login</Button>
}
