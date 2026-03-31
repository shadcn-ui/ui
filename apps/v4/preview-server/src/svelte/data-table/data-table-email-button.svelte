<script lang="ts">
	import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
	import { Button } from "@/svelte-ui/button/index.js";

	let { onclick, ...restProps }: { onclick?: (e: Event) => void } = $props();
</script>

<Button variant="ghost" {onclick} {...restProps}>
	Email
	<ArrowUpDownIcon class="ms-2 size-4" />
</Button>
