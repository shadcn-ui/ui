<script lang="ts">
	import { Spinner } from "@/svelte-ui/spinner/index.js";
	import * as Item from "@/svelte-ui/item/index.js";
</script>

<div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]" dir="rtl">
	<Item.Root variant="muted" dir="rtl">
		<Item.Media>
			<Spinner />
		</Item.Media>
		<Item.Content>
			<Item.Title class="line-clamp-1">جاري معالجة الدفع...</Item.Title>
		</Item.Content>
		<Item.Content class="flex-none justify-end">
			<span class="text-sm tabular-nums">١٠٠.٠٠ دولار</span>
		</Item.Content>
	</Item.Root>
</div>
