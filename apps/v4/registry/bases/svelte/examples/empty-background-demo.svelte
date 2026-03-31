<script lang="ts">
	import * as Empty from "$lib/registry/ui/empty/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import BellIcon from "@tabler/icons-svelte/icons/bell";
	import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
</script>

<Empty.Root class="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
	<Empty.Header>
		<Empty.Media variant="icon">
			<BellIcon />
		</Empty.Media>
		<Empty.Title>No Notifications</Empty.Title>
		<Empty.Description>
			You're all caught up. New notifications will appear here.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button variant="outline" size="sm">
			<RefreshCcwIcon />
			Refresh
		</Button>
	</Empty.Content>
</Empty.Root>
