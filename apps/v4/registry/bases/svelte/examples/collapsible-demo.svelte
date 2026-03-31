<script lang="ts">
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import * as Collapsible from "$lib/registry/ui/collapsible/index.js";
	import { buttonVariants } from "$lib/registry/ui/button/index.js";
</script>

<Collapsible.Root class="w-[350px] space-y-2">
	<div class="flex items-center justify-between space-x-4 px-4">
		<h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
		<Collapsible.Trigger
			class={buttonVariants({ variant: "ghost", size: "sm", class: "w-9 p-0" })}
		>
			<ChevronsUpDownIcon />
			<span class="sr-only">Toggle</span>
		</Collapsible.Trigger>
	</div>
	<div class="rounded-md border px-4 py-3 font-mono text-sm">@huntabyte/bits-ui</div>
	<Collapsible.Content class="space-y-2">
		<div class="rounded-md border px-4 py-3 font-mono text-sm">@melt-ui/melt-ui</div>
		<div class="rounded-md border px-4 py-3 font-mono text-sm">@sveltejs/svelte</div>
	</Collapsible.Content>
</Collapsible.Root>
