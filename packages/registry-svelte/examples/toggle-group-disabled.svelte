<script lang="ts">
	import BoldIcon from "~icons/ms/format_bold";
	import ItalicIcon from "~icons/ms/format_italic";
	import UnderlineIcon from "~icons/ms/format_underlined";
	import * as ToggleGroup from "$lib/registry/ui/toggle-group/index.js";
</script>

<ToggleGroup.Root disabled type="single">
	<ToggleGroup.Item value="bold" aria-label="Toggle bold">
		<BoldIcon class="size-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="italic" aria-label="Toggle italic">
		<ItalicIcon class="size-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
		<UnderlineIcon class="size-4" />
	</ToggleGroup.Item>
</ToggleGroup.Root>
