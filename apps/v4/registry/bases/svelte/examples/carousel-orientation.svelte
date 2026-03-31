<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import * as Carousel from "$lib/registry/ui/carousel/index.js";
</script>

<Carousel.Root
	opts={{
		align: "start",
	}}
	orientation="vertical"
	class="w-full max-w-xs"
>
	<Carousel.Content class="-mt-1 h-[200px]">
		{#each Array(5) as _, i (i)}
			<Carousel.Item class="pt-1 md:basis-1/2">
				<div class="p-1">
					<Card.Root>
						<Card.Content class="flex items-center justify-center p-6">
							<span class="text-3xl font-semibold">{i + 1}</span>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>
