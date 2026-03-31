<script lang="ts">
	import * as Item from "$lib/registry/ui/item/index.js";
	import * as Avatar from "$lib/registry/ui/avatar/index.js";
	import * as DropdownMenu from "$lib/registry/ui/dropdown-menu/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";

	const people = [
		{
			username: "shadcn",
			avatar: "https://github.com/shadcn.png",
			email: "shadcn@vercel.com",
		},
		{
			username: "maxleiter",
			avatar: "https://github.com/maxleiter.png",
			email: "maxleiter@vercel.com",
		},
		{
			username: "evilrabbit",
			avatar: "https://github.com/evilrabbit.png",
			email: "evilrabbit@vercel.com",
		},
	];
</script>

<div class="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="sm" class="w-fit">
					Select <ChevronDown />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-72 [--radius:0.65rem]" align="end">
			{#each people as person (person.username)}
				<DropdownMenu.Item class="p-0">
					<Item.Root size="sm" class="w-full p-2">
						<Item.Media>
							<Avatar.Root class="size-8">
								<Avatar.Image src={person.avatar} class="grayscale" />
								<Avatar.Fallback>{person.username.charAt(0)}</Avatar.Fallback>
							</Avatar.Root>
						</Item.Media>
						<Item.Content class="gap-0.5">
							<Item.Title>{person.username}</Item.Title>
							<Item.Description>{person.email}</Item.Description>
						</Item.Content>
					</Item.Root>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
