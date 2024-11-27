"use client"

import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Checkbox } from "@/registry/default/ui/checkbox"
import { Input } from "@/registry/default/ui/input"

export default function Component() {
  return (
    <Card x-chunk="dashboard-04-chunk-2">
      <CardHeader>
        <CardTitle>Plugins Directory</CardTitle>
        <CardDescription>
          The directory within your project, in which your plugins are located.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Input placeholder="Project Name" defaultValue="/content/plugins" />
          <div className="flex items-center space-x-2">
            <Checkbox id="include" defaultChecked />
            <label
              htmlFor="include"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Allow administrators to change the directory.
            </label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}
