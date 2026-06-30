<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
	import * as Select from "@/svelte-ui/select/index.js";

	let country = $state("us");
</script>

<form class="w-full max-w-sm">
	<Field.Group>
		<Field.Field>
			<Field.Label for="form-name">Name</Field.Label>
			<Input id="form-name" type="text" placeholder="Evil Rabbit" required />
		</Field.Field>
		<Field.Field>
			<Field.Label for="form-email">Email</Field.Label>
			<Input id="form-email" type="email" placeholder="john@example.com" />
			<Field.Description>We'll never share your email with anyone.</Field.Description>
		</Field.Field>
		<div class="grid grid-cols-2 gap-4">
			<Field.Field>
				<Field.Label for="form-phone">Phone</Field.Label>
				<Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
			</Field.Field>
			<Field.Field>
				<Field.Label for="form-country">Country</Field.Label>
				<Select.Root type="single" bind:value={country}>
					<Select.Trigger id="form-country">
						<span>{country === "us" ? "United States" : country === "uk" ? "United Kingdom" : "Canada"}</span>
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="us">United States</Select.Item>
						<Select.Item value="uk">United Kingdom</Select.Item>
						<Select.Item value="ca">Canada</Select.Item>
					</Select.Content>
				</Select.Root>
			</Field.Field>
		</div>
		<Field.Field>
			<Field.Label for="form-address">Address</Field.Label>
			<Input id="form-address" type="text" placeholder="123 Main St" />
		</Field.Field>
		<Field.Field orientation="horizontal">
			<Button type="button" variant="outline">Cancel</Button>
			<Button type="submit">Submit</Button>
		</Field.Field>
	</Field.Group>
</form>
