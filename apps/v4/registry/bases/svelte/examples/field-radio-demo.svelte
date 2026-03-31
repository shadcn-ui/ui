<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import * as RadioGroup from "$lib/registry/ui/radio-group/index.js";

	let plan = $state("monthly");
</script>

<div class="w-full max-w-md">
	<Field.Set>
		<Field.Label>Subscription Plan</Field.Label>
		<Field.Description>Yearly and lifetime plans offer significant savings.</Field.Description>
		<RadioGroup.Root bind:value={plan}>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="monthly" id="plan-monthly" />
				<Field.Label for="plan-monthly" class="font-normal">
					Monthly ($9.99/month)
				</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="yearly" id="plan-yearly" />
				<Field.Label for="plan-yearly" class="font-normal">
					Yearly ($99.99/year)
				</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="lifetime" id="plan-lifetime" />
				<Field.Label for="plan-lifetime" class="font-normal">
					Lifetime ($299.99)
				</Field.Label>
			</Field.Field>
		</RadioGroup.Root>
	</Field.Set>
</div>
