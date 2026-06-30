<script lang="ts">
	import Building2Icon from "~icons/ms/apartment";
	import CreditCardIcon from "~icons/ms/credit_card";
	import WalletIcon from "~icons/ms/wallet";

	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
	import { Button } from "@/svelte-ui/button/index.js";

	let paymentMethod = $state("card");
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline">Payment Method</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Label>Select Payment Method</DropdownMenu.Label>
			<DropdownMenu.RadioGroup bind:value={paymentMethod}>
				<DropdownMenu.RadioItem value="card">
					<CreditCardIcon />
					Credit Card
				</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="paypal">
					<WalletIcon />
					PayPal
				</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="bank">
					<Building2Icon />
					Bank Transfer
				</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
