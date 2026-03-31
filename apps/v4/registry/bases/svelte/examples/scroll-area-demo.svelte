<script lang="ts">
	import { ScrollArea } from "$lib/registry/ui/scroll-area/index.js";
	import { Separator } from "$lib/registry/ui/separator/index.js";

	const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
</script>

<ScrollArea class="h-72 w-48 rounded-md border">
	<div class="p-4">
		<h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
		{#each tags as tag (tag)}
			<div class="text-sm">
				{tag}
			</div>
			<Separator class="my-2" />
		{/each}
	</div>
</ScrollArea>
