<script lang="ts">
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import InfoIcon from "@lucide/svelte/icons/info";
	import MailIcon from "@lucide/svelte/icons/mail";
	import SearchIcon from "@lucide/svelte/icons/search";
	import StarIcon from "@lucide/svelte/icons/star";
</script>

<div class="grid w-full max-w-sm gap-6">
	<InputGroup.Root>
		<InputGroup.Input placeholder="Search..." />
		<InputGroup.Addon>
			<SearchIcon />
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Input type="email" placeholder="Enter your email" />
		<InputGroup.Addon>
			<MailIcon />
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Input placeholder="Card number" />
		<InputGroup.Addon>
			<CreditCardIcon />
		</InputGroup.Addon>
		<InputGroup.Addon align="inline-end">
			<CheckIcon />
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Input placeholder="Card number" />
		<InputGroup.Addon align="inline-end">
			<StarIcon />
			<InfoIcon />
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
