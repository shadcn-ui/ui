<script lang="ts">
	import FrameIcon from "~icons/ms/crop_free";
	import LifeBuoyIcon from "~icons/ms/help";
	import MapIcon from "~icons/ms/map";
	import PanelLeftCloseIcon from "~icons/ms/left_panel_close";
	import PanelLeftOpenIcon from "~icons/ms/left_panel_open";
	import PieChartIcon from "~icons/ms/pie_chart";
	import SendIcon from "~icons/ms/send";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";

	let open = $state(true);

	const projects = [
		{ name: "Design Engineering", url: "#", icon: FrameIcon },
		{ name: "Sales & Marketing", url: "#", icon: PieChartIcon },
		{ name: "Travel", url: "#", icon: MapIcon },
		{ name: "Support", url: "#", icon: LifeBuoyIcon },
		{ name: "Feedback", url: "#", icon: SendIcon },
	];
</script>

<Sidebar.Provider bind:open>
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
			<Button size="sm" variant="ghost" onclick={() => (open = !open)}>
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
