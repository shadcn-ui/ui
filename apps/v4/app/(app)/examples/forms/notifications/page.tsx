import { Separator } from "@/registry/new-york-v4/ui/separator"
import { NotificationsForm } from "@/app/(app)/examples/forms/notifications/notifications-form"

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-muted-foreground text-sm">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  )
}
