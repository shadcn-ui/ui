<script lang="ts">
	import * as Accordion from "@/svelte-ui/accordion/index.js";
</script>

<Accordion.Root type="single" class="w-full">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>Can I access my account history?</Accordion.Trigger>
		<Accordion.Content>
			Yes, you can view your complete account history including all
			transactions, plan changes, and support tickets in the Account History
			section of your dashboard.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-2" disabled>
		<Accordion.Trigger>Premium feature information</Accordion.Trigger>
		<Accordion.Content>
			This section contains information about premium features. Upgrade your
			plan to access this content.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-3">
		<Accordion.Trigger>How do I update my email address?</Accordion.Trigger>
		<Accordion.Content>
			You can update your email address in your account settings. You'll
			receive a verification email at your new address to confirm the change.
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
