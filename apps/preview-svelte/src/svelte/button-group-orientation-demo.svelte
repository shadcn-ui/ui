<script lang="ts">
	import Minus from "~icons/ms/remove";
	import Plus from "~icons/ms/add";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as ButtonGroup from "@/svelte-ui/button-group/index.js";
</script>

<ButtonGroup.Root orientation="vertical" aria-label="Media controls" class="h-fit">
	<Button variant="outline" size="icon">
		<Plus />
	</Button>
	<Button variant="outline" size="icon">
		<Minus />
	</Button>
</ButtonGroup.Root>
