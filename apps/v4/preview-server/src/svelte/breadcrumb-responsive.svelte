<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";
	import * as Breadcrumb from "@/svelte-ui/breadcrumb/index.js";
	import * as Drawer from "@/svelte-ui/drawer/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";

	const items = [
		{ href: "#", label: "Home" },
		{ href: "#", label: "Documentation" },
		{ href: "#", label: "Build Your Application" },
		{ href: "#", label: "Data Fetching" },
		{ label: "Caching and Revalidating" },
	];

	const ITEMS_TO_DISPLAY = 3;

	let open = $state(false);

	const isDesktop = new MediaQuery("(min-width: 768px)");
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href={items[0].href}>
				{items[0].label}
			</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		{#if items.length > ITEMS_TO_DISPLAY}
			<Breadcrumb.Item>
				{#if isDesktop.current}
					<DropdownMenu.Root bind:open>
						<DropdownMenu.Trigger
							class="flex items-center gap-1"
							aria-label="Toggle menu"
						>
							<Breadcrumb.Ellipsis class="size-4" />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start">
							{#each items.slice(1, -2) as item, i (i)}
								<DropdownMenu.Item>
									<a href={item.href ? item.href : "#"}>
										{item.label}
									</a>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<Drawer.Root bind:open>
						<Drawer.Trigger aria-label="Toggle Menu">
							<Breadcrumb.Ellipsis class="size-4" />
						</Drawer.Trigger>
						<Drawer.Content>
							<Drawer.Header class="text-start">
								<Drawer.Title>Navigate to</Drawer.Title>
								<Drawer.Description>
									Select a page to navigate to.
								</Drawer.Description>
							</Drawer.Header>
							<div class="grid gap-1 px-4">
								{#each items.slice(1, -2) as item, i (i)}
									<a href={item.href ? item.href : "#"} class="py-1 text-sm">
										{item.label}
									</a>
								{/each}
							</div>
							<Drawer.Footer class="pt-4">
								<Drawer.Close class={buttonVariants({ variant: "outline" })}>
									Close
								</Drawer.Close>
							</Drawer.Footer>
						</Drawer.Content>
					</Drawer.Root>
				{/if}
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
		{/if}

		{#each items.slice(-ITEMS_TO_DISPLAY + 1) as item (item.label)}
			<Breadcrumb.Item>
				{#if item.href}
					<Breadcrumb.Link href={item.href} class="max-w-20 truncate md:max-w-none">
						{item.label}
					</Breadcrumb.Link>
					<Breadcrumb.Separator />
				{:else}
					<Breadcrumb.Page class="max-w-20 truncate md:max-w-none">
						{item.label}
					</Breadcrumb.Page>
				{/if}
			</Breadcrumb.Item>
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
