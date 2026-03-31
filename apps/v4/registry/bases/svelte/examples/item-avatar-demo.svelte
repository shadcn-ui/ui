<script lang="ts">
	import * as Item from "$lib/registry/ui/item/index.js";
	import * as Avatar from "$lib/registry/ui/avatar/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import Plus from "@lucide/svelte/icons/plus";
</script>

<div class="flex w-full max-w-lg flex-col gap-6">
	<Item.Root variant="outline">
		<Item.Media>
			<Avatar.Root class="size-10">
				<Avatar.Image src="https://github.com/evilrabbit.png" />
				<Avatar.Fallback>ER</Avatar.Fallback>
			</Avatar.Root>
		</Item.Media>
		<Item.Content>
			<Item.Title>Evil Rabbit</Item.Title>
			<Item.Description>Last seen 5 months ago</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button size="icon" variant="outline" class="rounded-full" aria-label="Invite">
				<Plus />
			</Button>
		</Item.Actions>
	</Item.Root>
	<Item.Root variant="outline">
		<Item.Media>
			<div
				class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale"
			>
				<Avatar.Root class="hidden sm:flex">
					<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root class="hidden sm:flex">
					<Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
					<Avatar.Fallback>LR</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
					<Avatar.Fallback>ER</Avatar.Fallback>
				</Avatar.Root>
			</div>
		</Item.Media>
		<Item.Content>
			<Item.Title>No Team Members</Item.Title>
			<Item.Description>Invite your team to collaborate on this project.</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button size="sm" variant="outline">Invite</Button>
		</Item.Actions>
	</Item.Root>
</div>
