<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
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
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: ChartPieIcon,
		},
		{
			name: "Travel",
			url: "#",
			icon: MapIcon,
		},
		{
			name: "Support",
			url: "#",
			icon: LifeBuoyIcon,
		},
		{
			name: "Feedback",
			url: "#",
			icon: SendIcon,
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
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Sidebar.MenuAction {...props}>
												<EllipsisIcon />
												<span class="sr-only">More</span>
											</Sidebar.MenuAction>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content side="right" align="start">
										<DropdownMenu.Item>
											<span>Edit Project</span>
										</DropdownMenu.Item>
										<DropdownMenu.Item>
											<span>Delete Project</span>
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Provider>
