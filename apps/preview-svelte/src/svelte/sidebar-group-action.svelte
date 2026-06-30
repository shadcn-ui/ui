<script lang="ts">
	import FrameIcon from "~icons/ms/crop_free";
	import MapIcon from "~icons/ms/map";
	import PieChartIcon from "~icons/ms/pie_chart";
	import PlusIcon from "~icons/ms/add";
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";

	const projects = [
		{ name: "Design Engineering", url: "#", icon: FrameIcon },
		{ name: "Sales & Marketing", url: "#", icon: PieChartIcon },
		{ name: "Travel", url: "#", icon: MapIcon },
	];
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
				<Sidebar.GroupAction title="Add Project">
					<PlusIcon /> <span class="sr-only">Add Project</span>
				</Sidebar.GroupAction>
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
</Sidebar.Provider>
