<script lang="ts">
	import BoldIcon from "~icons/ms/format_bold";
	import ItalicIcon from "~icons/ms/format_italic";
	import UnderlineIcon from "~icons/ms/format_underlined";
	import * as ToggleGroup from "@/svelte-ui/toggle-group/index.js";
</script>

<ToggleGroup.Root type="multiple" orientation="vertical" spacing={1} defaultValue={["bold", "italic"]}>
	<ToggleGroup.Item value="bold" aria-label="Toggle bold">
		<BoldIcon class="size-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="italic" aria-label="Toggle italic">
		<ItalicIcon class="size-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="underline" aria-label="Toggle underline">
		<UnderlineIcon class="size-4" />
	</ToggleGroup.Item>
</ToggleGroup.Root>
