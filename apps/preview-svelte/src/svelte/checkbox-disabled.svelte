<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";
</script>

<Field.Group class="mx-auto w-56">
	<Field.Field orientation="horizontal" data-disabled>
		<Checkbox
			id="toggle-checkbox-disabled"
			name="toggle-checkbox-disabled"
			disabled
		/>
		<Field.Label for="toggle-checkbox-disabled">
			Enable notifications
		</Field.Label>
	</Field.Field>
</Field.Group>
