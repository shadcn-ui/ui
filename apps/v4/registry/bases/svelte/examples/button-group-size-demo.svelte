<script lang="ts">
	import Plus from "@lucide/svelte/icons/plus";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as ButtonGroup from "$lib/registry/ui/button-group/index.js";
</script>

<div class="flex flex-col items-start gap-8">
	<ButtonGroup.Root>
		<Button variant="outline" size="sm">Small</Button>
		<Button variant="outline" size="sm">Button</Button>
		<Button variant="outline" size="sm">Group</Button>
		<Button variant="outline" size="icon-sm">
			<Plus />
		</Button>
	</ButtonGroup.Root>
	<ButtonGroup.Root>
		<Button variant="outline">Default</Button>
		<Button variant="outline">Button</Button>
		<Button variant="outline">Group</Button>
		<Button variant="outline" size="icon">
			<Plus />
		</Button>
	</ButtonGroup.Root>
	<ButtonGroup.Root>
		<Button variant="outline" size="lg">Large</Button>
		<Button variant="outline" size="lg">Button</Button>
		<Button variant="outline" size="lg">Group</Button>
		<Button variant="outline" size="icon-lg">
			<Plus />
		</Button>
	</ButtonGroup.Root>
</div>
