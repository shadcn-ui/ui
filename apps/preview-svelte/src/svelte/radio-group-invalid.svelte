<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as RadioGroup from "@/svelte-ui/radio-group/index.js";
</script>

<div class="w-full max-w-xs">
	<Field.Set>
		<Field.Legend>Notification Preferences</Field.Legend>
		<Field.Description>Choose how you want to receive notifications.</Field.Description>
		<RadioGroup.Root value="email">
			<Field.Field orientation="horizontal" data-invalid>
				<RadioGroup.Item value="email" id="invalid-email" aria-invalid={true} />
				<Field.Label for="invalid-email" class="font-normal">Email only</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal" data-invalid>
				<RadioGroup.Item value="sms" id="invalid-sms" aria-invalid={true} />
				<Field.Label for="invalid-sms" class="font-normal">SMS only</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal" data-invalid>
				<RadioGroup.Item value="both" id="invalid-both" aria-invalid={true} />
				<Field.Label for="invalid-both" class="font-normal">Both Email &amp; SMS</Field.Label>
			</Field.Field>
		</RadioGroup.Root>
	</Field.Set>
</div>
