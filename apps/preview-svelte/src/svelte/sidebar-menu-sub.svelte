<script lang="ts">
	import * as Sidebar from "@/svelte-ui/sidebar/index.js";

	const items = [
		{
			title: "Getting Started",
			url: "#",
			items: [
				{ title: "Installation", url: "#" },
				{ title: "Project Structure", url: "#" },
			],
		},
		{
			title: "Build Your Application",
			url: "#",
			items: [
				{ title: "Routing", url: "#" },
				{ title: "Data Fetching", url: "#" },
				{ title: "Rendering", url: "#" },
			],
		},
		{
			title: "API Reference",
			url: "#",
			items: [
				{ title: "Components", url: "#" },
				{ title: "File Conventions", url: "#" },
				{ title: "Functions", url: "#" },
			],
		},
	];
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
								<Sidebar.MenuSub>
									{#each item.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Provider>
