<script lang="ts">
	import CalculatorIcon from "~icons/ms/calculate";
	import CalendarIcon from "~icons/ms/calendar_month";
	import CreditCardIcon from "~icons/ms/credit_card";
	import SettingsIcon from "~icons/ms/settings";
	import SmileIcon from "~icons/ms/mood";
	import UserIcon from "~icons/ms/person";
	import * as Command from "@/svelte-ui/command/index.js";
	import { Button } from "@/svelte-ui/button/index.js";

	let open = $state(false);
</script>

<div class="flex flex-col gap-4">
	<Button onclick={() => (open = true)} variant="outline" class="w-fit">
		Open Menu
	</Button>
	<Command.Dialog bind:open>
		<Command.Input placeholder="Type a command or search..." />
		<Command.List>
			<Command.Empty>No results found.</Command.Empty>
			<Command.Group heading="Suggestions">
				<Command.Item>
					<CalendarIcon />
					<span>Calendar</span>
				</Command.Item>
				<Command.Item>
					<SmileIcon />
					<span>Search Emoji</span>
				</Command.Item>
				<Command.Item>
					<CalculatorIcon />
					<span>Calculator</span>
				</Command.Item>
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Settings">
				<Command.Item>
					<UserIcon />
					<span>Profile</span>
					<Command.Shortcut>⌘P</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<CreditCardIcon />
					<span>Billing</span>
					<Command.Shortcut>⌘B</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<SettingsIcon />
					<span>Settings</span>
					<Command.Shortcut>⌘S</Command.Shortcut>
				</Command.Item>
			</Command.Group>
		</Command.List>
	</Command.Dialog>
</div>
