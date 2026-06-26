<script lang="ts">
	import CalendarIcon from "~icons/ms/calendar_month";
	import HouseIcon from "~icons/ms/house";
	import InboxIcon from "~icons/ms/inbox";
	import SearchIcon from "~icons/ms/search";
	import SettingsIcon from "~icons/ms/settings";
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";

	// Menu items.
	const items = [
		{
			title: "Home",
			url: "#",
			icon: HouseIcon,
		},
		{
			title: "Inbox",
			url: "#",
			icon: InboxIcon,
		},
		{
			title: "Calendar",
			url: "#",
			icon: CalendarIcon,
		},
		{
			title: "Search",
			url: "#",
			icon: SearchIcon,
		},
		{
			title: "Settings",
			url: "#",
			icon: SettingsIcon,
		},
	];
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
	<Sidebar.Inset>
		<header class="flex h-12 items-center justify-between px-4">
			<Sidebar.Trigger />
		</header>
	</Sidebar.Inset>
</Sidebar.Provider>
