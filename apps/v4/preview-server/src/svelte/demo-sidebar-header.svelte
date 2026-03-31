<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									Select Workspace
									<ChevronDownIcon class="ms-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
							<DropdownMenu.Item>
								<span>Acme Inc</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<span>Acme Corp.</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
	</Sidebar.Root>
	<Sidebar.Inset>
		<header class="flex h-12 items-center justify-between px-4">
			<Sidebar.Trigger />
		</header>
	</Sidebar.Inset>
</Sidebar.Provider>
