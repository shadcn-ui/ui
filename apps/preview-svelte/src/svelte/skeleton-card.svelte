<script lang="ts">
	import * as Card from "@/svelte-ui/card/index.js";
	import { Skeleton } from "@/svelte-ui/skeleton/index.js";
</script>

<Card.Root class="w-full max-w-xs">
	<Card.Header>
		<Skeleton class="h-4 w-2/3" />
		<Skeleton class="h-4 w-1/2" />
	</Card.Header>
	<Card.Content>
		<Skeleton class="aspect-video w-full" />
	</Card.Content>
</Card.Root>
