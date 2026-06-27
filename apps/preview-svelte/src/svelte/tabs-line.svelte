<script lang="ts">
	import * as Tabs from "@/svelte-ui/tabs/index.js";
</script>

<Tabs.Root value="overview">
	<Tabs.List variant="line">
		<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
		<Tabs.Trigger value="reports">Reports</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>
