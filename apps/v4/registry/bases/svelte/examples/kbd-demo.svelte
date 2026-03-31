<script lang="ts">
	import * as Kbd from "$lib/registry/ui/kbd/index.js";
</script>

<div class="flex flex-col items-center gap-4">
	<Kbd.Group>
		<Kbd.Root>⌘</Kbd.Root>
		<Kbd.Root>⇧</Kbd.Root>
		<Kbd.Root>⌥</Kbd.Root>
		<Kbd.Root>⌃</Kbd.Root>
	</Kbd.Group>
	<Kbd.Group>
		<Kbd.Root>Ctrl</Kbd.Root>
		<span>+</span>
		<Kbd.Root>B</Kbd.Root>
	</Kbd.Group>
</div>
