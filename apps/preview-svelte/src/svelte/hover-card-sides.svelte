<script lang="ts">
	import * as HoverCard from "@/svelte-ui/hover-card/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";

	const HOVER_CARD_SIDES = ["left", "top", "bottom", "right"] as const;
</script>

<div class="flex flex-wrap justify-center gap-2">
	{#each HOVER_CARD_SIDES as side (side)}
		<HoverCard.Root openDelay={100} closeDelay={100}>
			<HoverCard.Trigger class={buttonVariants({ variant: "outline" })} style="text-transform: capitalize">
				{side}
			</HoverCard.Trigger>
			<HoverCard.Content {side}>
				<div class="flex flex-col gap-1">
					<h4 class="font-medium">Hover Card</h4>
					<p>This hover card appears on the {side} side of the trigger.</p>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	{/each}
</div>
