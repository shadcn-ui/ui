<script lang="ts">
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import { Button } from "$lib/registry/ui/button/index.js";
</script>

<div class="flex flex-wrap items-center gap-2 md:flex-row">
	<Button variant="outline">Button</Button>
	<Button variant="outline" size="icon" aria-label="Submit">
		<ArrowUpIcon />
	</Button>
</div>
