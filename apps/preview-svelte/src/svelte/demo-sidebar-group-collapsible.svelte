<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";
	import * as Collapsible from "@/svelte-ui/collapsible/index.js";
	import ChevronDownIcon from "~icons/ms/keyboard_arrow_down";
	import LifeBuoyIcon from "~icons/ms/support";
	import SendIcon from "~icons/ms/send";
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Content>
			<Collapsible.Root open class="group/collapsible">
				<Sidebar.Group>
					<Sidebar.GroupLabel
						class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
					>
						{#snippet child({ props })}
							<Collapsible.Trigger {...props}>
								Help
								<ChevronDownIcon
									class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
								/>
							</Collapsible.Trigger>
						{/snippet}
					</Sidebar.GroupLabel>
					<Collapsible.Content>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										<LifeBuoyIcon />
										Support
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										<SendIcon />
										Feedback
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Collapsible.Content>
				</Sidebar.Group>
			</Collapsible.Root>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Provider>
