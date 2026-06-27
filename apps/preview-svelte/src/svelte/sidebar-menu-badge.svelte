<script lang="ts">
	import FrameIcon from "~icons/ms/crop_free";
	import LifeBuoyIcon from "~icons/ms/help";
	import MapIcon from "~icons/ms/map";
	import PieChartIcon from "~icons/ms/pie_chart";
	import SendIcon from "~icons/ms/send";
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";

	const projects = [
		{ name: "Design Engineering", url: "#", icon: FrameIcon, badge: "24" },
		{ name: "Sales & Marketing", url: "#", icon: PieChartIcon, badge: "12" },
		{ name: "Travel", url: "#", icon: MapIcon, badge: "3" },
		{ name: "Support", url: "#", icon: LifeBuoyIcon, badge: "21" },
		{ name: "Feedback", url: "#", icon: SendIcon, badge: "8" },
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
								<Sidebar.MenuButton>
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
