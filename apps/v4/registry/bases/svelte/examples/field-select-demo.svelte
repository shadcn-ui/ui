<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import * as Select from "$lib/registry/ui/select/index.js";

	let department = $state<string>();

	const departments = [
		{ value: "engineering", label: "Engineering" },
		{ value: "design", label: "Design" },
		{ value: "marketing", label: "Marketing" },
		{ value: "sales", label: "Sales" },
		{ value: "support", label: "Customer Support" },
		{ value: "hr", label: "Human Resources" },
		{ value: "finance", label: "Finance" },
		{ value: "operations", label: "Operations" },
	];

	const departmentLabel = $derived(
		departments.find((d) => d.value === department)?.label ?? "Choose department"
	);
</script>

<div class="w-full max-w-md">
	<Field.Field>
		<Field.Label for="department">Department</Field.Label>
		<Select.Root type="single" bind:value={department}>
			<Select.Trigger id="department">
				{departmentLabel}
			</Select.Trigger>
			<Select.Content>
				{#each departments as department (department.value)}
					<Select.Item {...department} />
				{/each}
			</Select.Content>
		</Select.Root>
		<Field.Description>Select your department or area of work.</Field.Description>
	</Field.Field>
</div>
