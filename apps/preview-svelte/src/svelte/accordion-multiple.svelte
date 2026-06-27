<script lang="ts">
	import * as Accordion from "@/svelte-ui/accordion/index.js";

	const items = [
		{
			value: "notifications",
			trigger: "Notification Settings",
			content:
				"Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
		},
		{
			value: "privacy",
			trigger: "Privacy & Security",
			content:
				"Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.",
		},
		{
			value: "billing",
			trigger: "Billing & Subscription",
			content:
				"View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
		},
	];
</script>

<Accordion.Root type="multiple" value={["notifications"]} class="max-w-lg">
	{#each items as item}
		<Accordion.Item value={item.value}>
			<Accordion.Trigger>{item.trigger}</Accordion.Trigger>
			<Accordion.Content>{item.content}</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
