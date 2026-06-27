<script lang="ts">
	import * as Resizable from "@/svelte-ui/resizable/index.js";
</script>

<Resizable.PaneGroup direction="horizontal" class="max-w-sm rounded-lg border" dir="rtl">
	<Resizable.Pane defaultSize={50}>
		<div class="flex h-[200px] items-center justify-center p-6">
			<span class="font-semibold">واحد</span>
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={50}>
		<Resizable.PaneGroup direction="vertical" dir="rtl">
			<Resizable.Pane defaultSize={25}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">اثنان</span>
				</div>
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane defaultSize={75}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">ثلاثة</span>
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</Resizable.Pane>
</Resizable.PaneGroup>
