<script lang="ts">
	import * as Item from "$lib/registry/ui/item/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
</script>

<div class="flex flex-col gap-6">
	<Item.Root>
		<Item.Content>
			<Item.Title>Default Variant</Item.Title>
			<Item.Description>
				Standard styling with subtle background and borders.
			</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button variant="outline" size="sm">Open</Button>
		</Item.Actions>
	</Item.Root>
	<Item.Root variant="outline">
		<Item.Content>
			<Item.Title>Outline Variant</Item.Title>
			<Item.Description>
				Outlined style with clear borders and transparent background.
			</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button variant="outline" size="sm">Open</Button>
		</Item.Actions>
	</Item.Root>
	<Item.Root variant="muted">
		<Item.Content>
			<Item.Title>Muted Variant</Item.Title>
			<Item.Description>
				Subdued appearance with muted colors for secondary content.
			</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button variant="outline" size="sm">Open</Button>
		</Item.Actions>
	</Item.Root>
</div>
