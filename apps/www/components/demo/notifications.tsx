import { AtSign, Bell, BellOff } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function DemoNotifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what you want to be notified about.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1 p-1.5">
        <div className="hover:bg-accent hover:text-accent-foreground flex items-center space-x-4 rounded-[0.24rem] p-2">
          <Bell className="h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Everything</p>
            <p className="text-muted-foreground text-sm">
              Email digest, mentions & all activity.
            </p>
          </div>
        </div>
        <div className="bg-accent text-accent-foreground flex items-center space-x-4 rounded-[0.24rem] p-2">
          <AtSign className="h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Available</p>
            <p className="text-muted-foreground text-sm">
              Only mentions and comments.
            </p>
          </div>
        </div>
        <div className="hover:bg-accent hover:text-accent-foreground flex items-center space-x-4 rounded-[0.24rem] p-2">
          <BellOff className="h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Ignoring</p>
            <p className="text-muted-foreground text-sm">
              Turn off all notifications.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
