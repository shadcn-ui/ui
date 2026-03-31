<script lang="ts">
	import * as Resizable from "$lib/registry/ui/resizable/index.js";
</script>

<Resizable.PaneGroup direction="vertical" class="min-h-[200px] max-w-md rounded-lg border">
	<Resizable.Pane defaultSize={25}>
		<div class="flex h-full items-center justify-center p-6">
			<span class="font-semibold">Header</span>
		</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={75}>
		<div class="flex h-full items-center justify-center p-6">
			<span class="font-semibold">Content</span>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
