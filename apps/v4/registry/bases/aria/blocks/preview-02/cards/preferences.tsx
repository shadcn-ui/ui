import { Button } from "@/registry/bases/aria/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/aria/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/registry/bases/aria/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import { Switch } from "@/registry/bases/aria/ui/switch"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const CURRENCIES = [
  { label: "USD — United States Dollar", value: "usd" },
  { label: "EUR — Euro", value: "eur" },
  { label: "GBP — British Pound", value: "gbp" },
  { label: "JPY — Japanese Yen", value: "jpy" },
]

export function Preferences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Manage your account settings and notifications.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" className="bg-muted">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="default-currency">Default Currency</FieldLabel>
            <Select defaultValue="usd">
              <SelectTrigger id="default-currency" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {CURRENCIES.map((item) => (
                    <SelectItem key={item.value} id={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <FieldSeparator className="-my-4 style-sera:hidden" />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="public-statistics">
                Public Statistics
              </FieldLabel>
              <FieldDescription>
                Allow others to see your total stream count and listening
                activity
              </FieldDescription>
            </FieldContent>
            <Switch id="public-statistics" defaultSelected />
          </Field>
          <FieldSeparator className="-my-4 style-sera:hidden" />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="email-notifications">
                Email Notifications
              </FieldLabel>
              <FieldDescription>
                Monthly royalty reports and distribution updates
              </FieldDescription>
            </FieldContent>
            <Switch id="email-notifications" defaultSelected />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Reset</Button>
        <Button className="ml-auto">Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
