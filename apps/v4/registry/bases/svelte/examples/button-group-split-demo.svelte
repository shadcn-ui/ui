<script lang="ts">
	import Plus from "@lucide/svelte/icons/plus";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as ButtonGroup from "$lib/registry/ui/button-group/index.js";
</script>

<ButtonGroup.Root>
	<Button variant="secondary">Button</Button>
	<ButtonGroup.Separator />
	<Button variant="secondary" size="icon">
		<Plus />
	</Button>
</ButtonGroup.Root>
