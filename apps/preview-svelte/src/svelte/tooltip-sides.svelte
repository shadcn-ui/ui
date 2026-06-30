<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Tooltip from "@/svelte-ui/tooltip/index.js";

	const sides = ["left", "top", "bottom", "right"] as const;
</script>

<Tooltip.Provider>
	<div class="flex flex-wrap gap-2">
		{#each sides as side}
			<Tooltip.Root>
				<Tooltip.Trigger class={buttonVariants({ variant: "outline" }) + " w-fit capitalize"}>
					{side}
				</Tooltip.Trigger>
				<Tooltip.Content {side}>
					<p>Add to library</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</div>
</Tooltip.Provider>
