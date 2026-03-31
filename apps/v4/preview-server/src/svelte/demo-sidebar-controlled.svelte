<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
	import PanelLeftOpenIcon from "@lucide/svelte/icons/panel-left-open";
	import PanelLeftCloseIcon from "@lucide/svelte/icons/panel-left-close";
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

	let open = $state(true);
</script>

<Sidebar.Provider bind:open={() => open, (v) => (open = v)}>
	<Sidebar.Root>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each projects as project (project.name)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={project.url} {...props}>
											<project.icon />
											<span>{project.name}</span>
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
			<Button onclick={() => (open = !open)} size="sm" variant="ghost">
				{#if open}
					<PanelLeftCloseIcon />
				{:else}
					<PanelLeftOpenIcon />
				{/if}
				<span>{open ? "Close" : "Open"} Sidebar</span>
			</Button>
		</header>
	</Sidebar.Inset>
</Sidebar.Provider>
