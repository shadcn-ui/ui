<script lang="ts">
	import * as Tabs from "@/svelte-ui/tabs/index.js";
</script>

<Tabs.Root value="home">
	<Tabs.List>
		<Tabs.Trigger value="home">Home</Tabs.Trigger>
		<Tabs.Trigger value="settings" disabled>Disabled</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>
