<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as Pagination from "@/svelte-ui/pagination/index.js";
	import * as Select from "@/svelte-ui/select/index.js";

	const rowOptions = ["10", "25", "50", "100"];
	let rowsPerPage = $state("25");

	const triggerLabel = $derived(rowsPerPage || "25");
</script>

<div class="flex items-center justify-between gap-4">
	<Field.Field orientation="horizontal" class="w-fit">
		<Field.Label for="select-rows-per-page">Rows per page</Field.Label>
		<Select.Root type="single" bind:value={rowsPerPage} name="rowsPerPage">
			<Select.Trigger class="w-20" id="select-rows-per-page">
				{triggerLabel}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each rowOptions as option (option)}
						<Select.Item value={option} label={option}>{option}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</Field.Field>
	<Pagination.Root count={100} perPage={parseInt(rowsPerPage) || 25} class="mx-0 w-auto">
		{#snippet children()}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous />
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Next />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</div>
