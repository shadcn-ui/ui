<script lang="ts">
	import * as Tabs from "@/svelte-ui/tabs/index.js";
</script>

<Tabs.Root value="account" orientation="vertical">
	<Tabs.List>
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="password">Password</Tabs.Trigger>
		<Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>
