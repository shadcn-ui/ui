<script lang="ts">
	import * as Card from "@/svelte-ui/card/index.js";
	import * as Carousel from "@/svelte-ui/carousel/index.js";
</script>

<Carousel.Root
	class="mx-auto max-w-xs sm:max-w-sm"
	opts={{
		align: "start",
	}}
>
	<Carousel.Content>
		{#each Array(5) as _, i (i)}
			<Carousel.Item class="sm:basis-1/2 lg:basis-1/3">
				<div class="p-1">
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-6">
							<span class="text-3xl font-semibold">{i + 1}</span>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous class="hidden sm:inline-flex" />
	<Carousel.Next class="hidden sm:inline-flex" />
</Carousel.Root>
