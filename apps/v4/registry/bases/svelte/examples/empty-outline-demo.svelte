<script lang="ts">
	import * as Empty from "$lib/registry/ui/empty/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import CloudIcon from "@tabler/icons-svelte/icons/cloud";
</script>

<Empty.Root class="border border-dashed">
	<Empty.Header>
		<Empty.Media variant="icon">
			<CloudIcon />
		</Empty.Media>
		<Empty.Title>Cloud Storage Empty</Empty.Title>
		<Empty.Description>
			Upload files to your cloud storage to access them anywhere.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button variant="outline" size="sm">Upload Files</Button>
	</Empty.Content>
</Empty.Root>
