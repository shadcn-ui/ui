<script lang="ts">
	import * as Item from "@/svelte-ui/item/index.js";
	import InboxIcon from "~icons/ms/inbox";
</script>

<div class="flex w-full max-w-md flex-col gap-6">
	<Item.Root>
		<Item.Media variant="icon">
			<InboxIcon />
		</Item.Media>
		<Item.Content>
			<Item.Title>Default Variant</Item.Title>
			<Item.Description>Transparent background with no border.</Item.Description>
		</Item.Content>
	</Item.Root>
	<Item.Root variant="outline">
		<Item.Media variant="icon">
			<InboxIcon />
		</Item.Media>
		<Item.Content>
			<Item.Title>Outline Variant</Item.Title>
			<Item.Description>Outlined style with a visible border.</Item.Description>
		</Item.Content>
	</Item.Root>
	<Item.Root variant="muted">
		<Item.Media variant="icon">
			<InboxIcon />
		</Item.Media>
		<Item.Content>
			<Item.Title>Muted Variant</Item.Title>
			<Item.Description>Muted background for secondary content.</Item.Description>
		</Item.Content>
	</Item.Root>
</div>
