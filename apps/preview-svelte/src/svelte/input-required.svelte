<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
</script>

<Field.Field>
	<Field.Label for="input-required">
		Required Field <span class="text-destructive">*</span>
	</Field.Label>
	<Input id="input-required" placeholder="This field is required" required />
	<Field.Description>This field must be filled out.</Field.Description>
</Field.Field>
