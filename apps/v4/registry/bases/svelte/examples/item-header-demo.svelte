<script lang="ts">
	import * as Item from "$lib/registry/ui/item/index.js";

	const models = [
		{
			name: "v0-1.5-sm",
			description: "Everyday tasks and UI generation.",
			image: "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
			credit: "Valeria Reverdo on Unsplash",
		},
		{
			name: "v0-1.5-lg",
			description: "Advanced thinking or reasoning.",
			image: "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",
			credit: "Michael Oeser on Unsplash",
		},
		{
			name: "v0-2.0-mini",
			description: "Open Source model for everyone.",
			image: "https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop",
			credit: "Cherry Laithang on Unsplash",
		},
	];
</script>

<div class="flex w-full max-w-xl flex-col gap-6">
	<Item.Group class="grid grid-cols-3 gap-4">
		{#each models as model (model.name)}
			<Item.Root variant="outline">
				<Item.Header>
					<img
						src={model.image}
						alt={model.name}
						width="128"
						height="128"
						class="aspect-square w-full rounded-sm object-cover"
					/>
				</Item.Header>
				<Item.Content>
					<Item.Title>{model.name}</Item.Title>
					<Item.Description>{model.description}</Item.Description>
				</Item.Content>
			</Item.Root>
		{/each}
	</Item.Group>
</div>
