<script lang="ts">
	import { Spinner } from "$lib/registry/ui/spinner/index.js";
	import * as Item from "$lib/registry/ui/item/index.js";
</script>

<div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
	<Item.Root variant="muted">
		<Item.Media>
			<Spinner />
		</Item.Media>
		<Item.Content>
			<Item.Title class="line-clamp-1">Processing payment...</Item.Title>
		</Item.Content>
		<Item.Content class="flex-none justify-end">
			<span class="text-sm tabular-nums">$100.00</span>
		</Item.Content>
	</Item.Root>
</div>
