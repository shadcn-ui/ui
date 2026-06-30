<script lang="ts">
	import { Badge } from "@/svelte-ui/badge/index.js";
	import { Spinner } from "@/svelte-ui/spinner/index.js";
</script>

<div class="flex items-center gap-2">
	<Badge>
		<Spinner />
		Syncing
	</Badge>
	<Badge variant="secondary">
		<Spinner />
		Updating
	</Badge>
	<Badge variant="outline">
		<Spinner />
		Loading
	</Badge>
</div>
