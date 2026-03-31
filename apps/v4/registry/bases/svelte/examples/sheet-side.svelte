<script lang="ts">
	import * as Sheet from "$lib/registry/ui/sheet/index.js";
	import { buttonVariants } from "$lib/registry/ui/button/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";

	const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;
</script>

<div class="grid grid-cols-2 gap-2">
	{#each SHEET_SIDES as side, _ (side)}
		<Sheet.Root>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props} class="capitalize">
						{side}
					</Button>
				{/snippet}
			</Sheet.Trigger>
			<Sheet.Content {side}>
				<Sheet.Header>
					<Sheet.Title>Edit profile</Sheet.Title>
					<Sheet.Description>
						Make changes to your profile here. Click save when you're done.
					</Sheet.Description>
				</Sheet.Header>
				<div class="overflow-y-auto px-4 text-sm">
					<h4 class="mb-4 text-lg leading-none font-medium">Lorem Ipsum</h4>
					{#each { length: 10 } as _, index (index)}
						<p class="mb-4 leading-normal">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
							veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
							commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
							velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
							occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
					{/each}
				</div>
				<Sheet.Footer>
					<Sheet.Close class={buttonVariants({ variant: "outline" })}>
						Save changes
					</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	{/each}
</div>
