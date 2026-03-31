<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";
	import { Toaster } from "@/svelte-ui/sonner/index.js";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import FrameIcon from "@lucide/svelte/icons/frame";
	import ChartPieIcon from "@lucide/svelte/icons/chart-pie";
	import MapIcon from "@lucide/svelte/icons/map";
	import { toast } from "svelte-sonner";
</script>

<Sidebar.Provider>
	<Toaster
		position="bottom-left"
		toastOptions={{
			class: "ms-[160px]",
		}}
	/>
	<Sidebar.Root>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
				<Sidebar.GroupAction
					title="Add Project"
					onclick={() => toast("You clicked the group action!")}
				>
					<PlusIcon /> <span class="sr-only">Add Project</span>
				</Sidebar.GroupAction>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href="##" {...props}>
										<FrameIcon />
										<span>Design Engineering</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href="##" {...props}>
										<ChartPieIcon />
										<span>Sales & Marketing</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href="##" {...props}>
										<MapIcon />
										<span>Travel</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Provider>
