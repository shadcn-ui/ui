<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import { Input } from "$lib/registry/ui/input/index.js";
</script>

<div class="w-full max-w-md space-y-6">
	<Field.Set>
		<Field.Legend>Address Information</Field.Legend>
		<Field.Description>We need your address to deliver your order.</Field.Description>
		<Field.Group>
			<Field.Field>
				<Field.Label for="street">Street Address</Field.Label>
				<Input id="street" type="text" placeholder="123 Main St" />
			</Field.Field>
			<div class="grid grid-cols-2 gap-4">
				<Field.Field>
					<Field.Label for="city">City</Field.Label>
					<Input id="city" type="text" placeholder="New York" />
				</Field.Field>
				<Field.Field>
					<Field.Label for="zip">Postal Code</Field.Label>
					<Input id="zip" type="text" placeholder="90502" />
				</Field.Field>
			</div>
		</Field.Group>
	</Field.Set>
</div>
