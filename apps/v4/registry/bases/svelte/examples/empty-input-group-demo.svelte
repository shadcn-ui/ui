<script lang="ts">
	import * as Empty from "$lib/registry/ui/empty/index.js";
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import * as Kbd from "$lib/registry/ui/kbd/index.js";
	import SearchIcon from "@lucide/svelte/icons/search";
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Title>404 - Not Found</Empty.Title>
		<Empty.Description>
			The page you're looking for doesn't exist. Try searching for what you need below.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<InputGroup.Root class="sm:w-3/4">
			<InputGroup.Input placeholder="Try searching for pages..." />
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">
				<Kbd.Root>/</Kbd.Root>
			</InputGroup.Addon>
		</InputGroup.Root>
		<Empty.Description>
			Need help? <a href="#/">Contact support</a>
		</Empty.Description>
	</Empty.Content>
</Empty.Root>
