<script lang="ts">
	import IconBrandJavascript from "@tabler/icons-svelte/icons/brand-javascript";
	import IconCopy from "@tabler/icons-svelte/icons/copy";
	import IconCornerDownLeft from "@tabler/icons-svelte/icons/corner-down-left";
	import IconRefresh from "@tabler/icons-svelte/icons/refresh";

	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
</script>

<div class="grid w-full max-w-md gap-4">
	<InputGroup.Root>
		<InputGroup.Addon align="block-start" class="border-b">
			<InputGroup.Text class="font-mono font-medium">
				<IconBrandJavascript />
				script.js
			</InputGroup.Text>
			<InputGroup.Button class="ms-auto" size="icon-xs">
				<IconRefresh />
			</InputGroup.Button>
			<InputGroup.Button variant="ghost" size="icon-xs">
				<IconCopy />
			</InputGroup.Button>
		</InputGroup.Addon>
		<InputGroup.Textarea placeholder="console.log('Hello, world!');" class="min-h-[200px]" />
		<InputGroup.Addon align="block-end" class="border-t">
			<InputGroup.Text>Line 1, Column 1</InputGroup.Text>
			<InputGroup.Button size="sm" class="ms-auto" variant="default">
				Run <IconCornerDownLeft />
			</InputGroup.Button>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
