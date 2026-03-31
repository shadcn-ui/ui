<script lang="ts">
	import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";

	let { id }: { id: string } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="size-8 p-0">
				<span class="sr-only">Open menu</span>
				<MoreHorizontalIcon class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Label>Actions</DropdownMenu.Label>
		<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
			Copy payment ID
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>View customer</DropdownMenu.Item>
		<DropdownMenu.Item>View payment details</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
