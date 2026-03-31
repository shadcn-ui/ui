<script lang="ts">
	import * as Item from "$lib/registry/ui/item/index.js";
	import * as Avatar from "$lib/registry/ui/avatar/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import Plus from "@lucide/svelte/icons/plus";

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

<div class="flex w-full max-w-md flex-col gap-6">
	<Item.Group>
		{#each people as person, index (person.username)}
			<Item.Root>
				<Item.Media>
					<Avatar.Root>
						<Avatar.Image src={person.avatar} class="grayscale" />
						<Avatar.Fallback>{person.username.charAt(0)}</Avatar.Fallback>
					</Avatar.Root>
				</Item.Media>
				<Item.Content class="gap-1">
					<Item.Title>{person.username}</Item.Title>
					<Item.Description>{person.email}</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button variant="ghost" size="icon" class="rounded-full">
						<Plus />
					</Button>
				</Item.Actions>
			</Item.Root>
			{#if index !== people.length - 1}
				<Item.Separator />
			{/if}
		{/each}
	</Item.Group>
</div>
