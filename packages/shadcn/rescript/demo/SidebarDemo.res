@@directive("'use client'")

type icon =
  | IconAudioWaveform
  | IconBadgeCheck
  | IconBell
  | IconBookOpen
  | IconBot
  | IconCommand
  | IconFolder
  | IconForward
  | IconFrame
  | IconGalleryVerticalEnd
  | IconMap
  | IconMoreHorizontal
  | IconPieChart
  | IconPlus
  | IconSettings2
  | IconSparkles
  | IconSquareTerminal
  | IconTrash2

let renderIcon = (~icon: icon, ~className="") =>
  switch icon {
  | IconAudioWaveform => <Icons.AudioWaveform className />
  | IconBadgeCheck => <Icons.BadgeCheck className />
  | IconBell => <Icons.Bell className />
  | IconBookOpen => <Icons.BookOpen className />
  | IconBot => <Icons.Bot className />
  | IconCommand => <Icons.Command className />
  | IconFolder => <Icons.Folder className />
  | IconForward => <Icons.Forward className />
  | IconFrame => <Icons.Frame className />
  | IconGalleryVerticalEnd => <Icons.GalleryVerticalEnd className />
  | IconMap => <Icons.Map className />
  | IconMoreHorizontal => <Icons.MoreHorizontal className />
  | IconPieChart => <Icons.PieChart className />
  | IconPlus => <Icons.Plus className />
  | IconSettings2 => <Icons.Settings2 className />
  | IconSparkles => <Icons.Sparkles className />
  | IconSquareTerminal => <Icons.SquareTerminal className />
  | IconTrash2 => <Icons.Trash2 className />
  }

type team = {
  name: string,
  logo: icon,
  plan: string,
}

type navSubItem = {
  title: string,
  url: string,
}

type navMainItem = {
  title: string,
  url: string,
  icon: icon,
  isActive: bool,
  items: array<navSubItem>,
}

type project = {
  name: string,
  url: string,
  icon: icon,
}

type user = {
  name: string,
  email: string,
  avatar: string,
}

let userData: user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

let teams: array<team> = [
  {name: "Acme Inc", logo: IconGalleryVerticalEnd, plan: "Enterprise"},
  {name: "Acme Corp.", logo: IconAudioWaveform, plan: "Startup"},
  {name: "Evil Corp.", logo: IconCommand, plan: "Free"},
]

let navMain: array<navMainItem> = [
  {
    title: "Playground",
    url: "#",
    icon: IconSquareTerminal,
    isActive: true,
    items: [
      {title: "History", url: "#"},
      {title: "Starred", url: "#"},
      {title: "Settings", url: "#"},
    ],
  },
  {
    title: "Models",
    url: "#",
    icon: IconBot,
    isActive: false,
    items: [
      {title: "Genesis", url: "#"},
      {title: "Explorer", url: "#"},
      {title: "Quantum", url: "#"},
    ],
  },
  {
    title: "Documentation",
    url: "#",
    icon: IconBookOpen,
    isActive: false,
    items: [
      {title: "Introduction", url: "#"},
      {title: "Get Started", url: "#"},
      {title: "Tutorials", url: "#"},
      {title: "Changelog", url: "#"},
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: IconSettings2,
    isActive: false,
    items: [
      {title: "General", url: "#"},
      {title: "Team", url: "#"},
      {title: "Billing", url: "#"},
      {title: "Limits", url: "#"},
    ],
  },
]

let projects: array<project> = [
  {name: "Design Engineering", url: "#", icon: IconFrame},
  {name: "Sales & Marketing", url: "#", icon: IconPieChart},
  {name: "Travel", url: "#", icon: IconMap},
]

module TeamSwitcher = {
  @react.component
  let make = (~teams: array<team>) => {
  let sidebar = Sidebar.useSidebar()
  let isMobile = sidebar.isMobile
  let (activeTeamIndex, setActiveTeamIndex) = React.useState(() => 0)

  switch teams->Belt.Array.get(activeTeamIndex) {
  | None => React.null
  | Some(activeTeam) =>
    <Sidebar.Group>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <DropdownMenu>
            <DropdownMenu.Trigger
              render={
                <Sidebar.MenuButton
                  dataSize=BaseUi.Types.Size.Lg
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                />
              }
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {renderIcon(~icon=activeTeam.logo, ~className="size-4")}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name->React.string}</span>
                <span className="truncate text-xs">{activeTeam.plan->React.string}</span>
              </div>
              <Icons.ChevronsUpDown className="ml-auto" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align=BaseUi.Types.Align.Start
              side={isMobile ? BaseUi.Types.Side.Bottom : BaseUi.Types.Side.Right}
              sideOffset={4.}
            >
              <DropdownMenu.Group>
                <DropdownMenu.Label className="text-muted-foreground text-xs">
                  {"Teams"->React.string}
                </DropdownMenu.Label>
                {teams
                ->Belt.Array.mapWithIndex((index, team) =>
                  <DropdownMenu.Item
                    key={team.name}
                    onClick={_ => setActiveTeamIndex(_ => index)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      {renderIcon(~icon=team.logo, ~className="size-3.5 shrink-0")}
                    </div>
                    {team.name->React.string}
                    <DropdownMenu.Shortcut>
                      {`⌘${Int.toString(index + 1)}`->React.string}
                    </DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                )
                ->React.array}
              </DropdownMenu.Group>
              <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
              <DropdownMenu.Group>
                <DropdownMenu.Item className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    {renderIcon(~icon=IconPlus, ~className="size-4")}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {"Add team"->React.string}
                  </div>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  }
}
}

module NavMainSection = {
  @react.component
  let make = (~items: array<navMainItem>) =>
  <Sidebar.Group>
    <Sidebar.GroupLabel>{"Platform"->React.string}</Sidebar.GroupLabel>
    <Sidebar.Menu>
      {items
      ->Belt.Array.map(item =>
        <Collapsible key={item.title} defaultOpen={item.isActive} className="group/collapsible">
          <Sidebar.MenuItem>
            <Collapsible.Trigger
              render={<Sidebar.MenuButton />}
            >
              {renderIcon(~icon=item.icon)}
              <span>{item.title->React.string}</span>
              <Icons.ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Sidebar.MenuSub>
                {item.items
                ->Belt.Array.map(subItem =>
                  <Sidebar.MenuSubItem key={subItem.title}>
                    <Sidebar.MenuSubButton render={<a href={subItem.url} />}>
                      <span>{subItem.title->React.string}</span>
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                )
                ->React.array}
              </Sidebar.MenuSub>
            </Collapsible.Content>
          </Sidebar.MenuItem>
        </Collapsible>
      )
      ->React.array}
    </Sidebar.Menu>
  </Sidebar.Group>
}

module NavProjectsSection = {
  @react.component
  let make = (~projects: array<project>) => {
  let sidebar = Sidebar.useSidebar()
  let isMobile = sidebar.isMobile

  <Sidebar.Group className="group-data-[collapsible=icon]:hidden">
    <Sidebar.GroupLabel>{"Projects"->React.string}</Sidebar.GroupLabel>
    <Sidebar.Menu>
      {projects
      ->Belt.Array.map(project =>
        <Sidebar.MenuItem key={project.name}>
          <Sidebar.MenuButton render={<a href={project.url} />}>
            {renderIcon(~icon=project.icon)}
            <span>{project.name->React.string}</span>
          </Sidebar.MenuButton>
          <DropdownMenu>
            <DropdownMenu.Trigger
              render={<Sidebar.MenuAction showOnHover=true />}
            >
              <Icons.MoreHorizontal />
              <span className="sr-only">{"More"->React.string}</span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="w-48 rounded-lg"
              side={isMobile ? BaseUi.Types.Side.Bottom : BaseUi.Types.Side.Right}
              align={isMobile ? BaseUi.Types.Align.End : BaseUi.Types.Align.Start}
            >
              <DropdownMenu.Item>
                {renderIcon(~icon=IconFolder, ~className="text-muted-foreground")}
                <span>{"View Project"->React.string}</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                {renderIcon(~icon=IconForward, ~className="text-muted-foreground")}
                <span>{"Share Project"->React.string}</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
              <DropdownMenu.Item>
                {renderIcon(~icon=IconTrash2, ~className="text-muted-foreground")}
                <span>{"Delete Project"->React.string}</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Sidebar.MenuItem>
      )
      ->React.array}
      <Sidebar.MenuItem>
        <Sidebar.MenuButton className="text-sidebar-foreground/70">
          {renderIcon(~icon=IconMoreHorizontal, ~className="text-sidebar-foreground/70")}
          <span>{"More"->React.string}</span>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Group>
}
}

module NavUserSection = {
  @react.component
  let make = (~user: user) => {
  let sidebar = Sidebar.useSidebar()
  let isMobile = sidebar.isMobile

  <Sidebar.Group>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu>
          <DropdownMenu.Trigger
            render={
              <Sidebar.MenuButton
                dataSize=BaseUi.Types.Size.Lg
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <Avatar.Image src={user.avatar} alt={user.name} />
              <Avatar.Fallback className="rounded-lg">{"CN"->React.string}</Avatar.Fallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name->React.string}</span>
              <span className="truncate text-xs">{user.email->React.string}</span>
            </div>
            <Icons.ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? BaseUi.Types.Side.Bottom : BaseUi.Types.Side.Right}
            align=BaseUi.Types.Align.End
            sideOffset={4.}
          >
            <DropdownMenu.Group>
              <DropdownMenu.Label className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <Avatar.Image src={user.avatar} alt={user.name} />
                    <Avatar.Fallback className="rounded-lg">{"CN"->React.string}</Avatar.Fallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name->React.string}</span>
                    <span className="truncate text-xs">{user.email->React.string}</span>
                  </div>
                </div>
              </DropdownMenu.Label>
            </DropdownMenu.Group>
            <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                {renderIcon(~icon=IconSparkles)}
                {"Upgrade to Pro"->React.string}
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                {renderIcon(~icon=IconBadgeCheck)}
                {"Account"->React.string}
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Icons.CreditCard />
                {"Billing"->React.string}
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                {renderIcon(~icon=IconBell)}
                {"Notifications"->React.string}
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                <Icons.LogOut />
                {"Log out"->React.string}
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Group>
}
}

@react.component
let make = () =>
  <Sidebar.Provider>
    <Sidebar dataCollapsible="icon">
      <Sidebar.Header>
        <TeamSwitcher teams />
      </Sidebar.Header>
      <Sidebar.Content>
        <NavMainSection items=navMain />
        <NavProjectsSection projects />
      </Sidebar.Content>
      <Sidebar.Footer>
        <NavUserSection user=userData />
      </Sidebar.Footer>
      <Sidebar.Rail />
    </Sidebar>
    <Sidebar.Inset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Sidebar.Trigger className="-ml-1" />
        </div>
      </header>
    </Sidebar.Inset>
  </Sidebar.Provider>
