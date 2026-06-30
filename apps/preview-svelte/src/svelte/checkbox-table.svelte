<script lang="ts">
	import * as Table from "@/svelte-ui/table/index.js";
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";

	const tableData = [
		{
			id: "1",
			name: "Sarah Chen",
			email: "sarah.chen@example.com",
			role: "Admin",
		},
		{
			id: "2",
			name: "Marcus Rodriguez",
			email: "marcus.rodriguez@example.com",
			role: "User",
		},
		{
			id: "3",
			name: "Priya Patel",
			email: "priya.patel@example.com",
			role: "User",
		},
		{
			id: "4",
			name: "David Kim",
			email: "david.kim@example.com",
			role: "Editor",
		},
	];

	let selectedRows = $state<Set<string>>(new Set(["1"]));

	let selectAll = $derived(selectedRows.size === tableData.length);

	function handleSelectAll(checked: boolean) {
		if (checked) {
			selectedRows = new Set(tableData.map((row) => row.id));
		} else {
			selectedRows = new Set();
		}
	}

	function handleSelectRow(id: string, checked: boolean) {
		const newSelected = new Set(selectedRows);
		if (checked) {
			newSelected.add(id);
		} else {
			newSelected.delete(id);
		}
		selectedRows = newSelected;
	}
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-8">
				<Checkbox
					id="select-all-checkbox"
					name="select-all-checkbox"
					checked={selectAll}
					onCheckedChange={handleSelectAll}
				/>
			</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head>Email</Table.Head>
			<Table.Head>Role</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each tableData as row (row.id)}
			<Table.Row data-state={selectedRows.has(row.id) ? "selected" : undefined}>
				<Table.Cell>
					<Checkbox
						id={`row-${row.id}-checkbox`}
						name={`row-${row.id}-checkbox`}
						checked={selectedRows.has(row.id)}
						onCheckedChange={(checked) => handleSelectRow(row.id, checked === true)}
					/>
				</Table.Cell>
				<Table.Cell class="font-medium">{row.name}</Table.Cell>
				<Table.Cell>{row.email}</Table.Cell>
				<Table.Cell>{row.role}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
