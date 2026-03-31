<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import * as Carousel from "$lib/registry/ui/carousel/index.js";
</script>

<Carousel.Root class="w-full max-w-xs">
	<Carousel.Content>
		{#each Array(5), i}
			<Carousel.Item>
				<div class="p-1">
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-6">
							<span class="text-4xl font-semibold">{i + 1}</span>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>
