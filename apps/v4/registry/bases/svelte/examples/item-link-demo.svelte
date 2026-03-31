<script lang="ts">
	import * as Item from "$lib/registry/ui/item/index.js";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
</script>

<div class="flex w-full max-w-md flex-col gap-4">
	<Item.Root>
		{#snippet child({ props })}
			<a href="#/" {...props}>
				<Item.Content>
					<Item.Title>Visit our documentation</Item.Title>
					<Item.Description>
						Learn how to get started with our components.
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<ChevronRightIcon class="size-4" />
				</Item.Actions>
			</a>
		{/snippet}
	</Item.Root>
	<Item.Root variant="outline">
		{#snippet child({ props })}
			<a href="#/" target="_blank" rel="noopener noreferrer" {...props}>
				<Item.Content>
					<Item.Title>External resource</Item.Title>
					<Item.Description>
						Opens in a new tab with security attributes.
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<ExternalLinkIcon class="size-4" />
				</Item.Actions>
			</a>
		{/snippet}
	</Item.Root>
</div>
