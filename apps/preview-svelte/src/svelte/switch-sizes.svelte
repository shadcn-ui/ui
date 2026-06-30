<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Switch } from "@/svelte-ui/switch/index.js";
</script>

<Field.Group class="w-full max-w-[10rem]">
	<Field.Field orientation="horizontal">
		<Switch id="switch-size-sm" size="sm" />
		<Field.Label for="switch-size-sm">Small</Field.Label>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<Switch id="switch-size-default" size="default" />
		<Field.Label for="switch-size-default">Default</Field.Label>
	</Field.Field>
</Field.Group>
