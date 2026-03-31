<script lang="ts">
	import Minus from "@lucide/svelte/icons/minus";
	import Plus from "@lucide/svelte/icons/plus";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as ButtonGroup from "$lib/registry/ui/button-group/index.js";
</script>

<ButtonGroup.Root orientation="vertical" aria-label="Media controls" class="h-fit">
	<Button variant="outline" size="icon">
		<Plus />
	</Button>
	<Button variant="outline" size="icon">
		<Minus />
	</Button>
</ButtonGroup.Root>
