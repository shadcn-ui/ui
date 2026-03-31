<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import * as Carousel from "$lib/registry/ui/carousel/index.js";
	import type { CarouselAPI } from "$lib/registry/ui/carousel/context.js";

	let api = $state<CarouselAPI>();

	const count = $derived(api ? api.scrollSnapList().length : 0);
	let current = $state(0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on("select", () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});
</script>

<div>
	<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="w-full max-w-xs">
		<Carousel.Content>
			{#each Array(5) as _, i (i)}
				<Carousel.Item>
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-6">
							<span class="text-4xl font-semibold">{i + 1}</span>
						</Card.Content>
					</Card.Root>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
	<div class="text-muted-foreground py-2 text-center text-sm">
		Slide {current} of {count}
	</div>
</div>
