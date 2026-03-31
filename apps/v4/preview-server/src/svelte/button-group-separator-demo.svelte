<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import * as ButtonGroup from "@/svelte-ui/button-group/index.js";
</script>

<ButtonGroup.Root>
	<Button variant="secondary" size="sm">Copy</Button>
	<ButtonGroup.Separator />
	<Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup.Root>
