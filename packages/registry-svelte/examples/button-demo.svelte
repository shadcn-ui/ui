<script lang="ts">
	import ArrowUpIcon from "~icons/ms/arrow_upward";
	import { Button } from "$lib/registry/ui/button/index.js";
</script>

<div class="flex flex-wrap items-center gap-2 md:flex-row">
	<Button variant="outline">Button</Button>
	<Button variant="outline" size="icon" aria-label="Submit">
		<ArrowUpIcon />
	</Button>
</div>
