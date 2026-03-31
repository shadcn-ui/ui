<script lang="ts">
	import ItalicIcon from "@lucide/svelte/icons/italic";
	import { Toggle } from "$lib/registry/ui/toggle/index.js";
</script>

<Toggle aria-label="Toggle italic">
	<ItalicIcon class="me-2 size-4" />
	Italic
</Toggle>
