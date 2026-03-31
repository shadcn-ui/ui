<script lang="ts">
	import * as Item from "$lib/registry/ui/item/index.js";

	const music = [
		{
			title: "Midnight City Lights",
			artist: "Neon Dreams",
			album: "Electric Nights",
			duration: "3:45",
		},
		{
			title: "Coffee Shop Conversations",
			artist: "The Morning Brew",
			album: "Urban Stories",
			duration: "4:05",
		},
		{
			title: "Digital Rain",
			artist: "Cyber Symphony",
			album: "Binary Beats",
			duration: "3:30",
		},
	];
</script>

<div class="flex w-full max-w-md flex-col gap-6">
	<div class="flex w-full max-w-md flex-col gap-4">
		{#each music as song (song)}
			<Item.Root variant="outline">
				{#snippet child({ props })}
					<a href="#/" {...props}>
						<Item.Media variant="image">
							<img
								src={`https://avatar.vercel.sh/${song.title}`}
								alt={song.title}
								width="32"
								height="32"
								class="size-8 rounded object-cover grayscale"
							/>
						</Item.Media>
						<Item.Content>
							<Item.Title class="line-clamp-1">
								{song.title} -
								<span class="text-muted-foreground">{song.album}</span>
							</Item.Title>
							<Item.Description>{song.artist}</Item.Description>
						</Item.Content>
						<Item.Content class="flex-none text-center">
							<Item.Description>{song.duration}</Item.Description>
						</Item.Content>
					</a>
				{/snippet}
			</Item.Root>
		{/each}
	</div>
</div>
