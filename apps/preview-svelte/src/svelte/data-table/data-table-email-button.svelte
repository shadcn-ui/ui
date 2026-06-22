<script lang="ts">
	import ArrowUpDownIcon from "~icons/ms/swap_vert";
	import { Button } from "@/svelte-ui/button/index.js";

	let { onclick, ...restProps }: { onclick?: (e: Event) => void } = $props();
</script>

<Button variant="ghost" {onclick} {...restProps}>
	Email
	<ArrowUpDownIcon class="ms-2 size-4" />
</Button>
