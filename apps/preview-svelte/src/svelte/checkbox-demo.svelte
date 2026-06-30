<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";
	import { Label } from "@/svelte-ui/label/index.js";
</script>

<Field.Group class="max-w-sm">
	<Field.Field orientation="horizontal">
		<Checkbox id="terms-checkbox" name="terms-checkbox" />
		<Label for="terms-checkbox">Accept terms and conditions</Label>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<Checkbox id="terms-checkbox-2" name="terms-checkbox-2" checked />
		<Field.Content>
			<Field.Label for="terms-checkbox-2">
				Accept terms and conditions
			</Field.Label>
			<Field.Description>
				By clicking this checkbox, you agree to the terms.
			</Field.Description>
		</Field.Content>
	</Field.Field>
	<Field.Field orientation="horizontal" data-disabled>
		<Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled />
		<Field.Label for="toggle-checkbox">Enable notifications</Field.Label>
	</Field.Field>
	<Field.Label>
		<Field.Field orientation="horizontal">
			<Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
			<Field.Content>
				<Field.Title>Enable notifications</Field.Title>
				<Field.Description>
					You can enable or disable notifications at any time.
				</Field.Description>
			</Field.Content>
		</Field.Field>
	</Field.Label>
</Field.Group>
