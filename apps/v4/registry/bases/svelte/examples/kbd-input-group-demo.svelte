<script lang="ts">
	import * as Kbd from "$lib/registry/ui/kbd/index.js";
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import SearchIcon from "@lucide/svelte/icons/search";
</script>

<div class="flex w-full max-w-xs flex-col gap-6">
	<InputGroup.Root>
		<InputGroup.Input placeholder="Search..." />
		<InputGroup.Addon>
			<SearchIcon />
		</InputGroup.Addon>
		<InputGroup.Addon align="inline-end">
			<Kbd.Root>⌘</Kbd.Root>
			<Kbd.Root>K</Kbd.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
