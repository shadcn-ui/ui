<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as RadioGroup from "@/svelte-ui/radio-group/index.js";
</script>

<RadioGroup.Root value="plus" class="max-w-sm">
	<Field.Label for="plus-plan">
		<Field.Field orientation="horizontal">
			<Field.Content>
				<Field.Title>Plus</Field.Title>
				<Field.Description>For individuals and small teams.</Field.Description>
			</Field.Content>
			<RadioGroup.Item value="plus" id="plus-plan" />
		</Field.Field>
	</Field.Label>
	<Field.Label for="pro-plan">
		<Field.Field orientation="horizontal">
			<Field.Content>
				<Field.Title>Pro</Field.Title>
				<Field.Description>For growing businesses.</Field.Description>
			</Field.Content>
			<RadioGroup.Item value="pro" id="pro-plan" />
		</Field.Field>
	</Field.Label>
	<Field.Label for="enterprise-plan">
		<Field.Field orientation="horizontal">
			<Field.Content>
				<Field.Title>Enterprise</Field.Title>
				<Field.Description>For large teams and enterprises.</Field.Description>
			</Field.Content>
			<RadioGroup.Item value="enterprise" id="enterprise-plan" />
		</Field.Field>
	</Field.Label>
</RadioGroup.Root>
