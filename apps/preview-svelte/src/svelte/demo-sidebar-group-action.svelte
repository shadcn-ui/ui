<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";
	import { Toaster } from "@/svelte-ui/sonner/index.js";
	import PlusIcon from "~icons/ms/add";
	import FrameIcon from "~icons/ms/crop_square";
	import ChartPieIcon from "~icons/ms/pie_chart";
	import MapIcon from "~icons/ms/map";
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
