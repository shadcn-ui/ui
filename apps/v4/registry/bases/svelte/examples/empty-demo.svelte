<script lang="ts">
	import * as Empty from "$lib/registry/ui/empty/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import FolderCodeIcon from "@tabler/icons-svelte/icons/folder-code";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="icon">
			<FolderCodeIcon />
		</Empty.Media>
		<Empty.Title>No Projects Yet</Empty.Title>
		<Empty.Description>
			You haven't created any projects yet. Get started by creating your first project.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<div class="flex gap-2">
			<Button>Create Project</Button>
			<Button variant="outline">Import Project</Button>
		</div>
	</Empty.Content>
	<Button variant="link" class="text-muted-foreground" size="sm">
		<a href="#/">
			Learn More <ArrowUpRightIcon class="inline" />
		</a>
	</Button>
</Empty.Root>
