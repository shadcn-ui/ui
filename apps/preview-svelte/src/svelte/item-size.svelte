<script lang="ts">
	import * as Item from "@/svelte-ui/item/index.js";
	import InboxIcon from "~icons/ms/inbox";
</script>

<div class="flex w-full max-w-md flex-col gap-6">
	<Item.Root variant="outline">
		<Item.Media variant="icon">
			<InboxIcon />
		</Item.Media>
		<Item.Content>
			<Item.Title>Default Size</Item.Title>
			<Item.Description>The standard size for most use cases.</Item.Description>
		</Item.Content>
	</Item.Root>
	<Item.Root variant="outline" size="sm">
		<Item.Media variant="icon">
			<InboxIcon />
		</Item.Media>
		<Item.Content>
			<Item.Title>Small Size</Item.Title>
			<Item.Description>A compact size for dense layouts.</Item.Description>
		</Item.Content>
	</Item.Root>
	<Item.Root variant="outline" size="xs">
		<Item.Media variant="icon">
			<InboxIcon />
		</Item.Media>
		<Item.Content>
			<Item.Title>Extra Small Size</Item.Title>
			<Item.Description>The most compact size available.</Item.Description>
		</Item.Content>
	</Item.Root>
</div>
