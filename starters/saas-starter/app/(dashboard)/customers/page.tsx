import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UsersIcon, PlusIcon, UploadIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage and view your customer base.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UploadIcon />
            Import
          </Button>
          <Button>
            <PlusIcon />
            Add Customer
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-8" />
        </div>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <UsersIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No customers yet</h3>
          <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
            You haven&apos;t added any customers yet. Get started by adding your
            first customer or importing from a CSV file.
          </p>
          <div className="mt-6 flex gap-2">
            <Button variant="outline">
              <UploadIcon />
              Import CSV
            </Button>
            <Button>
              <PlusIcon />
              Add Customer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
