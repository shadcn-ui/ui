<script lang="ts">
	import * as Empty from "$lib/registry/ui/empty/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as Avatar from "$lib/registry/ui/avatar/index.js";
	import PlusIcon from "@lucide/svelte/icons/plus";
</script>

<Empty.Root class="flex-none border">
	<Empty.Header>
		<Empty.Media>
			<Avatar.Group class="grayscale">
				<Avatar.Root>
					<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
					<Avatar.Fallback>LR</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
					<Avatar.Fallback>ER</Avatar.Fallback>
				</Avatar.Root>
			</Avatar.Group>
		</Empty.Media>
		<Empty.Title>No Team Members</Empty.Title>
		<Empty.Description>Invite your team to collaborate on this project.</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button size="sm">
			<PlusIcon />
			Invite Members
		</Button>
	</Empty.Content>
</Empty.Root>
