"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { Separator } from "@/registry/new-york/ui/separator"

export function CardsShare() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Share this document</CardTitle>
        <CardDescription>
          Anyone with the link can view this document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            value="http://example.com/link/to/document"
            readOnly
          />
          <Button className="shrink-0">Copy Link</Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="text-sm font-medium">People with access</div>
          <div className="grid gap-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/03.png" alt="Image" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">m@example.com</p>
                </div>
              </div>
              <Select defaultValue="edit">
                <SelectTrigger className="ml-auto w-[110px]" aria-label="Edit">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="view">Can view</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/05.png" alt="Image" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                  <p className="text-sm text-muted-foreground">b@example.com</p>
                </div>
              </div>
              <Select defaultValue="view">
                <SelectTrigger className="ml-auto w-[110px]" aria-label="Edit">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="view">Can view</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/01.png" alt="Image" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">p@example.com</p>
                </div>
              </div>
              <Select defaultValue="view">
                <SelectTrigger className="ml-auto w-[110px]" aria-label="Edit">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="view">Can view</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
