<script lang="ts">
	import { browser } from "$app/environment";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as Command from "$lib/registry/ui/command/index.js";
	import * as Drawer from "$lib/registry/ui/drawer/index.js";
	import * as Popover from "$lib/registry/ui/popover/index.js";
	import { onMount } from "svelte";

	type Status = {
		value: string;
		label: string;
	};

	const statuses: Status[] = [
		{
			value: "backlog",
			label: "Backlog",
		},
		{
			value: "todo",
			label: "Todo",
		},
		{
			value: "in progress",
			label: "In Progress",
		},
		{
			value: "done",
			label: "Done",
		},
		{
			value: "canceled",
			label: "Canceled",
		},
	];

	let open = $state(false);
	let selectedStatus: Status | null = $state(null);
	let isDesktop = $state(false);

	function checkScreenSize() {
		isDesktop = window.innerWidth >= 768;
	}

	onMount(() => {
		if (browser) {
			checkScreenSize();
			window.addEventListener("resize", checkScreenSize);
			return () => window.removeEventListener("resize", checkScreenSize);
		}
	});

	function handleStatusSelect(value: string) {
		selectedStatus = statuses.find((status) => status.value === value) || null;
		open = false;
	}
</script>

{#if isDesktop}
	<Popover.Root bind:open>
		<Popover.Trigger>
			<Button variant="outline" class="w-[150px] justify-start">
				{selectedStatus ? selectedStatus.label : "+ Set status"}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0" align="start">
			<Command.Root>
				<Command.Input placeholder="Filter status..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group>
						{#each statuses as status (status.value)}
							<Command.Item
								value={status.value}
								onSelect={() => handleStatusSelect(status.value)}
							>
								{status.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			<Button variant="outline" class="w-[150px] justify-start">
				{selectedStatus ? selectedStatus.label : "+ Set status"}
			</Button>
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mt-4 border-t">
				<Command.Root>
					<Command.Input placeholder="Filter status..." />
					<Command.List>
						<Command.Empty>No results found.</Command.Empty>
						<Command.Group>
							{#each statuses as status (status.value)}
								<Command.Item
									value={status.value}
									onSelect={() => handleStatusSelect(status.value)}
								>
									{status.label}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
