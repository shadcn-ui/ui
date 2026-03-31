<script lang="ts">
	import CircleIcon from "@lucide/svelte/icons/circle";
	import CircleArrowUpIcon from "@lucide/svelte/icons/circle-arrow-up";
	import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
	import CircleHelpIcon from "@lucide/svelte/icons/circle-help";
	import CircleXIcon from "@lucide/svelte/icons/circle-x";
	import { type Component, tick } from "svelte";
	import { useId } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import * as Popover from "$lib/registry/ui/popover/index.js";
	import * as Command from "$lib/registry/ui/command/index.js";
	import { buttonVariants } from "$lib/registry/ui/button/index.js";

	type Status = {
		value: string;
		label: string;
		icon: Component;
	};

	const statuses: Status[] = [
		{
			value: "backlog",
			label: "Backlog",
			icon: CircleHelpIcon,
		},
		{
			value: "todo",
			label: "Todo",
			icon: CircleIcon,
		},
		{
			value: "in progress",
			label: "In Progress",
			icon: CircleArrowUpIcon,
		},
		{
			value: "done",
			label: "Done",
			icon: CircleCheckIcon,
		},
		{
			value: "canceled",
			label: "Canceled",
			icon: CircleXIcon,
		},
	];

	let open = $state(false);
	let value = $state("");

	const selectedStatus = $derived(statuses.find((s) => s.value === value));

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	const triggerId = useId();
</script>

<div class="flex items-center space-x-4">
	<p class="text-muted-foreground text-sm">Status</p>
	<Popover.Root bind:open>
		<Popover.Trigger
			id={triggerId}
			class={buttonVariants({
				variant: "outline",
				size: "sm",
				class: "w-[150px] justify-start",
			})}
		>
			{#if selectedStatus}
				{@const Icon = selectedStatus.icon}
				<Icon class="me-2 size-4 shrink-0" />
				{selectedStatus.label}
			{:else}
				+ Set status
			{/if}
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0" side="right" align="start">
			<Command.Root>
				<Command.Input placeholder="Change status..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group>
						{#each statuses as status (status.value)}
							<Command.Item
								value={status.value}
								onSelect={() => {
									value = status.value;
									closeAndFocusTrigger(triggerId);
								}}
							>
								{@const Icon = status.icon}
								<Icon
									class={cn(
										"me-2 size-4",
										status.value !== selectedStatus?.value &&
											"text-foreground/40"
									)}
								/>

								<span>
									{status.label}
								</span>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>
