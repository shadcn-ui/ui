import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Input } from "@/registry/default/ui/input"

export default function Component() {
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Store Name</CardTitle>
        <CardDescription>
          Used to identify your store in the marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Store Name" />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}
