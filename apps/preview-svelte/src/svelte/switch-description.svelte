<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Switch } from "@/svelte-ui/switch/index.js";
</script>

<Field.Field orientation="horizontal" class="max-w-sm">
	<Field.Content>
		<Field.Label for="switch-focus-mode">Share across devices</Field.Label>
		<Field.Description>
			Focus is shared across devices, and turns off when you leave the app.
		</Field.Description>
	</Field.Content>
	<Switch id="switch-focus-mode" />
</Field.Field>
