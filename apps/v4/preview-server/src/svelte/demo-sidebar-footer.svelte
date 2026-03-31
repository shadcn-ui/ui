<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Header />
		<Sidebar.Content />
		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									Username
									<ChevronUpIcon class="ms-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							side="top"
							class="w-(--bits-dropdown-menu-anchor-width)"
						>
							<DropdownMenu.Item>
								<span>Account</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<span>Billing</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<span>Sign out</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
	</Sidebar.Root>
	<Sidebar.Inset>
		<header class="flex h-12 items-center justify-between px-4">
			<Sidebar.Trigger />
		</header>
	</Sidebar.Inset>
</Sidebar.Provider>
