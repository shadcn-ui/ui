<script lang="ts">
	import * as Item from "$lib/registry/ui/item/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import ShieldAlertIcon from "@lucide/svelte/icons/shield-alert";
</script>

<div class="flex w-full max-w-lg flex-col gap-6">
	<Item.Root variant="outline">
		<Item.Media variant="icon">
			<ShieldAlertIcon />
		</Item.Media>
		<Item.Content>
			<Item.Title>Security Alert</Item.Title>
			<Item.Description>New login detected from unknown device.</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button size="sm" variant="outline">Review</Button>
		</Item.Actions>
	</Item.Root>
</div>
