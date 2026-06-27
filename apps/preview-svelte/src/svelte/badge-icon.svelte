<script lang="ts">
	import { Badge } from "@/svelte-ui/badge/index.js";
	import BadgeCheckIcon from "~icons/ms/verified";
	import BookmarkIcon from "~icons/ms/bookmark";
</script>

<div class="flex flex-wrap gap-2">
	<Badge variant="secondary">
		<BadgeCheckIcon data-icon="inline-start" />
		Verified
	</Badge>
	<Badge variant="outline">
		Bookmark
		<BookmarkIcon data-icon="inline-end" />
	</Badge>
</div>
