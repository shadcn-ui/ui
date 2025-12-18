import {
  BarChart3,
  Bell,
  BookOpen,
  Command,
  FileText,
  Folder,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Wireframe,
  WireframeNav,
  WireframeSidebar,
} from "@/registry/new-york-v4/ui/wireframe"

export function WireframeDemo() {
  return (
    <Wireframe
      config={{
        corners: {
          bottomLeft: "navbar",
        },
      }}
    >
      {/* Top Navigation Bar */}
      <WireframeNav
        position="top"
        className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur"
      >
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
                <Command className="h-4 w-4" />
              </div>
              <span className="hidden text-lg font-semibold sm:inline-block">
                Acme Inc
              </span>
            </div>
          </div>

          <div className="hidden flex-1 px-6 md:block lg:px-12">
            <div className="relative max-w-md">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input placeholder="Search..." className="h-9 w-full pr-4 pl-9" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </WireframeNav>

      {/* Left Sidebar */}
      <WireframeSidebar
        position="left"
        className="bg-muted/40 dark:bg-background border-r"
      >
        <div className="flex h-full flex-col gap-2 p-3">
          <div className="mb-2 px-3 py-2">
            <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
              Navigation
            </h2>
          </div>

          <nav className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary justify-start gap-3"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </Button>

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground justify-start gap-3"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </Button>

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground justify-start gap-3"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Messages</span>
              <Badge variant="secondary" className="ml-auto">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground justify-start gap-3"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Team</span>
            </Button>

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground justify-start gap-3"
            >
              <Folder className="h-4 w-4" />
              <span className="text-sm font-medium">Projects</span>
            </Button>

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground justify-start gap-3"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Analytics</span>
            </Button>
          </nav>

          <div className="mt-4 mb-2 px-3 py-2">
            <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
              Other
            </h2>
          </div>

          <nav className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground justify-start gap-3"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium">Documentation</span>
            </Button>

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground justify-start gap-3"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Settings</span>
            </Button>
          </nav>

          <div className="mt-auto">
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="text-primary h-4 w-4" />
                <span className="text-sm font-semibold">Upgrade to Pro</span>
              </div>
              <p className="text-muted-foreground mb-3 text-xs">
                Unlock advanced features and get unlimited access.
              </p>
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </WireframeSidebar>

      {/* Main Content Area */}
      <main className="bg-background">
        <div className="h-full overflow-auto">
          <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, Sarah
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your projects today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-sm font-medium">
                    Total Revenue
                  </div>
                  <ShoppingCart className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+20.1%</span> from last
                    month
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-sm font-medium">
                    Active Users
                  </div>
                  <Users className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-2xl font-bold">2,350</div>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+15.3%</span> from last
                    month
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-sm font-medium">
                    Projects
                  </div>
                  <Folder className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+2</span> since last week
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-sm font-medium">
                    Tasks Completed
                  </div>
                  <FileText className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+12.5%</span> from last
                    month
                  </p>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    {
                      user: "John Doe",
                      action: "completed task",
                      item: "Design System Updates",
                      time: "2 hours ago",
                    },
                    {
                      user: "Jane Smith",
                      action: "commented on",
                      item: "Q4 Roadmap",
                      time: "4 hours ago",
                    },
                    {
                      user: "Mike Johnson",
                      action: "created",
                      item: "New Dashboard Wireframe",
                      time: "6 hours ago",
                    },
                    {
                      user: "Sarah Wilson",
                      action: "updated",
                      item: "Team Guidelines",
                      time: "1 day ago",
                    },
                  ].map((activity) => (
                    <div
                      key={activity.user + activity.item + activity.time}
                      className="flex gap-3 text-sm"
                    >
                      <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                        <User className="text-primary h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-foreground">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium">{activity.item}</span>
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Project Overview</h2>
                <div className="space-y-4">
                  {[
                    {
                      name: "Website Redesign",
                      progress: 75,
                      status: "In Progress",
                    },
                    { name: "Mobile App", progress: 40, status: "In Progress" },
                    {
                      name: "Marketing Campaign",
                      progress: 90,
                      status: "Review",
                    },
                    {
                      name: "API Development",
                      progress: 25,
                      status: "Planning",
                    },
                  ].map((project) => (
                    <div key={project.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{project.name}</span>
                        <Badge variant="secondary">{project.status}</Badge>
                      </div>
                      <div className="bg-secondary h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {project.progress}% complete
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="from-primary/10 via-primary/5 to-background rounded-lg border bg-gradient-to-br p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Wireframe Component</h2>
                  <p className="text-muted-foreground text-sm">
                    Build beautiful layouts with ease
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Responsive Design",
                    description:
                      "Automatically adapts to any screen size with smooth transitions",
                  },
                  {
                    title: "Dark Mode Ready",
                    description:
                      "Built-in support for light and dark themes out of the box",
                  },
                  {
                    title: "Highly Customizable",
                    description:
                      "Full control over styling, spacing, and component behavior",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-card/50 hover:bg-card/80 rounded-lg border p-4 backdrop-blur-sm transition-all hover:shadow-md"
                  >
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <WireframeNav
        position="bottom"
        className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex items-center border-t pl-4 backdrop-blur"
      >
        <div className="text-muted-foreground font-mono text-sm">
          Systems UI v4.2.0 &copy; 2024 Acme Inc.
        </div>
      </WireframeNav>
    </Wireframe>
  )
}
