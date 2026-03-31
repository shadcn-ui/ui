<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";
	import LifeBuoyIcon from "@lucide/svelte/icons/life-buoy";
	import SendIcon from "@lucide/svelte/icons/send";
	import FrameIcon from "@lucide/svelte/icons/frame";
	import ChartPieIcon from "@lucide/svelte/icons/chart-pie";
	import MapIcon from "@lucide/svelte/icons/map";

	const projects = [
		{
			name: "Design Engineering",
			url: "#",
			icon: FrameIcon,
			badge: "24",
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: ChartPieIcon,
			badge: "12",
		},
		{
			name: "Travel",
			url: "#",
			icon: MapIcon,
			badge: "3",
		},
		{
			name: "Support",
			url: "#",
			icon: LifeBuoyIcon,
			badge: "21",
		},
		{
			name: "Feedback",
			url: "#",
			icon: SendIcon,
			badge: "8",
		},
	];
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each projects as project (project.name)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									class="group-has-[[data-state=open]]/menu-item:bg-sidebar-accent"
								>
									{#snippet child({ props })}
										<a href={project.url} {...props}>
											<project.icon />
											<span>{project.name}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
								<Sidebar.MenuBadge>{project.badge}</Sidebar.MenuBadge>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Provider>
