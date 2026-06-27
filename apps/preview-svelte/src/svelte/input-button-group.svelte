<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import * as ButtonGroup from "@/svelte-ui/button-group/index.js";
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
</script>

<Field.Field>
	<Field.Label for="input-button-group">Search</Field.Label>
	<ButtonGroup.Root>
		<Input id="input-button-group" placeholder="Type to search..." />
		<Button variant="outline">Search</Button>
	</ButtonGroup.Root>
</Field.Field>
