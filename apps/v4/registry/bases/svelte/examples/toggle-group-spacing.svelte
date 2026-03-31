<script lang="ts">
	import * as ToggleGroup from "$lib/registry/ui/toggle-group/index.js";
	import BookmarkIcon from "@lucide/svelte/icons/bookmark";
	import HeartIcon from "@lucide/svelte/icons/heart";
	import StarIcon from "@lucide/svelte/icons/star";
</script>

<ToggleGroup.Root type="multiple" variant="outline" spacing={2} size="sm">
	<ToggleGroup.Item
		value="star"
		aria-label="Toggle star"
		class="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
	>
		<StarIcon />
		Star
	</ToggleGroup.Item>
	<ToggleGroup.Item
		value="heart"
		aria-label="Toggle heart"
		class="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
	>
		<HeartIcon />
		Heart
	</ToggleGroup.Item>
	<ToggleGroup.Item
		value="bookmark"
		aria-label="Toggle bookmark"
		class="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
	>
		<BookmarkIcon />
		Bookmark
	</ToggleGroup.Item>
</ToggleGroup.Root>
