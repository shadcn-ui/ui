"use client"

import * as React from "react"
import type { Layout } from "react-grid-layout"
import { Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { DASHBOARD_EXAMPLE_SPEC } from "@/registry/new-york-v4/lib/rgl-dashboard-example"
import { createDashboard, loadPersisted, savePersisted } from "@/registry/new-york-v4/lib/rgl-dashboard-storage"
import type { DashboardRecord, PersistedDashboards, WidgetType } from "@/registry/new-york-v4/lib/rgl-dashboard-types"
import { defaultLayoutItemForNewTile } from "@/registry/new-york-v4/lib/rgl-dashboard-types"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { cn } from "@/registry/new-york-v4/lib/utils"
import { DashboardGrid } from "@/registry/new-york-v4/ui/rgl-dashboard-grid"
import { TileByWidget } from "./tile-widgets"

const WIDGET_OPTIONS: { value: WidgetType; label: string }[] = [
  { value: "intro", label: "Intro" },
  { value: "kpi", label: "KPI" },
  { value: "chart", label: "Area chart" },
  { value: "bar", label: "Bar chart" },
  { value: "table", label: "Table" },
  { value: "metric", label: "Metric" },
]

export type DashboardDemoProps = {
  embedded?: boolean
  /** Example/demo seed: one object with `layout` + `widgets` for all tiles. Defaults to `DASHBOARD_EXAMPLE_SPEC`. */
  initialDashboard?: DashboardRecord
  /** `false` (default): in-memory only. Pass a string to persist to that localStorage key. */
  storageKey?: string | false
}

export function DashboardDemo({
  embedded = false,
  initialDashboard = DASHBOARD_EXAMPLE_SPEC,
  storageKey = false,
}: DashboardDemoProps) {
  const persistKey = typeof storageKey === "string" ? storageKey : null
  const saveToDisk = persistKey !== null

  const initialSnapshotRef = React.useRef(initialDashboard)
  React.useEffect(() => {
    initialSnapshotRef.current = initialDashboard
  }, [initialDashboard])

  const [data, setData] = React.useState<PersistedDashboards | null>(() => {
    if (!saveToDisk) {
      return { dashboards: [initialDashboard], activeDashboardId: initialDashboard.id }
    }
    return null
  })
  const [editMode, setEditMode] = React.useState(false)
  const [newOpen, setNewOpen] = React.useState(false)
  const [renameOpen, setRenameOpen] = React.useState(false)
  const [addTileOpen, setAddTileOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("Untitled")
  const [renameValue, setRenameValue] = React.useState("")
  const [newTileType, setNewTileType] = React.useState<WidgetType>("kpi")

  React.useEffect(() => {
    if (saveToDisk && persistKey) {
      setData(loadPersisted(persistKey))
    }
  }, [saveToDisk, persistKey])

  const commit = React.useCallback(
    (next: PersistedDashboards) => {
      setData(next)
      if (saveToDisk && persistKey) savePersisted(persistKey, next)
    },
    [saveToDisk, persistKey]
  )

  const active = data?.dashboards.find((d) => d.id === data.activeDashboardId)

  const onLayoutChange = React.useCallback(
    (layout: Layout[]) => {
      if (!data || !active) return
      const next: PersistedDashboards = {
        ...data,
        dashboards: data.dashboards.map((d) =>
          d.id === active.id ? { ...d, layout } : d
        ),
      }
      commit(next)
    },
    [data, active, commit]
  )

  const selectDashboard = (id: string) => {
    if (!data) return
    commit({ ...data, activeDashboardId: id })
  }

  const addDashboard = () => {
    if (!data) return
    const d = createDashboard(newName || "Untitled")
    commit({
      dashboards: [...data.dashboards, d],
      activeDashboardId: d.id,
    })
    setNewName("Untitled")
    setNewOpen(false)
    toast.success(`Created dashboard "${d.name}"`)
  }

  const removeDashboard = (id: string) => {
    if (!data) return
    if (data.dashboards.length <= 1) {
      toast.error("You need at least one dashboard")
      return
    }
    const dashboards = data.dashboards.filter((d) => d.id !== id)
    let activeDashboardId = data.activeDashboardId
    if (activeDashboardId === id) {
      activeDashboardId = dashboards[0].id
    }
    commit({ dashboards, activeDashboardId })
    toast.success("Dashboard deleted")
  }

  const applyRename = () => {
    if (!data || !active) return
    const name = renameValue.trim() || active.name
    commit({
      ...data,
      dashboards: data.dashboards.map((d) =>
        d.id === active.id ? { ...d, name } : d
      ),
    })
    setRenameOpen(false)
    toast.success(`Renamed to "${name}"`)
  }

  const addTile = () => {
    if (!data || !active) return
    const id = `tile-${crypto.randomUUID().slice(0, 8)}`
    const layoutItem = defaultLayoutItemForNewTile(id, active.layout)
    const widgets = { ...active.widgets, [id]: { type: newTileType } }
    const layout = [...active.layout, layoutItem]
    commit({
      ...data,
      dashboards: data.dashboards.map((d) =>
        d.id === active.id ? { ...d, layout, widgets } : d
      ),
    })
    setAddTileOpen(false)
    toast.success(`Added ${newTileType} tile`)
  }

  const removeTile = (tileId: string) => {
    if (!data || !active) return
    if (active.layout.length <= 1) {
      toast.error("Keep at least one tile")
      return
    }
    const layout = active.layout.filter((l) => l.i !== tileId)
    const widgets = { ...active.widgets }
    delete widgets[tileId]
    commit({
      ...data,
      dashboards: data.dashboards.map((d) =>
        d.id === active.id ? { ...d, layout, widgets } : d
      ),
    })
    toast.success("Tile removed")
  }

  React.useEffect(() => {
    if (active) setRenameValue(active.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when dashboard id or persisted name changes
  }, [active?.id, active?.name])

  if (!data || !active) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        Loading dashboard…
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6",
        embedded ? "max-w-none p-3 sm:p-4" : "mx-auto max-w-[1600px] p-4 md:p-8"
      )}
    >
      <header className="flex flex-col items-center gap-4">
        <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-3">
          <div className="flex items-center gap-2">
            <Switch id="edit-layout" checked={editMode} onCheckedChange={setEditMode} />
            <Label htmlFor="edit-layout" className="cursor-pointer text-sm font-medium">
              Edit layout
            </Label>
          </div>
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <Dialog open={addTileOpen} onOpenChange={setAddTileOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                disabled={!editMode}
                title={!editMode ? "Turn on Edit layout" : undefined}
              >
                <Plus className="h-4 w-4" />
                Add tile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add tile</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-2">
                <Label>Widget type</Label>
                <Select value={newTileType} onValueChange={(v) => setNewTileType(v as WidgetType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WIDGET_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addTile}>Add to grid</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <div className="flex items-center gap-2">
            <Label className="sr-only">Dashboard</Label>
            <Select value={active.id} onValueChange={selectDashboard}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Dashboard" />
              </SelectTrigger>
              <SelectContent>
                {data.dashboards.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New dashboard</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2 py-2">
                <Label htmlFor="dn">Name</Label>
                <Input
                  id="dn"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sales"
                />
                <Button onClick={addDashboard}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={() => setRenameOpen(true)}>
            Rename
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                disabled={data.dashboards.length <= 1}
                onClick={() => removeDashboard(active.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (!data) return
                  if (saveToDisk && persistKey) {
                    localStorage.removeItem(persistKey)
                    setData(loadPersisted(persistKey))
                    toast.message("Storage reset")
                    return
                  }
                  const snap = initialSnapshotRef.current
                  if (snap) {
                    setData({ dashboards: [snap], activeDashboardId: snap.id })
                  } else {
                    const d = createDashboard("Main")
                    setData({ dashboards: [d], activeDashboardId: d.id })
                  }
                  toast.message("Reset to example")
                }}
              >
                {saveToDisk ? "Reset local storage" : "Reset to example"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename dashboard</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Label htmlFor="rn">Name</Label>
            <Input
              id="rn"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
            />
            <Button onClick={applyRename}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <DashboardGrid
        layout={active.layout}
        onLayoutChange={onLayoutChange}
        isDraggable={editMode}
        isResizable={editMode}
        className="min-h-[560px]"
      >
        {active.layout.map((item) => {
          const w = active.widgets[item.i]
          const t = w?.type ?? "kpi"
          return (
            <div
              key={item.i}
              className={cn(
                "relative h-full overflow-hidden rounded-lg transition-colors",
                editMode && "border-2 border-dotted border-primary"
              )}
            >
              {editMode ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="rgl-no-drag absolute right-1 top-1 z-10 size-7 opacity-90 shadow-sm"
                  onClick={() => removeTile(item.i)}
                  aria-label="Remove tile"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              ) : null}
              <TileByWidget id={item.i} type={t} />
            </div>
          )
        })}
      </DashboardGrid>

    </div>
  )
}
