<script lang="ts">
	import * as Resizable from "$lib/registry/ui/resizable/index.js";
</script>

<Resizable.PaneGroup direction="horizontal" class="max-w-md rounded-lg border">
	<Resizable.Pane defaultSize={50}>
		<div class="flex h-[200px] items-center justify-center p-6">
			<span class="font-semibold">One</span>
		</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={50}>
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane defaultSize={25}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Two</span>
				</div>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane defaultSize={75}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Three</span>
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</Resizable.Pane>
</Resizable.PaneGroup>
