<script lang="ts">
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import CheckIcon from "~icons/ms/check";
	import CreditCardIcon from "~icons/ms/credit_card";
	import InfoIcon from "~icons/ms/info";
	import MailIcon from "~icons/ms/mail";
	import SearchIcon from "~icons/ms/search";
	import StarIcon from "~icons/ms/star";
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
