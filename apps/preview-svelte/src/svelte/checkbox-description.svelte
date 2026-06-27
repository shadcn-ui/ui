<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";
</script>

<Field.Group class="mx-auto w-72">
	<Field.Field orientation="horizontal">
		<Checkbox id="terms-checkbox-desc" name="terms-checkbox-desc" checked />
		<Field.Content>
			<Field.Label for="terms-checkbox-desc">
				Accept terms and conditions
			</Field.Label>
			<Field.Description>
				By clicking this checkbox, you agree to the terms and conditions.
			</Field.Description>
		</Field.Content>
	</Field.Field>
</Field.Group>
