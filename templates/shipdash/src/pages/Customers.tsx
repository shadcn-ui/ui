import { Users, Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function Customers() {
  // Empty state - no customers yet
  const hasCustomers = false

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage and view your customer base.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add customer
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {hasCustomers ? (
        // Customer list would go here
        <div>Customer list</div>
      ) : (
        // Empty State
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No customers yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Your customers will appear here once they sign up or you add them manually.
            </p>
            <div className="flex gap-3">
              <Button variant="outline">Import CSV</Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add your first customer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
